import Logo from './Logo.jsx';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container site-footer__inner">
        <Logo tone="light" />
        <p>A student-run and college-supported thrift store.</p>
        <p className="site-footer__small">© {new Date().getFullYear()} Reusing Your Whit</p>
      </div>
    </footer>
  );
}
