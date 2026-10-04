# StoryDogs Website Project Specification

Project owner: Mark Cheverton  
Website: MarkCheverton.com  
Proposed route: /story-dogs  
Date: October 3, 2026

Build a free, welcoming StoryDogs story builder on MarkCheverton.com. Students and educators will answer questions about seven story stages, then turn their own answers into a plot outline they can edit, copy, download, or print. Codex should first inspect the existing website project, then implement a working public version that fits its current architecture.

This specification describes the intended product and the first implementation assignment. The fourteen prompts and interface choices below are proposed starting requirements for Mark to review in the working preview. The existing codebase has not been inspected for this specification.

## Purpose and audience

StoryDogs helps kids get past “I don’t know what to write” by giving them questions and structure. It helps them discover their own ideas. The tool must not write a story for them or replace their creative decisions with AI-generated answers.

The public version serves students in grades K–6, teachers and librarians leading a group activity, and families helping a child plan a story. Younger children can dictate ideas to an adult. Older students can work independently and expand their outline into scenes or chapters.

The classroom activity uses seven stuffed dogs, each representing one part of a story. On the website, corresponding dog images make the stages recognizable and memorable. The digital tool should work both during Mark’s live presentation and afterward in a classroom or at home.

## Website placement

MarkCheverton.com/story-dogs is the canonical home for the tool and its resources. Connect it to the author website’s existing writing resources and fan fiction pages after verifying their routes in the project.

ChevertonAuthorVisits.com will showcase StoryDogs as a school visit activity and link to the free tool. It should eventually offer “Try StoryDogs Free” and “Bring StoryDogs to Your School.” Do not build a second copy of the tool or edit that separate website during this assignment.

Include a restrained school visit invitation below the public activity, linking to https://ChevertonAuthorVisits.com. Teachers should be able to use the complete tool without booking a visit, supplying an email address, or creating an account.

## Scope of the first release

- A public StoryDogs page with a short introduction and a prominent “Build My Story” action.
- A seven-stage builder with two responses per stage, fourteen responses in total.
- A finished plot outline assembled deterministically from the student’s answers.
- Editing, copy, plain text download, print, local draft recovery, and reset controls.
- An educator resources area and a modest author visit link below the activity.
- Responsive layouts suitable for phones, laptops, and classroom projection.

Teacher accounts, school branding, usage dashboards, cloud story storage, and teacher management features belong to a later phase. Do not implement authentication or a database for the first release unless the existing project makes one necessary for serving the page itself.

## Seven story stages

Keep the labels WHO, LIFE/WANT, UH-OH, TROUBLE, WORSE!, CLIMAX, and CHANGE. Use approachable explanatory text beside them. The following prompts are the initial content proposal. Store prompts, hints, labels, and image references in one editable configuration so Mark can revise them easily.

### WHO

1. Who is your main character? Give them a name and tell us a little about them.
2. What is something they struggle with or are afraid of?

Hint: Your character could be a kid, an animal, a robot, or something nobody has thought of yet. What makes things difficult for them?

### LIFE WANT

1. What is your character’s life like before the adventure begins?
2. What does your character want, and why does it matter to them?

Hint: They might want a friend, a prize, a way home, or a chance to prove themselves. Give them a reason to care.

### UH OH

1. What happens that changes your character’s normal life?
2. What does your character decide to do because of it?

Hint: Something arrives, disappears, breaks, or goes wrong. What choice starts the adventure?

### TROUBLE

1. What problem gets in the way when your character tries to reach their goal?
2. What do they try, and how does that create the next problem?

Hint: Build on what has already happened. Their attempt might help a little, backfire, or reveal something they didn’t expect.

### WORSE

1. How does the situation become even more difficult?
2. What could your character lose if they fail now?

Hint: Make the new problem matter to this character. A lost friendship can matter as much as a battle with a dragon.

### CLIMAX

1. What is the biggest challenge your character must face?
2. What do they choose to do, and what happens because of that choice?

Hint: Let your character take action. Use something they have learned, practiced, or discovered along the way.

### CHANGE

1. What has your character learned, or how have they changed?
2. What is their life like at the end of the story?

Hint: Think back to the beginning. What can they do, understand, or face now that they couldn’t before?

## Builder behavior

Use one clearly focused stage at a time, with all seven stages available through accessible navigation. Each stage shows its dog image when available, the stage label, two labeled text fields, a short optional hint, and Back and Next controls. Show progress by stage and make it easy to return to earlier answers without losing work.

Provide a collapsed “Show our answers” view so a teacher can refer to earlier contributions while projecting the tool. Keep the active questions and responses large enough to read across a classroom. Do not make the main interface depend on hover, animation, or tiny icons.

Do not force every field to be complete before moving forward. A student can skip a difficult question and return later. If they request an outline with missing answers, explain which stages have gaps and allow them to proceed with a clearly labeled partial outline. Never fill gaps with invented story content.

Render typed answers as plain text. Preserve intentional line breaks. Avoid restrictive input limits that prevent meaningful student answers. Any necessary limits should be generous, documented, and visible before text is lost.

## Plot outline output

“Show My Plot Outline” reveals an outline using only the student’s own answers. Group both responses under each matching stage, in order. Use these story spine leads as organizational cues: “Once upon a time,” “Every day,” “But one day,” “Because of that,” “And because of that,” “Until finally,” and “So.”

Do not simply glue every response into a sentence; students may write fragments or multiple sentences. Keep the cues as headings or separate lead-ins and preserve their wording beneath them. A partial outline should identify unanswered prompts with clear placeholders.

The finished view must support returning to the builder, editing responses, copying the complete outline, downloading a UTF-8 .txt file, and printing. Include stage headings in copied and downloaded output. Use print styles that remove site navigation, buttons, and promotional content from the story printout. Handle clipboard permission failures with a selectable text fallback and an honest status message.

