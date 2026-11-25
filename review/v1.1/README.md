# CSS Workbench v1.1 review

Open the local preview and register a disposable student. The preview stores its accounts in memory. Production uses the existing spreadsheet, Apps Script deployment, Netlify configuration and environment variables. This release requires no teacher setup or data migration.

## Before and after

| Browser capture | Before | v1.1 |
| --- | --- | --- |
| Multiline selection and toolbar, light | [Before](before-editor-light.png) | [After](after-editor-light.png) |
| Multiline selection and toolbar, dark | [Before](before-editor-dark.png) | [After](after-editor-dark.png) |
| First lesson hint and answer controls | [Before](before-hint.png) | [After](after-hint.png) |
| Selected username during registration | [Before](before-auth.png) | [After](after-auth.png) |

## Bugs and fixes

- The editor drew an opaque selection over the syntax layer while its selected textarea text was transparent. Both themes now specify a contrasting selection foreground and background, including the text fill. Outside the selection the syntax layer stays visible. The editor also shows a focus outline and uses darker light-theme comments and lighter dark-theme comments.
- The editor toolbar had only a reset action. **Kodni tekshirish** now sits beside **Tiklash**. Buttons wrap on narrow screens. The top action, bottom check action and Ctrl+Enter use the same validator. Rechecking identical code reuses the result. A successful check records completion once.
- The solution button, insertion action and enable switch exposed finished CSS. Complete references now live in the private test fixture. The **Maqsad** tab loads a picture only when opened. Each picture represents a 440-pixel-wide reference viewport and scales down on narrow screens. The student's own preview still updates live.
- Hints that supplied declarations now ask students to reason about the relevant property, box edge, unit or layout rule. Original explanations, examples and grading criteria are preserved.
- The sync message could move adjacent navigation controls. Its space is reserved on desktop, with a dedicated row on mobile. Stale validation rows now use a dashed border so their text stays legible. Navigating between steps cancels a pending editor preview update.

## Verification

All three local suites passed in Chrome and Node. The browser tests completed 30 practical exercises and 9 quizzes containing 41 questions. Registration, login, logout, progress restoration, offline recovery, quota retry, concurrent edits, and account isolation passed against the real gateway code with simulated Google services. An account created through the pre-update interface retained its session and saved CSS after loading v1.1. A curriculum comparison confirmed identical IDs, validators, examples and quiz data.

Mouse drag, Shift+Arrow multiline selection, Ctrl+A, horizontal and vertical scrolling, gutter alignment, Tab indentation, Escape then Tab, syntax highlighting, read-only HTML, hints, and Ctrl+Enter were checked. Repeated successful validations generated zero extra save requests. Selection was also exercised on lesson text, tasks, examples, quiz text and the login form.

| Viewport | Light | Dark |
| --- | --- | --- |
| 1920 × 1080 | [Capture](layout-1920-light.png) | [Capture](layout-1920-dark.png) |
| 1366 × 768 | [Capture](layout-1366-light.png) | [Capture](layout-1366-dark.png) |
| 1280 × 720 | [Capture](layout-1280-light.png) | [Capture](layout-1280-dark.png) |
| 768 × 1024 | [Capture](layout-768-light.png) | [Capture](layout-768-dark.png) |
| 360 × 780 | [Capture](layout-360-light.png) | [Capture](layout-360-dark.png) |

Each layout kept the toolbar check action in the viewport and passed the page-width check. Screenshots were visually inspected. Testing used desktop Chrome with viewport emulation and fallback fonts. Physical touch devices, Safari, Firefox, and the live production backend were outside this local run.

## Files

| Files | Change |
| --- | --- |
| public/index.html | Selection styles, toolbar, focus and feedback, hints, reference image viewer |
| public/curriculum.js | Removed reference CSS and revised hints |
| public/account.css | Stable synchronization status layout |
| public/goals/*.png | 30 reference images |
| tests/reference-solutions.json | Private reference CSS keyed by existing exercise IDs |
| tests/browser.mjs | Exercises run through the student editor and toolbar |
| tests/preview.mjs | Reusable loopback preview with temporary storage |
| tests/ui-review.mjs | Real-browser UI checks, screenshots and optional target regeneration |
| README.md | Local review instructions and updated curriculum notes |
| review/v1.1/ | Release notes and before/after screenshots |

With the Chrome and Playwright settings from [the test guide](../../TEST-RESULTS.md), run `node tests/ui-review.mjs`, `node tests/browser.mjs` and `node --test tests/backend.test.mjs` from the project root. For a curriculum change, `node tests/ui-review.mjs --goals` rebuilds reference images from the private solutions using the live preview.

