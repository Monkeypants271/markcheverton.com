# StoryDogs approved fade refinement

Preview: http://127.0.0.1:3000/story-dogs

The Desktop/StoryDogs folder contained the original mockup, promotional image and earlier screenshot, but no newly saved fade reference. The approved fade image attached to the user's request was visually inspected and used for this update.

Replaced the old SVG silhouettes with a separately rendered SVG opacity mask. ResizeObserver measures the decorative layer; a rounded mask region is feathered with a Gaussian filter and alpha transfer. The alpha transfer makes the inner region fully opaque and reduces the exterior continuously to zero. Only the mask is softened: no blur, opacity, glow, rim, blend mode, border or panel shadow is applied to text, controls or dogs. The cream blends through transparency into the existing page gradient.

Started with 110px feathers and broadened the unconstrained desktop feather to 160px after browser comparison. Outer horizontal feathers adapt to the available viewport margin; the horizontal filter uses the smaller available extent so it reaches zero before the viewport edge. On mobile the feather is 16px horizontally and 40px vertically, with full-width fields and opaque content padding. Extra solid space and 30px top padding protect LIFE/WANT and WORSE! headings. Layer dimensions and masks expand automatically when answers or help content grow. All decorative layers sit behind all activity content. The top draft notice and bottom outline action have extra clearance from the fades.

Added independent low-opacity dark plum elliptical ground shadows beneath the dogs, with widths and positions adjusted to each stance. The gold trail remains removed.

Verified TypeScript, affected-file ESLint, the four suggestion/asset tests, actual React interactions under jsdom (including long answers, unchanged drafts, suggestion rotation, outline generation, Google Docs copy/fallback, download, print and reset), and HTTP 200 plus all served assets. Rasterized desktop, long-answer and mobile masks and checked full opacity at reading-area corners, intermediate opacity in the feather, and zero alpha at the exterior.

Native Chrome desktop inspection compared the first two revised stages with the attached reference, checked heading clearance, sharp dogs/controls, restored existing answers, and the broader final feather. Browser control was repeatedly interrupted by activity in other Chrome tabs. The complete seven-stage rendered sweep and mobile webpage visual check remain unverified; the standalone mobile mask and DOM checks do not replace those browser checks. No existing user answers were edited or cleared. Everything remains local.
