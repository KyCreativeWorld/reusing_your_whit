/**
 * Reusing Your Whit: shop backend.
 *
 * Paste this whole file into Extensions → Apps Script in your Google Sheet,
 * then follow google-apps-script/SETUP.md to deploy it as a web app.
 *
 * Each item is one row in the "Items" sheet. Photos are saved to a Google
 * Drive folder and the row stores a link to the photo.
 */

const SHEET_NAME = 'Items';
const PHOTO_FOLDER_NAME = 'Reusing Your Whit item photos';
const HEADERS = [
  'id', 'createdAt', 'name', 'price', 'category', 'size',
  'condition', 'color', 'description', 'imageUrl',
];
const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5 MB after decoding

/* ---------------- HTTP handlers ---------------- */

function doGet(e) {
  const action = (e && e.parameter && e.parameter.action) || 'list';
  try {
    if (action === 'list') return json({ ok: true, items: listItems() });
    return json({ ok: false, error: 'Unknown action' });
  } catch (err) {
    return json({ ok: false, error: String(err.message || err) });
  }
}

function doPost(e) {
  let body;
  try {
    body = JSON.parse(e.postData.contents);
  } catch (err) {
    return json({ ok: false, error: 'Bad request' });
  }

  const passcode = PropertiesService.getScriptProperties().getProperty('STAFF_PASSCODE');
  if (!passcode) return json({ ok: false, error: 'Staff passcode has not been set up yet' });
  if (body.passcode !== passcode) return json({ ok: false, error: 'Wrong passcode' });

  try {
    if (body.action === 'verify') return json({ ok: true });
    if (body.action === 'add') return json({ ok: true, item: addItem(body.item || {}) });
    return json({ ok: false, error: 'Unknown action' });
  } catch (err) {
    return json({ ok: false, error: String(err.message || err) });
  }
}

/* ---------------- Items ---------------- */

function listItems() {
  const sheet = getSheet();
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return [];

  const rows = sheet.getRange(2, 1, lastRow - 1, HEADERS.length).getValues();
  return rows
    .filter((row) => row[0] !== '' && row[2] !== '') // skip blank rows
    .map((row) => {
      const item = {};
      HEADERS.forEach((h, i) => {
        item[h] = row[i] instanceof Date ? row[i].toISOString() : row[i];
      });
      item.price = Number(item.price) || 0;
      item.id = String(item.id);
      return item;
    })
    .reverse(); // newest first
}

function addItem(input) {
  const name = clean(input.name, 80);
  const category = clean(input.category, 40);
  const condition = clean(input.condition, 40);
  const color = clean(input.color, 40);
  const price = Number(input.price);

  if (!name) throw new Error('Item name is required');
  if (!category) throw new Error('Category is required');
  if (!condition) throw new Error('Condition is required');
  if (!color) throw new Error('Color is required');
  if (!isFinite(price) || price < 0) throw new Error('Price must be 0 or more');

  const item = {
    id: Utilities.getUuid(),
    createdAt: new Date().toISOString(),
    name: name,
    price: Math.round(price * 100) / 100,
    category: category,
    size: clean(input.size, 20),
    condition: condition,
    color: color,
    description: clean(input.description, 300),
    imageUrl: input.image ? savePhoto(input.image, name) : '',
  };

  // Lock so two staff adding at once don't overwrite each other's rows.
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    getSheet().appendRow(HEADERS.map((h) => safeCell(item[h])));
  } finally {
    lock.releaseLock();
  }
  return item;
}

/* ---------------- Photos ---------------- */

function savePhoto(dataUrl, itemName) {
  const match = /^data:(image\/(?:jpeg|png|webp));base64,(.+)$/.exec(dataUrl);
  if (!match) throw new Error('Photo must be a JPEG, PNG, or WebP image');

  const bytes = Utilities.base64Decode(match[2]);
  if (bytes.length > MAX_IMAGE_BYTES) throw new Error('Photo is too large');

  const ext = match[1].split('/')[1].replace('jpeg', 'jpg');
  const blob = Utilities.newBlob(bytes, match[1], `${itemName.slice(0, 40)}-${Date.now()}.${ext}`);
  const file = getPhotoFolder().createFile(blob);

  try {
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  } catch (err) {
    file.setTrashed(true);
    throw new Error(
      'Photo saved, but Google would not let it be shared publicly. ' +
      'Your account may block "anyone with the link" sharing (common on school accounts). ' +
      'See SETUP.md for help.'
    );
  }
  return `https://drive.google.com/thumbnail?id=${file.getId()}&sz=w1200`;
}

function getPhotoFolder() {
  const props = PropertiesService.getScriptProperties();
  const id = props.getProperty('PHOTO_FOLDER_ID');
  if (id) {
    try { return DriveApp.getFolderById(id); } catch (err) { /* deleted: make a new one */ }
  }
  const folder = DriveApp.createFolder(PHOTO_FOLDER_NAME);
  props.setProperty('PHOTO_FOLDER_ID', folder.getId());
  return folder;
}

/* ---------------- Helpers ---------------- */

function getSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
  }
  return sheet;
}

function clean(value, maxLen) {
  return String(value == null ? '' : value).trim().slice(0, maxLen);
}

// Stop text like "=IMPORTXML(...)" from being run as a spreadsheet formula.
function safeCell(value) {
  if (typeof value === 'string' && /^[=+\-@]/.test(value)) return "'" + value;
  return value;
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

/**
 * Run this once from the Apps Script editor (select it and press ▶ Run) to
 * create the Items sheet, the photo folder, and grant permissions.
 */
function setup() {
  getSheet();
  getPhotoFolder();
  const hasPasscode = !!PropertiesService.getScriptProperties().getProperty('STAFF_PASSCODE');
  Logger.log(hasPasscode
    ? 'Setup complete.'
    : 'Setup complete, but STAFF_PASSCODE is not set yet. Add it under Project Settings → Script Properties.');
}
