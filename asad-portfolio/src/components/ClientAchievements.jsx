import { motion } from "framer-motion";
import {
  CalendarDays,
  Trophy,
  Sparkles,
  Code2,
  Target,
  CheckCircle2,
} from "lucide-react";
import "../css/ClientAchievements.css";

export default function ClientAchievements() {
  return (
    <section
      id="client-achievements"
      className="client-achievements-section"
    >
      <div className="client-achievements-container">

        {/* =========================
            SECTION HEADER
        ========================= */}
        <motion.div
          className="client-achievements-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <span className="client-achievements-mini-label">
            <Sparkles size={14} />
            CLIENT ACHIEVEMENT
          </span>

          <h2>
            Challenging Requirements.
            <span> Successful Delivery.</span>
          </h2>

          <p>
            A real project achievement where I accepted a challenging
            requirement, invested significant effort, and successfully
            delivered the solution.
          </p>
        </motion.div>

        {/* =========================
            MAIN ACHIEVEMENT
        ========================= */}
        <motion.div
          className="client-achievement-card"
          initial={{ opacity: 0, y: 45 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >

          {/* Decorative Border */}
          <div className="client-achievement-border" />

          {/* =========================
              LEFT VISUAL
          ========================= */}
          <div className="client-achievement-visual">

            <div className="client-achievement-grid" />
            <div className="client-achievement-glow" />

            <div className="client-achievement-number">
              01
            </div>

            <motion.div
              className="client-calendar-icon"
              animate={{
                y: [0, -6, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <CalendarDays
                size={58}
                strokeWidth={1.4}
              />

              <div className="client-calendar-dot dot-one" />
              <div className="client-calendar-dot dot-two" />
              <div className="client-calendar-dot dot-three" />
            </motion.div>

            {/* Achievement Badge */}
            <div className="client-achievement-badge">
              <Trophy size={14} />
              <span>ACHIEVEMENT</span>
            </div>

            {/* Floating Tech Card */}
            <motion.div
              className="client-floating-code"
              animate={{
                y: [0, 5, 0],
              }}
              transition={{
                duration: 3.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <div className="client-floating-code-icon">
                <Code2 size={15} />
              </div>

              <div>
                <small>Built With</small>
                <strong>Custom Development</strong>
              </div>
            </motion.div>

          </div>

          {/* =========================
              RIGHT CONTENT
          ========================= */}
          <div className="client-achievement-content">

            <div className="client-achievement-meta">
              <span>QBS.CO</span>
              <i />
              <span>CONNECT QBS</span>
            </div>

            <h3>
              Custom Inline Calendar
              <span> Development</span>
            </h3>

            <p className="client-achievement-description">
              Designed and developed a custom inline calendar for the
              Connect QBS enterprise platform. The requirement involved
              complex UI behavior, custom interactions, and detailed
              implementation beyond a standard calendar component.
            </p>

            <p className="client-achievement-description">
              I accepted the challenge, worked through the technical
              complexities, and successfully accomplished and delivered
              the custom calendar solution as part of the application.
            </p>

            {/* =========================
                ACHIEVEMENT JOURNEY
            ========================= */}
            <div className="client-achievement-journey">

              <div className="client-journey-line" />

              <div className="client-journey-item">
                <div className="client-journey-icon">
                  <Target size={16} />
                </div>

                <div>
                  <strong>Challenge Accepted</strong>
                  <span>
                    Took ownership of a challenging custom requirement.
                  </span>
                </div>
              </div>

              <div className="client-journey-item">
                <div className="client-journey-icon">
                  <Code2 size={16} />
                </div>

                <div>
                  <strong>Custom Development</strong>
                  <span>
                    Designed and implemented the required calendar solution.
                  </span>
                </div>
              </div>

              <div className="client-journey-item">
                <div className="client-journey-icon">
                  <CheckCircle2 size={16} />
                </div>

                <div>
                  <strong>Successfully Delivered</strong>
                  <span>
                    Completed the challenge and delivered the required
                    functionality.
                  </span>
                </div>
              </div>

            </div>

            {/* =========================
                TECHNOLOGIES
            ========================= */}
            <div className="client-achievement-tech">
              <span>Reactjs</span>
              <span>Javascript</span>
              <span>Material Ui</span>
              <span>Redux</span>
              <span>REST API</span>
            </div>

          </div>
        </motion.div>

      </div>
    </section>
  );
}