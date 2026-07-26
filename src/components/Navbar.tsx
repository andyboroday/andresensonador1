const items = ["Home", "Projects", "Articles", "Artwork", "Shop", "Donate", "Contact"];

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full navbar">
      <ul className="flex flex-wrap justify-center items-center gap-4 px-4 py-1">
        {items.map((label) => (
          <li key={label}>
            <a
              href={
  label === "Home"
    ? "/"
    : label === "Donate"
    ? "/donate"
    : `/#${label.toLowerCase()}`
}
              className="block navbar__link"
            >
              {label.toUpperCase()}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
