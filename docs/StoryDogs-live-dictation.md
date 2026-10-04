# Private StoryDogs: punctuation during dictation

Private StoryDogs requests punctuation when Chrome finalizes a phrase, while the microphone remains active. The first finalized phrase is sent promptly; later final results are batched for six seconds to limit requests. Only one request per field runs at a time. Stop flushes the pending batch after recognition ends, including final words delivered after Stop.

Answer boxes receive only validated punctuated text during normal operation. Interim recognition and finalized words awaiting AI stay in separate labeled previews. Each update repunctuates only the current dictation session's accumulated words; pre-existing answers remain unchanged. Repeated recognition indexes are ignored. Public StoryDogs continues to append ordinary browser dictation without AI.

Failures show the explicit AI-unavailable message, retain raw words in the answer, and offer Retry. Undo restores the current session's original words and stops that field's microphone. Edits and reset invalidate requests so delayed responses cannot overwrite later work. Opening an outline or a reset confirmation preserves pending words as raw text before cancelling punctuation.

Pending finalized words are backed up locally under the presenter draft's `:pending-punctuation` key. Reload recovers a matching pending passage as raw text with Retry, without an automatic paid request. If an answer has changed, recovered words appear separately for manual copying; the saved answer is never overwritten. Confirmed reset clears both the ordinary presenter draft and pending backups. Browser-storage failures remain a limitation: keep the visible preview or copy/download before leaving if storage is unavailable.

Live AI and React component verification used simulated recognition events, not a microphone: both phrases of the dragon/homework test appeared punctuated in the correct answer box before Stop, without duplicate words, and were saved. Whole-session Undo, Retry, late-response protection, reset, reload recovery, and no public AI requests were also checked. Real microphone timing remains for presenter confirmation.
