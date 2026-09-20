import { useState } from "react";
import { motion } from "framer-motion";
import "../css/Contact.css"

const API_URL =
  import.meta.env.VITE_API_URL

function Contact() {

  const [form, setForm] =
    useState({
      name: "",
      email: "",
      subject: "",
      message: "",
    });

  const [isSending, setIsSending] =
    useState(false);

  const [status, setStatus] =
    useState({
      type: "",
      message: "",
    });

  /* =========================================================
     HANDLE CHANGE
  ========================================================= */

  const handleChange = (
    event
  ) => {

    setForm({
      ...form,

      [event.target.name]:
        event.target.value,
    });

    setStatus({
      type: "",
      message: "",
    });

  };

  /* =========================================================
     HANDLE SUBMIT
  ========================================================= */

  const handleSubmit = async (
    event
  ) => {

    event.preventDefault();

    if (isSending) {
      return;
    }

    setIsSending(true);

    setStatus({
      type: "",
      message: "",
    });

    try {

      const response =
        await fetch(
          `${API_URL}/api/contact`,
          {
            method:
              "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify(form),
          }
        );

      const data =
        await response.json();

      if (
        !response.ok ||
        !data.success
      ) {

        throw new Error(
          data.message ||
          "Failed to send message."
        );

      }

      /* =====================================================
         SUCCESS
      ===================================================== */

      setStatus({

        type:
          "success",

        message:
          "Message sent successfully! I'll get back to you soon.",

      });

      /* =====================================================
         RESET FORM
      ===================================================== */

      setForm({

        name: "",
        email: "",
        subject: "",
        message: "",

      });

    } catch (error) {

      console.error(
        "Contact form error:",
        error
      );

      setStatus({

        type:
          "error",

        message:
          error.message ||
          "Something went wrong. Please try again.",

      });

    } finally {

      setIsSending(false);

    }

  };

  return (

    <section
      id="contact"
      className="section contact"
    >

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

          <span>
            08
          </span>

          <h2>
            Let's Work Together
          </h2>

          <p>
            Have a project in mind?
          </p>

        </motion.div>


        {/* =========================
            CONTACT GRID
        ========================= */}

        <div className="contact-grid">

          {/* =========================
              LEFT SIDE
          ========================= */}

          <motion.div
            className="contact-info"

            initial={{
              opacity: 0,
              x: -50,
            }}

            whileInView={{
              opacity: 1,
              x: 0,
            }}

            viewport={{
              once: true,
            }}

            transition={{
              duration: 0.7,
            }}
          >

            <div className="availability">

              <span
                className="availability-dot"
              />

              Available for new projects

            </div>


            <span className="contact-small-title">
              GET IN TOUCH
            </span>


            <h3>

              Let's build something

              <span>
                {" "}amazing.
              </span>

            </h3>


            <p className="contact-description">

              I'm always interested in
              discussing new projects,
              creative ideas and
              opportunities. Let's turn
              your idea into a powerful
              digital experience.

            </p>


            {/* Contact Details */}

            <div className="contact-details">

              {/* Email */}

              <motion.a
                href="mailto:crypton.futuremedia1989@gmail.com"

                className="contact-item"

                whileHover={{
                  x: 6,
                }}
              >

                <div className="contact-item-icon">

                  <i className="fas fa-envelope" />

                </div>


                <div>

                  <span>
                    Email
                  </span>

                  <strong>
                    crypton.futuremedia1989@gmail.com
                  </strong>

                </div>


                <i
                  className="
                    fas
                    fa-arrow-up-right-from-square
                    contact-arrow
                  "
                />

              </motion.a>


              {/* Location */}

              <div className="contact-item">

                <div className="contact-item-icon">

                  <i className="fas fa-map-marker-alt" />

                </div>


                <div>

                  <span>
                    Location
                  </span>

                  <strong>
                    House No: A-120 Sector 14-b Shadman Town
                  </strong>

                </div>

              </div>


              {/* Phone */}

              <div className="contact-item">

                <div className="contact-item-icon">

                  <i className="fas fa-phone" />

                </div>


                <div>

                  <span>
                    Contact No
                  </span>

                  <strong>
                    03222382819
                  </strong>

                </div>

              </div>

            </div>

          </motion.div>


          {/* =========================
              RIGHT FORM
          ========================= */}

          <motion.form
            className="contact-form"

            onSubmit={
              handleSubmit
            }

            initial={{
              opacity: 0,
              x: 50,
            }}

            whileInView={{
              opacity: 1,
              x: 0,
            }}

            viewport={{
              once: true,
            }}

            transition={{
              duration: 0.7,
            }}
          >

            <div className="form-heading">

              <div>

                <span>
                  START A PROJECT
                </span>

                <h3>
                  Tell me about your idea
                </h3>

              </div>


              <div className="form-icon">

                <i className="fas fa-paper-plane" />

              </div>

            </div>


            {/* =========================
                NAME + EMAIL
            ========================= */}

            <div className="form-row">

              <div className="input-group">

                <label>
                  Your Name
                </label>

                <div className="input-wrapper">

                  <i className="fas fa-user" />

                  <input
                    name="name"

                    placeholder="John Doe"

                    value={
                      form.name
                    }

                    onChange={
                      handleChange
                    }

                    required
                  />

                </div>

              </div>


              <div className="input-group">

                <label>
                  Email Address
                </label>

                <div className="input-wrapper">

                  <i className="fas fa-envelope" />

                  <input
                    type="email"

                    name="email"

                    placeholder="john@example.com"

                    value={
                      form.email
                    }

                    onChange={
                      handleChange
                    }

                    required
                  />

                </div>

              </div>

            </div>


            {/* =========================
                SUBJECT
            ========================= */}

            <div className="input-group">

              <label>
                Subject
              </label>

              <div className="input-wrapper">

                <i className="fas fa-tag" />

                <input
                  name="subject"

                  placeholder="Project Discussion"

                  value={
                    form.subject
                  }

                  onChange={
                    handleChange
                  }

                  required
                />

              </div>

            </div>


            {/* =========================
                MESSAGE
            ========================= */}

            <div className="input-group">

              <label>
                Message
              </label>

              <div className="textarea-wrapper">

                <i className="fas fa-comment-dots" />

                <textarea
                  name="message"

                  rows="6"

                  placeholder="Tell me about your project..."

                  value={
                    form.message
                  }

                  onChange={
                    handleChange
                  }

                  required
                />

              </div>

            </div>


            {/* =========================
                STATUS
            ========================= */}

            {status.message && (

              <motion.div
                className={`contact-form-status ${status.type}`}

                initial={{
                  opacity: 0,
                  y: -10,
                }}

                animate={{
                  opacity: 1,
                  y: 0,
                }}
              >

                <i
                  className={
                    status.type ===
                    "success"
                      ? "fas fa-circle-check"
                      : "fas fa-circle-exclamation"
                  }
                />

                <span>
                  {status.message}
                </span>

              </motion.div>

            )}


            {/* =========================
                SUBMIT
            ========================= */}

            <motion.button
              className="contact-submit"

              type="submit"

              disabled={
                isSending
              }

              whileHover={
                !isSending
                  ? {
                      y: -3,
                    }
                  : {}
              }

              whileTap={
                !isSending
                  ? {
                      scale: 0.97,
                    }
                  : {}
              }
            >

              <span>

                {isSending
                  ? "Sending..."
                  : "Send Message"}

              </span>


              <div className="submit-icon">

                <i
                  className={
                    isSending
                      ? "fas fa-spinner fa-spin"
                      : "fas fa-arrow-right"
                  }
                />

              </div>

            </motion.button>

          </motion.form>

        </div>


        {/* =========================
            BOTTOM
        ========================= */}

        <motion.div
          className="contact-bottom"

          initial={{
            opacity: 0,
            y: 20,
          }}

          whileInView={{
            opacity: 1,
            y: 0,
          }}

          viewport={{
            once: true,
          }}
        >

          <i className="fas fa-code" />

          <span>
            Have an idea? Let's turn it into reality.
          </span>

        </motion.div>

      </div>

    </section>

  );

}

export default Contact;