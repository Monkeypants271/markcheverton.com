# StoryDogs teacher resources and narrative report

Prepared October 4, 2026. This is an implementation handoff, not a claim that the website behavior has already changed.

## Goal

Make the public StoryDogs experience usable by teachers and students together, with a Resources link to five free downloads. Present the completed story plan through the Pixar Rule #4 sentence sequence, followed by the clearly identified StoryDogs extension, “Ever since then…”. Keep the student’s ideas and wording intact.

## Inspected project

Repository: `Monkeypants271/markcheverton.com`, default branch `main`.

Relevant files:

- `src/data/storyDogs.ts`: seven stage definitions, two questions per stage, `StoryAnswers`, `missingStages()`, and the shared plain-text `outlineText()` export.
- `src/app/story-dogs/StoryDogsBuilder.tsx`: on-screen report, edit links, copy, text download, printing, and clipboard fallback. The report currently repeats each question before its answer.
- `src/app/story-dogs/StoryDogsExperience.tsx`: public/teacher/presenter navigation and the existing teacher-guide link.
- `src/app/story-dogs/story-dogs.css`: warm plum-to-gold background, cream panels, report and print styles.
- `public/images/story-dogs/`: the seven existing dog illustrations.
- `public/downloads/storydogs-teacher-guide.pdf`: an existing guide. Preserve it until old links have been deliberately updated.
- `scripts/storydogs.test.ts`: existing checks to review and adapt for the report change.

The handouts use the existing dog illustrations and light stage colors on white paper. Their headings and instructions remain readable in grayscale.

Before implementing code, read `AGENTS.md` and the installed Next.js documentation it requires. Recheck the working tree and current files; this note records an inspection, not a guarantee that the code has stayed unchanged.

## Download placement

PDFs belong in `public/teacher-resources/downloads/`. Their public URLs begin with `/teacher-resources/downloads/`; `public` is not part of a URL.

| Title | PDF filename | Pages |
| --- | --- | --- |
| Start Here: Run StoryDogs in 20 Minutes | `01-start-here-20-minutes.pdf` | 1 |
| The StoryDogs Seven-Step Cheat Sheet | `02-seven-step-cheat-sheet.pdf` | 1 |
| StoryDogs Prompt Cards | `03-prompt-cards.pdf` | 3 |
| From Outline to Story | `04-from-outline-to-story.pdf` | 1 |
| A Finished StoryDogs Example | `05-finished-example.pdf` | 2 |

Editable DOCX originals are in `teacher-resources/source/`, using the same stems. Keep these outside `public` unless Mark chooses to offer Word downloads. The cards contain 24 prompts in stage order, eight per page. The example uses one projector page for the seven-step outline and one for the narrative form, with short teacher notes.

Add a Resources anchor to the common public activity and show the five titles with PDF and page-count labels. Suggested intro: “Ready to try StoryDogs with your class? Start with the 20-minute guide, then choose the tools you need.” No login or email gate is needed. The public page serves teachers and students; a separate teacher activity is unnecessary. Preserve the private presenter flow and existing drafts when consolidating navigation.

## Stage mapping and label mismatch

Use stable stage IDs for mapping. Do not map by display label or rename stored keys. The current code uses HERO, WISH, YIKES!, SHOWDOWN, and AFTER! in some positions. This bundle follows Mark’s requested labels below. Make those labels visible in the report; synchronize the builder labels in the same implementation so the documents and activity agree.

| Stable ID | Report label | Narrative lead |
| --- | --- | --- |
| `who` | WHO? | Once upon a time… |
| `life-want` | LIFE / WANT | Every day… |
| `uh-oh` | UH-OH! | One day… |
| `trouble` | TROUBLE | Because of that… |
| `worse` | WORSE! | Because of that… |
| `climax` | CLIMAX | Until finally… |
| `change` | CHANGE | Ever since then… |

