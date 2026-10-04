# StoryDogs seven-stage visual update

Preview: http://127.0.0.1:3000/story-dogs. The local development server runs from `/Users/markcheverton/Desktop/markcheverton.com`; restart it with `npm run dev -- --hostname 127.0.0.1 --port 3000` if necessary. This update has not been deployed or pushed.

The reference `/Users/markcheverton/Desktop/StoryDogs/StoryDogs Seven-Step Story Website structure.png` was accessible and visually inspected before editing. The implementation follows its plum/rust/amber background, cream panels, colored stage headings, alternating dogs, golden connecting trail and opening copy. The reference is not embedded as an image or background. Existing optimized transparent dog illustrations remain in use, with seven unique files and inward-facing directions.

The builder is now a tall scrolling page. All seven sections and fourteen answer fields stay mounted, including while the finished outline is displayed below the activity. The existing fourteen questions, 168 suggestions, draft key, answers, deterministic outline generation, copy/download/print and reset logic are reused. Existing browser drafts remain recoverable. The audience text is grades K–5. The general author navigation remains; its scenic masthead is hidden only on StoryDogs so it does not compete with the reference composition.

## Responsive presentation

- Desktop places alternating dogs beside spacious cream panels. Two questions appear side by side above 1000px; narrower layouts use one column.
- Mobile places each dog above its full-width panel, aligned on its side and facing inward. Jump links wrap into a grid, without a horizontal scrolling navigation strip.
- Sticky StoryDogs navigation includes branding, seven jump links and the top outline button. ResizeObserver measures this navigation and the existing author navigation; section scroll offsets include both. Jumping moves keyboard focus to the matching heading, without an animated scroll. Reduced-motion CSS also disables motion.
- `GrowingAnswer.tsx` grows each multiline field based on scrollHeight, both for typed and recovered text. Width changes also trigger height recalculation. No answer-length limit was added.
- `StoryTrail.tsx` observes the panel and container bounds. It curves along the outside edge of each panel and crosses between sides only in the open inter-stage gaps. It recalculates after text growth, hints expanding or viewport changes. The path is behind all opaque panels, excludes pointer and keyboard interaction, and is hidden from assistive technology. Mobile simplifies it to a vertical connector behind the panels.
- The first dog and second dog are preloaded. Other dog images lazy-load; as stages approach the viewport, IntersectionObserver preloads the next stage using matching next/image responsive properties. Square image space is reserved.

Both outline buttons share the same handler. Missing responses display the existing gap notice and partial-outline choice. The finished outline opens below the builder and receives heading focus. Edit controls jump to the mounted response fields. Changing an answer updates the displayed outline and invalidates previous Google Docs copy success. Educator resources and the author-visit invitation remain below the activity.

Print rules exclude the introduction, navigation, trail, writing panels, reset controls and resources. The opened outline remains with headings and answers. Clipboard, download and print functionality remain unchanged.

## Checks

- TypeScript and changed-file ESLint pass.
- Four persisted content/shuffle/asset tests pass (`node --import tsx --test scripts/storydogs.test.ts`).
- A temporary DOM test exercises the actual React components with browser methods and geometry simulated. It passed for 7 sections/14 mounted fields; changing one suggestion only; all alternating distinct images; jump-link focus; text growth; trail geometry updates; both outline buttons and heading focus; builder staying mounted while output is open; Google Docs copy/fallback; editing jumps; download/print callbacks; draft recovery after remount; keeping or clearing a story; all-field suggestion refresh; draft removal; empty reset; and partial outline behavior from both entry points.
- HTTP verification passed for `/story-dogs` (200), all 7 stages/14 real input elements, 14 suggestion controls, 7 jump links, 2 outline buttons, requested opening copy, 7 distinct images and all 19 script/stylesheet URLs. Responsive, print and reduced-motion rules are included in the served stylesheet.

## Remaining visual review

Browser access remains unavailable under the previously reported Computer Use/browser-connection restrictions. DOM geometry is simulated, so these checks do not establish the actual appearance at desktop/phone widths or on a classroom projector. Review spacing, trail curvature as long answers grow, sticky offsets, native dialog focus and keyboard behavior, native clipboard permissions, saved text downloads and print preview in the local browser. No new project dependencies were installed for this redesign.
