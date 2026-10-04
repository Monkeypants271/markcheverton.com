# StoryDogs public and presenter versions: local implementation notes

## Routes and shared architecture

- `/story-dogs`: shared public builder for kids, teachers, and librarians; no login or AI requests. It retains `markcheverton:storydogs:v1`.
- `/story-dogs/teachers`: redirects to `/story-dogs`; no separate teacher builder remains.
- `/story-dogs/presenter`: server-protected presenter builder. Draft key: `markcheverton:storydogs:v1:presenter`.
- `/story-dogs/presenter/login`: login screen; directs a valid login to the presenter builder.

The public navigation's Resources button opens a native modal dialog, with keyboard focus containment, Escape/Close, focus restoration to the trigger, and scroll-position restoration. It offers grouped, verified teaching PDFs with previews in new tabs, explicit downloads, a download-all ZIP, and a discreet Presenter Login link. No missing worksheets or handouts are advertised.

Legacy teacher-draft migration: if only the old teacher draft has answers, it is preserved and loaded into the public working draft. If both have answers, autosaving waits for a choice. Before replacement or old-key removal, both originals are stored under `markcheverton:storydogs:v1:preserved`; they remain downloadable from Resources. A backup failure prevents replacement/removal. Keeping the current public story or dismissing the choice leaves the old teacher key intact for a later choice. Reset clears the working draft, not these explicitly preserved originals; browser site-data clearing removes archives on shared devices.


`StoryDogsExperience.tsx` provides one shared shell; `StoryDogsBuilder.tsx` and the existing editable question, suggestion, dog, help, and placeholder data drive all views. Deterministic outline generation remains unchanged. Downloads do not mutate a story; the PDF link also opens a separate tab if a browser displays it instead of downloading it. Story Prompts is the verified `/writing-resources/prompts` route. The author-visit URL remains `https://chevertonauthorvisits.com`.

## Private password setup

No presenter password was included in the attached request, and none was inferred or embedded. From this project directory, run:

```sh
npm run storydogs:setup
```

Enter the desired password twice in the interactive terminal (input is hidden). Minimum length is twelve characters. The command stores only a salted scrypt hash (N=32768, r=8, p=3) and a random encryption secret in `.local/storydogs-presenter.json`, with file mode 0600 inside a 0700 directory. `.local/` is ignored by Git. Password setup cannot take a password via arguments, environment variables, or pipes. Never paste a password into chat or a source file.

