import { CATEGORIES, CLOTHING_SIZES, SHOE_SIZES, CONDITIONS, COLORS } from '../../shopOptions.js';

export const EMPTY_FILTERS = {
  categories: [],
  sizes: [],
  conditions: [],
  colors: [],
  minPrice: '',
  maxPrice: '',
};

export function countActiveFilters(f) {
  return (
    f.categories.length +
    f.sizes.length +
    f.conditions.length +
    f.colors.length +
    (f.minPrice !== '' ? 1 : 0) +
    (f.maxPrice !== '' ? 1 : 0)
  );
}

function toggle(list, value) {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

function CheckList({ legend, options, selected, onToggle }) {
  return (
    <fieldset className="filter-group">
      <legend>{legend}</legend>
      <div className="check-list">
        {options.map((opt) => (
          <label key={opt} className="check">
            <input type="checkbox" checked={selected.includes(opt)} onChange={() => onToggle(opt)} />
            <span>{opt}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function ChipList({ options, selected, onToggle, label }) {
  return (
    <div className="chip-list" role="group" aria-label={label}>
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          className="chip"
          aria-pressed={selected.includes(opt)}
          onClick={() => onToggle(opt)}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

export default function Filters({ filters, onChange }) {
  const set = (patch) => onChange({ ...filters, ...patch });
  const active = countActiveFilters(filters);

  return (
    <div className="filters">
      <div className="filters__head">
        <h2 className="filters__title">Filters</h2>
        {active > 0 && (
          <button type="button" className="link-btn" onClick={() => onChange(EMPTY_FILTERS)}>
            Clear all
          </button>
        )}
      </div>

      <CheckList
        legend="Category"
        options={CATEGORIES.map((c) => c.name)}
        selected={filters.categories}
        onToggle={(v) => set({ categories: toggle(filters.categories, v) })}
      />

      <fieldset className="filter-group">
        <legend>Size</legend>
        <p className="filter-sub">Clothing</p>
        <ChipList
          label="Clothing sizes"
          options={CLOTHING_SIZES}
          selected={filters.sizes}
          onToggle={(v) => set({ sizes: toggle(filters.sizes, v) })}
        />
        <p className="filter-sub">Shoes</p>
        <ChipList
          label="Shoe sizes"
          options={SHOE_SIZES}
          selected={filters.sizes}
          onToggle={(v) => set({ sizes: toggle(filters.sizes, v) })}
        />
      </fieldset>

      <fieldset className="filter-group">
        <legend>Price</legend>
        <div className="price-range">
          <label>
            <span className="visually-hidden">Minimum price</span>
            <span className="price-input">
              <span aria-hidden="true">$</span>
              <input
                type="number"
                inputMode="decimal"
                min="0"
                step="1"
                placeholder="Min"
                value={filters.minPrice}
                onChange={(e) => set({ minPrice: e.target.value })}
              />
            </span>
          </label>
          <span className="price-range__dash" aria-hidden="true">–</span>
          <label>
            <span className="visually-hidden">Maximum price</span>
            <span className="price-input">
              <span aria-hidden="true">$</span>
              <input
                type="number"
                inputMode="decimal"
                min="0"
                step="1"
                placeholder="Max"
                value={filters.maxPrice}
                onChange={(e) => set({ maxPrice: e.target.value })}
              />
            </span>
          </label>
        </div>
      </fieldset>

      <CheckList
        legend="Condition"
        options={CONDITIONS}
        selected={filters.conditions}
        onToggle={(v) => set({ conditions: toggle(filters.conditions, v) })}
      />

      <fieldset className="filter-group">
        <legend>Color</legend>
        <div className="swatch-list">
          {COLORS.map((c) => (
            <button
              key={c.name}
              type="button"
              className="swatch"
              aria-pressed={filters.colors.includes(c.name)}
              onClick={() => set({ colors: toggle(filters.colors, c.name) })}
            >
              <span className="swatch__dot" style={{ background: c.hex }} aria-hidden="true" />
              <span className="swatch__name">{c.name}</span>
            </button>
          ))}
        </div>
      </fieldset>
    </div>
  );
}

/** Applies search text + filters to the item list. */
export function applyFilters(items, query, f) {
  const q = query.trim().toLowerCase();
  const min = f.minPrice === '' ? null : Number(f.minPrice);
  const max = f.maxPrice === '' ? null : Number(f.maxPrice);

  return items.filter((item) => {
    if (q) {
      const haystack = [item.name, item.description, item.category, item.color, item.size]
        .join(' ')
        .toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    if (f.categories.length && !f.categories.includes(item.category)) return false;
    if (f.sizes.length && !f.sizes.includes(item.size)) return false;
    if (f.conditions.length && !f.conditions.includes(item.condition)) return false;
    if (f.colors.length && !f.colors.includes(item.color)) return false;
    const price = Number(item.price);
    if (min !== null && price < min) return false;
    if (max !== null && price > max) return false;
    return true;
  });
}