The tool supplies an outline, not a finished story. Explain briefly that younger writers can use it as a short story and older writers can add the scenes and details between its main events.

## Drafts and reset

Save responses locally in the current browser when storage is available. Use a namespaced, versioned draft format and recover safely from missing or malformed data. Do not send student responses to analytics, an AI service, or a server.

Show a short, accurate notice near the builder: “Your draft is saved in this browser. On a shared computer, clear it when you’re done.” A browser draft is not a cloud backup and does not follow the student to another device. If saving fails or is unavailable, keep the current session usable and say that the draft is not being saved.

“Start a New Story” must ask before clearing an existing draft, then remove both the visible responses and saved draft. Make clearing the draft easy to find on a shared classroom device. Do not collect student names, emails, ages, school names, or login credentials. A fictional character’s name is part of a story response.

## Page design and content

The page should feel warm, playful, and credible for educators. Fit the existing author website’s navigation and design. Use clear typography, generous spacing, gentle color, and the dog images as visual anchors. Avoid making the tool look like a cluttered worksheet or a sales landing page.

Suggested opening copy: “Got a story idea? Let’s help it grow.” Follow with: “Seven StoryDogs will help you build the bones of your story. Answer their questions, then turn your ideas into a plot outline.” Add a brief note that an adult can type for younger writers and that the tool is free for grades K–6.

Keep classroom downloads and author visit information on the public page, because teachers may use the student version. An educator resources section should explain group use and connect to verified existing materials. Link to writing resources and story submission instructions only after confirming their actual locations and current content.

Do not invent downloadable PDFs, testimonials, school logos, usage numbers, or publication promises. If classroom materials are missing, document what is needed for Mark and use a simple informational resources section. Do not display dead links or pretend a download exists.

## Images and assets

Individual StoryDog image files still need to be located or supplied. Related StoryDogs promotional graphics have been found, but those are not confirmation that seven separate website assets are available.

Codex should inspect existing project assets first. Map verified images to the seven stages explicitly. Preserve aspect ratios and use consistent display sizes. Use useful alt text and avoid putting essential prompts inside images.

If the individual images are absent, build with neutral, clearly temporary stage placeholders and report the expected asset paths. Keep the configuration ready for Mark to drop in approved files. Do not generate replacement dogs or cut dogs from promotional posters without Mark’s instruction.

## Later teacher version

The planned second experience is a teacher-led version with teacher login, saved preferences, and optional school or classroom branding. Mark wants a way to understand educator usage. Students should still be able to use the public version without individual accounts.

Keep the story stages and outline logic reusable so both experiences can share them. Later planning must decide which usage events to track, where accounts and branding live, and whether teachers can save class outlines. Prefer aggregate feature usage without collecting student story text. Do not add tracking or account infrastructure during the first release.

## What Codex should do first

1. Read this specification and all applicable repository instructions. Inspect the current working tree before making changes and preserve unrelated work.
2. Identify the actual framework, routing, styling, content management system, asset locations, existing StoryDogs content, and relevant test/build commands. Do not assume the site uses Next.js or rebuild the whole website.
3. Determine what the opened project can actually change. If it is a WordPress theme, static export, or partial checkout, state the resulting integration constraints. Ask only for a missing detail that truly blocks implementation.
4. Give a brief implementation summary with the proposed files, route, and verified assets. Then proceed with the public first release using the existing architecture. If a working StoryDogs builder already exists, improve and reuse it instead of creating a competing version.
5. Implement the public page, configurable fourteen prompts, stage navigation, deterministic outline output, local draft recovery, reset confirmation, copy, text download, and print behavior. Include the public educator resources area and author visit invitation.
6. Run the relevant existing checks. Verify the complete user flow in a browser when available, including phone layout, classroom readability, keyboard access, partial outlines, refresh recovery, reset, clipboard fallback, download, and print output.
7. Hand back the changed files, verification results, preview instructions, and any missing assets or materials. Identify any remaining limitations precisely.

For this first assignment, work locally and provide a preview. Do not publish to the live domain, push commits, install paid services, or change production configuration. Mark will review the result before authorizing publication. This restriction applies to the Codex implementation assignment, not to creating these specification files.

## Acceptance criteria

- The page is integrated into the existing site and reachable at the agreed route.
- All seven stages and fourteen prompts appear in the correct order with editable centralized content.
- Students can move freely between stages and recover prior responses after a refresh when browser storage works.
- The outline contains the student’s answers in stage order, with no AI-generated additions; partial outlines show gaps honestly.
- Editing, copy or fallback, .txt download, print, and confirmed reset work end to end.
- Local saving failures do not break the activity; student responses are not transmitted off the device.
- Inputs and controls have accessible labels, visible keyboard focus, readable contrast, and usable mobile sizing.
- The tool works without student accounts, email gates, or paid services.
- Resource links point to real content and missing dog images remain clearly documented.
- Relevant checks pass, or failures and their causes are reported; the existing site remains usable.

## First message to paste into Codex

Read StoryDogs_Project_Spec.md in this repository and follow its first implementation assignment. Begin by inspecting the existing website architecture, repository instructions, current changes, and any StoryDogs code or assets. Then build the public StoryDogs experience at the appropriate route using the existing stack. Use the proposed fourteen prompts as the initial editable content. Reuse existing working components where possible. Keep teacher login and custom branding for a later phase. If dog images are missing, use temporary placeholders and document the required asset paths. Complete the builder, outline, draft recovery, copy, text download, print, and reset flows, then run appropriate checks and provide a local preview with a concise handoff. Keep this first build local for my review and do not publish or push it.
