# Reusing Your Whit

Website for Reusing Your Whit, a college- and student-run thrift store.
Built with React + Vite. It has two pages:

- `index.html`: home page (about, how it works, donating, hours and location)
- `shop.html`: searchable, filterable list of items, where staff can add new items

## Run it

```bash
npm install
npm run dev      # local dev server with live reload
npm run build    # production build in dist/
npm run preview  # serve the production build
```

## Edit store details

Hours, location, contact info and sale dates all live in `src/storeInfo.js`.
Anything in `[square brackets]` is a placeholder.

## Shop page

- **Items are stored in a Google Sheet.** Follow [`google-apps-script/SETUP.md`](google-apps-script/SETUP.md)
  to connect it, then paste the web app URL into `src/config.js`.
- Until the sheet is connected, the shop runs in **demo mode**: items are saved only in your browser,
  and the staff passcode is `whit`.
- **Adding items:** click **Staff sign-in** at the bottom of the shop page and enter the passcode.
  A yellow **+** button appears for adding items.
- **Removing or editing items:** edit or delete the row in the Google Sheet.
- Filter options (categories, sizes, conditions, colors) are in `src/shopOptions.js`.

## Design

- Colors come from the brand palette in `color scheme/`, defined as CSS variables at the top of `src/index.css`.
- Headlines use **Lora** (per the brand guide). Body text uses **Figtree**, a free stand-in for the licensed Vito font.
