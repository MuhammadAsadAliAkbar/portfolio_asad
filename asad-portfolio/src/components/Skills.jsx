import { motion } from "framer-motion";

/* =========================================================
   SKILLS DATA
========================================================= */

const skills = [
  // =========================
  // SKILLS
  // =========================
  {
    category: "Skills",
    items: [
      ["HTML5", "fab fa-html5", 95],
      ["CSS3", "fab fa-css3-alt", 90],
      ["JavaScript", "fab fa-js", 90],
      ["Python", "fab fa-python", 80],
      ["ECMAScript", "fas fa-file-code", 90],
      ["TypeScript", "fas fa-code", 88],
      ["REST APIs", "fas fa-server", 92],
      ["Socket.IO", "fas fa-plug", 88],
      ["WebSocket", "fas fa-bolt", 85],
      ["gRPC", "fas fa-network-wired", 80],
    ],
  },

  // =========================
  // FRAMEWORKS
  // =========================
  {
    category: "Frameworks",
    items: [
      ["React.js", "fab fa-react", 90],
      ["Next.js", "fas fa-layer-group", 88],
      ["Angular", "fab fa-angular", 85],
      ["Node.js", "fab fa-node-js", 88],
      ["Express.js", "fas fa-server", 88],
      ["NestJS", "fas fa-cubes", 85],
      ["Flask", "fas fa-flask", 80],
      ["FastAPI", "fas fa-bolt", 85],
      ["Numpy", "fas fa-calculator", 80],
      ["Pandas", "fas fa-table", 85],

    ],
  },

  // =========================
  // DATABASES
  // =========================
  {
    category: "Databases",
    items: [
      ["MongoDB", "fas fa-database", 85],
      ["PostgreSQL", "fas fa-database", 85],
      ["MySQL", "fas fa-database", 85],
      ["SQL", "fas fa-database", 88],
      ["Redis", "fas fa-memory", 82],
    ],
  },

  // =========================
  // ORM / ODM
  // =========================
  {
    category: "ORM / ODM",
    items: [
      ["TypeORM", "fas fa-database", 82],
      ["Prisma", "fas fa-database", 85],
      ["Sequelize", "fas fa-database", 80],
      ["Knex.js", "fas fa-database", 82]
    ],
  },

  // =========================
  // DEVOPS
  // =========================
  {
    category: "DevOps & Infrastructure",
    items: [
      ["Docker", "fab fa-docker", 80],
      ["CI/CD Pipelines", "fas fa-code-branch", 85],
    ],
  },

  // =========================
  // AI
  // =========================
  {
    category: "AI",
    items: [
      ["OpenAI", "fas fa-robot", 90],
      ["Gemini", "fas fa-wand-magic-sparkles", 88],
      ["Claude", "fas fa-robot", 88],
      ["Grok", "fas fa-robot", 88],
      ["ChatGPT", "fas fa-comments", 95],
      ["LLM", "fas fa-brain", 88],
      ["RAG", "fas fa-database", 88],
      ["LangChain", "fas fa-link", 85],
      ["LangGraph", "fas fa-project-diagram", 82],
      ["Agentic AI", "fas fa-brain", 85],
      ["AI Agents", "fas fa-robot", 88],
      ["AI Assistants", "fas fa-comments", 90],
    ],
  },

  // =========================
  // TOOLS
  // =========================
  {
    category: "Tools",
    items: [
      ["Postman", "fas fa-paper-plane", 92],
      ["Swagger", "fas fa-book", 88],
      ["VS Code", "fas fa-code", 95],
      ["Cursor", "fas fa-terminal", 90],
    ],
  },
];

/* =========================================================
   ANIMATION VARIANTS
========================================================= */

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 35,
    scale: 0.96,
  },

  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

/* =========================================================
   STAT COMPONENT
========================================================= */

function Stat({ number, suffix, text }) {
  return (
    <div className="stat">
      <div className="stat-number">
        <span>{number}</span>
        <small>{suffix}</small>
      </div>

      <p>{text}</p>
    </div>
  );
}

