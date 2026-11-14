import { useEffect, useState } from 'react';
import Logo from './Logo.jsx';

const sections = [
  { hash: '#how-it-works', label: 'How it works' },
  { hash: '#donate', label: 'Donate' },
  { hash: '#visit', label: 'Visit' },
];

// `page` is 'home' or 'shop'. From the shop page, section links point back
// to the home page.
export default function Header({ page = 'home' }) {
  const [open, setOpen] = useState(false);
  const home = page === 'home' ? '' : './';

  // Close the mobile menu with Escape, or when the screen grows to desktop width.
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    const mq = window.matchMedia('(min-width: 760px)');
    const onResize = () => mq.matches && setOpen(false);
    window.addEventListener('keydown', onKey);
    mq.addEventListener('change', onResize);
    return () => {
      window.removeEventListener('keydown', onKey);
      mq.removeEventListener('change', onResize);
    };
  }, []);

  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <a
          href={page === 'home' ? '#top' : './'}
          className="site-header__brand"
          aria-label={page === 'home' ? 'Reusing Your Whit, back to top' : 'Reusing Your Whit home page'}
        >
          <Logo tone="dark" />
        </a>

        <button
          className="menu-toggle"
          aria-expanded={open}
          aria-controls="site-nav"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((o) => !o)}
        >
          <span className={`menu-toggle__icon ${open ? 'is-open' : ''}`} aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
        </button>

        <nav id="site-nav" className={`site-nav ${open ? 'is-open' : ''}`} aria-label="Main">
          <ul>
            {sections.map((s) => (
              <li key={s.hash}>
                <a href={home + s.hash} onClick={() => setOpen(false)}>
                  {s.label}
                </a>
              </li>
            ))}
            <li>
              <a
                href="./shop.html"
                className="site-nav__shop"
                aria-current={page === 'shop' ? 'page' : undefined}
                onClick={() => setOpen(false)}
              >
                Shop
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
