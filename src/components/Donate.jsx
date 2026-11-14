import storeInfo from '../storeInfo.js';

const steps = [
  {
    title: 'Check what we take',
    text: 'Clothing is welcome all year. Other non-consumable goods are accepted during move-out.',
  },
  {
    title: 'Bring it by',
    text: `Drop items off at ${storeInfo.location.building} during open hours. Please make sure they're clean and ready to wear or use.`,
  },
  {
    title: 'It finds a new home',
    text: 'Student workers sort, price, and shelve everything so another student can use it.',
  },
];

export default function Donate() {
  return (
    <section className="section section--grey" id="donate">
      <div className="container">
        <p className="eyebrow">Donate</p>
        <h2 className="section__title">Give your stuff another semester</h2>

        <ol className="steps">
          {steps.map((s, i) => (
            <li key={s.title} className="step">
              <span className="step__num" aria-hidden="true">{i + 1}</span>
              <div>
                <h3 className="step__title">{s.title}</h3>
                <p>{s.text}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="accept">
          <div className="accept__col accept__col--yes">
            <h3>We accept</h3>
            <ul>
              <li><strong>All year:</strong> clean clothing, shoes, and accessories</li>
              <li><strong>During move-out:</strong> dorm and household goods such as lamps, decor, kitchenware, storage, and books</li>
            </ul>
          </div>
          <div className="accept__col accept__col--no">
            <h3>Please don't bring</h3>
            <ul>
              <li>Food, drinks, or other consumables</li>
              <li>Opened toiletries, cosmetics, or cleaning products</li>
              <li>Broken, stained, or heavily damaged items</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
