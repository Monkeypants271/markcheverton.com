# StoryDogs layout refinement

Preview: http://127.0.0.1:3000/story-dogs. Run `npm run dev -- --hostname 127.0.0.1 --port 3000` from the website project if the local server is stopped. Nothing was published or pushed.

Both images in the Desktop StoryDogs folder were visually inspected: the supplied current-page screenshot `c6d1deaa-23e0-4137-be0f-94d98620cc4a.png` and `StoryDogs Seven-Step Story Website structure.png`.

## Changes

- Replaced the StoryDogs page's shared Container (`max-w-6xl`, 1152px including 48px horizontal padding) with a route-specific `.sd-shell` capped at 1248px including the same 48px padding. The intended 1440px desktop geometry is 1200px of story content: a 360px dog column, 20px gap and 820px writing panel. This is calculated from CSS, not a real-browser measurement. The shared Container and other routes were not widened.
- The two-question desktop layout remains. Labels and suggestions no longer have fixed 80px/75px minimum heights. Panel padding, heading/subtitle gaps and suggestion spacing were tightened without reducing font sizes or comfortable button targets. Another Idea is 8px below its suggestion instead of following an artificially tall empty area.
- Answer fields start with `rows=3` and a 120px minimum (approximately three 18px text lines plus padding), instead of five rows/150px. They still expand for typed or restored long answers and when wrapping changes. Panels have no fixed height.
- Alternate asymmetric elliptical panel corners: left-dog panels use `92px 40px 78px 48px / 46px 68px 42px 72px`; right-dog panels use `46px 100px 42px 88px / 68px 42px 74px 38px`. Interior content remains upright. Mobile uses smaller alternating ellipses with full-width panels.
- Desktop dog image boxes increase to 360px from approximately 232–240px, about 50–55% larger. Phone dog boxes increase to up to 240px from 160px. Images remain proportionate and in their own columns or mobile rows, with no transform over the panel. Responsive next/image sizes were updated. The existing 640px transparent WebP files remain unchanged.
- Alpha-bound inspection found the visible dog occupying 524–624px of the 640px source width (82–98%). The original assets therefore did not have large transparent margins that would defeat enlargement. No approved image was cropped or regenerated.
- Rebuilt the golden trail with broad cubic side sweeps using 32px clearance and outward control points scaled to container width. Side sweeps and inter-stage connectors share horizontal tangents at their joins, removing the previous sharp-looking transitions and nearly straight edge lines. Connectors use measured panel tops/bottoms and cross only the open gaps; side curves stay outside the writing panels. ResizeObserver still recalculates for long answers, hints and resizing. Mobile retains the simplified decorative connector.
- Removed the navigation's negative top margin. It now occupies normal document flow before sticking below the measured site header. Introduction spacing is positive. Stage jump margins continue to include both measured navigation heights plus 22px of clearance. Print layout now targets the new `.sd-shell`.

## Preservation and checks

The question configuration, fourteen suggestion banks, draft key, answer state, reset behavior and outline generation were not changed. Existing browser drafts are retained.

Passed: TypeScript, changed-file ESLint, four content/shuffle/asset tests, and actual React component DOM flow checks for all fourteen mounted responses; independent suggestion rotation; long answer growth; decorative trail recalculation with simulated geometry; keyboard focus on stage jumps; both outline buttons; retained inputs while output is open; Google Docs copy/fallback; download and print callbacks; recovery after remount; reset cancellation/confirmation; refreshed suggestions; draft removal and partial outlines.

HTTP checks passed for `/story-dogs` (200), all seven sections/fourteen fields, all navigation and outline controls, all seven distinct dog images, and all 19 referenced scripts/styles. Mobile, print and reduced-motion CSS is delivered.

## Visual verification limitation

A fresh computer-use inventory found no connected browser. Native Chrome access reported `Computer Use permissions are not granted`. Consequently, a new same-viewport rendered comparison at 1440px and phone width could not be captured. The provided screenshot/reference were inspected, but the new width calculations and geometry tests do not substitute for browser screenshots. Review actual introduction clearance, panel silhouettes, dog scale, trail curves during long-answer growth, sticky behavior, phone overflow, stage jumps and native print preview in the local browser.
