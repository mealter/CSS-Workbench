# CSS Workbench v1.1

An Uzbek-language CSS classroom workbench with student accounts and progress saved to a private Google spreadsheet. Open the deployed HTTPS site to use the application. Opening the HTML file directly runs outside the authentication gateway.

## Review v1.1 locally

Run `node tests/preview.mjs` from the project root, open `http://localhost:4173` and register a disposable account. This preview uses an in-memory spreadsheet and temporary credentials. Restarting the process clears its test accounts. See [v1.1 review and screenshots](review/v1.1/README.md) for changes and verification. The existing deployment configuration works with v1.1.

## What changed

| File | Responsibility |
| --- | --- |
| `public/index.html` | Original learning interface, CSS editor, preview and validators. The save hook now delegates to the account module. The new sign-in form and account strip use the original theme. |
| `public/curriculum.js` | Original topic definitions shared by the browser and server. Edit lessons, question options and answer keys here. Keep existing topic and step IDs stable so students retain their work. |
| `public/account.js`, `public/account.css` | Sign-in, registration, session restoration, local drafts, sync status, conflict resolution and responsive account UI. |
| `netlify/functions/api.mjs` | Same-origin POST endpoint at `/api/workbench`. Supports register, login, logout, getSession, getProgress and saveProgress. Uses Node’s built-in crypto and fetch. |
| `server/progress.cjs` | Validates curriculum keys, CSS strings, completion flags and answer indices. Derives teacher-facing totals and individual quiz scores. |
| `apps-script/Code.gs` | Private spreadsheet adapter, setup and teacher password reset. Serializes spreadsheet operations with a script lock. |
| `netlify.toml`, `.env.example` | Hosting configuration and placeholder environment variable names. Netlify publishes only the public directory. |
| `backup/original.html` | Byte-for-byte copy of the original single-file application. |
| `tests/`, `TEST-RESULTS.md` | Repeatable local checks and their coverage. |

## Manual deployment

You need a teacher-owned Google account that permits anonymous Apps Script web apps, a free Netlify account, and a personal Git repository for this deployment route. Students need only a username and password.

1. **Create the spreadsheet.** In Google Drive, create a blank Google Sheet named CSS Workbench. Under **Share**, keep General access **Restricted**. Give editor access only to trusted administrators. Spreadsheet editors can also edit the bound script. Set the spreadsheet time zone under **File → Settings**. Copy the spreadsheet ID from its address, between `/d/` and `/edit`.
2. **Install the script.** Open **Extensions → Apps Script** from that sheet. Replace the starter code in `Code.gs` with the complete contents of this project's `apps-script/Code.gs`. Save the project.
3. **Generate two independent secrets.** With Node installed, run the following command twice in a private terminal. Save each result in a password manager. Use the first as `GAS_SECRET` and the second as `SESSION_SECRET`. Each result is 64 hexadecimal characters.

   ```sh
   node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"
   ```

