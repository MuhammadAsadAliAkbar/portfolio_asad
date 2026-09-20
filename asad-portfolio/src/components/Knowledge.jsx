import { motion } from "framer-motion";

const knowledge = [
  {
    name: "Frontend",
    percentage: 95,
    icon: "fas fa-laptop-code",
  },
  {
    name: "Backend",
    percentage: 92,
    icon: "fas fa-server",
  },
  {
    name: "Database",
    percentage: 90,
    icon: "fas fa-database",
  },
  {
    name: "React / JS",
    percentage: 95,
    icon: "fab fa-react",
  },
  {
    name: "DevOps",
    percentage: 82,
    icon: "fab fa-docker",
  },
  {
    name: "Architecture",
    percentage: 85,
    icon: "fas fa-sitemap",
  },
];

const points = knowledge.length;
const center = 250;
const radius = 170;

const getPoint = (index, value = 100) => {
  const angle = (Math.PI * 2 * index) / points - Math.PI / 2;

  const r = (radius * value) / 100;

  return {
    x: center + Math.cos(angle) * r,
    y: center + Math.sin(angle) * r,
  };
};

const graphPoints = knowledge
  .map((item, index) => {
    const point = getPoint(index, item.percentage);

    return `${point.x},${point.y}`;
  })
  .join(" ");

function Knowledge() {
  return (
    <section id="knowledge" className="knowledge-graph-section">
      <div className="knowledge-graph-container">

        {/* =========================
            HEADING
        ========================= */}

        <motion.div
          className="knowledge-heading"
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
          }}
          transition={{
            duration: 0.8,
          }}
        >
          <span>TECHNICAL KNOWLEDGE</span>

          <h2>
            My Technical
            <strong> Knowledge.</strong>
          </h2>

          <p>
            A visual overview of my technical expertise
            across frontend, backend, databases and DevOps.
          </p>
        </motion.div>

        {/* =========================
            GRAPH AREA
        ========================= */}

        <motion.div
          className="knowledge-graph"
          initial={{
            opacity: 0,
            scale: 0.7,
            rotateX: 25,
          }}
          whileInView={{
            opacity: 1,
            scale: 1,
            rotateX: 0,
          }}
          viewport={{
            once: true,
            amount: 0.2,
          }}
          transition={{
            duration: 1,
            ease: "easeOut",
          }}
        >

          {/* Graph Glow */}

          <div className="graph-glow" />

          <svg
            viewBox="0 0 500 500"
            className="radar-svg"
          >

            {/* =========================
                RADAR GRID
            ========================= */}

            {[20, 40, 60, 80, 100].map((level) => {
              const polygon = knowledge
                .map((_, index) => {
                  const point = getPoint(index, level);

                  return `${point.x},${point.y}`;
                })
                .join(" ");

              return (
                <polygon
                  key={level}
                  points={polygon}
                  className="radar-grid"
                />
              );
            })}

            {/* =========================
                AXIS LINES
            ========================= */}

            {knowledge.map((_, index) => {
              const point = getPoint(index);

              return (
                <line
                  key={index}
                  x1={center}
                  y1={center}
                  x2={point.x}
                  y2={point.y}
                  className="radar-axis"
                />
              );
            })}

            {/* =========================
                GRAPH AREA
            ========================= */}

            <motion.polygon
              points={graphPoints}
              className="radar-area"
              initial={{
                opacity: 0,
                scale: 0,
              }}
              whileInView={{
                opacity: 1,
                scale: 1,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                duration: 1.5,
                delay: 0.4,
              }}
            />

            {/* =========================
                GRAPH BORDER
            ========================= */}

            <motion.polygon
              points={graphPoints}
              className="radar-line"
              initial={{
                opacity: 0,
              }}
              whileInView={{
                opacity: 1,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                duration: 1,
                delay: 0.6,
              }}
            />

            {/* =========================
                DATA POINTS
            ========================= */}

            {knowledge.map((item, index) => {
              const point = getPoint(index, item.percentage);

              return (
                <motion.circle
                  key={item.name}
                  cx={point.x}
                  cy={point.y}
                  r="7"
                  className="radar-point"
                  initial={{
                    opacity: 0,
                    scale: 0,
                  }}
                  whileInView={{
                    opacity: 1,
                    scale: 1,
                  }}
                  viewport={{
                    once: true,
                  }}
                  transition={{
                    duration: 0.5,
                    delay: 0.8 + index * 0.1,
                  }}
                />
              );
            })}
          </svg>

          {/* =========================
              CENTER
          ========================= */}

          <motion.div
            className="graph-center"
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <div className="graph-center-inner">
              <i className="fas fa-code" />

              <span>FULL STACK</span>

              <strong>DEVELOPER</strong>
            </div>
          </motion.div>

          {/* =========================
              LABELS
          ========================= */}

          {knowledge.map((item, index) => {
            const point = getPoint(index, 125);

            return (
              <motion.div
                key={item.name}
                className="graph-label"
                style={{
                  left: `${(point.x / 500) * 100}%`,
                  top: `${(point.y / 500) * 100}%`,
                }}
                initial={{
                  opacity: 0,
                  scale: 0.7,
                }}
                whileInView={{
                  opacity: 1,
                  scale: 1,
                }}
                viewport={{
                  once: true,
                }}
                transition={{
                  duration: 0.5,
                  delay: 0.8 + index * 0.1,
                }}
              >
                <div className="graph-label-icon">
                  <i className={item.icon} />
                </div>

                <div>
                  <strong>{item.percentage}%</strong>

                  <span>{item.name}</span>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* =========================
            KNOWLEDGE CARDS
        ========================= */}

        <div className="knowledge-mini-grid">
          {knowledge.map((item, index) => (
            <motion.div
              className="knowledge-mini-card"
              key={item.name}
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
                duration: 0.5,
                delay: index * 0.08,
              }}
              whileHover={{
                y: -8,
                scale: 1.03,
              }}
            >
              <div className="mini-icon">
                <i className={item.icon} />
              </div>

              <div className="mini-content">
                <div>
                  <h4>{item.name}</h4>

                  <strong>
                    {item.percentage}%
                  </strong>
                </div>

                <div className="mini-progress">
                  <motion.span
                    initial={{
                      width: 0,
                    }}
                    whileInView={{
                      width: `${item.percentage}%`,
                    }}
                    viewport={{
                      once: true,
                    }}
                    transition={{
                      duration: 1.2,
                      delay: 0.3,
                    }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}

export default Knowledge;