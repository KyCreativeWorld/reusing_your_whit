import { useState } from 'react';
import Modal from './Modal.jsx';
import { CATEGORIES, CONDITIONS, COLORS, sizesForCategory } from '../../shopOptions.js';
import { addItem, resizeImage } from '../../api.js';

const BLANK = {
  name: '',
  price: '',
  category: '',
  size: '',
  condition: '',
  color: '',
  description: '',
  image: '',
};

export default function AddItemDialog({ open, onClose, passcode, onAdded, onAuthFailed }) {
  const [form, setForm] = useState(BLANK);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [processingPhoto, setProcessingPhoto] = useState(false);

  const set = (patch) => setForm((f) => ({ ...f, ...patch }));
  const sizes = sizesForCategory(form.category);

  const close = () => {
    if (busy) return;
    setForm(BLANK);
    setError('');
    onClose();
  };

  const onPhoto = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError('');
    setProcessingPhoto(true);
    try {
      set({ image: await resizeImage(file) });
    } catch (err) {
      setError(err.message);
    } finally {
      setProcessingPhoto(false);
      e.target.value = ''; // allow re-picking the same file
    }
  };

  const onCategory = (category) => {
    // Clear the size if it doesn't belong to the new category's size list.
    const nextSizes = sizesForCategory(category);
    set({ category, size: nextSizes.includes(form.size) ? form.size : '' });
  };

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const item = {
        ...form,
        name: form.name.trim(),
        description: form.description.trim(),
        price: Number(form.price),
      };
      const saved = await addItem(item, passcode);
      onAdded(saved);
      setForm(BLANK);
      onClose();
    } catch (err) {
      if (err.message === 'Wrong passcode') {
        onAuthFailed();
        return;
      }
      setError(err.message || 'Could not save the item. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal open={open} onClose={close} title="Add an item" wide>
      <form className="form" onSubmit={submit}>
        <div className="photo-field">
          <span className="field__label" id="photo-label">Photo</span>
          <div className="photo-field__row">
            <div className="photo-field__preview">
              {form.image ? (
                <img src={form.image} alt="Selected item photo" />
              ) : (
                <span>{processingPhoto ? 'Loading…' : 'No photo yet'}</span>
              )}
            </div>
            <div className="photo-field__actions">
              <label className="btn btn--outline btn--small-plain">
                {form.image ? 'Change photo' : 'Choose photo'}
                <input
                  type="file"
                  accept="image/*"
                  className="visually-hidden"
                  aria-labelledby="photo-label"
                  onChange={onPhoto}
                />
              </label>
              {form.image && (
                <button type="button" className="link-btn" onClick={() => set({ image: '' })}>
                  Remove photo
                </button>
              )}
              <p className="form__hint">On a phone you can take a photo directly.</p>
            </div>
          </div>
        </div>

        <label className="field">
          <span className="field__label">Item name *</span>
          <input
            type="text"
            value={form.name}
            onChange={(e) => set({ name: e.target.value })}
            maxLength={80}
            placeholder="e.g. Vintage denim jacket"
            required
          />
        </label>

        <div className="field-row">
          <label className="field">
            <span className="field__label">Price *</span>
            <span className="price-input price-input--lg">
              <span aria-hidden="true">$</span>
              <input
                type="number"
                inputMode="decimal"
                min="0"
                step="0.01"
                value={form.price}
                onChange={(e) => set({ price: e.target.value })}
                placeholder="0.00"
                required
              />
            </span>
          </label>

          <label className="field">
            <span className="field__label">Category *</span>
            <select value={form.category} onChange={(e) => onCategory(e.target.value)} required>
              <option value="" disabled>Choose…</option>
              {CATEGORIES.map((c) => (
                <option key={c.name}>{c.name}</option>
              ))}
            </select>
          </label>
        </div>

        <div className="field-row">
          {sizes.length > 0 && (
            <label className="field">
              <span className="field__label">Size *</span>
              <select value={form.size} onChange={(e) => set({ size: e.target.value })} required>
                <option value="" disabled>Choose…</option>
                {sizes.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </label>
          )}

          <label className="field">
            <span className="field__label">Condition *</span>
            <select value={form.condition} onChange={(e) => set({ condition: e.target.value })} required>
              <option value="" disabled>Choose…</option>
              {CONDITIONS.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </label>
        </div>

        <fieldset className="field">
          <legend className="field__label">Color *</legend>
          <div className="swatch-list swatch-list--form">
            {COLORS.map((c) => (
              <label key={c.name} className="swatch swatch--radio">
                <input
                  type="radio"
                  name="color"
                  value={c.name}
                  checked={form.color === c.name}
                  onChange={() => set({ color: c.name })}
                  required
                />
                <span className="swatch__dot" style={{ background: c.hex }} aria-hidden="true" />
                <span className="swatch__name">{c.name}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <label className="field">
          <span className="field__label">Description</span>
          <textarea
            rows={3}
            maxLength={300}
            value={form.description}
            onChange={(e) => set({ description: e.target.value })}
            placeholder="Brand, material, measurements, anything shoppers should know"
          />
        </label>

        {error && <p className="form__error" role="alert">{error}</p>}

        <div className="form__actions">
          <button type="button" className="btn btn--outline" onClick={close} disabled={busy}>
            Cancel
          </button>
          <button type="submit" className="btn btn--blue" disabled={busy || processingPhoto}>
            {busy ? 'Saving…' : 'Add item'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
