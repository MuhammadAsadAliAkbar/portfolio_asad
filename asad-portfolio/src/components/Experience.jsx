import { motion } from "framer-motion";

const experience = [
{
  year: "2023 — 2026",
  title: "Senior MERN Stack Developer",
  company: "QBS.CO",
  description:
    "Built scalable enterprise applications and SaaS solutions using React, Node.js, Express.js and MongoDB. Delivered high-performance systems supporting 50K+ users and improved API performance by up to 60%.",
  icon: "fas fa-code",
  skills: ["React", "Node.js", "Express.js", "MongoDB"],
},

{
  year: "2020 — 2022",
  title: "Associate Frontend Developer",
  company: "Bitwits",
  description:
    "Developed responsive web applications and reusable React components for client projects, improving usability, performance and overall user experience.",
  icon: "fas fa-laptop-code",
  skills: ["React", "JavaScript", "REST API", "Responsive UI"],
},
];

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 50,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: "easeOut",
    },
  },
};

function Experience() {
  return (
    <section id="experience" className="section experience">
      <div className="container">

        {/* =========================
            SECTION HEADING
        ========================= */}

        <motion.div
          className="section-heading"
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
          <span>03</span>

          <h2>Experience</h2>

          <p>My professional journey</p>
        </motion.div>

        {/* =========================
            TIMELINE
        ========================= */}

        <motion.div
          className="experience-timeline"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{
            once: true,
            amount: 0.15,
          }}
        >
          {experience.map((item, index) => (
            <motion.div
              className={`experience-item ${
                index % 2 === 0
                  ? "experience-left"
                  : "experience-right"
              }`}
              key={item.title}
              variants={itemVariants}
            >

              {/* Timeline Dot */}

              <motion.div
                className="experience-dot"
                whileHover={{
                  scale: 1.25,
                }}
              >
                <span />
              </motion.div>

              {/* Decorative Number */}

              <div className="experience-number">
                0{index + 1}
              </div>

              {/* Experience Card */}

              <motion.div
                className="experience-card"
                whileHover={{
                  y: -7,
                }}
                transition={{
                  duration: 0.25,
                }}
              >
                {/* Card Header */}

                <div className="experience-header">

                  <div className="experience-date">
                    <i className="far fa-calendar-alt" />

                    <span>{item.year}</span>
                  </div>

                  {/* {index === 0 && (
                    <span className="current-badge">
                      <span className="current-dot" />
                      Current
                    </span>
                  )} */}

                </div>

                {/* Icon + Title */}

                <div className="experience-title-row">

                  <motion.div
                    className="experience-icon"
                    whileHover={{
                      scale: 1.1,
                      rotate: 5,
                    }}
                  >
                    <i className={item.icon} />
                  </motion.div>

                  <div>
                    <h3>{item.title}</h3>

                    <h4>
                      <i className="fas fa-building" />

                      {item.company}
                    </h4>
                  </div>

                </div>

                {/* Description */}

                <p className="experience-description">
                  {item.description}
                </p>

                {/* Skills */}

                <div className="experience-skills">
                  {item.skills.map((skill) => (
                    <span key={skill}>
                      {skill}
                    </span>
                  ))}
                </div>

              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* =========================
            FOOTER
        ========================= */}

        <motion.div
          className="experience-footer"
          initial={{
            opacity: 0,
            y: 25,
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
            delay: 0.3,
          }}
        >
          <i className="fas fa-rocket" />

          <span>
            Building, learning and growing with every project.
          </span>
        </motion.div>

      </div>
    </section>
  );
}

export default Experience;