(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* nav */
  const nav = $('#nav');
  const callbar = $('.callbar');
  const onScroll = () => {
    const y = scrollY;
    nav.classList.toggle('is-solid', y > 40);
    if (callbar) callbar.classList.toggle('is-visible', y > innerHeight * 0.8);
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  const toggle = $('.nav__toggle');
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });
  $$('.nav__links a').forEach(a => a.addEventListener('click', () => {
    nav.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', false);
    document.body.style.overflow = '';
  }));

  /* hero: use img/hero.mp4 if present, otherwise play the real build sequence */
  const hero = $('.hero');
  const video = $('.hero__video');
  const frames = $$('.frame');
  const bars = $$('.hero__bars i');
  const stage = $('.hero__stage');
  const HOLD = 5200;
  let i = 0, timer;

  const show = n => {
    frames.forEach((f, k) => f.classList.toggle('is-active', k === n));
    bars.forEach((b, k) => {
      b.classList.remove('run', 'done');
      if (k < n) b.classList.add('done');
    });
    if (bars[n]) { void bars[n].offsetWidth; bars[n].style.setProperty('--dur', HOLD + 'ms'); bars[n].classList.add('run'); }
    stage.textContent = frames[n].dataset.stage;
  };
  const startSequence = () => {
    show(0);
    if (reduced) return;
    timer = setInterval(() => { i = (i + 1) % frames.length; show(i); }, HOLD);
  };
  startSequence();

  if (video && video.dataset.src) {
    video.src = video.dataset.src;
    video.addEventListener('canplay', () => {
      clearInterval(timer);
      hero.classList.add('has-video');
      if (!reduced) video.play().catch(() => {});
    }, { once: true });
    video.addEventListener('error', () => video.remove(), { once: true });
    video.load();
  }

  /* reveal on scroll */
  const io = new IntersectionObserver(entries => entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
  }), { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  $$('.reveal').forEach(el => io.observe(el));

  /* before / after sliders */
  $$('.ba').forEach(ba => {
    const range = $('.ba__range', ba);
    const set = v => ba.style.setProperty('--pos', v + '%');
    range.addEventListener('input', () => { ba.classList.remove('hint'); set(range.value); });
    // gentle hint the first time it comes into view
    const hintIO = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting || reduced) return;
      hintIO.disconnect();
      ba.classList.add('hint');
      setTimeout(() => set(78), 300);
      setTimeout(() => set(30), 1300);
      setTimeout(() => { set(50); range.value = 50; }, 2300);
      setTimeout(() => ba.classList.remove('hint'), 3400);
    }, { threshold: 0.5 });
    hintIO.observe(ba);
  });

  /* lightbox */
  const lb = document.createElement('div');
  lb.className = 'lightbox';
  lb.innerHTML = '<img alt="">';
  document.body.appendChild(lb);
  const lbImg = $('img', lb);
  $$('.case__thumbs img, .mosaic img').forEach(img => img.addEventListener('click', () => {
    lbImg.src = img.src; lbImg.alt = img.alt; lb.classList.add('is-open');
  }));
  lb.addEventListener('click', () => lb.classList.remove('is-open'));
  addEventListener('keydown', e => { if (e.key === 'Escape') lb.classList.remove('is-open'); });

  /* enquiry form -> pre-filled email */
  $('#enquiry').addEventListener('submit', e => {
    e.preventDefault();
    const f = new FormData(e.target);
    const interests = f.getAll('interest').join(', ') || '—';
    const body = [
      `Name: ${f.get('name')}`,
      `Phone: ${f.get('phone') || '—'}`,
      `Email: ${f.get('email')}`,
      `Postcode: ${f.get('postcode') || '—'}`,
      `Interested in: ${interests}`,
      '',
      f.get('message') || ''
    ].join('\n');
    location.href = `mailto:oliver@chalkprojects.co.uk?subject=${encodeURIComponent('Project enquiry — ' + f.get('name'))}&body=${encodeURIComponent(body)}`;
  });

  $('#year').textContent = new Date().getFullYear();
})();
