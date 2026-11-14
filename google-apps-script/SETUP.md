# Connecting the shop to a Google Sheet

This takes about 10 minutes. Once you've done it, items added on the shop page are saved as rows
in a Google Sheet, and everyone who visits the site sees them.

## 1. Create the sheet

1. Go to [sheets.new](https://sheets.new) to make a new Google Sheet. Name it something like
   **Reusing Your Whit – Shop Items**.
2. In the menu, open **Extensions → Apps Script**.
3. Delete the sample code in the editor, then paste in everything from
   [`Code.gs`](./Code.gs). Click the save icon (💾).

## 2. Set the staff passcode

1. In the Apps Script editor, click the **gear icon (Project Settings)** on the left.
2. Scroll to **Script Properties** and click **Add script property**.
3. Property: `STAFF_PASSCODE`. Value: the passcode staff will type on the shop page.
4. Click **Save script properties**.

The passcode lives only here, never in the website code. To change it later, edit this value.
You don't need to redeploy after changing it.

## 3. Run setup once

1. Click the **< > (Editor)** icon on the left to go back to the code.
2. In the function dropdown at the top, choose **`setup`**, then click **▶ Run**.
3. Google will ask for permission. Choose your account, then **Advanced → Go to (project name)
   → Allow**. The script needs this to edit the sheet and save photos to your Drive.

This creates an **Items** tab in the sheet and a Drive folder called
**Reusing Your Whit item photos**.

## 4. Deploy it as a web app

1. Click **Deploy → New deployment**.
2. Click the gear next to "Select type" and choose **Web app**.
3. Set:
   - **Execute as:** Me
   - **Who has access:** Anyone
4. Click **Deploy**, then copy the **Web app URL**. It ends in `/exec`.

## 5. Connect the website

Open [`src/config.js`](../src/config.js) and paste the URL in:

```js
export const SHEETS_API_URL = 'https://script.google.com/macros/s/AKfy.../exec';
```

Save, and the demo-mode banner on the shop page disappears. Items now come from the sheet.

---

## Managing items

- **Remove a sold item:** delete its row in the **Items** tab. Leave row 1 (the headers) alone.
- **Fix a typo or price:** edit the cell directly. The site picks up the change on the next page load.
- Keep the column order the same: `id, createdAt, name, price, category, size, condition, color,
  description, imageUrl`.

## If you change `Code.gs` later

Use **Deploy → Manage deployments → ✏️ Edit → Version: New version → Deploy**. This keeps the same
URL. Choosing "New deployment" instead creates a different URL that you'd have to paste into
`config.js` again.

## Troubleshooting

- **Staff sign-in fails and items won't load (URL contains `/a/macros/whitman.edu/`)**: the
  deployment is limited to people signed into a school account, so the website gets a login page
  instead of data. Go to **Deploy → Manage deployments → ✏️ Edit**, set **Who has access** to
  **Anyone**, and click **Deploy**. If "Anyone" isn't offered (only "Anyone within Whitman
  College"), the school has disabled public web apps. Redo this setup with a personal Gmail
  account and paste the new URL into `src/config.js`.

- **"Google would not let it be shared publicly"**: many school Google accounts (including
  college ones) block "anyone with the link" sharing, which photos need in order to show on the site.
  Do steps 1–4 with a personal Gmail account instead, or ask IT to allow link sharing for that account.
- **Photos show the hanger placeholder instead of the image**: make sure the photo folder in Drive
  hasn't been moved to a shared drive with stricter sharing rules.
- **"Couldn't load items"**: check that the deployment's access is set to **Anyone**, and that the
  URL in `config.js` ends in `/exec`, not `/dev`.
