import storeInfo from '../storeInfo.js';

export default function Hero() {
  return (
    <section className="hero" id="top">
      <div className="container hero__inner">
        <p className="eyebrow eyebrow--light">Student-run thrift store</p>
        <h1 className="hero__title">
          Reusing Your <span className="hero__accent">Whit</span>
        </h1>
        <p className="hero__lead">{storeInfo.tagline}</p>
        <p className="hero__body">
          We're a thrift store run by students, with support from the college. Donated
          clothes and dorm goods get a second life here, so they stay on campus and out of
          the landfill.
        </p>
        <div className="hero__actions">
          <a href="./shop.html" className="btn btn--yellow">Shop items</a>
          <a href="#visit" className="btn btn--ghost">Plan a visit</a>
          <a href="#donate" className="btn btn--ghost">Donate items</a>
        </div>
      </div>
    </section>
  );
}
