# StoryDogs interaction and image update

Local preview: http://127.0.0.1:3000/story-dogs. Start from this project with `npm run dev -- --hostname 127.0.0.1 --port 3000` if the server is stopped. Nothing has been deployed or pushed.

## Creative suggestions

`src/data/storyDogs.ts` now contains fourteen separate banks, twelve suggestions each (168 total), alongside the existing questions, hints, image mappings and later-stage connection reminder. Suggestions mix everyday, magical, silly and adventurous possibilities without relying on violent stakes. Each field shows one labeled inspiration outside its input, and has its own Give Me Another Idea button.

`src/lib/story-dogs.ts` implements independent Fisher–Yates decks. Each deck exhausts its bank before reshuffling; the first idea in the next cycle differs from the last one in the previous cycle. Navigation keeps each field's current deck. New stories replace all fourteen decks and avoid the previous displayed idea in each field. Suggestions never write to the answer state or outline.

## Dog mapping and loading

The original stage-three `uh-oh.png` is a white terrier with a head tilt, facing right. Stage-four `trouble.png` is a brown hound leaning forward, facing left. Both mappings and the actual original/optimized files were inspected; they are not duplicate files. All seven source hashes and all seven optimized hashes are distinct, and all images were visually inspected for breed, pose and facing direction.

The client image now has a stage-specific React key, preventing the prior dog's DOM node from being reused as the next stage loads. The files have new WebP URLs. A responsive preload for the next stage is built from the same Next.js getImageProps settings used to display the dog, preventing mismatched preload requests. The first dog uses preload; subsequent visible dogs load eagerly. The next preload has low fetch priority. Back navigation benefits from the browser/Next.js image cache; direct jumps to a stage that has never been visited may still require an image request.

Image space is reserved with intrinsic 640×640 dimensions and a square CSS container; desktop display is capped at 300px and mobile at 160px. Responsive sizes include 256/384/640px candidates so mobile does not have to request a desktop-sized rendition. The existing next/image optimizer remains in use. The original PNGs are retained as source masters. WebPs were generated with Sharp resize to 640×640, quality 90 and alphaQuality 100. All remain transparent; alpha range 0–255 is verified. Optimized appearance was visually checked.

All originals are PNG, 1254×1254. All new page assets are WebP, 640×640. Sizes below are exact bytes (divide by 1,000 for decimal KB).

| Stage | Original PNG bytes | Optimized WebP bytes | Pose / facing |
| --- | ---: | ---: | --- |
| who | 1,628,883 | 90,516 | Corgi sitting / right |
| life-want | 1,712,555 | 102,338 | Golden retriever standing / left |
| uh-oh | 1,243,023 | 68,034 | White terrier head tilt / right |
| trouble | 1,603,550 | 103,618 | Brown hound leaning forward / left |
| worse | 1,700,290 | 102,396 | Black-and-tan dog raised paw / right |
| climax | 1,807,464 | 108,288 | Schnauzer playful bow / left |
| change | 1,610,039 | 87,224 | Dalmatian lying relaxed / right |

Total: 11,305,804 → 662,414 bytes, a 94.1% source-size reduction. The served Next.js 640px quality-75 WebP renditions measured 48,364–75,776 bytes. Full measurements are in `StoryDogs-image-audit.json` and `StoryDogs-image-delivery.json`.

## Google Docs and reset

The first outline action is Copy for Google Docs. It copies the complete plain-text outline with stage headings, prompts, answers and intentional line breaks. Only after successful copying does Open Google Docs appear, linking to https://docs.google.com/document/ in a new tab. Instructions explain creating a blank document and pasting. There is no Google authorization or document-creation API. Download and print remain secondary actions. Clipboard failure exposes a read-only selectable outline and Ctrl/Command+A, C and V instructions. Editing responses or starting a new story invalidates previous copy-success state; a copy completing after reset cannot bring that state back.

Start a New Story is available at the top and bottom of both builder and outline views, with a warm outlined style distinct from navigation. A native modal dialog asks exactly “Start a new story? This will clear all your answers.” and offers Keep My Story and Clear Answers and Start Again. Keeping the story preserves answers, output, suggestions and browser draft. Confirmation removes the saved draft, clears answers and outline, returns to WHO, clears clipboard success/fallback, and refreshes all suggestion decks. Empty stories restart immediately without a dialog. Storage-removal failure is reported honestly instead of claiming that the saved draft was deleted.

## Verification

- Changed-file ESLint and TypeScript pass.
- `node --import tsx --test scripts/storydogs.test.ts`: four tests pass, covering bank completeness, immutable non-repeating deck cycles, all-field refresh, and unique asset/direction mappings.
- A temporary jsdom installation outside the project was used to exercise the actual React component. No project dependencies were added. All seven stages/fourteen fields were filled and each suggestion bank exhausted. Responses stayed intact. Tests covered later-stage reminders, alternating placement classes, distinct image URLs and next-stage preload presence.
- Component checks passed for complete/partial outlines, successful clipboard payload and new-tab Google Docs link, clipboard-denied fallback/instructions, text download and print callback, outline editing, draft recovery after remount, Keep My Story, confirmed reset, all-field suggestion refresh, no-confirm empty reset, and empty drafts after remount. These tests simulate clipboard/download/print and dialog browser methods; they do not replace native browser integration checks.
- `/story-dogs` returns HTTP 200 with the actual activity. All 19 page script/stylesheet URLs returned 200. All seven new WebPs and Next.js image renditions returned 200 with transparency. First and next responsive preload links were checked in served HTML. Local cold optimizer requests measured 75–118ms; cached responses measured 1–4ms and X-Nextjs-Cache HIT. These are local HTTP measurements, not a browser navigation benchmark.
- Resource links and the Writing Resources link to StoryDogs continue to return HTTP 200.
- Real visual browser access remains unavailable from the previously reported Computer Use/browser connection restrictions. Review mobile/desktop layout, on-screen image switching and perceived timing, native dialog focus/keyboard behavior, native clipboard permissions, actual saved downloads and print preview in the local browser.
- Known prior repository-wide checks: full lint has existing errors in FanFicSearch and the older PlotBuilder; production build was blocked by existing Google Fonts network downloads. Neither was changed in this update.
