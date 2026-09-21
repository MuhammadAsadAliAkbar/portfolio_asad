import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  X,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  UserPlus,
  Loader2,
} from "lucide-react";

import "../css/SignupPopup.css";

function SignupPopup() {
  const [isOpen, setIsOpen] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  /* =====================================================
     OPEN SIGNUP EVENT
  ===================================================== */

  useEffect(() => {
    const handleOpenSignup = () => {
      setError("");
      setIsOpen(true);
    };

    window.addEventListener("open-signup", handleOpenSignup);

    return () => {
      window.removeEventListener("open-signup", handleOpenSignup);
    };
  }, []);

  /* =====================================================
     CLOSE
  ===================================================== */

  const handleClose = () => {
    if (isLoading) return;

    setIsOpen(false);

    setName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");

    setShowPassword(false);
    setShowConfirmPassword(false);

    setError("");
  };

  /* =====================================================
     ESC KEY
  ===================================================== */

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape" && isOpen && !isLoading) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, isLoading]);

  /* =====================================================
     SIGNUP
  ===================================================== */

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    /* =====================================================
       FRONTEND VALIDATION
    ===================================================== */

    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }

    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    /* =====================================================
       API REGISTER
    ===================================================== */

    try {
      setIsLoading(true);

      const API_URL = import.meta.env.VITE_API_URL;

      if (!API_URL) {
        throw new Error(
          "VITE_API_URL is not configured."
        );
      }

      const response = await fetch(
        `${API_URL}/api/auth/register`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            name: name.trim(),
            email: email.trim().toLowerCase(),
            password,
            confirmPassword
          }),
        }
      );

      const data = await response.json();

      /* =====================================================
         API ERROR
      ===================================================== */

      if (!response.ok) {
        throw new Error(
          data.message || "Registration failed."
        );
      }

      /* =====================================================
         SUCCESS
      ===================================================== */

      console.log("Signup successful:", data);

      /*
        Backend se token mil raha hai to save kar dein
      */

      if (data.token) {
        localStorage.setItem(
          "authToken",
          data.token
        );
      }

      /*
        Logged-in user save
      */

      if (data.user) {
        localStorage.setItem(
          "user",
          JSON.stringify(data.user)
        );
      }

      /*
        App ke dusre components ko inform karein
      */

      window.dispatchEvent(
        new CustomEvent("auth-success", {
          detail: data.user,
        })
      );

      /*
        Form reset
      */

      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");

      setShowPassword(false);
      setShowConfirmPassword(false);

      setError("");

      /*
        Signup popup close
      */

      setIsOpen(false);

    } catch (error) {
      console.error("Signup failed:", error);

      setError(
        error.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  /* =====================================================
     OPEN LOGIN
  ===================================================== */

  const handleLogin = () => {
    if (isLoading) return;

    setIsOpen(false);

    setName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");

    setShowPassword(false);
    setShowConfirmPassword(false);

    setError("");

    window.dispatchEvent(
      new CustomEvent("open-login")
    );
  };

  /* =====================================================
     UI
  ===================================================== */

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="signup-overlay"
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          exit={{
            opacity: 0,
          }}
          onMouseDown={(event) => {
            if (
              event.target === event.currentTarget
            ) {
              handleClose();
            }
          }}
        >
          <motion.div
            className="signup-popup"
            initial={{
              opacity: 0,
              scale: 0.9,
              y: 25,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: 0.9,
              y: 25,
            }}
            transition={{
              type: "spring",
              stiffness: 350,
              damping: 28,
            }}
            onMouseDown={(event) =>
              event.stopPropagation()
            }
          >
            {/* =================================================
                CLOSE
            ================================================= */}

            <button
              type="button"
              className="signup-close"
              onClick={handleClose}
              aria-label="Close signup"
              disabled={isLoading}
            >
              <X size={20} />
            </button>

            {/* =================================================
                HEADER
            ================================================= */}

            <div className="signup-header">
              <div className="signup-icon">
                <UserPlus size={25} />
              </div>

              <div>
                <h2>Create Account</h2>

                <p>
                  Join us and get started
                </p>
              </div>
            </div>

            {/* =================================================
                ERROR
            ================================================= */}

            <AnimatePresence>
              {error && (
                <motion.div
                  className="signup-error"
                  initial={{
                    opacity: 0,
                    y: -8,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  exit={{
                    opacity: 0,
                    y: -8,
                  }}
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* =================================================
                FORM
            ================================================= */}

            <form
              className="signup-form"
              onSubmit={handleSubmit}
            >
              {/* NAME */}

              <div className="signup-field">
                <label htmlFor="signup-name">
                  Full Name
                </label>

                <div className="signup-input-wrapper">
                  <User
                    size={18}
                    className="signup-input-icon"
                  />

                  <input
                    id="signup-name"
                    type="text"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(event) => {
                      setName(event.target.value);
                      setError("");
                    }}
                    autoComplete="name"
                    disabled={isLoading}
                    required
                  />
                </div>
              </div>

              {/* EMAIL */}

              <div className="signup-field">
                <label htmlFor="signup-email">
                  Email Address
                </label>

                <div className="signup-input-wrapper">
                  <Mail
                    size={18}
                    className="signup-input-icon"
                  />

                  <input
                    id="signup-email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(event) => {
                      setEmail(event.target.value);
                      setError("");
                    }}
                    autoComplete="email"
                    disabled={isLoading}
                    required
                  />
                </div>
              </div>

              {/* PASSWORD */}

              <div className="signup-field">
                <label htmlFor="signup-password">
                  Password
                </label>

                <div className="signup-input-wrapper">
                  <Lock
                    size={18}
                    className="signup-input-icon"
                  />

                  <input
                    id="signup-password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    placeholder="Create a password"
                    value={password}
                    onChange={(event) => {
                      setPassword(event.target.value);
                      setError("");
                    }}
                    autoComplete="new-password"
                    disabled={isLoading}
                    required
                  />

                  <button
                    type="button"
                    className="signup-password-toggle"
                    onClick={() =>
                      setShowPassword(
                        (prev) => !prev
                      )
                    }
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              {/* CONFIRM PASSWORD */}

              <div className="signup-field">
                <label htmlFor="signup-confirm-password">
                  Confirm Password
                </label>

                <div className="signup-input-wrapper">
                  <Lock
                    size={18}
                    className="signup-input-icon"
                  />

                  <input
                    id="signup-confirm-password"
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(event) => {
                      setConfirmPassword(
                        event.target.value
                      );
                      setError("");
                    }}
                    autoComplete="new-password"
                    disabled={isLoading}
                    required
                  />

                  <button
                    type="button"
                    className="signup-password-toggle"
                    onClick={() =>
                      setShowConfirmPassword(
                        (prev) => !prev
                      )
                    }
                    aria-label={
                      showConfirmPassword
                        ? "Hide password"
                        : "Show password"
                    }
                    disabled={isLoading}
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              {/* TERMS */}

              <label className="signup-terms">
                <input
                  type="checkbox"
                  required
                  disabled={isLoading}
                />

                <span>
                  I agree to the{" "}
                  <button
                    type="button"
                    className="terms-link"
                  >
                    Terms & Conditions
                  </button>
                </span>
              </label>

              {/* SUBMIT */}

              <button
                type="submit"
                className="signup-submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2
                      size={19}
                      className="signup-spinner"
                    />

                    Creating account...
                  </>
                ) : (
                  <>
                    <UserPlus size={19} />

                    Create Account
                  </>
                )}
              </button>
            </form>

            {/* =================================================
                FOOTER
            ================================================= */}

            <div className="signup-footer">
              <span>
                Already have an account?
              </span>

              <button
                type="button"
                className="signup-login-link"
                onClick={handleLogin}
                disabled={isLoading}
              >
                Sign In
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default SignupPopup;