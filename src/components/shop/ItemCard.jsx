import { useState } from 'react';
import { colorSwatch } from '../../shopOptions.js';
import { formatPrice } from '../../api.js';

function PhotoPlaceholder() {
  return (
    <div className="item-card__placeholder" aria-hidden="true">
      <svg viewBox="0 0 64 64">
        <path
          d="M32 14a5 5 0 1 1 5 5c-2 0-5 1.5-5 4v3l21 13c2 1.2 1.2 4.5-1 4.5H12c-2.2 0-3-3.3-1-4.5l21-13"
          fill="none"
          stroke="currentColor"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

export default function ItemCard({ item }) {
  const [imgFailed, setImgFailed] = useState(false);
  const meta = [item.size, item.condition].filter(Boolean).join(' · ');

  return (
    <article className="item-card">
      <div className="item-card__photo">
        {item.imageUrl && !imgFailed ? (
          <img src={item.imageUrl} alt={item.name} loading="lazy" onError={() => setImgFailed(true)} />
        ) : (
          <PhotoPlaceholder />
        )}
        <span className="item-card__category">{item.category}</span>
      </div>
      <div className="item-card__body">
        <div className="item-card__top">
          <h3 className="item-card__name">{item.name}</h3>
          <span className="item-card__price">{formatPrice(item.price)}</span>
        </div>
        {meta && <p className="item-card__meta">{meta}</p>}
        {item.color && (
          <p className="item-card__color">
            <span className="item-card__dot" style={{ background: colorSwatch(item.color) }} aria-hidden="true" />
            {item.color}
          </p>
        )}
        {item.description && <p className="item-card__desc">{item.description}</p>}
      </div>
    </article>
  );
}
