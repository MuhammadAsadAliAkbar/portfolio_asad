import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Asad from '../assets/Asa.png'
// import Asad from '../assets/As.jpeg'

const roles = [
  "Full Stack Developer",
  "MERN Stack Developer",
  "React Developer",
  "Node.js Developer",
  "Software Engineer",
];

function Hero() {
  const [bubbles, setBubbles] = useState([]);

  /* =========================================================
     TYPEWRITER STATE
  ========================================================= */

  const [roleIndex, setRoleIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  /* =========================================================
     BUBBLES
  ========================================================= */

  useEffect(() => {
    const createBubbles = () => {
      const count = window.innerWidth < 768 ? 12 : 22;

      const newBubbles = Array.from(
        { length: count },
        (_, index) => ({
          id: index,
          left: Math.random() * 100,
          top: Math.random() * 100,
          size: Math.random() * 90 + 30,
          duration: Math.random() * 12 + 10,
          delay: Math.random() * 8,
        })
      );

      setBubbles(newBubbles);
    };

    createBubbles();

    window.addEventListener("resize", createBubbles);

    return () => {
      window.removeEventListener("resize", createBubbles);
    };
  }, []);

  /* =========================================================
     TYPEWRITER EFFECT
  ========================================================= */

  useEffect(() => {
    const currentRole = roles[roleIndex];

    let timeout;

    if (!isDeleting && displayText.length < currentRole.length) {
      timeout = setTimeout(() => {
        setDisplayText(
          currentRole.substring(0, displayText.length + 1)
        );
      }, 90);
    }

    else if (
      !isDeleting &&
      displayText.length === currentRole.length
    ) {
      timeout = setTimeout(() => {
        setIsDeleting(true);
      }, 1800);
    }

    else if (
      isDeleting &&
      displayText.length > 0
    ) {
      timeout = setTimeout(() => {
        setDisplayText(
          currentRole.substring(0, displayText.length - 1)
        );
      }, 50);
    }

    else if (
      isDeleting &&
      displayText.length === 0
    ) {
      setIsDeleting(false);

      setRoleIndex(
        (prev) => (prev + 1) % roles.length
      );
    }

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, roleIndex]);

  /* =========================================================
     SCROLL
  ========================================================= */

  const scrollDown = () => {
    document.getElementById("about")?.scrollIntoView({
      behavior: "smooth",
    });
  };

  return (
    <section id="home" className="hero section">

      {/* =====================================================
          BUBBLES
      ===================================================== */}

      <div className="hero-bubbles">
        {bubbles.map((bubble) => (
          <span
            key={bubble.id}
            className="hero-bubble"
            style={{
              left: `${bubble.left}%`,
              top: `${bubble.top}%`,
              width: `${bubble.size}px`,
              height: `${bubble.size}px`,
              animationDuration: `${bubble.duration}s`,
              animationDelay: `-${bubble.delay}s`,
            }}
          />
        ))}
      </div>

      {/* =====================================================
          HERO CONTAINER
      ===================================================== */}

      <div className="hero-container">

        {/* ===================================================
            HERO CONTENT
        =================================================== */}

        <motion.div
          className="hero-content"
          initial={{
            opacity: 0,
            x: -60,
          }}
          animate={{
            opacity: 1,
            x: 0,
          }}
          transition={{
            duration: 0.8,
          }}
        >

          <span className="eyebrow">
            HELLO, I'M
          </span>

          <h1>
            Muhammad Asad
            <span>Ali Akbar</span>
          </h1>

          {/* =================================================
              TYPEWRITER
          ================================================= */}

          <h2 className="hero-role">
            <span className="typewriter-text">
              {displayText}
            </span>

            <span className="typewriter-cursor">
              |
            </span>
          </h2>

          <p>
           Senior Full Stack / MERN Stack Developer with 5+ years of experience building scalable web applications, enterprise solutions, REST APIs, and modern AI-powered systems.

          </p>

          <p>
                       I turn complex ideas into secure, high-performance, and production-ready software using modern technologies like React, Next.js, Node.js, Angular, MongoDB, and AI.

          </p>

          {/* =================================================
              BUTTONS
          ================================================= */}

          <div className="hero-buttons">

            <a
              href="#about"
              className="btn btn-primary"
            >
              About Me
              <i className="fas fa-arrow-down" />
            </a>

            <a
              href="/Muhammad_Asad_Mern.pdf"
              className="btn btn-outline"
              target="_blank"
              rel="noreferrer"
            >
              View Resume
            </a>

          </div>

          {/* =================================================
              SOCIAL LINKS
          ================================================= */}

          <div className="social-links">

            <a
              href="https://github.com/MuhammadAsadAliAkbar"
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
            >
              <i className="fab fa-github" />
            </a>

            <a
              href="https://www.linkedin.com/in/asad-akbar-1890892b2/"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
            >
              <i className="fab fa-linkedin-in" />
            </a>

            <a
              href="mailto:crypton.futuremedia1989@gmail.com"
              aria-label="Email"
            >
              <i className="fas fa-envelope" />
            </a>

          </div>

        </motion.div>

        {/* ===================================================
            HERO VISUAL
        =================================================== */}

        <motion.div
          className="hero-visual"
          initial={{
            opacity: 0,
            scale: 0.7,
          }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          transition={{
            duration: 1,
          }}
        >

          <div className="profile-orbit orbit-one" />

          <div className="profile-orbit orbit-two" />

          <div className="profile-card">

            <div className="profile-glow" />

            {/* <div className="profile-code">
              <span>const</span> developer = {"{"}
              <br />

              &nbsp;&nbsp;name:{" "}
              <b>"Asad Ali"</b>,
              <br />

              &nbsp;&nbsp;role:{" "}
              <b>"Full Stack"</b>,
              <br />

              &nbsp;&nbsp;passion:{" "}
              <b>"Building"</b>
              <br />

              {"}"};
            </div> */}

            <div className="profile-image">
              <img src={Asad} alt="Asad Ali" />
            </div>

          </div>

        </motion.div>

      </div>

      {/* =====================================================
          SCROLL INDICATOR
      ===================================================== */}

      <button
        className="mouse-scroll"
        onClick={scrollDown}
        aria-label="Scroll to About section"
      >
        <span className="mouse-icon">
          <span className="mouse-wheel"></span>
        </span>

        <i className="fas fa-chevron-down"></i>
      </button>

    </section>
  );
}

export default Hero;