The worksheet gives the full opening starter, “Once upon a time there was ___.” Both TROUBLE and WORSE! use “Because of that,” without adding “And” to the second occurrence. Replace the current “But one day,” “And because of that,” and “So” cues accordingly.

Use this attribution below the report and in copied/downloaded output: “Sentence frame: Pixar Story Rule #4. ‘Ever since then’ is a StoryDogs extension, not part of Pixar’s original rule.”

## Preserve both answers without inventing prose

The current data shape is `Record<string, string[]>`, with two responses per stage. Keep both responses in their original order. The first WHO response describes the character; the second describes a struggle. LIFE / WANT includes both ordinary life and motivation. Losing every second answer would remove much of the story’s emotional logic.

Build one shared report representation from the seven fixed IDs, their display labels, narrative leads, and the original answer strings. Use it for screen, copy, manual-copy fallback, text download, and print so the versions agree.

Recommended first release:

1. Show seven flowing story passages, each beginning with its bold narrative lead. Put the matching StoryDogs label in smaller secondary text immediately above the passage.
2. Place each nonblank student answer after the lead, preserving its internal line breaks and order. Use a line break between the two answers so punctuation is not required to connect them.
3. Students may have written full sentences, fragments, or multiple paragraphs. Use the lead on its own short line when needed, rather than forcing a grammatical join such as “Once upon a time there was Bea is a bear.” This is an honest story plan that the student can revise into smooth prose.
4. Do not automatically change pronouns, tense, names, spelling, capitalization, or meaning. Do not invent causal links, infer missing answers, or use AI to rewrite the report. The example handout demonstrates a human-written narrative version; it does not authorize automatic rewriting of student text.
5. Trim only to detect empty input. Preserve the original nonblank text. Do not silently deduplicate repeated words or discard an answer because it resembles a sentence lead.
6. Remove the fourteen question sentences from the finished report. Keep the builder and “Show our answers” view available for reviewing questions and editing answers.

For a whitespace-only or blank field, omit that answer cleanly. If both answers in a stage are blank, show its lead followed by a single blank: “One day… ___”. Never insert “[Not answered yet]” after every question. Keep all seven stage labels so the structure remains visible. A partially answered stage retains the supplied text without a fabricated completion.

If every field is blank, show a warm empty state and a “Start with WHO?” action instead of announcing a completed story. For partial work, use “Your StoryDogs Story Plan” with “You’ve started your story. You can add more ideas whenever you’re ready.” For complete work: “Look what you’ve built! Read your plan aloud, then add the moments that make it yours.”

## Example layout using unchanged student responses

The following is a display sample, not an extra student answer:

> **LIFE / WANT**
>
> **Every day…**  
> She bakes alone.  
> She wants to make a giant cake for Mouse’s birthday picnic.

Use spacious paragraphs rather than a grid of response boxes. Keep edit buttons outside the printed report. Maintain the current report controls, plain-text rendering, keyboard access, draft recovery, and storage warnings. Do not inject answers as raw HTML.

## Acceptance checks for the future code change

- A completed fourteen-answer story shows every answer once, in stage and question order, with seven narrative leads and all seven labels.
- Copy, clipboard fallback, `.txt` download, screen, and print use the same content and extension attribution.
- Test blank first answers, blank second answers, an entirely blank stage, whitespace-only input, and all fields blank. No story detail is invented and no undefined values appear.
- Test multiline text, fragments, complete sentences, names beginning with capital letters, and answers already containing narrative leads. Preserve the student’s wording.
- Reopening and editing an older saved draft still works because stage IDs and stored answer arrays have not changed.
- The report reads comfortably on a projector and prints without navigation, buttons, promotional blocks, or question-by-question interrogation.
- Each new resource link serves the intended PDF. Confirm the one-page guides, 24 unbroken cards, and two-page example after deployment.

## Scope of this delivery

This resource bundle adds documents and this implementation note. The narrative formatter, Resources navigation, public/teacher consolidation, and deployment remain implementation work described here.
