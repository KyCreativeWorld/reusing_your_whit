// Hanger mark + wordmark. `tone` switches colors for light or dark backgrounds.
export default function Logo({ tone = 'dark' }) {
  return (
    <span className={`logo logo--${tone}`}>
      <svg className="logo__mark" viewBox="0 0 64 64" aria-hidden="true">
        <path
          d="M32 14a5 5 0 1 1 5 5c-2 0-5 1.5-5 4v3l21 13c2 1.2 1.2 4.5-1 4.5H12c-2.2 0-3-3.3-1-4.5l21-13"
          fill="none"
          stroke="currentColor"
          strokeWidth="4.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="logo__text">Reusing Your Whit</span>
    </span>
  );
}
