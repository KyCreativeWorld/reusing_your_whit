import storeInfo from '../storeInfo.js';

export default function HowItWorks() {
  return (
    <section className="section section--white" id="how-it-works">
      <div className="container">
        <p className="eyebrow">How it works</p>
        <h2 className="section__title">Two kinds of shopping, one store</h2>
        <p className="section__intro">
          Most of the year we're a clothing thrift store. At the start and end of each
          semester we open up to almost anything students are moving in or out with.
        </p>

        <div className="cards">
          <article className="card card--blue">
            <span className="card__tag">All year</span>
            <h3 className="card__title">Clothing</h3>
            <p>
              Shop racks of donated clothes, shoes, and accessories. New items come in
              throughout the semester, so check back often.
            </p>
            <ul className="card__list">
              <li>Tops, bottoms, and outerwear</li>
              <li>Shoes and accessories</li>
              <li>Formal wear and costumes</li>
            </ul>
          </article>

          <article className="card card--yellow">
            <span className="card__tag">Start &amp; end of semester</span>
            <h3 className="card__title">Move-out &amp; move-in sales</h3>
            <p>
              When students move out, they can drop off almost any <strong>non-consumable</strong>{' '}
              goods instead of throwing them away. When the next group moves in, those
              goods go on sale for low prices.
            </p>
            <ul className="card__list">
              <li>Lamps, rugs, and decor</li>
              <li>Kitchenware and storage bins</li>
              <li>Books, small furniture, and more</li>
            </ul>
          </article>
        </div>

        <ol className="timeline" aria-label="Typical year">
          <li className="timeline__step">
            <span className="timeline__when">{storeInfo.moveInDates}</span>
            <span className="timeline__what">Move-in sale: dorm goods at low prices</span>
          </li>
          <li className="timeline__step">
            <span className="timeline__when">During the semester</span>
            <span className="timeline__what">Clothing thrift, open regular hours</span>
          </li>
          <li className="timeline__step">
            <span className="timeline__when">{storeInfo.moveOutDates}</span>
            <span className="timeline__what">Move-out drop-off: donate what you won't take home</span>
          </li>
        </ol>
      </div>
    </section>
  );
}
