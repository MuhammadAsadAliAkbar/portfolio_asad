import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
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

  /* =====================================================
     THEME
  ===================================================== */

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") !== "light";
  });

  /* =====================================================
     AUTH STATE
  ===================================================== */

  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("user");
      const token = localStorage.getItem("authToken");

      if (savedUser && token) {
        return JSON.parse(savedUser);
      }

      return null;
    } catch (error) {
      console.error("Failed to load user:", error);
      return null;
    }
  });

  const [profileOpen, setProfileOpen] = useState(false);

  const profileRef = useRef(null);

  /* =====================================================
     THEME
  ===================================================== */

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

  /* =====================================================
     AUTH SUCCESS
  ===================================================== */

  useEffect(() => {
    const handleAuthSuccess = (event) => {
      const loggedInUser = event.detail;

      if (!loggedInUser) {
        return;
      }

      setUser(loggedInUser);
      setProfileOpen(false);
    };

    window.addEventListener(
      "auth-success",
      handleAuthSuccess
    );

    return () => {
      window.removeEventListener(
        "auth-success",
        handleAuthSuccess
      );
    };
  }, []);

  /* =====================================================
     AUTH LOGOUT EVENT
  ===================================================== */

  useEffect(() => {
    const handleAuthLogout = () => {
      setUser(null);
      setProfileOpen(false);
    };

    window.addEventListener(
      "auth-logout",
      handleAuthLogout
    );

    return () => {
      window.removeEventListener(
        "auth-logout",
        handleAuthLogout
      );
    };
  }, []);

  /* =====================================================
     AUTH STORAGE SYNC
  ===================================================== */

  useEffect(() => {
    const handleStorage = (event) => {
      if (
        event.key === "user" ||
        event.key === "authToken"
      ) {
        try {
          const savedUser =
            localStorage.getItem("user");

          const token =
            localStorage.getItem("authToken");

          if (savedUser && token) {
            setUser(JSON.parse(savedUser));
          } else {
            setUser(null);
            setProfileOpen(false);
          }
        } catch (error) {
          console.error(
            "Auth storage error:",
            error
          );

          setUser(null);
          setProfileOpen(false);
        }
      }
    };

    window.addEventListener(
      "storage",
      handleStorage
    );

    return () => {
      window.removeEventListener(
        "storage",
        handleStorage
      );
    };
  }, []);

  /* =====================================================
     SCROLL
  ===================================================== */

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 35);

      const sections = links
        .map(([id]) =>
          document.getElementById(id)
        )
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

    window.addEventListener(
      "scroll",
      handleScroll,
      {
        passive: true,
      }
    );

    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll
      );
    };
  }, []);

  /* =====================================================
     CLOSE PROFILE ON OUTSIDE CLICK
  ===================================================== */

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setProfileOpen(false);
      }
    };

    if (profileOpen) {
      document.addEventListener(
        "mousedown",
        handleOutsideClick
      );
    }

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };
  }, [profileOpen]);

  /* =====================================================
     ESC KEY
  ===================================================== */

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setProfileOpen(false);
        setMenuOpen(false);
      }
    };

    document.addEventListener(
      "keydown",
      handleEscape
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, []);

  /* =====================================================
     SCROLL TO SECTION
  ===================================================== */

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

  /* =====================================================
     LOGIN
  ===================================================== */

  const handleLogin = () => {
    setMenuOpen(false);
    setProfileOpen(false);

    window.dispatchEvent(
      new CustomEvent("open-login")
    );
  };

  /* =====================================================
     SIGN UP
  ===================================================== */

  const handleSignup = () => {
    setMenuOpen(false);
    setProfileOpen(false);

    window.dispatchEvent(
      new CustomEvent("open-signup")
    );
  };

  /* =====================================================
     DASHBOARD
  ===================================================== */

  const handleDashboard = () => {
    setProfileOpen(false);
    setMenuOpen(false);

    window.location.href = "/dashboard";
  };

  /* =====================================================
     LOGOUT
  ===================================================== */

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");

    setUser(null);
    setProfileOpen(false);
    setMenuOpen(false);

    window.dispatchEvent(
      new CustomEvent("auth-logout")
    );
  };

  /* =====================================================
     USER INITIAL
  ===================================================== */

  const getUserInitial = () => {
    if (!user?.name) {
      return "U";
    }

    return user.name
      .trim()
      .charAt(0)
      .toUpperCase();
  };

  /* =====================================================
     USER DISPLAY NAME
  ===================================================== */

  const getFirstName = () => {
    if (!user?.name) {
      return "User";
    }

    return user.name
      .trim()
      .split(" ")[0];
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
            <span className="ma-m">
              M
            </span>

            <span className="ma-a">
              A
            </span>
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
                active === id
                  ? "active"
                  : ""
              }
              onClick={() =>
                scrollTo(id)
              }
            >
              <span>
                {label}
              </span>
            </button>
          ))}

          {/* =================================================
              MOBILE AUTH
          ================================================= */}

          <div className="mobile-auth-actions">

            {!user ? (
              <>
                {/* LOGIN */}

                <button
                  type="button"
                  className="nav-login-btn"
                  onClick={handleLogin}
                >
                  <i className="fas fa-right-to-bracket" />

                  <span>
                    Login
                  </span>
                </button>

                {/* SIGN UP */}

                <button
                  type="button"
                  className="nav-signup-btn"
                  onClick={handleSignup}
                >
                  <i className="fas fa-user-plus" />

                  <span>
                    Sign Up
                  </span>
                </button>
              </>
            ) : (
              <div className="mobile-user-actions">

                {/* USER INFO */}

                <div className="mobile-user-info">

                  <div className="mobile-user-avatar">
                    {getUserInitial()}
                  </div>

                  <div>
                    <strong>
                      {getFirstName()}
                    </strong>

                    <span>
                      {user.email}
                    </span>
                  </div>

                </div>

                {/* DASHBOARD */}

                <button
                  type="button"
                  className="mobile-dashboard-btn"
                  onClick={
                    handleDashboard
                  }
                >
                  <i className="fas fa-chart-line" />

                  <span>
                    Dashboard
                  </span>
                </button>

                {/* LOGOUT */}

                <button
                  type="button"
                  className="mobile-logout-btn"
                  onClick={
                    handleLogout
                  }
                >
                  <i className="fas fa-right-from-bracket" />

                  <span>
                    Logout
                  </span>
                </button>

              </div>
            )}

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

            {!user ? (
              <>
                {/* LOGIN */}

                <button
                  type="button"
                  className="nav-login-btn"
                  onClick={handleLogin}
                >
                  <i className="fas fa-right-to-bracket" />

                  <span>
                    Login
                  </span>
                </button>

                {/* SIGN UP */}

                <button
                  type="button"
                  className="nav-signup-btn"
                  onClick={handleSignup}
                >
                  <i className="fas fa-user-plus" />

                  <span>
                    Sign Up
                  </span>
                </button>
              </>
            ) : (

              /* =================================================
                 USER PROFILE
              ================================================= */

              <div
                className="nav-profile-wrapper"
                ref={profileRef}
              >

                {/* PROFILE BUTTON */}

                <button
                  type="button"
                  className={`nav-profile-btn ${
                    profileOpen
                      ? "profile-active"
                      : ""
                  }`}
                  onClick={() =>
                    setProfileOpen(
                      (value) =>
                        !value
                    )
                  }
                  aria-label="Open user menu"
                  aria-expanded={
                    profileOpen
                  }
                >

                  {/* AVATAR */}

                  <span className="nav-user-avatar">
                    {getUserInitial()}
                  </span>

                  {/* NAME */}

                  <span className="nav-user-name">
                    {getFirstName()}
                  </span>

                  {/* ARROW */}

                  <i
                    className={`fas fa-chevron-down ${
                      profileOpen
                        ? "rotate"
                        : ""
                    }`}
                  />

                </button>

                {/* =================================================
                    PROFILE DROPDOWN
                ================================================= */}

                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      className="nav-profile-dropdown"

                      initial={{
                        opacity: 0,
                        y: -8,
                        scale: 0.96,
                      }}

                      animate={{
                        opacity: 1,
                        y: 0,
                        scale: 1,
                      }}

                      exit={{
                        opacity: 0,
                        y: -8,
                        scale: 0.96,
                      }}

                      transition={{
                        duration: 0.18,
                        ease: "easeOut",
                      }}
                    >

                      {/* =================================================
                          USER INFO
                      ================================================= */}

                      <div className="profile-user-info">

                        <div className="profile-large-avatar">
                          {getUserInitial()}
                        </div>

                        <div className="profile-user-details">

                          <strong>
                            {user.name}
                          </strong>

                          <span>
                            {user.email}
                          </span>

                        </div>

                      </div>

                      {/* DIVIDER */}

                      <div className="profile-divider" />

                      {/* =================================================
                          DASHBOARD
                      ================================================= */}

                      <button
                        type="button"
                        className="profile-menu-item"
                        onClick={
                          handleDashboard
                        }
                      >

                        <span className="profile-menu-icon">
                          <i className="fas fa-chart-line" />
                        </span>

                        <span>
                          <strong>
                            Dashboard
                          </strong>

                          <small>
                            Open your dashboard
                          </small>
                        </span>

                      </button>

                      {/* =================================================
                          LOGOUT
                      ================================================= */}

                      <button
                        type="button"
                        className="profile-menu-item profile-logout"
                        onClick={
                          handleLogout
                        }
                      >

                        <span className="profile-menu-icon">
                          <i className="fas fa-right-from-bracket" />
                        </span>

                        <span>
                          <strong>
                            Logout
                          </strong>

                          <small>
                            Sign out of your account
                          </small>
                        </span>

                      </button>

                    </motion.div>
                  )}
                </AnimatePresence>

              </div>
            )}

          </div>

          {/* =================================================
              THEME TOGGLE
          ================================================= */}

          <button
            type="button"
            className={`theme-toggle ${
              darkMode
                ? "dark"
                : "light"
            }`}
            onClick={() =>
              setDarkMode(
                (value) =>
                  !value
              )
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
                {darkMode
                  ? "☾"
                  : "☀"}
              </span>

            </span>

          </button>

          {/* =================================================
              MOBILE MENU
          ================================================= */}

          <button
            type="button"
            className={`menu-btn ${
              menuOpen
                ? "menu-open"
                : ""
            }`}
            onClick={() =>
              setMenuOpen(
                (value) =>
                  !value
              )
            }
            aria-label="Toggle navigation"
            aria-expanded={
              menuOpen
            }
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