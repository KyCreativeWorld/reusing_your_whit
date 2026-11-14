// Data layer for the shop. Talks to the Google Apps Script web app when
// SHEETS_API_URL is set; otherwise falls back to browser-only demo storage.
import { SHEETS_API_URL, DEMO_PASSCODE } from './config.js';

export const isDemoMode = !SHEETS_API_URL;

const DEMO_KEY = 'ryw-demo-items';

function makeId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    try { return crypto.randomUUID(); } catch { /* insecure context */ }
  }
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
}

function readDemoItems() {
  try {
    return JSON.parse(localStorage.getItem(DEMO_KEY)) || [];
  } catch {
    return [];
  }
}

const ACCESS_HELP =
  "Can't reach the Google Sheet. The Apps Script deployment probably requires a sign-in. " +
  "Redeploy it with \"Who has access\" set to \"Anyone\" (see google-apps-script/SETUP.md).";

// Calls the Apps Script web app and returns its parsed JSON. If the deployment
// isn't public, Google answers with a login page instead of JSON (or the
// browser blocks the redirect outright), so both cases get a clear message.
async function callSheet(url, options) {
  let res;
  try {
    res = await fetch(url, options);
  } catch {
    throw new Error(ACCESS_HELP);
  }
  if (!res.ok) throw new Error(`Server error (${res.status})`);
  try {
    return await res.json();
  } catch {
    throw new Error(ACCESS_HELP);
  }
}

// Apps Script only allows "simple" cross-origin requests, so POST bodies are
// sent as text/plain (which skips the CORS preflight) and parsed as JSON there.
async function postToSheet(payload) {
  const data = await callSheet(SHEETS_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(payload),
  });
  if (!data.ok) throw new Error(data.error || 'Something went wrong');
  return data;
}

/** Returns all items, newest first. */
export async function fetchItems() {
  if (isDemoMode) return readDemoItems();

  const data = await callSheet(`${SHEETS_API_URL}?action=list`);
  if (!data.ok) throw new Error(data.error || 'Could not load items');
  return data.items;
}

/** Resolves if the passcode is correct, rejects otherwise. */
export async function verifyPasscode(passcode) {
  if (isDemoMode) {
    if (passcode !== DEMO_PASSCODE) throw new Error('Wrong passcode');
    return;
  }
  await postToSheet({ action: 'verify', passcode });
}

/**
 * Saves a new item and returns it as stored.
 * `item.image` is a JPEG data URL (or empty string).
 */
export async function addItem(item, passcode) {
  if (isDemoMode) {
    const stored = {
      ...item,
      id: makeId(),
      createdAt: new Date().toISOString(),
      imageUrl: item.image,
    };
    delete stored.image;
    const items = [stored, ...readDemoItems()];
    try {
      localStorage.setItem(DEMO_KEY, JSON.stringify(items));
    } catch {
      throw new Error('Browser storage is full. Demo mode can only hold a limited number of photos.');
    }
    return stored;
  }

  const data = await postToSheet({ action: 'add', passcode, item });
  return data.item;
}

/** Shrinks a photo to a JPEG data URL so uploads stay small and fast. */
export function resizeImage(file, maxDim = isDemoMode ? 800 : 1200, quality = 0.8) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#ffffff'; // transparent PNGs get a white background
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL('image/jpeg', quality));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("That file couldn't be read as an image. Try a JPEG or PNG."));
    };
    img.src = url;
  });
}

export const formatPrice = (n) =>
  Number(n) === 0
    ? 'Free'
    : new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(n));
