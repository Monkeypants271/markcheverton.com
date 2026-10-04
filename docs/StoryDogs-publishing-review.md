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

## Remaining production requirements

1. **Session revocation and throttling storage.** The server-only Upstash REST adapter now replaces filesystem storage in production. Connect the database and configure `STORYDOGS_REDIS_REST_URL` / `STORYDOGS_REDIS_REST_TOKEN`. Implement atomic counter increments with window expiry, four-hour session TTLs, logout deletion, and consistent access across instances. Verify expiry, replay rejection, concurrent limits, datastore outages, and fail-closed behavior on the actual hosting environment. For a persistent Node host, the existing adapter requires durable shared POSIX storage with reliable atomic directory locks, stale-lock recovery, and expired-record cleanup; do not use `/tmp`.
2. **Server credentials and HTTPS.** Configure `STORYDOGS_PASSWORD_HASH`, `STORYDOGS_SESSION_SECRET`, `STORYDOGS_OPENAI_API_KEY`, and `STORYDOGS_OPENAI_MODEL` privately in the host. Configure `STORYDOGS_PRESENTER_EMAIL` and the shared Redis credentials; production does not permit filesystem state. Never deploy the ignored development JSON as configuration. Verify Secure/HttpOnly/SameSite cookies, trusted proxy Host/Origin handling, login/logout, authenticated direct entry, and expiration over HTTPS.
3. **Public-host abuse controls.** Current global limits are eight login attempts/15 minutes and twenty punctuation requests/minute plus 300/day. Preserve those caps in the shared store. The login route additionally caps attempts at four per fifteen minutes using Vercel’s edge-provided IP header (only on Vercel). Add host-level abuse protection; the global login cap alone allows an attacker to temporarily lock out the presenter. Set provider spending limits and monitor safe metadata without logging stories or credentials.
4. **Dependency security.** `npm audit --omit=dev` reports six affected packages: one critical (Next.js), four high (nanoid, Nodemailer, PostCSS, sharp), and one moderate (baseline-browser-mapping). Review patched framework/mail/transitive versions and regression-test the upgrade before publishing. No automatic broad or major-version dependency upgrades were made in this navigation task.
5. **Whole-site checks.** Full `npm run lint` still fails on existing React effect/state issues in `src/app/fanfic/_components/FanFicSearch.tsx:33` and `src/app/writing-resources/plot/PlotBuilder.tsx:148`. These unrelated flows need fixes and checks. The build also warns about deprecated middleware naming and overbroad file tracing from the runtime store. Private files are excluded, but tighten remaining tracing before a standalone/serverless artifact so unrelated project documents are not packaged unnecessarily.
6. **Final visual/user checks.** Review phone widths (320/375/390px), tablet navigation, authenticated presenter buttons/Log Out, version switching with both existing drafts, sticky jumps, and long answers. Real microphone input still requires a user test; no live microphone success is claimed. Existing live AI punctuation success from the prior review does not establish deployed HTTPS/microphone behavior.

See `StoryDogs-versions.md` for the architecture, storage constraints, private setup, and prior live/simulated test distinctions. The verified teacher guide is available; separate worksheets and handouts have not been supplied and are not advertised.


## Presenter repair verification

The browser's affected tab was verified as live `markcheverton.com/story-dogs/presenter/login`, not localhost. Local private setup is present; production never reads it. Saved Vercel CLI authorization returned 403, so private hosting configuration remains pending owner sign-in and Redis connection.

The production build, targeted lint, twenty pure tests, and shared React draft/resources/presenter regressions pass. `node scripts/storydogs-production-check.cjs` tests a built production server with random temporary environment credentials and simulated Redis: missing-config fallback contains no Mac path or terminal instructions, configured login accepts the temporary password, authenticated builder opens, Secure/HttpOnly/SameSite cookies, forged origin, expiry, logout replay and concurrent global/Vercel-IP throttling pass. This does not certify actual hosted Redis or the owner's password.

A real authenticated local OpenAI call passed with gpt-4.1-mini and an invented Zorblyn passage, preserving every word while adding punctuation and capitalization. The test used a temporary server-recorded session, not an owner-password login or microphone recording. No configured secret values were found in client assets or staged changes. Live login and live authenticated AI must still be tested after private configuration and deployment.
