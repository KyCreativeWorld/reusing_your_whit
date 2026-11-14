// Connection settings for the shop's Google Sheet.
//
// Paste the Web App URL from your Google Apps Script deployment here
// (see google-apps-script/SETUP.md). It looks like:
//   https://script.google.com/macros/s/AKfy.../exec
//
// While this is empty, the shop runs in DEMO MODE: items are saved only in
// the current browser, and the staff passcode is DEMO_PASSCODE below.
export const SHEETS_API_URL = 'https://script.google.com/a/macros/whitman.edu/s/AKfycbzvqkYe_cPQPhiW_EKr04sOVIa_nj3cJCOQb6kufv4houqp7Rnf6-lcWlvZdkDgx63J/exec';

// Only used in demo mode. Once the sheet is connected, the real passcode is
// set inside Google Apps Script and never appears in the website code.
export const DEMO_PASSCODE = 'whit';
