# StoryDogs local implementation

Preview: http://127.0.0.1:3000/story-dogs (`npm run dev` to restart).

The existing Next.js 16.2.6 App Router, global header/footer, Container, fonts and warm site palette are retained. No StoryDogs implementation existed. The older eight-step Plot Builder is a different writing resource and remains available. StoryDogs is linked from Writing Resources and included in the sitemap.

Content and image mapping: `src/data/storyDogs.ts`. Client activity: `src/app/story-dogs/StoryDogsBuilder.tsx`. Page and educator links: `src/app/story-dogs/page.tsx`. Responsive and print styles: `src/app/story-dogs/story-dogs.css`.

Answers remain in React state and versioned browser storage (`markcheverton:storydogs:v1`). No StoryDogs answer data is sent to a service or server. Outline cues organize the student's own responses; skipped prompts get explicit placeholders. Edit buttons return to the selected stage. Reset confirms before clearing nonempty answers. Clipboard denial exposes selected plain text. Downloads use a UTF-8 text Blob. Print hides navigation, controls and resources.

## Illustrations

The Desktop folder `/Users/markcheverton/Desktop/StoryDogs` was readable. It contained the Markdown and Word specifications, the promotional PNG, and a Word lock file. There were no individual dogs. The promotional image was visually inspected before implementation. New assets were generated with the built-in image_gen tool using that image as visual guidance, as authorized in the user request. No stock images or poster cutouts were used.

All assets are separate 1254×1254 RGBA PNGs in `public/images/story-dogs/`. All have true transparency, no lettering, and were visually inspected. No mirroring is applied.

| Asset | Dog / pose | Side / facing |
| --- | --- | --- |
| who.png | Orange-and-white corgi, proud sitting | Left / right |
| life-want.png | Golden retriever, standing | Right / left |
| uh-oh.png | White terrier, seated head tilt | Left / right |
| trouble.png | Brown hound, leaning forward | Right / left |
| worse.png | Black-and-tan dog, seated raised paw | Left / right |
| climax.png | Gray schnauzer, playful bow | Right / left |
| change.png | Dalmatian, relaxed lying pose | Left / right |

Prompt template used for each image: create one separate StoryDogs website illustration; use the promotional image only as style guidance; friendly soft stuffed-toy appearance, plush fabric texture, expressive dark bead eyes, rounded muzzle, small red cloth cape with no lettering; use the subject, pose and direction in the table; full dog in three-quarter view, including paws/ears, square canvas, consistent apparent size, warm studio lighting, genuine transparent background, no floor/scenery/text/logos/children.

Mobile places the dog above full-width questions, aligned on its stage's side and looking toward the center. Missing assets have a clearly temporary stage placeholder. No images are currently missing. Dedicated StoryDogs classroom handouts were not supplied; the page does not claim they are downloadable.

## Verification

- TypeScript: passed.
- ESLint on changed page, client component, content config and writing resource page: passed.
- Outline assertions: passed for seven stages/fourteen prompts, original text and line breaks, ordered output, and complete/partial outlines.
- Asset inspection: all seven correct facing directions, distinct poses and matching plush style; alpha range 0–255 on every image.
- Local HTTP preview: 200 response.
- Full repository lint: existing errors in FanFicSearch.tsx and the older PlotBuilder.tsx (react-hooks/set-state-in-effect).
- Production build: blocked by Google Fonts network fetch failures for the existing Geist, Geist Mono and Fraunces imports. Existing middleware deprecation warning also reported.
- Browser end-to-end and visual layout checks: unavailable. No connected browser, agent-browser CLI not installed, native Chrome control reports Computer Use permissions are not granted. Accordingly mobile appearance, keyboard interaction, refresh recovery, actual clipboard fallback/download and print output have not been exercised in a browser.

Review checklist: type answers in multiple stages, return to earlier stages, refresh, request a partial outline, edit and complete the outline, copy/download/print, confirm and cancel reset, check a narrow phone viewport and classroom projection size. Also verify clipboard and storage denial behavior once browser testing is available.

Work is local only. No deployment, push, production configuration changes, accounts, databases or new tracking were added. Unrelated working tree files were preserved.

## Follow-up visibility audit

The existing page, builder, centralized prompts, CSS and seven PNGs were present; no duplicate page or regenerated assets were created. The existing port-3000 server was confirmed to belong to `/Users/markcheverton/Desktop/markcheverton.com`. The route already returned HTTP 200, so there is no evidence that missing implementation caused the visibility problem. The prior run did not open a browser preview, and the live domain was never deployed; the exact cause of the user's unseen page cannot be established without their browser state.

A fresh development server was explicitly started from this project with `npm run dev -- --hostname 127.0.0.1 --port 3000`. Review URL: http://127.0.0.1:3000/story-dogs. Leave that terminal session running. Visiting the production domain does not show these local changes.

The introduction now lives alongside the builder in its client component. Build My Story reopens the current stage from the outline, preserves answers, focuses the stage heading and scrolls the builder below the sticky navigation. The partial-outline gap notice disappears when no missing answers remain, preventing an invalid return-to-missing-stage action. Image intrinsic dimensions now match the existing PNGs (1254×1254).

Fresh HTTP checks verified the actual StoryDogs page structure, seven-stage navigation, two labeled initial fields, educator section and visit link. All 19 referenced script/stylesheet URLs returned 200; the served client script contains the builder behavior, and the CSS contains responsive and print rules. All seven dog PNGs and the first dog's Next.js optimized image returned 200. Writing Resources, For Educators and Fan Fiction submission routes returned 200, and Writing Resources links to StoryDogs. Server logs confirmed all four page responses.

Changed-file ESLint, TypeScript and deterministic outline checks pass. Browser testing remains unavailable under the previously reported browser access/Computer Use restrictions. HTTP verification does not establish client hydration, physical button interactions, actual storage recovery after refresh, clipboard permission fallback, saved downloads, print layout, keyboard navigation, or phone/projector appearance. Those are the precise remaining browser review items.


## Current suggestion, reset, Docs and image update

See [StoryDogs-updates.md](StoryDogs-updates.md) for current behavior, the per-image format/dimension/size report, optimized asset mappings and affected-flow verification. The current page uses 640×640 transparent WebPs while retaining the original PNG source masters.
