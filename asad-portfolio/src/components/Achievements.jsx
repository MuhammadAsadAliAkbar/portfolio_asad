import { motion } from "framer-motion";


const achievements = [
  {
    icon: "fas fa-code",
    number: "100+",
    title: "Projects Completed",
    text: "Successfully delivered multiple web and backend projects.",
  },
  {
    icon: "fas fa-users",
    number: "50+",
    title: "Happy Clients",
    text: "Worked with clients to build reliable digital solutions.",
  },
  {
    icon: "fas fa-layer-group",
    number: "10+",
    title: "Technologies",
    text: "Experience with modern frontend, backend and DevOps tools.",
  },
  {
    icon: "fas fa-award",
    number: "5+",
    title: "Years Experience",
    text: "Professional experience in full-stack development.",
  },
];

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 40,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

function Achievements() {
  return (
    <section id="achievements" className="section achievements">
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
          <span>06</span>

          <h2>Achievements</h2>

          <p>Milestones I've reached</p>
        </motion.div>

        {/* =========================
            ACHIEVEMENTS
        ========================= */}

        <motion.div
          className="achievements-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{
            once: true,
            amount: 0.15,
          }}
        >
          {achievements.map((item, index) => (
            <motion.div
              className="achievement-card"
              key={item.title}
              variants={cardVariants}
              whileHover={{
                y: -10,
              }}
            >

              {/* Decorative Number */}

              <div className="achievement-index">
                0{index + 1}
              </div>

              {/* Background Glow */}

              <div className="achievement-glow" />

              {/* Icon */}

              <motion.div
                className="achievement-icon"
                whileHover={{
                  scale: 1.12,
                  rotate: 6,
                }}
              >
                <i className={item.icon} />
              </motion.div>

              {/* Number */}

              <strong className="achievement-number">
                {item.number}
              </strong>

              {/* Title */}

              <h3>{item.title}</h3>

              {/* Description */}

              <p>{item.text}</p>

              {/* Bottom Line */}

              <div className="achievement-line">
                <span />
              </div>

            </motion.div>
          ))}
        </motion.div>

        {/* =========================
            FOOTER
        ========================= */}

        <motion.div
          className="achievements-footer"
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
          <i className="fas fa-chart-line" />

          <span>
            Every milestone represents another step forward.
          </span>
        </motion.div>

      </div>
    </section>
  );
}

export default Achievements;