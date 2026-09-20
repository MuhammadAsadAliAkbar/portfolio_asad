import { motion } from "framer-motion";

const educationData = [
   {
    year: "Professional Certification",
    degree: "Professional Certification in Software Engineering",
    institute: "Sir Syed University of Engineering & Technology",
    description:
      "Completed professional certification focused on software engineering, programming concepts, application development and modern technology practices.",
    icon: "fas fa-certificate",
    tags: [
      "Software Engineering",
      "Programming",
      "Application Development",
      "Technology",
    ],
  },

  {
    year: "Bachelor of Commerce",
    degree: "Bachelor of Commerce (B.Com)",
    institute: "University / College",
    description:
      "Studied commerce, accounting, business management, economics and fundamental business practices.",
      icon: "fas fa-graduation-cap",
    tags: [
      "Commerce",
      "Accounting",
      "Business",
      "Management",
    ],
  },

  {
    year: "Professional Development",
    degree: "Full Stack Web Development",
    institute: "Professional Training & Self Learning",
    description:
      "Hands-on learning and professional experience with modern frontend, backend, database and DevOps technologies.",
    icon: "fas fa-code",
    tags: [
      "React.js",
      "Node.js",
      "MongoDB",
      "Docker",
    ],
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

function Education() {
  return (
    <section id="education" className="section education">
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
          <span>04</span>

          <h2>My Education</h2>

          <p>My academic & professional journey</p>
        </motion.div>

        {/* =========================
            TIMELINE
        ========================= */}

        <motion.div
          className="education-timeline"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{
            once: true,
            amount: 0.15,
          }}
        >
          {educationData.map((education, index) => (
            <motion.div
              className={`education-item ${
                index % 2 === 0 ? "timeline-left" : "timeline-right"
              }`}
              key={index}
              variants={itemVariants}
            >
              {/* Timeline Number */}
              <div className="education-number">
                0{index + 1}
              </div>

              {/* Icon */}
              <motion.div
                className="education-icon"
                whileHover={{
                  scale: 1.12,
                  rotate: 5,
                }}
              >
                <i className={education.icon} />
              </motion.div>

              {/* Content */}
              <motion.div
                className="education-content"
                whileHover={{
                  y: -6,
                }}
                transition={{
                  duration: 0.25,
                }}
              >
                {/* Top */}
                <div className="education-top">
                  <span className="education-year">
                    {education.year}
                  </span>

                  <span className="education-status">
                    <span className="status-dot" />
                    Completed
                  </span>
                </div>

                {/* Degree */}
                <h3>{education.degree}</h3>

                {/* Institute */}
                <h4>
                  <i className="fas fa-building-columns" />
                  {education.institute}
                </h4>

                {/* Description */}
                <p>{education.description}</p>

                {/* Tags */}
                <div className="education-tags">
                  {education.tags.map((tag, tagIndex) => (
                    <motion.span
                      key={tagIndex}
                      whileHover={{
                        scale: 1.05,
                      }}
                    >
                      {tag}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom */}
        <motion.div
          className="education-footer"
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
          <i className="fas fa-laptop-code" />

          <span>
            Continuous learning is part of my development journey.
          </span>
        </motion.div>

      </div>
    </section>
  );
}

export default Education;