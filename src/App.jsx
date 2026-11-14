import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx';
import HowItWorks from './components/HowItWorks.jsx';
import Donate from './components/Donate.jsx';
import Visit from './components/Visit.jsx';
import Footer from './components/Footer.jsx';

export default function App() {
  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <Header />
      <main id="main">
        <Hero />
        <HowItWorks />
        <Donate />
        <Visit />
      </main>
      <Footer />
    </>
  );
}
