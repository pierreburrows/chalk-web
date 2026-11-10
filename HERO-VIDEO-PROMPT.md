# Chalk: hero film prompt

**What it's for:** the full-screen opening film on the homepage. It plays muted and on a loop behind the headline.
**How to use it:** save the finished film as `img/hero.mp4` and the site picks it up automatically. Until then, the hero plays a sequence of real Chalk photos (before, build, turf, finish).

## Delivery spec

| Setting | Value |
|---|---|
| Aspect ratio | 16:9 landscape (the site crops it to fill phones, so keep the action in the centre 60%) |
| Resolution | Generate at the highest the model allows (1080p or 4K), then upscale to 3840×2160 if needed |
| Length | 10–15 s. The end frame should hold for about 2 s so the loop feels calm |
| Frame rate | 24 fps |
| Audio | None |
| Export | H.264 MP4, about 8–12 MB for the web (`ffmpeg -i in.mp4 -vf scale=1920:-2 -c:v libx264 -crf 24 -preset slow -an -movflags +faststart hero.mp4`) |

## Best method for accuracy: first and last frame

Text-only prompts tend to produce wobbly fences and impossible construction. For the most realistic result, use a model that accepts a **start frame and an end frame** (Kling, Veo, Runway, Higgsfield and similar):

- **End frame:** a real Chalk photo, `assets/project1-after-lawn.jpg` (finished slatted fence, gate, raised beds, lawn). The final shot is then the actual work, not an AI guess.
- **Start frame:** `assets/project1-before.jpg`, or the same garden stripped to levelled bare ground (that version can be generated from the end frame using the "Start frame" prompt below).

---

## Main prompt (paste this)

> Photorealistic architectural time-lapse, shot on a full-frame cinema camera locked off on a tripod at eye height (1.6 m), 24 mm lens, f/8, deep focus, 4K, natural colour grade with soft contrast. A narrow, walled rear garden of a Victorian terraced house in Hove, England: old soft-red brick boundary walls on both sides and at the back, a mature tree behind the far wall, blue sky with slow-moving white clouds.
>
> The time-lapse shows a complete garden build from start to finish in one continuous, unbroken shot, with the camera never moving:
>
> 1. **Bare ground.** The garden starts as a level, freshly raked bed of pale grey MOT sub-base and sand screed, framed by straight treated-timber edging boards. The old brick walls are clean and repointed.
> 2. **Posts.** Square 100 × 100 mm pressure-treated pine posts are set upright against the brick walls at even 1.8 m centres, perfectly plumb, bases bedded into the ground.
> 3. **Fence.** Horizontal slatted batten fencing builds up board by board, from the bottom upwards, along the top of the brick walls. The slats are pale, honey-green pressure-treated pine, about 70 mm tall with identical 8–10 mm gaps, perfectly level and parallel, and fixed to the face of the posts. The boards show clear, realistic wood grain and knots. Along the back wall, a matching slatted gate is hung on black strap hinges.
> 4. **Raised beds.** Low raised beds of chunky pressure-treated timber sleepers are assembled at the base of the back wall, either side of the gate, with neat, tight corners.
> 5. **Turf.** Rolls of fresh, deep-green turf are unrolled one after another, starting from a straight edge and laid in staggered brick-bond joints, with tight seams and the edges cut cleanly to the timber edging. The lawn becomes one even, lush surface with soft mowing-stripe tones.
> 6. **Planting.** The raised beds and wall borders fill with plants: silvery lavender, ornamental grasses, a small multi-stem olive tree and green climbers starting on the slats. The soil is dark and freshly mulched.
> 7. **Final hold.** Late-afternoon golden sunlight rakes across the new fence, casting long, crisp, parallel slat shadows across the lawn. Everything is calm and still, apart from gentle leaf movement and drifting clouds.
>
> Light moves naturally from cool morning to warm golden hour, and shadows sweep smoothly across the garden as the day passes. Workers appear only as soft, translucent motion blur during the time-lapse, never as sharp figures. The garden is neat and tidy at every stage. Tones are restrained and premium: natural timber, soft brick red, lush green, pale sky. Ultra-detailed textures, physically accurate light and shadow, real-world construction order, and no cuts.

## Negative prompt

> warped or bending fence boards, uneven or random gaps between slats, floating posts, boards fixed to nothing, vertical slats, picket fence, lap panel fence, plastic-looking wood, melting geometry, morphing walls, shifting brick pattern, camera shake, camera movement, zoom, cuts, scene changes, sharp faces, distorted people, extra limbs, tools appearing from nowhere, turf rolling uphill, grass growing like a fast-motion animation, mismatched seams, oversaturated green, cartoon, CGI look, text, watermark, logo, lens flare overload, fisheye distortion

## Start-frame image prompt (if you generate one)

> Photorealistic photo, same garden, camera, lens and lighting as the reference image: a narrow walled Victorian rear garden in Hove with old red-brick boundary walls, completely cleared and levelled, freshly raked pale grey sub-base and sand screed, straight treated-timber edging boards set around the lawn area, no fence, no plants, no turf, clean site, soft morning light, 4K, 24 mm, eye level, tripod.

## Shorter version (for models with short prompt limits)

> Locked-off photoreal 4K time-lapse of a narrow walled Victorian garden in Hove. From levelled sand screed, plumb timber posts are set, then horizontal slatted pressure-treated pine fencing builds up board by board with even 10 mm gaps and a matching slatted gate. Sleeper raised beds are assembled, fresh turf rolls are laid in staggered joints, and lavender, grasses and an olive tree are planted. Light moves from morning to golden hour, with long parallel slat shadows across the new lawn. Workers appear only as motion blur. No camera movement, no cuts, accurate construction, premium natural tones.

## Tips for a perfect result

- **Generate 4–6 takes and pick the best.** Check the slats frame by frame, since they're the most likely thing to go wrong.
- **If the model limits clips to 5–10 s**, generate two clips: (a) bare ground to finished fence, then (b) using clip a's last frame as the start, turf and planting to golden hour. Join them with a short cross-dissolve.
- **Upscale** with a video upscaler (Topaz Video AI, or the upscale tool in your generator) to 4K, then compress for the web as shown in the spec above.
- **Keep it honest.** Under the film, the site shows only real Chalk projects, so the hero should feel like an idealised version of their real work: slatted fencing, sleepers and turf, which is exactly what Project 1 shows.
