# StoryDogs dictation (local review)

Optional dictation detects `SpeechRecognition` or `webkitSpeechRecognition`; it does not infer support from the browser name. It requests US English, continuous recognition, and interim results. No microphone session starts on page load. No API key, paid transcription provider, audio recording, or audio-storage backend was added. The browser provider may process audio through its speech-recognition service; see [MDN](https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition).

Only finalized text reaches answers and the existing browser-draft saving system. Interim text appears in a separate unsaved preview. Each recognition session owns a fixed question and finalized result indexes; session identity checks reject late events. Switching questions aborts the previous session and waits for its end before starting another. A timeout cancels a stalled switch rather than retrying indefinitely. Manual edits, outline actions, new-story actions, page exit, and unmount stop recognition. Typing remains enabled throughout.

Teacher scripts and follow-up guidance remain editable in `src/data/storyDogsHelp.ts`. The former classroom introduction is retained in `src/data/storyDogsTeacher.ts`. The student page now offers a printable PDF instead of displaying teacher scripts. Regenerate the seven-page guide using Python with reportlab installed:

```sh
node --import tsx scripts/export-storydogs-teacher-guide.ts > /tmp/storydogs-teacher-guide.json
python3 scripts/build-storydogs-teacher-guide.py /tmp/storydogs-teacher-guide.json public/downloads/storydogs-teacher-guide.pdf
```

Bottom links use the inspected existing `/writing-resources/prompts` route and `https://chevertonauthorvisits.com`. Both open a new tab with `noopener noreferrer` and an accessible new-tab indication.

## Verification

- Eight automated controller tests cover feature detection, interim/final separation, duplicate prevention, append spacing, switching, stale events, errors, silence/end, cleanup, and stalled-stop handling.
- Simulated speech events through the actual React builder verified fourteen controls, start/stop, append/edit/draft persistence, switching, denial, unexpected end, outline/reset cancellation, page exit, unmount, and unsupported fallback.
- Existing builder regression checks passed for headings, placeholders, jump focus, expanding answers/backgrounds, independent suggestions, recovered drafts, outline generation, Docs copy/fallback, download, print, and confirmed reset.
- TypeScript and targeted ESLint checks passed. Local `/story-dogs` and the PDF return HTTP 200; page scripts/styles and seven distinct dog assets load.
- Desktop microphone placement was visually inspected. Narrow-screen geometry was simulated; a mobile browser visual review remains outstanding because the native browser changed focus during inspection.
- All seven PDF pages were rendered and inspected. No real microphone audio or live speech-recognition service was tested.

## Windows Chrome and USB microphone manual check

1. Connect the USB microphone. In Windows Settings > System > Sound > Input, select it and confirm the input meter responds. A wireless microphone needs a receiver recognized by Windows as an audio input; StoryDogs cannot configure the equipment.
2. Open the StoryDogs preview on that PC in Chrome, using a local server or an accessible HTTPS preview. Enter an existing sentence, click Dictate, allow microphone access, and speak. Check the interim preview, finalized appended words, Stop Dictation, normal editing, and draft recovery after refresh.
3. Dictate into a second answer; confirm the first stops. Edit while listening, open the outline, and confirm Start a New Story clears answers without late words returning. Try Keep My Story as well.
4. Deny microphone permission in a separate test browser profile, test silence/unplugged input, and confirm readable errors and usable typing. Check controls at phone width. Review all seven stages and download/print the teacher guide.

The Mac preview URL is local to the Mac; it does not automatically provide access from another Windows computer. Keep deployment separate from this local review.
