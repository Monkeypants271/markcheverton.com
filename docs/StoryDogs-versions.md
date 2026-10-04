# StoryDogs public and presenter versions: local implementation notes

## Routes and shared architecture

- `/story-dogs`: shared public builder for kids, teachers, and librarians; no login or AI requests. It retains `markcheverton:storydogs:v1`.
- `/story-dogs/teachers`: redirects to `/story-dogs`; no separate teacher builder remains.
- `/story-dogs/presenter`: server-protected presenter builder. Draft key: `markcheverton:storydogs:v1:presenter`.
- `/story-dogs/presenter/login`: login screen; directs a valid login to the presenter builder.

The public navigation's Resources button opens a native modal dialog, with keyboard focus containment, Escape/Close, focus restoration to the trigger, and scroll-position restoration. It offers a real teacher-guide PDF preview in a new tab, an explicit Download link, teaching guidance, and a discreet Presenter Login link. No missing worksheets or handouts are advertised.

Legacy teacher-draft migration: if only the old teacher draft has answers, it is preserved and loaded into the public working draft. If both have answers, autosaving waits for a choice. Before replacement or old-key removal, both originals are stored under `markcheverton:storydogs:v1:preserved`; they remain downloadable from Resources. A backup failure prevents replacement/removal. Keeping the current public story or dismissing the choice leaves the old teacher key intact for a later choice. Reset clears the working draft, not these explicitly preserved originals; browser site-data clearing removes archives on shared devices.


`StoryDogsExperience.tsx` provides one shared shell; `StoryDogsBuilder.tsx` and the existing editable question, suggestion, dog, help, and placeholder data drive all views. Deterministic outline generation remains unchanged. Downloads do not mutate a story; the PDF link also opens a separate tab if a browser displays it instead of downloading it. Story Prompts is the verified `/writing-resources/prompts` route. The author-visit URL remains `https://chevertonauthorvisits.com`.

## Private password setup

No presenter password was included in the attached request, and none was inferred or embedded. From this project directory, run:

```sh
npm run storydogs:setup
```

Enter the desired password twice in the interactive terminal (input is hidden). Minimum length is twelve characters. The command stores only a salted scrypt hash (N=32768, r=8, p=3) and a random encryption secret in `.local/storydogs-presenter.json`, with file mode 0600 inside a 0700 directory. `.local/` is ignored by Git. Password setup cannot take a password via arguments, environment variables, or pipes. Never paste a password into chat or a source file.

