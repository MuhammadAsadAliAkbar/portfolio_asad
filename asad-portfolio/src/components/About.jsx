import { motion } from "framer-motion";
import Asad from '../assets/Asa.png'
function About() {
  return (
    <section id="about" className="section about">
      <div className="container">
        {/* Section Heading */}
        <motion.div
          className="section-heading"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span>01</span>
          <h2>About Me</h2>
          <p>Get to know me</p>
        </motion.div>

        <div className="about-grid">
          {/* ================= IMAGE SIDE ================= */}
          <motion.div
            className="about-image"
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="about-visual">
              {/* Glow */}
              <div className="about-glow" />

              {/* Decorative Rings */}
              <div className="about-ring ring-one" />
              <div className="about-ring ring-two" />

              {/* Main Card */}
              {/* <div className="about-image-box"> */}
                {/* <div className="code-window"> */}
                  {/* <div className="window-header">
                    <span />
                    <span />
                    <span />
                  </div> */}

                  {/* <div className="code-content">
                    <p>
                      <span className="code-purple">const</span>{" "}
                      <span className="code-blue">developer</span> = {"{"}
                    </p>

                    <p className="indent">
                      <span className="code-key">name:</span>{" "}
                      <span className="code-green">
                        "Asad Ali"
                      </span>
                    </p>

                    <p className="indent">
                      <span className="code-key">role:</span>{" "}
                      <span className="code-green">
                        "Full Stack Developer"
                      </span>
                    </p>

                    <p className="indent">
                      <span className="code-key">stack:</span>{" "}
                      <span className="code-green">
                        "MERN"
                      </span>
                    </p>

                    <p className="indent">
                      <span className="code-key">passion:</span>{" "}
                      <span className="code-green">
                        "Building"
                      </span>
                    </p>

                    <p>{"};"}</p>

                    <div className="code-cursor">|</div>
                  </div> */}
                {/* </div> */}
              {/* </div> */}

              <div className="about-profile-image">
                <img
                  src={Asad}
                  alt="Muhammad Asad Ali Akbar"
                />
              </div>

              {/* Floating Cards */}
              <div className="floating-card card-react">
                <i className="fab fa-react" />
                <span>React</span>
              </div>

              <div className="floating-card card-node">
                <i className="fab fa-node-js" />
                <span>Node.js</span>
              </div>

              <div className="floating-card card-mongo">
                <i className="fas fa-database" />
                <span>MongoDB</span>
              </div>
            </div>
          </motion.div>

          {/* ================= CONTENT SIDE ================= */}
          <motion.div
            className="about-content"
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <span className="small-title">
              <span className="title-line" />
              WHO I AM
            </span>

            <h3>
              I turn ideas into
              <span> digital experiences.</span>
            </h3>

            <p className="about-description">
              I’m a Senior Full Stack / MERN Stack Developer with 5+ years of experience, specializing in building scalable web applications, enterprise dashboards, REST APIs, and modern software solutions.
            </p>

            <p className="about-description">
             My expertise includes React.js, Next.js, Angular, Node.js, Express.js, NestJS, MongoDB, PostgreSQL, Redis, Docker, Kafka, Elasticsearch, and AI technologies. I focus on writing clean, secure, high-performance code and delivering reliable solutions that create real business value.
            </p>

            {/* Info Cards */}
            <div className="about-info">
              <div className="info-item">
                <div className="info-icon">
                  <i className="fas fa-user" />
                </div>

                <div>
                  <strong>Name</strong>
                  <span>Muhammad Asad Ali Akbar</span>
                </div>
              </div>

              <div className="info-item">
                <div className="info-icon">
                  <i className="fas fa-code" />
                </div>

                <div>
                  <strong>Role</strong>
                  <span>Full Stack Developer</span>
                </div>
              </div>

              <div className="info-item">
                <div className="info-icon">
                  <i className="fas fa-layer-group" />
                </div>

                <div>
                  <strong>Stack</strong>
                  <span>MERN Stack</span>
                </div>
              </div>

              <div className="info-item">
                <div className="info-icon">
                  <i className="fas fa-circle-check" />
                </div>

                <div>
                  <strong>Availability</strong>
                  <span className="available">
                    Open to opportunities
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Stats */}
            <div className="about-stats">
              <div>
                <strong>5+</strong>
                <span>Years Experience</span>
              </div>

              <div>
                <strong>50+</strong>
                <span>Projects Completed</span>
              </div>

              <div>
                <strong>10+</strong>
                <span>Technologies</span>
              </div>
            </div>
            <div className="about-actions">
              <a
                href="/Muhammad_Asad_Mern.pdf"
                className="resume-btn"
              >
                <i className="fas fa-download" />
                <span>Download Resume</span>
                <i className="fas fa-arrow-right arrow-icon" />
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default About;