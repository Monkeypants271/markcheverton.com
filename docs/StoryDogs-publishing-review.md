# StoryDogs publishing review — October 4, 2026

Status: feature changes complete; **presenter production readiness remains blocked** by the requirements below. This review precedes the owner-authorized GitHub push; a connected hosting integration may deploy that push automatically.

## Discoverability and version switching

- The shared desktop and mobile website navigation includes StoryDogs immediately before Writing Resources, linking to `/story-dogs`. The footer also links to the public builder.
- Writing Resources has the approved comic-adventure banner with “Build your next adventure in seven steps.” and “Start Your Story”. The banner shares the resource grid’s centered content container, preserves its 3:1 aspect ratio, and links to the public builder. The original image is retained separately.
- Public, authenticated presenter, and presenter login screens share always-visible Public StoryDogs / Private StoryDogs controls. `aria-current="page"` and a gold fill distinguish the active version. Authenticated presenter screens retain Log Out.
- Desktop navigation uses a wider container, smaller gaps, and the mobile menu below 1280px to avoid crowding. Version controls wrap on small screens and have 48px minimum heights.
- Draft keys, migration, dictation, outline actions, resources, and authentication were not changed. Public and presenter stories retain separate existing browser storage keys.

## Checks completed in this review

- `npm run build`: passed, including TypeScript and all 41 prerendered pages.
- Changed-file ESLint and TypeScript checks: passed.
- All 19 StoryDogs pure tests passed.
- Actual React DOM regressions passed for public/legacy draft preservation, Resources, answers, suggestions, outlines, copy/fallback, downloads, print, reset, and simulated presenter punctuation/Undo/Retry/stale-response protection.
- A separate DOM navigation check passed: opening the mobile menu, StoryDogs ordering/target, closing after selection, both version controls, active indication, and private Log Out. This does not verify rendered mobile geometry.
- Final production server HTTP checks: public builder and Writing Resources 200 with the expected links; presenter and teacher routes 307 to login/public respectively; login 200 with both version controls; real teacher-guide PDF 200; unauthenticated AI endpoint 401.
- Development login page confirms the existing private account is configured. The production smoke test deliberately did not load private local credentials; production requires server environment configuration.
- Chrome desktop visual review confirmed main navigation spacing and the Writing Resources feature. Existing public answers were visible and untouched. Browser UI access became unavailable during the mobile check; mobile visual review and authenticated presenter visual review remain outstanding.
- `.env.local` and `.local/storydogs-presenter.json` remain Git-ignored. No credential values were printed. Production browser assets contain none of the configured API key, password hash, or session secret.
- Fixed a packaging problem: explicit Next output-file-tracing exclusions now prevent `.env*` and `.local/**` from entering deployable traces. Rebuilt traces verify those files are absent.

## Stateless presenter publishing review

The owner approved a no-additional-subscription design. Redis, filesystem session records, and mandatory shared throttling storage have been removed. The established iron-session library seals eight-hour cookies; every private page and AI endpoint checks them on the server. Logout clears this browser's cookie; a previously copied token remains valid until expiry. Rotating the private session secret and redeploying invalidates all sessions. Neither plaintext password nor password hash is stored in browser assets or cookie payloads.

Private configuration requires only email, password hash, session secret, OpenAI key and model as sensitive Vercel Production variables. The transfer helper successfully transferred all five existing variables as sensitive Production settings without printing values. Missing production configuration renders a simple unavailable message. No new paid service is provisioned. Existing provider API usage remains billable under the owner's OpenAI account.

Vercel automatic DDoS mitigation remains included. The team's plan is Pro, whose WAF rate limiting is usage-billed; it is not enabled. In-memory login and API counters are bounded best-effort measures per warm process, not reliable cross-instance limits or a hard spending ceiling. A free custom WAF rule now rejects foreign-origin StoryDogs login/logout/punctuation POSTs on the canonical domains. Same-origin spoofing and distributed brute force remain possible; free IP blocks can supplement protection. Distributed brute force and global spend limits remain limitations; no database is mandatory.

The isolated production HTTP test uses temporary environment credentials, never the owner's saved password. It checks login, eight-hour expiry, secure cookie flags, CSRF, cookie-clearing logout, continued validity of a deliberately retained token, rotation rejection and per-process counters. `scripts/storydogs-live-check.cjs` prompts for the owner's password privately; `--session-only` instead uses a sealed test token and explicitly does not certify password login. Neither prints credentials or cookies. Live tests use invented story text, confirm exact word preservation and do not certify microphone input.

Existing broader site issues remain outside this authentication change: previously documented dependency advisories, unrelated lint failures, middleware naming warning, and incomplete mobile/microphone visual checks. Public drafts, private drafts, all fourteen fields, resources and the approved design are unchanged.

See `StoryDogs-versions.md` for current configuration, session semantics and limitations. Earlier server-recorded logout/revocation and Redis findings in historic test reports are superseded by this stateless design.
