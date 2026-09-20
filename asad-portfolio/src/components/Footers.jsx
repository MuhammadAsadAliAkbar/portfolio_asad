import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import "../css/Footer.css";

function Footers() {
  const currentYear = new Date().getFullYear();

  const [showBackToTop, setShowBackToTop] = useState(false);

const [isChatbotOpen, setIsChatbotOpen] = useState(false);

const toggleChatbot = () => {
  setIsChatbotOpen(prev => {
    const newState = !prev;
    
    if (newState) {
      openChatbot();   // chatbot open karo
    } else {
      closeChatbot();  // chatbot close karo
    }
    
    return newState;
  });
};

const closeChatbot = () => {
  window.dispatchEvent(
    new CustomEvent("close-chatbot")
  );
};

  /* =================================================
     BACK TO TOP
  ================================================= */

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  /* =================================================
     OPEN CHATBOT EVENT
  ================================================= */

  const openChatbot = () => {
    window.dispatchEvent(
      new CustomEvent("open-chatbot")
    );
  };

   const openMessage = () => {
    window.dispatchEvent(
      new CustomEvent("open-message-chat")
    );
  };

  return (
    <footer className="footer">

      <div className="container">

        {/* =================================================
            FOOTER GRID
        ================================================= */}

        <div className="footer-grid">

          {/* =================================================
              LEFT - BRAND
          ================================================= */}

          <motion.div
            className="footer-brand"
            initial={{
              opacity: 0,
              y: 30,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              duration: 0.6,
            }}
          >

            {/* LOGO */}

            <a
              href="#home"
              className="footer-logo"
            >
              <span className="footer-ma-logo">

                <span className="footer-ma-m">
                  M
                </span>

                <span className="footer-ma-a">
                  A
                </span>

              </span>
            </a>


            {/* DESCRIPTION */}

            <p className="footer-description">
              Senior Full Stack Developer passionate about
              building modern, scalable and high-performance
              web applications.
            </p>


            {/* SOCIAL LINKS */}

            <div className="footer-socials">

              {/* GITHUB */}

              <a
                href="https://github.com/MuhammadAsadAliAkbar"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
                title="GitHub"
              >
                <i className="fab fa-github"></i>
              </a>


              {/* LINKEDIN */}

              <a
                href="https://www.linkedin.com/in/asad-akbar-1890892b2/"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                title="LinkedIn"
              >
                <i className="fab fa-linkedin-in"></i>
              </a>


              {/* EMAIL */}

              <a
                href="mailto:crypton.futuremedia1989@gmail.com"
                aria-label="Email"
                title="Email"
              >
                <i className="fas fa-envelope"></i>
              </a>

            </div>

          </motion.div>


          {/* =================================================
              QUICK LINKS
          ================================================= */}

          <motion.div
            className="footer-links"
            initial={{
              opacity: 0,
              y: 30,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              duration: 0.6,
              delay: 0.1,
            }}
          >

            <h3>
              Quick Links
            </h3>

            <ul>

              <li>
                <a href="#home">
                  <i className="fas fa-chevron-right"></i>
                  Home
                </a>
              </li>

              <li>
                <a href="#about">
                  <i className="fas fa-chevron-right"></i>
                  About
                </a>
              </li>

              <li>
                <a href="#skills">
                  <i className="fas fa-chevron-right"></i>
                  Skills
                </a>
              </li>

              <li>
                <a href="#projects">
                  <i className="fas fa-chevron-right"></i>
                  Projects
                </a>
              </li>

              <li>
                <a href="#experience">
                  <i className="fas fa-chevron-right"></i>
                  Experience
                </a>
              </li>

              <li>
                <a href="#education">
                  <i className="fas fa-chevron-right"></i>
                  Education
                </a>
              </li>

              <li>
                <a href="#contact">
                  <i className="fas fa-chevron-right"></i>
                  Contact
                </a>
              </li>

            </ul>

          </motion.div>


          {/* =================================================
              CONTACT INFO
          ================================================= */}

          <motion.div
            className="footer-contact"
            initial={{
              opacity: 0,
              y: 30,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              duration: 0.6,
              delay: 0.2,
            }}
          >

            <h3>
              Contact Info
            </h3>


            {/* EMAIL */}

            <div className="footer-contact-item">

              <div className="footer-contact-icon">
                <i className="fas fa-envelope"></i>
              </div>

              <div>

                <span>
                  Email
                </span>

                <a href="mailto:crypton.futuremedia1989@gmail.com">
                  crypton.futuremedia1989@gmail.com
                </a>

              </div>

            </div>


            {/* PHONE */}

            <div className="footer-contact-item">

              <div className="footer-contact-icon">
                <i className="fas fa-phone"></i>
              </div>

              <div>

                <span>
                  Phone
                </span>

                <a href="tel:+923222382819">
                  +92 322 2382819
                </a>

              </div>

            </div>


            {/* LOCATION */}

            <div className="footer-contact-item">

              <div className="footer-contact-icon">
                <i className="fas fa-map-marker-alt"></i>
              </div>

              <div>

                <span>
                  Location
                </span>

                <p>
                  Karachi, Pakistan
                </p>

              </div>

            </div>

          </motion.div>

        </div>


        {/* =================================================
            FOOTER BOTTOM
        ================================================= */}

        <div className="footer-bottom">

          <p>
            © {currentYear}{" "}

            <span>
              Muhammad Asad Ali Akbar
            </span>

            . All Rights Reserved.
          </p>

          <p className="footer-built">

            Built with{" "}

            <i className="fab fa-react"></i>{" "}

            React.js

          </p>

        </div>

      </div>


      {/* =================================================
          PREMIUM FLOATING ACTIONS
      ================================================= */}

      <div className="premium-floating-actions">


        {/* =================================================
            WHATSAPP
        ================================================= */}

        <motion.a
          href="https://wa.me/923222382819"
          target="_blank"
          rel="noreferrer"
          className="premium-float-btn premium-whatsapp"
          aria-label="Chat on WhatsApp"
          title="Chat on WhatsApp"
          whileHover={{
            scale: 1.08,
            y: -4,
          }}
          whileTap={{
            scale: 0.94,
          }}
        >

          <span className="premium-btn-glow"></span>

          <span className="premium-btn-inner">

            <i className="fab fa-whatsapp"></i>

          </span>

          <span className="premium-float-tooltip">

            <strong>
              WhatsApp
            </strong>

            <small>
              Let's chat
            </small>

          </span>

        </motion.a>


        {/* =================================================
            MESSAGE
        ================================================= */}

       <motion.a
  href="mailto:crypton.futuremedia1989@gmail.com"
  className="premium-float-btn premium-message"
  aria-label="Send Message"
  title="Send Message"
  onClick={openMessage}
  whileHover={{
    scale: 1.1,
    y: -5,
  }}
  whileTap={{
    scale: 0.94,
  }}
>
  {/* Animated Glow */}
  <span className="premium-btn-glow"></span>

  {/* Pulse Ring */}
  <span className="message-pulse-ring"></span>

  {/* Main Button */}
  <span className="premium-btn-inner">
    <i className="fas fa-comment-dots"></i>
  </span>

  {/* Notification Dot */}
  <span className="message-notification-dot"></span>

  {/* Tooltip */}
  <span className="premium-float-tooltip">
    <strong>
      Send Message
    </strong>

    <small>
      Let's connect
    </small>
  </span>
</motion.a>


        {/* =================================================
            AI CHATBOT
        ================================================= */}

        {/* <motion.button
          type="button"
          className="premium-float-btn premium-chatbot"
          aria-label="Open Chatbot"
          title="Chatbot"
          onClick={openChatbot}
          whileHover={{
            scale: 1.08,
            y: -4,
          }}
          whileTap={{
            scale: 0.94,
          }}
        >

          <span className="premium-btn-glow"></span>

          <span className="premium-btn-inner">

            <i className="fas fa-robot"></i>

          </span>

          <span className="premium-float-tooltip">

            <strong>
              AI Assistant
            </strong>

            <small>
              Ask me anything
            </small>

          </span>

        </motion.button> */}

<motion.button
  type="button"
  className="premium-float-btn premium-chatbot"
  aria-label={isChatbotOpen ? "Close Chatbot" : "Open Chatbot"}
  title={isChatbotOpen ? "Close" : "Chatbot"}
  onClick={toggleChatbot}
  whileHover={{
    scale: 1.08,
    y: -4,
  }}
  whileTap={{
    scale: 0.94,
  }}
>
  <span className="premium-btn-glow"></span>

  <span className="premium-btn-inner">
    <i className={`fas ${isChatbotOpen ? "fa-chevron-down" : "fa-robot"}`}></i>
  </span>

  <span className="premium-float-tooltip">
    <strong>
      {isChatbotOpen ? "Close Assistant" : "AI Assistant"}
    </strong>
    <small>
      {isChatbotOpen ? "Hide chat" : "Ask me anything"}
    </small>
  </span>
</motion.button>

      </div>


      {/* =================================================
          EXISTING BACK TO TOP
          UNCHANGED
      ================================================= */}

      {showBackToTop && (

        <motion.a
          href="#home"
          className="back-to-top"
          aria-label="Back to top"
          initial={{
            opacity: 0,
            scale: 0.5,
            y: 20,
          }}
          animate={{
            opacity: 1,
            scale: 1,
            y: 0,
          }}
          exit={{
            opacity: 0,
            scale: 0.5,
          }}
          whileHover={{
            y: -5,
          }}
          whileTap={{
            scale: 0.9,
          }}
        >

          <i className="fas fa-arrow-up"></i>

        </motion.a>

      )}

    </footer>
  );
}

export default Footers;