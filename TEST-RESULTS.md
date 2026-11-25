# Local verification · 25 November 2026

Tests used Node.js 20.15.1 and headless desktop Chrome. The test HTTP server called the actual Netlify handler. A local adapter executed the supplied Code.gs in a JavaScript VM with in-memory ranges, script properties and Google utility substitutes. Each run started with an empty database. No test contacted a live student spreadsheet.

| Coverage | Observed locally |
| --- | --- |
| Registration | Valid account received a session and one progress row. Two simultaneous case-variant registrations produced one success and one duplicate response. Invalid name, short password and mismatched confirmation were rejected. |
| Authentication | Valid credentials worked. Incorrect passwords failed. Repeated attempts reached the rate limit. Login responses contained username, state and revision. |
| Sessions and isolation | Chrome restored the signed-in account after refresh. Logout cleared the cookie. Missing or expired sessions, a mismatched target account and a foreign Origin were rejected. Replacing the password hash denied an old session access to progress. |
| Teacher reset | Editor function called the simulated teacher dialog and gateway, selected the correct user row, wrote the returned hash and displayed the generated password. The real gateway hashing branch was exercised separately. |
| Practice and quizzes | Chrome opened every curriculum step. All 30 supplied CSS solutions passed the original browser validators. All 9 quizzes passed with the supplied correct selections. The final spreadsheet summary was 100%. Backend checks also covered partial answers and a claimed quiz pass unsupported by answers. |
| Cloud restore | Unfinished CSS survived refresh and appeared in a second isolated browser context after login. Two accounts in one browser showed distinct progress. |
| Anonymous migration | A seeded anonymous draft remained separate after registration. Explicitly confirming import restored it to the editor. |
| Concurrent edits | Overlapping saves with different snapshots at the same revision produced one success and one conflict. A separate two-browser scenario preserved an offline edit while the other browser saved and required a version choice after reconnection. |
| Interrupted service | Offline editing, reconnect, simulated spreadsheet quota errors, automatic retry and subsequent recovery were exercised. |
| Spreadsheet storage | Repeated setup preserved headings. A long Unicode CSS draft round-tripped across at least three JSON cells. Shortening the draft removed stale continuation data. Invalid state structure was rejected. |
| Mobile and theme | At a 360 × 780 CSS-pixel viewport, login and a lesson fitted the viewport width. Chrome used the expected light and dark theme colors for the account form. |
| Original file | The source attachment and backup had matching SHA-256 hashes: `B54B2F8096FC634613392F92A68D9F981DF357106CFB1C24235C20AF7064622B`. |

## Repeat the checks

From the project root, use Node 20.15 or newer for the gateway suite. It needs no installed packages.

```sh
node --test tests/backend.test.mjs
```

The browser suite needs a local Chromium browser and the test-only Playwright Core package. The following PowerShell commands install the browser driver outside the project. Adjust the executable path for your machine.

```powershell
$testTools = Join-Path $env:TEMP 'css-workbench-test-tools'
npm install --prefix $testTools playwright-core --no-audit --no-fund
$env:NODE_PATH = Join-Path $testTools 'node_modules'
$env:CHROME_PATH = 'C:/Program Files/Google/Chrome/Application/chrome.exe'
node tests/browser.mjs
```

## Live checks remaining

The local adapter executes spreadsheet calls sequentially. It cannot establish actual LockService behavior under classroom traffic, Google authorization and anonymous-access policy, spreadsheet formatting in the Google UI, real provider quotas, or production Netlify routing and cookie delivery. The mobile checks used desktop Chrome viewport emulation. Complete the live smoke test in the [deployment guide](README.md) after supplying teacher-owned accounts and secrets.

