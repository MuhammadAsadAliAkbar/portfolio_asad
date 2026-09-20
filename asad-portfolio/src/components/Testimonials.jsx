import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const testimonials = [
  {
    name: "Hiba Siddiqui",
    role: "Team Lead & Project Manager",
    text: "Hiba Siddiqui has been an incredible Team Lead and Project Manager throughout my professional journey. She consistently supported me, guided me through challenging situations, and helped me grow both technically and professionally. I truly appreciate her leadership, encouragement, and the trust she placed in my abilities. I’m genuinely grateful for all the support and guidance she has given me.",
    rating: 5,
  },
  {
    name: "Owais Ali Khan",
    role: "Team Lead & Project Manager",
    text: "Owais Ali Khan has been an exceptional Team Lead and Project Manager who consistently supported and guided me throughout our work. His leadership, encouragement, and valuable guidance helped me overcome challenges and grow professionally. I truly appreciate his support, trust, and the positive impact he has had on my professional journey.",
    rating: 5,
  },
  {
    name: "Shayan Sherwani",
    role: "Manager",
    text: "Shayan Sherwani has been a supportive and inspiring manager throughout my professional journey. She always supported and encouraged me, especially during challenging situations, and provided valuable guidance that helped me grow both professionally and personally. I truly appreciate her support, trust, and encouragement, and I’m grateful for the positive impact she has had on my career.",
    rating: 5,
  },
];

function Testimonials() {
  const [index, setIndex] = useState(0);

  const next = () => {
    setIndex(
      (current) => (current + 1) % testimonials.length
    );
  };

  const prev = () => {
    setIndex(
      (current) =>
        (current - 1 + testimonials.length) %
        testimonials.length
    );
  };

  const item = testimonials[index];

  return (
    <section id="testimonials" className="section testimonials">
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
          <span>07</span>

          <h2>Testimonials</h2>

          <p>What people say about my work</p>
        </motion.div>

        {/* =========================
            TESTIMONIAL
        ========================= */}

        <div className="testimonial-wrapper">

          {/* Decorative Quote */}

          <div className="testimonial-big-quote">
            "
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={item.name}
              className="testimonial-card"
              initial={{
                opacity: 0,
                y: 30,
                scale: 0.98,
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                y: -20,
                scale: 0.98,
              }}
              transition={{
                duration: 0.4,
              }}
            >

              {/* Top */}

              <div className="testimonial-top">

                <div className="quote-icon">
                  <i className="fas fa-quote-left" />
                </div>

                <div className="testimonial-stars">
                  {Array.from({
                    length: item.rating,
                  }).map((_, i) => (
                    <i
                      className="fas fa-star"
                      key={i}
                    />
                  ))}
                </div>

              </div>

              {/* Text */}

              <p className="testimonial-text">
                "{item.text}"
              </p>

              {/* Author */}

              <div className="testimonial-author">

                <div className="author-avatar">
                  <span>
                    {item.name.charAt(0)}
                  </span>
                </div>

                <div className="author-info">
                  <h3>{item.name}</h3>

                  <span>
                    <i className="fas fa-circle-check" />
                    {item.role}
                  </span>
                </div>

              </div>

            </motion.div>
          </AnimatePresence>

        </div>

        {/* =========================
            CONTROLS
        ========================= */}

        <div className="testimonial-controls">

          <motion.button
            onClick={prev}
            whileHover={{
              scale: 1.08,
              x: -3,
            }}
            whileTap={{
              scale: 0.95,
            }}
            aria-label="Previous testimonial"
          >
            <i className="fas fa-arrow-left" />
          </motion.button>

          <div className="testimonial-dots">
            {testimonials.map((_, i) => (
              <button
                key={i}
                className={
                  i === index ? "active" : ""
                }
                onClick={() => setIndex(i)}
                aria-label={`Go to testimonial ${
                  i + 1
                }`}
              />
            ))}
          </div>

          <motion.button
            onClick={next}
            whileHover={{
              scale: 1.08,
              x: 3,
            }}
            whileTap={{
              scale: 0.95,
            }}
            aria-label="Next testimonial"
          >
            <i className="fas fa-arrow-right" />
          </motion.button>

        </div>

      </div>
    </section>
  );
}

export default Testimonials;