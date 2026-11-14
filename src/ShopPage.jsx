import { useEffect, useMemo, useState } from 'react';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import Filters, { EMPTY_FILTERS, applyFilters, countActiveFilters } from './components/shop/Filters.jsx';
import ItemCard from './components/shop/ItemCard.jsx';
import PasscodeDialog from './components/shop/PasscodeDialog.jsx';
import AddItemDialog from './components/shop/AddItemDialog.jsx';
import { fetchItems, isDemoMode } from './api.js';

const SESSION_KEY = 'ryw-staff-passcode';

function readSession() {
  try { return sessionStorage.getItem(SESSION_KEY) || ''; } catch { return ''; }
}
function writeSession(value) {
  try {
    if (value) sessionStorage.setItem(SESSION_KEY, value);
    else sessionStorage.removeItem(SESSION_KEY);
  } catch { /* storage unavailable: staff will just sign in again next visit */ }
}

export default function ShopPage() {
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState('loading'); // loading | ready | error
  const [loadError, setLoadError] = useState('');

  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const [passcode, setPasscode] = useState(readSession);
  const [signInOpen, setSignInOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [toast, setToast] = useState('');

  const load = () => {
    setStatus('loading');
    fetchItems()
      .then((list) => {
        setItems(list);
        setStatus('ready');
      })
      .catch((err) => {
        setLoadError(err.message);
        setStatus('error');
      });
  };

  useEffect(load, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(''), 3500);
    return () => clearTimeout(t);
  }, [toast]);

  const visible = useMemo(() => applyFilters(items, query, filters), [items, query, filters]);
  const activeCount = countActiveFilters(filters);
  const isStaff = Boolean(passcode);
  const hasSearch = query.trim() !== '' || activeCount > 0;

  const signIn = (code) => {
    setPasscode(code);
    writeSession(code);
    setSignInOpen(false);
    setAddOpen(true);
  };

  const signOut = () => {
    setPasscode('');
    writeSession('');
  };

  const clearAll = () => {
    setQuery('');
    setFilters(EMPTY_FILTERS);
  };

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <Header page="shop" />

      <main id="main">
        <section className="shop-hero">
          <div className="container">
            <p className="eyebrow eyebrow--light">Shop</p>
            <h1 className="shop-hero__title">What's in the store</h1>
            <p className="shop-hero__lead">
              Browse secondhand clothes and dorm goods from Reusing Your Whit.
            </p>
          </div>
        </section>

        {isDemoMode && (
          <div className="demo-banner" role="note">
            <div className="container">
              <strong>Demo mode:</strong> the Google Sheet isn't connected yet, so items you add
              are saved in this browser only.
            </div>
          </div>
        )}

        <section className="shop">
          <div className="container">
            <div className="shop__toolbar">
              <label className="search">
                <span className="visually-hidden">Search items</span>
                <svg className="search__icon" viewBox="0 0 24 24" aria-hidden="true">
                  <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="2.2" />
                  <path d="M16.5 16.5L21 21" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
                </svg>
                <input
                  type="search"
                  placeholder="Search items"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </label>
              <button
                type="button"
                className="btn btn--outline shop__filter-toggle"
                aria-expanded={filtersOpen}
                aria-controls="shop-filters"
                onClick={() => setFiltersOpen((o) => !o)}
              >
                Filters{activeCount > 0 ? ` (${activeCount})` : ''}
              </button>
            </div>

            <div className="shop__layout">
              <aside id="shop-filters" className={`shop__sidebar ${filtersOpen ? 'is-open' : ''}`}>
                <Filters filters={filters} onChange={setFilters} />
                <button
                  type="button"
                  className="btn btn--blue shop__show-results"
                  onClick={() => setFiltersOpen(false)}
                >
                  Show {visible.length} {visible.length === 1 ? 'item' : 'items'}
                </button>
              </aside>

              <div className="shop__results" aria-live="polite">
                {status === 'loading' && <p className="shop__status">Loading items…</p>}

                {status === 'error' && (
                  <div className="empty">
                    <h2 className="empty__title">Couldn't load items</h2>
                    <p>{loadError}</p>
                    <button type="button" className="btn btn--blue" onClick={load}>Try again</button>
                  </div>
                )}

                {status === 'ready' && items.length === 0 && (
                  <div className="empty">
                    <h2 className="empty__title">No items yet</h2>
                    <p>New items will show up here once staff add them. Check back soon!</p>
                  </div>
                )}

                {status === 'ready' && items.length > 0 && (
                  <>
                    <p className="shop__count">
                      {hasSearch
                        ? `${visible.length} of ${items.length} items`
                        : `${items.length} ${items.length === 1 ? 'item' : 'items'}`}
                    </p>
                    {visible.length === 0 ? (
                      <div className="empty">
                        <h2 className="empty__title">No matches</h2>
                        <p>Try a different search or remove some filters.</p>
                        <button type="button" className="btn btn--outline" onClick={clearAll}>
                          Clear search &amp; filters
                        </button>
                      </div>
                    ) : (
                      <ul className="item-grid">
                        {visible.map((item) => (
                          <li key={item.id}>
                            <ItemCard item={item} />
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                )}
              </div>
            </div>

            <div className="staff-bar">
              {isStaff ? (
                <>
                  <span>Signed in as staff.</span>
                  <button type="button" className="link-btn" onClick={signOut}>Sign out</button>
                </>
              ) : (
                <button type="button" className="link-btn" onClick={() => setSignInOpen(true)}>
                  Staff sign-in
                </button>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {isStaff && (
        <button type="button" className="fab" onClick={() => setAddOpen(true)} aria-label="Add an item">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" />
          </svg>
        </button>
      )}

      <PasscodeDialog open={signInOpen} onClose={() => setSignInOpen(false)} onSuccess={signIn} />

      <AddItemDialog
        open={addOpen}
        onClose={() => setAddOpen(false)}
        passcode={passcode}
        onAdded={(item) => {
          setItems((list) => [item, ...list]);
          setStatus('ready');
          setToast(`"${item.name}" was added.`);
        }}
        onAuthFailed={() => {
          signOut();
          setAddOpen(false);
          setToast('Your staff session expired. Please sign in again.');
          setSignInOpen(true);
        }}
      />

      {toast && <div className="toast" role="status">{toast}</div>}
    </>
  );
}
