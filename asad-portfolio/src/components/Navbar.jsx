
import { useEffect, useState } from "react";
import "../css/Navbar.css";

const links = [
  ["home", "Home"],
  ["about", "About"],
  ["skills", "Skills"],
  ["projects", "Projects"],
  ["experience", "Experience"],
  ["achievements", "Achievements"],
  ["education", "Education"],
  ["contact", "Contact"],
];

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState("home");
  const [scrolled, setScrolled] = useState(false);

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") !== "light";
  });

  /* ================= THEME ================= */

  useEffect(() => {
    const theme = darkMode ? "dark" : "light";

    document.documentElement.setAttribute(
      "data-theme",
      theme
    );

    document.body.setAttribute(
      "data-theme",
      theme
    );

    localStorage.setItem("theme", theme);
  }, [darkMode]);

  /* ================= SCROLL ================= */

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 35);

      const sections = links
        .map(([id]) => document.getElementById(id))
        .filter(Boolean);

      const current = sections.reduce(
        (currentSection, section) => {
          const top = Math.abs(
            section.getBoundingClientRect().top - 120
          );

          if (
            !currentSection ||
            top < currentSection.distance
          ) {
            return {
              id: section.id,
              distance: top,
            };
          }

          return currentSection;
        },
        null
      );

      if (current) {
        setActive(current.id);
      }
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll
      );
    };
  }, []);

  /* ================= SCROLL TO ================= */

  const scrollTo = (id) => {
    document
      .getElementById(id)
      ?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });

    setActive(id);
    setMenuOpen(false);
  };

  /* ================= LOGIN ================= */

  const handleLogin = () => {
    setMenuOpen(false);

    window.dispatchEvent(
      new CustomEvent("open-login")
    );
  };

  /* ================= SIGN UP ================= */

  const handleSignup = () => {
    setMenuOpen(false);

    window.dispatchEvent(
      new CustomEvent("open-signup")
    );
  };

  return (
    <header
      className={`navbar ${
        scrolled ? "navbar-scrolled" : ""
      }`}
    >
      <div className="nav-container">

        {/* =================================================
            LOGO
        ================================================= */}

        <button
          type="button"
          className="logo"
          onClick={() => scrollTo("home")}
          aria-label="Muhammad Asad Ali Akbar"
        >
          <span className="ma-logo">
            <span className="ma-m">M</span>
            <span className="ma-a">A</span>
          </span>
        </button>

        {/* =================================================
            NAV LINKS
        ================================================= */}

        <nav
          className={`nav-links ${
            menuOpen ? "open" : ""
          }`}
        >
          {links.map(([id, label]) => (
            <button
              type="button"
              key={id}
              className={
                active === id ? "active" : ""
              }
              onClick={() => scrollTo(id)}
            >
              <span>{label}</span>
            </button>
          ))}

          {/* =================================================
              MOBILE AUTH
              Only shown when mobile menu is open
          ================================================= */}

          <div className="mobile-auth-actions">
            <button
              type="button"
              className="nav-login-btn"
              onClick={handleLogin}
            >
              <i className="fas fa-right-to-bracket" />
              <span>Login</span>
            </button>

            <button
              type="button"
              className="nav-signup-btn"
              onClick={handleSignup}
            >
              <i className="fas fa-user-plus" />
              <span>Sign Up</span>
            </button>
          </div>
        </nav>

        {/* =================================================
            RIGHT ACTIONS
        ================================================= */}

        <div className="nav-actions">

          {/* =================================================
              DESKTOP AUTH
          ================================================= */}

          <div className="desktop-auth-actions">
            <button
              type="button"
              className="nav-login-btn"
              onClick={handleLogin}
            >
              <i className="fas fa-right-to-bracket" />
              <span>Login</span>
            </button>

            <button
              type="button"
              className="nav-signup-btn"
              onClick={handleSignup}
            >
              <i className="fas fa-user-plus" />
              <span>Sign Up</span>
            </button>
          </div>

          {/* =================================================
              THEME TOGGLE
          ================================================= */}

          <button
            type="button"
            className={`theme-toggle ${
              darkMode ? "dark" : "light"
            }`}
            onClick={() =>
              setDarkMode((value) => !value)
            }
            aria-label={
              darkMode
                ? "Switch to light mode"
                : "Switch to dark mode"
            }
          >
            <span className="theme-track">
              <span className="theme-icon sun-icon">
                ☀
              </span>

              <span className="theme-icon moon-icon">
                ☾
              </span>

              <span className="theme-thumb">
                {darkMode ? "☾" : "☀"}
              </span>
            </span>
          </button>

          {/* =================================================
              MOBILE MENU
          ================================================= */}

          <button
            type="button"
            className={`menu-btn ${
              menuOpen ? "menu-open" : ""
            }`}
            onClick={() =>
              setMenuOpen((value) => !value)
            }
            aria-label="Toggle navigation"
            aria-expanded={menuOpen}
          >
            <span />
            <span />
            <span />
          </button>

        </div>
      </div>
    </header>
  );
}

export default Navbar;