4. **Set Script Properties.** In Apps Script, open **Project Settings → Script Properties**. Add `SHEET_ID` and `GAS_SECRET` with the values from steps 1 and 3. You will add `SITE_ORIGIN` once Netlify gives you the production address.
5. **Initialize and authorize.** Return to the editor, select `setup` in the function selector and click **Run**. Choose the spreadsheet owner and review the requested permissions for spreadsheet access and external requests used by password reset. Approve your own script. Verify that **Users** and **Progress** appear in the spreadsheet with frozen headings. Running setup again checks the headers and preserves existing rows.
6. **Deploy Apps Script.** Choose **Deploy → New deployment → Select type → Web app**. Set **Execute as** to **Me** (the owner) and **Who has access** to **Anyone**, including anonymous callers. Deploy and copy the web app URL ending in `/exec`. The function authenticates to this endpoint with the shared secret. Keep the spreadsheet itself restricted. If your school disables anonymous web apps, ask its administrator whether this deployment is permitted. [Google web app deployment](https://developers.google.com/apps-script/guides/web)
7. **Prepare your repository.** Upload the project folders and files to a personal Git repository, including the two backend folders, public files and `netlify.toml`. The placeholder template is safe to commit. Keep actual secrets out of the repository.
8. **Create the Netlify project.** Choose a **Free** team, then **Add new project → Import an existing project** and select the repository and branch. Leave the base directory and build command empty. The configuration sets the publish directory to `public` and functions directory to `netlify/functions`. Deploy and copy the final production origin, for example `https://your-school.netlify.app`, with no trailing slash. Use that address consistently.
9. **Set runtime configuration.** In Netlify **Project configuration → Environment variables**, add the following values for production. Include Functions scope if a scope selector is available. Store secrets as secret values where the UI offers that option. [Netlify function environment variables](https://docs.netlify.com/build/functions/environment-variables/)

   | Netlify variable | Value |
   | --- | --- |
   | `SITE_ORIGIN` | Exact production HTTPS origin from step 8 |
   | `GAS_URL` | Deployed Google web app URL ending in `/exec` |
   | `GAS_SECRET` | Same first secret as the Apps Script property |
   | `SESSION_SECRET` | Independent second secret, used only by Netlify |

10. **Finish configuration.** Add the identical `SITE_ORIGIN` to Apps Script **Project Settings → Script Properties** for teacher resets. In Netlify, trigger a fresh production deployment after setting the environment. Verify the **api** function appears in the deployment. A static drag-and-drop upload of the public folder omits the function.
11. **Test with one disposable student before class.** Open the production address. Choose **Ro‘yxatdan o‘tish**, register and complete a practice exercise. Enter unfinished CSS in another exercise and wait for **Barcha o‘zgarishlar saqlandi**. Complete a quiz. Refresh, then sign into the same account in a private window. Check the code, answers, completed steps and sheet values. Log out of both windows. Test reset and sign in with the new password. Use a second account to confirm students see separate work.
12. **Back up before class and before updates.** In the private spreadsheet, use **File → Make a copy** and keep the copy restricted to administrators. An XLSX download also preserves the tables. Keep the script source and recovery secrets separately. To restore to a new spreadsheet, point `SHEET_ID` at the restored copy, verify headers, deployment ownership and properties, then repeat the disposable-account check. Restoring an older copy restores older password hashes and revisions. Rotate `SESSION_SECRET` and redeploy after a rollback.

For future Apps Script changes, save the code, then **Deploy → Manage deployments → Edit → New version → Deploy**. Keeping the same deployment keeps the existing URL.

## Reading and managing results

**Users** holds a normalized username and a salted scrypt hash. **Progress** has one row per student. Filter or sort entire rows together. Leave the identifiers, headers, revision and JSON cells intact.

| Column | Meaning |
| --- | --- |
| CompletedLessons / TotalLessons | Completed practical exercises reported by the original browser validator and total available practical exercises |
| CompletedQuizzes / TotalQuizzes | Checked quizzes with every answer correct and total available quizzes |
| QuizMarks / MaximumQuizMarks | Correct answers across the currently saved selections and total available questions, including unanswered questions |
| Quiz topic/step columns | Number of correct answers on each named quiz. Each question is worth one mark. |
| CompletionPercentage | Completed practical exercises plus completed quizzes divided by all curriculum steps |
| LastUpdated | Server time at registration or the last changed progress save, displayed in the spreadsheet time zone |
| ProgressJSON / JSON 2… | Existing done, code and answers maps. Large JSON spans cells in chunks of at most 40,000 UTF-16 units. Each continuation has a protective prefix removed during reconstruction. |
| Revision | Version used to detect concurrent changes |

Practical completion comes from the browser. The gateway recalculates quiz marks from answer choices and the curriculum key. Changing a checked quiz answer reopens that quiz for checking. The client contains quiz answer keys and practical validators. Complete practical reference CSS lives in the private test files. The Maqsad tab shows a reference image. Use these results for formative practice. High-stakes examinations need a different assessment design.

### Reset a forgotten password

Open the spreadsheet and its bound Apps Script editor as a trusted administrator. Keep the spreadsheet tab open. Select **resetStudentPassword** and click **Run**. Enter the username in the spreadsheet dialog. The script generates a new random password, obtains a salted hash from the authenticated gateway and updates the student's row. Give the password shown in the final dialog privately to the student. Progress is preserved. The previous password and old sessions lose access to progress immediately. Running the function again generates a different password.

### Sessions and shared computers

Usernames are case-insensitive, 3–32 characters, beginning with a Latin letter, followed by Latin letters, digits or underscores. Passwords are 8–128 UTF-16 units. Hashes encode a random 128-bit salt and scrypt parameters N=32768, r=8, p=3. Browser responses omit hashes.

Signed HttpOnly, Secure, SameSite=Strict cookies expire after seven days. Logout clears the browser cookie. A previously copied token remains usable until expiry, password reset or signing-key rotation. Progress operations verify the cookie identity and current credential fingerprint. The browser also sends an expected identity to catch account switches between tabs. The gateway checks the exact Origin for browser requests. Shared ten-minute rate-limit buckets in Script Properties cap authentication attempts by username (12) and IP (160), including successful sign-ins. Bucket collisions can temporarily share a limit.

Drafts live under account- and tab-specific localStorage keys. A loaded lesson continues to accept edits offline. Reopening the app requires connectivity to verify the session and retrieve the current revision. Unsaved work can be recovered after signing back into the same account. On a shared school computer, use separate OS/browser profiles when local draft confidentiality matters. Anyone with direct access to the browser profile can inspect its storage.

### Synchronization and recovery

- Editing saves a local draft immediately. The cloud save waits for four seconds of inactivity. Successful practice or quiz completion schedules an immediate save. A one-minute timer checks for pending work without polling the server for clean accounts.
- A save in progress captures one snapshot. Later changes stay dirty. Transient failures retry with exponential backoff up to two minutes. Reconnecting triggers a retry. A successful save removes the corresponding pending draft.
- Separate tabs have separate draft keys. If another device saved first, both versions are retained until the student selects the local or cloud version. Choosing the local version retries against the latest known revision. An additional unsent draft can be opened from **Qurilmadagi qoralamani ochish**.
- **Eski natijalarni import qilish** appears for existing anonymous progress accessible on the same browser origin. The student confirms ownership. Existing account entries win overlapping keys. The anonymous record is removed after a local account draft is secured. Browser storage from a different domain or a local file is isolated by the browser.
- The gateway caps a request at 600,000 UTF-8 bytes. Oversize work stays local. Shorten large CSS drafts and save again. If the browser reports local storage is full, keep the tab open and copy your CSS before closing it.

## Free operation and limits

The credit-based Netlify Free plan includes **300 credits per month with a hard limit**. A production deploy uses 15 credits. Web requests, bandwidth and function compute also consume credits. Choose Free, leave billing upgrades unused, and monitor the team's usage during representative classes. Available usage is shared across the team. Capacity depends on student activity, deployment frequency and actual function duration. [Netlify credit-based plans](https://docs.netlify.com/manage/accounts-and-billing/billing/billing-for-credit-based-plans/credit-based-pricing-plans/) · [Netlify credit usage](https://docs.netlify.com/manage/accounts-and-billing/billing/billing-for-credit-based-plans/how-credits-work/)

Google lists **six minutes per script execution, 30 simultaneous executions per user and 1,000 per script**. Owner-executed requests share the owner's limits. Properties operations also have daily quotas (50,000 on consumer accounts). View **Apps Script → Executions** for failures. No paid API, database service or billing activation is part of setup. Review current limits before expanding usage. [Google Apps Script quotas](https://developers.google.com/apps-script/guides/services/quotas)

## Troubleshooting

| Symptom | What to check |
| --- | --- |
| Form loads, sign-in fails | Open the production HTTPS address. Check that Netlify deployed the function and redeploy after environment changes. Verify SITE_ORIGIN exactly matches the browser origin. |
| Google returns HTML or asks for sign-in | Verify the /exec deployment URL, owner execution and anonymous web app access. Check the owner's authorization and school policy. |
| Service temporarily unavailable | Compare both GAS_SECRET values, verify SHEET_ID, run setup, and inspect Apps Script Executions and Netlify usage. Keep unsent drafts on the device until service returns. |
| Too many attempts | Wait until the next ten-minute window. A shared classroom IP has a combined allowance. |
| Progress differs between devices | Wait for the saved status on the first device. Reload the second. If both edited, use the version-choice prompt. |
| Reset dialog is missing | Open the bound spreadsheet in the same account and check its tab for the dialog. Confirm SITE_ORIGIN in Script Properties and grant external-request permission. |
| Registration succeeded but the response was interrupted | Sign in with the same credentials. Duplicate registration is rejected under the script lock. |
| Free-plan project paused | Check team credit usage and the next reset date. Resume on the free allowance when available. Keep the original browser profile for pending drafts. |
| Changes to curriculum | Preserve IDs and deploy frontend and function together. Changed scoring rules take effect on the next changed save. |

See [local test results and reproduction commands](TEST-RESULTS.md) for the verified scenarios and the remaining live deployment checks.

