import storeInfo from '../storeInfo.js';

export default function Visit() {
  const { location, hours, hoursNote, contact } = storeInfo;

  return (
    <section className="section section--navy" id="visit">
      <div className="container">
        <p className="eyebrow eyebrow--light">Visit</p>
        <h2 className="section__title section__title--light">Hours, location &amp; contact</h2>

        <div className="visit">
          <div className="visit__panel">
            <h3>Hours</h3>
            <dl className="hours">
              {hours.map((h) => (
                <div key={h.days} className="hours__row">
                  <dt>{h.days}</dt>
                  <dd>{h.time}</dd>
                </div>
              ))}
            </dl>
            <p className="visit__note">{hoursNote}</p>
          </div>

          <div className="visit__panel">
            <h3>Location</h3>
            <address>
              {location.building}
              <br />
              {location.room}
              <br />
              {location.address}
            </address>
            {location.mapUrl && (
              <a className="btn btn--yellow btn--small" href={location.mapUrl} target="_blank" rel="noreferrer">
                Get directions
              </a>
            )}
          </div>

          <div className="visit__panel">
            <h3>Contact</h3>
            <ul className="contact">
              <li>
                <span className="contact__label">Email</span>
                <a href={`mailto:${contact.email}`}>{contact.email}</a>
              </li>
              <li>
                <span className="contact__label">Instagram</span>
                {contact.instagramUrl ? (
                  <a href={contact.instagramUrl} target="_blank" rel="noreferrer">{contact.instagram}</a>
                ) : (
                  <span>{contact.instagram}</span>
                )}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
