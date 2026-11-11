/* Contact "build your garden" game + animated reviews */
(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ================= GARDEN QUEST ================= */
  const form = $('#enquiry');
  if (form) {
    const board = $('.board');
    const scene = $('.scene', board);
    const steps = $$('.step', form);
    const bars = $$('.slats-progress i', form);
    const countEl = $('.step-count b', form);
    const back = $('.js-back', form);
    const next = $('.js-next', form);
    const navBtns = $('.nav-btns', form);
    const toasts = $('.toasts', board);
    const xpEl = $('.xp', board);
    const xpBar = $('.board__xpbar i', board);
    const lvlEl = $('.lvl', board);
    const lvlName = $('.lvl-name', board);
    const signText = $('.sign__text', scene);
    const world = $('.world', scene);
    const sun = $('.sun', scene);
    const TOTAL = 5, MAX_XP = 170;
    const LEVELS = ['Bare ground', 'Groundwork', 'Taking shape', 'Coming together', 'Nearly there', 'Show garden'];
    const SIZES = ['Courtyard', 'Small garden', 'Medium', 'Large'];
    const SCALE = [1.22, 1.1, 1, 0.9];
    const SUN = [[0, 0], [-90, -12], [-220, 0], [-330, 30]];
    const NAMES = { fence: 'Fence', turf: 'Lawn', paving: 'Patio', deck: 'Decking', plants: 'Planting', drive: 'Driveway', carp: 'Oak planter & olive', trees: 'A few ideas' };
    let step = 1;
    const earned = new Set();

    const el = key => $('.el--' + key, scene);
    const award = (key, pts) => {
      if (earned.has(key)) return;
      earned.add(key);
      const total = [...earned].reduce((n, k) => n + (POINTS[k] || 0), 0);
      setXP(total);
      bump(pts);
    };
    const POINTS = {};
    const setXP = v => {
      xpEl.textContent = v;
      xpBar.style.width = Math.min(100, (v / MAX_XP) * 100) + '%';
    };
    const bump = pts => {
      const b = document.createElement('span');
      b.className = 'xp-pop';
      b.textContent = '+' + pts;
      $('.board__xp', board).appendChild(b);
      setTimeout(() => b.remove(), 1000);
    };
    const toast = (msg, good = true) => {
      const t = document.createElement('div');
      t.className = 'toast' + (good ? '' : ' toast--off');
      t.textContent = msg;
      toasts.appendChild(t);
      setTimeout(() => t.classList.add('out'), 1500);
      setTimeout(() => t.remove(), 1900);
    };
    const refreshLevel = () => {
      const built = $$('.el.on', scene).filter(e => !e.classList.contains('el--sign')).length;
      const lv = Math.min(LEVELS.length - 1, built);
      lvlEl.textContent = lv + 1;
      lvlName.textContent = step > TOTAL ? 'Garden complete' : LEVELS[lv];
    };

    /* step 1: tiles drop elements into the garden */
    $$('.tile input', form).forEach(input => {
      const key = input.dataset.el;
      POINTS['tile-' + key] = 10;
      input.addEventListener('change', () => {
        const node = el(key);
        if (node) node.classList.toggle('on', input.checked);
        const tile = input.closest('.tile');
        tile.classList.remove('pop'); void tile.offsetWidth; tile.classList.add('pop');
        if (input.checked) { toast(NAMES[key] + ' added'); award('tile-' + key, 10); }
        else toast(NAMES[key] + ' removed', false);
        $('.step[data-step="1"]', form).classList.remove('has-error');
        refreshLevel();
      });
    });

    /* step 2: size slider zooms the world */
    POINTS.size = 15;
    const range = $('input[name="size"]', form);
    const readout = $('.size__readout', form);
    const applySize = () => {
      const v = +range.value;
      world.style.transform = `scale(${SCALE[v]})`;
      readout.textContent = SIZES[v];
      range.style.setProperty('--fill', (v / 3) * 100 + '%');
      el('trees').classList.toggle('on', v >= 2 || $('input[data-el="trees"]', form).checked);
    };
    range.addEventListener('input', () => { applySize(); award('size', 15); });
    applySize();

    /* step 3: timing moves the sun */
    POINTS.timing = 15;
    $$('input[name="timing"]', form).forEach(r => r.addEventListener('change', () => {
      const [x, y] = SUN[+r.dataset.sun];
      sun.style.transform = `translate(${x}px, ${y}px)`;
      scene.dataset.time = r.dataset.sun;
      award('timing', 15);
      $('.step[data-step="3"]', form).classList.remove('has-error');
    }));

    /* step 4: name goes on the sign */
    POINTS.name = 20; POINTS.email = 20; POINTS.phone = 10;
    const nameIn = $('input[name="name"]', form);
    const emailIn = $('input[name="email"]', form);
    nameIn.addEventListener('input', () => {
      const first = nameIn.value.trim().split(/\s+/)[0] || '';
      el('sign').classList.toggle('on', !!first);
      signText.textContent = first ? (first.toUpperCase().slice(0, 10) + "'S GARDEN") : 'YOUR GARDEN';
      if (first.length > 1) award('name', 20);
    });
    emailIn.addEventListener('input', () => { if (emailIn.validity.valid && emailIn.value) award('email', 20); });
    $('input[name="phone"]', form).addEventListener('input', e => { if (e.target.value.replace(/\D/g, '').length >= 10) award('phone', 10); });

    /* step 5 */
    POINTS.message = 20;
    $('textarea[name="message"]', form).addEventListener('input', e => { if (e.target.value.trim().length > 15) award('message', 20); });

    /* clear an error as soon as the visitor fixes it */
    form.addEventListener('input', e => {
      const fs = e.target.closest('.step');
      if (!fs || !fs.classList.contains('has-error')) return;
      fs.classList.remove('has-error');
      const m = $('.step__error', fs); if (m) m.textContent = '';
    });

    /* validation */
    const fail = (fs, msg) => {
      fs.classList.remove('has-error'); void fs.offsetWidth; fs.classList.add('has-error');
      let m = $('.step__error', fs);
      if (!m) { m = document.createElement('p'); m.className = 'step__error'; m.setAttribute('role', 'alert'); fs.appendChild(m); }
      m.textContent = msg;
      return false;
    };
    const valid = n => {
      const fs = $(`.step[data-step="${n}"]`, form);
      if (n === 1 && !$$('.tile input:checked', form).length) return fail(fs, 'Pick at least one to get building.');
      if (n === 3 && !$('input[name="timing"]:checked', form)) return fail(fs, 'Choose one so we can plan around it.');
      if (n === 4) {
        if (!nameIn.value.trim()) { nameIn.focus(); return fail(fs, 'We need a name for the sign.'); }
        if (!emailIn.value || !emailIn.validity.valid) { emailIn.focus(); return fail(fs, 'Add an email so Oli can reply.'); }
      }
      fs.classList.remove('has-error');
      const m = $('.step__error', fs); if (m) m.textContent = '';
      return true;
    };

    const show = n => {
      step = n;
      steps.forEach(s => s.classList.toggle('is-active', +s.dataset.step === n));
      bars.forEach((b, i) => b.classList.toggle('on', i < Math.min(n, TOTAL) && (i < n - 1 || n > TOTAL ? true : true)));
      bars.forEach((b, i) => b.classList.toggle('done', i < n - 1));
      countEl.textContent = Math.min(n, TOTAL);
      $('.step-count', form).hidden = n > TOTAL;
      back.hidden = n === 1 || n > TOTAL;
      navBtns.hidden = n > TOTAL;
      next.innerHTML = n === TOTAL ? 'Plant it &amp; send <span aria-hidden="true">✓</span>' : 'Next <span aria-hidden="true">→</span>';
      refreshLevel();
      const active = $(`.step[data-step="${n}"]`, form);
      const focusable = n > TOTAL ? active : $('input, textarea', active);
      if (focusable && form.dataset.touched) setTimeout(() => focusable.focus({ preventScroll: true }), 350);
    };

    next.addEventListener('click', () => {
      form.dataset.touched = 1;
      if (!valid(step)) return;
      if (step < TOTAL) { show(step + 1); return; }
      submit();
    });
    back.addEventListener('click', () => show(Math.max(1, step - 1)));
    form.addEventListener('keydown', e => {
      if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA' && e.target.type !== 'button' && e.target.type !== 'submit') {
        e.preventDefault(); next.click();
      }
    });
    form.addEventListener('submit', e => { e.preventDefault(); next.click(); });

    const submit = () => {
      const f = new FormData(form);
      const body = [
        `Name: ${f.get('name')}`,
        `Email: ${f.get('email')}`,
        `Phone: ${f.get('phone') || '—'}`,
        `Postcode: ${f.get('postcode') || '—'}`,
        `Interested in: ${f.getAll('interest').join(', ')}`,
        `Size: ${SIZES[+f.get('size')]}`,
        `Timing: ${f.get('timing')}`,
        '',
        f.get('message') || ''
      ].join('\n');
      // finish the garden
      ['fence', 'turf', 'plants', 'carp'].forEach(k => el(k).classList.add('on'));
      board.classList.add('is-complete');
      $('.done__name', form).textContent = (nameIn.value.trim().split(/\s+/)[0]) || 'friend';
      setXP(MAX_XP); bump('bonus');
      show(TOTAL + 1);
      celebrate();
      setTimeout(() => {
        location.href = `mailto:oliver@chalkprojects.co.uk?subject=${encodeURIComponent('Project enquiry — ' + f.get('name'))}&body=${encodeURIComponent(body)}`;
      }, reduced ? 0 : 900);
    };

    const celebrate = () => {
      if (reduced) return;
      const g = $('.confetti', scene);
      g.innerHTML = '';
      const cols = ['#6f9a45', '#9b8fd6', '#f6c86b', '#dcbf8d', '#f4f1ea', '#c9a46c'];
      for (let i = 0; i < 46; i++) {
        const leaf = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
        leaf.setAttribute('cx', 240); leaf.setAttribute('cy', 150);
        leaf.setAttribute('rx', 3 + Math.random() * 3); leaf.setAttribute('ry', 1.5 + Math.random() * 1.5);
        leaf.setAttribute('fill', cols[i % cols.length]);
        leaf.style.setProperty('--x', (Math.random() * 520 - 260).toFixed(0) + 'px');
        leaf.style.setProperty('--y', (Math.random() * -170 - 20).toFixed(0) + 'px');
        leaf.style.setProperty('--r', (Math.random() * 720 - 360).toFixed(0) + 'deg');
        leaf.style.setProperty('--d', (Math.random() * 0.3).toFixed(2) + 's');
        g.appendChild(leaf);
      }
      g.classList.remove('go'); void g.getBoundingClientRect(); g.classList.add('go');
    };

    $('.js-restart', form).addEventListener('click', () => {
      form.reset();
      $$('.el', scene).forEach(e => e.classList.remove('on'));
      board.classList.remove('is-complete');
      sun.style.transform = ''; delete scene.dataset.time;
      signText.textContent = 'YOUR GARDEN';
      earned.clear(); setXP(0);
      applySize();
      show(1);
    });

    show(1);
  }

  /* ================= REVIEWS ================= */
  // marquee rows: duplicate the cards so the loop is seamless
  $$('.marquee').forEach(m => {
    const track = $('.marquee__track', m);
    if (reduced) { m.classList.add('is-static'); return; }
    const originals = [...track.children];
    const build = () => {
      track.querySelectorAll('[data-clone]').forEach(c => c.remove());
      const setW = track.scrollWidth;
      const reps = Math.max(1, Math.ceil(innerWidth / setW));
      // fill one half to at least the viewport, then duplicate that half
      for (let r = 1; r < reps; r++) originals.forEach(o => { const c = o.cloneNode(true); c.dataset.clone = 1; c.setAttribute('aria-hidden', 'true'); track.appendChild(c); });
      [...track.children].forEach(o => { if (o.dataset.half) return; const c = o.cloneNode(true); c.dataset.clone = 1; c.dataset.half = 1; c.setAttribute('aria-hidden', 'true'); track.appendChild(c); });
      const half = track.scrollWidth / 2;
      track.style.setProperty('--dur', Math.round(half / 38) + 's');
    };
    build();
    let t; addEventListener('resize', () => { clearTimeout(t); t = setTimeout(build, 250); });
  });

  // score: count up + light the stars when it scrolls into view
  const score = $('.score');
  const reviews = $('.reviews');
  if (score && reviews) {
    const run = () => {
      reviews.classList.add('is-lit');
      $$('[data-count]', score).forEach(n => {
        const to = +n.dataset.count, dec = +(n.dataset.decimals || 0);
        if (reduced) { n.textContent = to.toFixed(dec); return; }
        const t0 = performance.now(), dur = 1400;
        const tick = now => {
          const p = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - p, 3);
          n.textContent = (to * e).toFixed(dec);
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      });
    };
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { run(); io.disconnect(); } }, { threshold: 0.35 });
    io.observe(score);
  }
})();
