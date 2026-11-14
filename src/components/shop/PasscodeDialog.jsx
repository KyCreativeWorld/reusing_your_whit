import { useState } from 'react';
import Modal from './Modal.jsx';
import { verifyPasscode, isDemoMode } from '../../api.js';

export default function PasscodeDialog({ open, onClose, onSuccess }) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const close = () => {
    setCode('');
    setError('');
    onClose();
  };

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await verifyPasscode(code);
      onSuccess(code);
      setCode('');
    } catch (err) {
      setError(err.message === 'Wrong passcode' ? "That passcode isn't right." : err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal open={open} onClose={close} title="Staff sign-in">
      <form className="form" onSubmit={submit}>
        <p className="form__hint">Enter the staff passcode to add items to the shop.</p>
        {isDemoMode && (
          <p className="form__demo">
            Demo mode: the passcode is <strong>whit</strong>.
          </p>
        )}
        <label className="field">
          <span className="field__label">Passcode</span>
          <input
            type="password"
            autoComplete="current-password"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
            autoFocus
          />
        </label>
        {error && <p className="form__error" role="alert">{error}</p>}
        <div className="form__actions">
          <button type="button" className="btn btn--outline" onClick={close}>Cancel</button>
          <button type="submit" className="btn btn--blue" disabled={busy || !code}>
            {busy ? 'Checking…' : 'Sign in'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