/* =========================================================
   SKILLS COMPONENT
========================================================= */

function Skills() {
  return (
    <section id="skills" className="section skills">

      <div className="container">

        {/* =================================================
            SECTION HEADING
        ================================================= */}

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
          <span>02</span>

          <h2>My Skills</h2>

          <p>
            Technologies, frameworks, tools and AI technologies
            I work with
          </p>
        </motion.div>

        {/* =================================================
            SKILL CATEGORIES
        ================================================= */}

        <div className="skills-categories">

          {skills.map((category, categoryIndex) => (
            <motion.div
              className="skill-category"
              key={category.category}
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
                amount: 0.1,
              }}
              transition={{
                duration: 0.6,
                delay: categoryIndex * 0.08,
              }}
            >

              {/* =========================================
                  CATEGORY HEADING
              ========================================= */}

              <div className="skill-category-heading">

                <span className="category-number">
                  {String(categoryIndex + 1).padStart(2, "0")}
                </span>

                <h3>{category.category}</h3>

                <div className="category-line" />

              </div>

              {/* =========================================
                  SKILLS GRID
              ========================================= */}

              <motion.div
                className="skills-grid"
                variants={containerVariants}
                initial="hidden"
                whileInView="show"
                viewport={{
                  once: true,
                  amount: 0.15,
                }}
              >

                {category.items.map(
                  ([name, icon, percentage]) => (

                    <motion.div
                      className="skill-card"
                      key={name}
                      variants={cardVariants}
                      whileHover={{
                        y: -8,
                        scale: 1.02,
                      }}
                      transition={{
                        duration: 0.25,
                      }}
                    >

                      {/* =========================
                          GLOW
                      ========================= */}

                      <div className="skill-glow" />

                      {/* =========================
                          ICON
                      ========================= */}

                      <div className="skill-icon">
                        <i className={icon} />
                      </div>

                      {/* =========================
                          TITLE
                      ========================= */}

                      <div className="skill-title">

                        <div>
                          <h3>{name}</h3>

                          <span>
                            Professional
                          </span>
                        </div>

                        <strong>
                          {percentage}%
                        </strong>

                      </div>

                      {/* =========================
                          PROGRESS
                      ========================= */}

                      <div className="progress">

                        <motion.span
                          initial={{
                            width: 0,
                          }}
                          whileInView={{
                            width: `${percentage}%`,
                          }}
                          transition={{
                            duration: 1.4,
                            delay: 0.2,
                            ease: "easeOut",
                          }}
                          viewport={{
                            once: true,
                          }}
                        />

                      </div>

                      {/* =========================
                          SKILL LEVEL
                      ========================= */}

                      <div className="skill-level">

                        <span>
                          Skill Level
                        </span>

                        <span>
                          {percentage >= 90
                            ? "Advanced"
                            : percentage >= 80
                            ? "Strong"
                            : "Intermediate"}
                        </span>

                      </div>

                    </motion.div>
                  )
                )}

              </motion.div>

            </motion.div>
          ))}

        </div>

        {/* =================================================
            STATS
        ================================================= */}

        <motion.div
          className="skills-stats"
          initial={{
            opacity: 0,
            y: 40,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.2,
          }}
          transition={{
            duration: 0.7,
            delay: 0.2,
          }}
        >

          {/* EXPERIENCE */}

          <Stat
            number={5}
            suffix="+"
            text="Years of Experience"
          />

          {/* TECHNOLOGIES */}

          <Stat
            number={39}
            suffix="+"
            text="Technologies"
          />

          {/* PROJECTS */}

          <Stat
            number={100}
            suffix="+"
            text="Projects Completed"
          />

          {/* CLIENT */}

          <Stat
            number={95}
            suffix="%"
            text="Client Satisfaction"
          />

        </motion.div>

      </div>

    </section>
  );
}

export default Skills;