The single account is `Mark@chevertonauthorvisits.com`, matched case insensitively. Changing the hash invalidates earlier sessions. No existing admin authentication was changed: its deterministic nonexpiring cookie was unsuitable for these requirements. This feature uses [iron-session](https://github.com/vvo/iron-session) for encrypted cookies, plus random server-recorded session IDs for revocation.

Sessions last four hours, with explicit server expiry checks. Cookies are HttpOnly, SameSite=Strict, and Secure in production. Login attempts are capped at eight per fifteen-minute window globally for this one account; failures use a generic message. This global cap prevents bypass through changing email/IP, but someone can temporarily exhaust the login limit. Login, logout, and punctuation POSTs validate Origin against Host. Presenter rendering and every AI request check the session on the server; AI also rechecks expiry/revocation after the provider responds. Logout removes the server session record, so replaying its old cookie fails.

## Hosting and state

The repository uses Next.js 16.2.6 App Router and Node runtime; no Vercel project binding or dedicated hosting configuration was found. Supabase credentials exist, but no suitable presenter authentication schema or AI provider configuration was found.

For local review, session and rate-limit metadata live under ignored `.local/storydogs-state`. No story text or audio is saved there. Atomic writes and directory locks serialize rate counters across local processes. A server crash while holding a lock fails closed; an administrator can remove the corresponding stale lock after stopping the server. Expired session records contain metadata only and may be pruned administratively.

Before any deployment, configure private server environment variables:

- `STORYDOGS_PASSWORD_HASH`: the generated hash, never plaintext.
- `STORYDOGS_SESSION_SECRET`: the generated random encryption secret (at least 32 characters).
- `STORYDOGS_STATE_DIR`: an absolute path on a **durable, shared filesystem** for session revocation and rate limits.

Production fails closed without a configured state directory. This local filesystem store is **not appropriate for stateless Vercel/serverless instances or hosts without durable shared storage**. For those hosts, replace the store adapter with a shared transactional database/Redis store before publishing. Do not point it at ephemeral `/tmp`; no deployment was attempted. Production uses server environment configuration only, never the development JSON file.

## Presenter-only AI punctuation

A server-only provider key is configured locally, and gpt-4.1-mini passed a live authenticated punctuation test. These private variables control the integration:

```dotenv
STORYDOGS_OPENAI_API_KEY=<private OpenAI API key>
STORYDOGS_OPENAI_MODEL=<Responses-compatible text model available to your account, such as gpt-4.1-mini>
```

Restart the development server after adding those values. None may use a `NEXT_PUBLIC_` prefix. There are no provider calls from public versions and no audio-storage backend.

After an explicit Stop Dictation, the controller waits for the browser's end event and includes all finalized new chunks. Only that new passage is sent; preceding context is not needed or sent. A naturally ended, cancelled, edited, or switched session does not automatically incur an AI request. The raw transcript is already in the draft before processing. Interim words remain unsaved previews.

The private endpoint `/api/story-dogs/presenter/punctuate` sends text to OpenAI's Responses API with `store: false`, a punctuation-only instruction, a 20-second timeout, and at most 1,600 output tokens. Input is capped at 3,000 characters, the streamed HTTP body at 16 KB, requests at twenty/minute and 300/day globally. The output is limited to twice the input length plus 200 characters. Unicode word-sequence comparison rejects added, removed, reordered, or replaced words; only punctuation and capitalization are accepted. Character names and invented words therefore remain intact apart from capitalization.

The UI displays Adding punctuation, Undo, or a raw-text-preserving failure with Retry. Each request is tied to an exact answer snapshot and job identity. Editing, another dictation in the field, outline/reset actions, and unmount invalidate jobs; stale results cannot replace later text, another field, or a cleared story. Cleanup only changes the just-dictated suffix, never prior answers.

StoryDogs does not log transcripts or store audio. Browser speech recognition may separately send audio to the browser provider. OpenAI receives the dictated text, with [OpenAI's applicable data controls](https://developers.openai.com/api/docs/guides/your-data): API content is not used for training by default; abuse-monitoring retention (normally up to thirty days) may apply. `store: false` disables response application-state storage; it is not a zero-retention guarantee.

## Verified teaching files and missing materials

Inspected the repository and `/Users/markcheverton/Desktop/StoryDogs`. The Desktop folder contains the project specification (Markdown/Word) and design/reference PNGs, not classroom downloads. Those are not presented as student worksheets.

Verified available download: `public/downloads/storydogs-teacher-guide.pdf`, a seven-page guide with one page per stage, scripts, discussion prompts, and a connected Pip example. Its source notes remain editable in `src/data/storyDogsHelp.ts` and `src/data/storyDogsTeacher.ts`.

Not found as separate approved downloadable files:

- Seven-step planning worksheet.
- Classroom activity instructions handout (introductory instructions are retained in the guide).
- Example plot outline (the guide has Pip examples, not a standalone outline).

No broken or placeholder downloads were added.

## Verification and manual checks

Earlier local HTTP checks (before two-version consolidation) passed: kids/teachers 200 without login, presenter redirect without session, login with mixed-case email, cookie flags, forged-origin rejection, private AI rejection without authentication, explicit 503 when provider is absent, request-size limit, session expiry, logout/replayed-cookie rejection, and login throttling. Random temporary test credentials were removed after verification; the real account has since been configured privately by the owner.

`node scripts/storydogs-auth-check.cjs` repeats those HTTP tests against the running local server **only before private account setup**. It refuses to replace an existing configuration. It creates a temporary hash/secret and removes them and its session/rate records afterward. Do not run this test against a shared or production server.

Controller/word-preservation tests: `node --import tsx --test scripts/storydogs*.test.ts`. TypeScript and targeted ESLint passed. Actual shared React builder checks with simulated speech/AI passed for separate drafts, legacy-draft recovery, sending only the new passage, clean-text saving, Undo, Retry/raw preservation, edit/reset race protection, and no public AI calls. Existing suggestions, jumps, copying/fallback, print/download, outline, and confirmed reset checks passed.

Real microphone input has **not** been tested. A live authenticated OpenAI test passed on October 4, 2026: the invented Zorblyn passage received sentence punctuation and capitalization with every word preserved. Undo/Retry and edit/reset race protection were tested with simulated AI/speech events. The teacher desktop builder was visually inspected in Chrome, with its dogs, cream background, new placeholders, and dictation controls intact. Browser focus changed during the next inspection; mobile and login/presenter visual review remain to be completed. To test on Windows Chrome: select the USB microphone in Settings > System > Sound > Input, sign in to a preview reachable from that PC, click Dictate, allow access, wait for Listening/Speak now, speak, and Stop. Check punctuation, Undo, Retry with network disabled, edits during processing, reset during processing, and separate drafts across versions. Browser silence must return to Dictate without automatic restart. Review both remaining views at desktop and phone widths; print the teacher guide.


## Two-version consolidation verification

Nineteen pure tests pass, including migration of either draft, teacher-only migration, and quota-failure preservation. Actual React DOM checks pass for the draft-choice dialog, archived downloads, Resources open/close without answer or scroll changes, Close/trigger focus, retained edits and refresh recovery. Existing outline/copy/fallback/print/download/reset flows and simulated presenter punctuation Undo/Retry/stale-response protection pass. The presenter session store and serverless deployment limitations above remain unchanged. These DOM checks simulate geometry/native browser behavior; they do not certify a mobile visual review or live microphone use.

## Latest discoverability and publishing review

Both versions and the private login screen expose Public StoryDogs / Private StoryDogs controls outside Resources, with the active version highlighted. Main/mobile navigation and Writing Resources link to the public builder. See [StoryDogs-publishing-review.md](StoryDogs-publishing-review.md) for the current production checks and unresolved deployment blockers.