The single account is `Mark@chevertonauthorvisits.com`, matched case insensitively. Rotate the session secret when changing the password if all existing sessions should also end. No existing admin authentication was changed: its deterministic nonexpiring cookie was unsuitable for these requirements. This feature uses [iron-session](https://github.com/vvo/iron-session) for encrypted cookies, plus random server-recorded session IDs for revocation.

Sessions last **eight hours** with an absolute server-side expiry check on every private page and AI request. The established `iron-session` library cryptographically authenticates and encrypts the cookie. Its small payload contains the account email, version, issued-at and expiry timestamps; never a password, password hash, story text or API key. Cookies are HttpOnly, SameSite=Strict, and Secure in production. Authentication version 2 rejects old server-recorded-session cookies.

Logout clears this browser's cookie. **Stateless logout cannot revoke a previously copied token before its expiration.** Replacing `STORYDOGS_SESSION_SECRET` and redeploying invalidates all old tokens once all traffic reaches the new deployment; do not retain the old secret as a fallback key. Changing the password hash alone does not revoke existing cookies. Login, logout and punctuation validate Origin against Host. Presenter rendering and every AI endpoint authenticate on the server, with expiry checked again after the provider response.

## Hosting and private configuration

Production runs on the Vercel project `markcheverton-com` in `mark-chevertons-projects`. No database, Redis, subscription, filesystem session state, or `.local/storydogs-state` is required. Production never reads the Mac's development credentials. If private configuration is missing, it shows “Private StoryDogs is temporarily unavailable” without local commands or paths.

Configure these **server-only sensitive Production environment variables**, then redeploy:

- `STORYDOGS_PRESENTER_EMAIL`: `Mark@chevertonauthorvisits.com`, case insensitive.
- `STORYDOGS_PASSWORD_HASH`: generated salted scrypt hash, never plaintext.
- `STORYDOGS_SESSION_SECRET`: private random sealing secret, at least 32 characters.
- `STORYDOGS_OPENAI_API_KEY`: existing OpenAI key.
- `STORYDOGS_OPENAI_MODEL`: `gpt-4.1-mini`, verified with the owner's account.

`node scripts/storydogs-vercel-config.cjs` transfers the existing ignored local configuration directly to this project's private Vercel Production settings using the owner's saved CLI authorization, verifies variable names/types and prints no values. It never pulls environment files, creates a database, or provisions services. It is a Mac configuration-transfer helper, not production page content. Nothing may use a NEXT_PUBLIC prefix or be committed as a secret. Preview credentials are not automatically configured; use a separate sealing secret for previews.

## Abuse protection without an additional service

Vercel's platform DDoS protection is included automatically. A published free WAF deny rule rejects foreign-origin POSTs to StoryDogs login, logout and punctuation on the canonical site domains before server execution; it does not prevent bots that spoof a valid Origin. Free IP blocks can supplement it; normal hosting usage still applies to accepted traffic. The current Pro team's WAF **rate-limit** feature is usage-billed, so it is not enabled by this task. No paid plan, service or database is provisioned.

Application counters provide **best-effort per-process throttling only**: eight login attempts/15 minutes, four per Vercel edge-provided IP/15 minutes, twenty punctuation requests/minute, and 300/day. Cold starts reset them and independent serverless instances do not share them; they are neither dependable global abuse protection nor a hard provider spending cap. Memory is bounded and full counters fail closed within the affected process. Origin checks, generic login errors, strong scrypt passwords, bounded request bodies, finite provider timeouts and server-only paid API access remain enforced. Monitor login/API abuse and use provider spending limits; distributed abuse remains a limitation of this no-storage design. Redis is optional for a future policy change, never a prerequisite.

## Presenter-only AI punctuation

A server-only provider key is configured locally, and gpt-4.1-mini passed a live authenticated punctuation test. These private variables control the integration:

```dotenv
STORYDOGS_OPENAI_API_KEY=<private OpenAI API key>
STORYDOGS_OPENAI_MODEL=<Responses-compatible text model available to your account, such as gpt-4.1-mini>
```

Restart the development server after adding those values. None may use a `NEXT_PUBLIC_` prefix. There are no provider calls from public versions and no audio-storage backend.

After an explicit Stop Dictation, the controller waits for the browser's end event and includes all finalized new chunks. Only that new passage is sent; preceding context is not needed or sent. A naturally ended, cancelled, edited, or switched session does not automatically incur an AI request. The raw transcript is already in the draft before processing. Interim words remain unsaved previews.

The private endpoint `/api/story-dogs/presenter/punctuate` sends text to OpenAI's Responses API with `store: false`, a punctuation-only instruction, a 20-second timeout, and at most 1,600 output tokens. Input is capped at 3,000 characters, the streamed HTTP body at 16 KB, best-effort per-process requests at twenty/minute and 300/day (not global quotas). The output is limited to twice the input length plus 200 characters. Unicode word-sequence comparison rejects added, removed, reordered, or replaced words; only punctuation and capitalization are accepted. Character names and invented words therefore remain intact apart from capitalization.

The UI displays Adding punctuation, Undo, or a raw-text-preserving failure with Retry. Each request is tied to an exact answer snapshot and job identity. Editing, another dictation in the field, outline/reset actions, and unmount invalidate jobs; stale results cannot replace later text, another field, or a cleared story. Cleanup only changes the just-dictated suffix, never prior answers.

StoryDogs does not log transcripts or store audio. Browser speech recognition may separately send audio to the browser provider. OpenAI receives the dictated text, with [OpenAI's applicable data controls](https://developers.openai.com/api/docs/guides/your-data): API content is not used for training by default; abuse-monitoring retention (normally up to thirty days) may apply. `store: false` disables response application-state storage; it is not a zero-retention guarantee.

## Verified teaching files

The public Resources panel contains all 13 teaching documents exported as PDFs from the owner's Google Drive StoryDogs folder on October 4, 2026, plus the existing seven-page Printable Teacher Guide (14 PDFs total). All 24 pages of the new exports were rendered and visually inspected. Drive originals remain unchanged.

Editable titles, descriptions, and groups: `src/data/storyDogsResources.ts`. New PDFs and the all-resources ZIP: `public/downloads/storydogs/`. The existing guide retains `/downloads/storydogs-teacher-guide.pdf`. The ZIP contains all 14 PDFs. Previews open separately; explicit download links require no Google account. Some source documents retain earlier step labels; the panel explains their correspondence to current headings.

Included: Start Here (20-minute lesson), Lead a Group, Seven-Step Cheat Sheet, Planning Sheet, Sentence Starters, Prompt Cards, Finished Example, K–2 Examples, Grades 3–6 Examples, From Outline to Story, Share and Celebrate, Pixar's Rule #4, and Learning Standards. Standards connections are suggested teaching guidance, not a guarantee of mastery or official endorsement.

PDFs are snapshots: later Drive edits require re-exporting the corresponding files and rebuilding the ZIP. No credentials or authenticated Drive download URLs are included in the website.

## Verification and manual checks

Earlier local HTTP checks (before two-version consolidation) passed: kids/teachers 200 without login, presenter redirect without session, login with mixed-case email, cookie flags, forged-origin rejection, private AI rejection without authentication, explicit 503 when provider is absent, request-size limit, session expiry, logout/replayed-cookie rejection, and login throttling. Random temporary test credentials were removed after verification; the real account has since been configured privately by the owner.

`node scripts/storydogs-auth-check.cjs` now delegates to the isolated built-production test with temporary environment credentials. It never replaces the owner’s private configuration. Stateless tests verify eight-hour expiry, cookie-clearing logout, continued validity of a copied cookie until expiry, and secret rotation.

Controller/word-preservation tests: `node --import tsx --test scripts/storydogs*.test.ts`. TypeScript and targeted ESLint passed. Actual shared React builder checks with simulated speech/AI passed for separate drafts, legacy-draft recovery, sending only the new passage, clean-text saving, Undo, Retry/raw preservation, edit/reset race protection, and no public AI calls. Existing suggestions, jumps, copying/fallback, print/download, outline, and confirmed reset checks passed.

Real microphone input has **not** been tested. A live authenticated OpenAI test passed on October 4, 2026: the invented Zorblyn passage received sentence punctuation and capitalization with every word preserved. Undo/Retry and edit/reset race protection were tested with simulated AI/speech events. The teacher desktop builder was visually inspected in Chrome, with its dogs, cream background, new placeholders, and dictation controls intact. Browser focus changed during the next inspection; mobile and login/presenter visual review remain to be completed. To test on Windows Chrome: select the USB microphone in Settings > System > Sound > Input, sign in to a preview reachable from that PC, click Dictate, allow access, wait for Listening/Speak now, speak, and Stop. Check punctuation, Undo, Retry with network disabled, edits during processing, reset during processing, and separate drafts across versions. Browser silence must return to Dictate without automatic restart. Review both remaining views at desktop and phone widths; print the teacher guide.


## Two-version consolidation verification

Nineteen pure tests pass, including migration of either draft, teacher-only migration, and quota-failure preservation. Actual React DOM checks pass for the draft-choice dialog, archived downloads, Resources open/close without answer or scroll changes, Close/trigger focus, retained edits and refresh recovery. Existing outline/copy/fallback/print/download/reset flows and simulated presenter punctuation Undo/Retry/stale-response protection pass. Authentication is now stateless as described above; no shared store is required. These DOM checks simulate geometry/native browser behavior; they do not certify a mobile visual review or live microphone use.

## Latest discoverability and publishing review

Both versions and the private login screen expose Public StoryDogs / Private StoryDogs controls outside Resources, with the active version highlighted. Main/mobile navigation and Writing Resources link to the public builder. See [StoryDogs-publishing-review.md](StoryDogs-publishing-review.md) for the current production checks and unresolved deployment blockers.
