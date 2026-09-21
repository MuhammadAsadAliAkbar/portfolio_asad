
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  X,
  Mail,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  Loader2,
} from "lucide-react";

import "../css/LoginPopup.css";

function LoginPopup() {
  const [isOpen, setIsOpen] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  /* =====================================================
     OPEN LOGIN EVENT
  ===================================================== */

  useEffect(() => {
    const handleOpenLogin = () => {
      setIsOpen(true);
    };

    window.addEventListener(
      "open-login",
      handleOpenLogin
    );

    return () => {
      window.removeEventListener(
        "open-login",
        handleOpenLogin
      );
    };
  }, []);

  /* =====================================================
     CLOSE LOGIN
  ===================================================== */

  const handleClose = () => {
    if (isLoading) return;

    setIsOpen(false);
    setShowPassword(false);
  };

  /* =====================================================
     ESC KEY
  ===================================================== */

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape" && isOpen) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener(
        "keydown",
        handleEscape
      );
    }

    return () => {
      document.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, [isOpen, isLoading]);

  /* =====================================================
     LOGIN
  ===================================================== */

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!email.trim() || !password.trim()) {
      return;
    }

    try {
      setIsLoading(true);

      /*
        Yahan apni API call laga sakte hain.
      */

      console.log("Login Data:", {
        email: email.trim(),
        password,
      });

      /*
        Demo delay
        Isko baad mein API call se replace karna.
      */

      await new Promise((resolve) =>
        setTimeout(resolve, 1200)
      );

      /* Clear form */

      setEmail("");
      setPassword("");
      setShowPassword(false);

      /* Close popup */

      setIsOpen(false);

    } catch (error) {
      console.error(
        "Login failed:",
        error
      );
    } finally {
      setIsLoading(false);
    }
  };

  /* =====================================================
     FORGOT PASSWORD
  ===================================================== */

  const handleForgotPassword = () => {
    console.log("Forgot password clicked");

    /*
      Yahan forgot-password popup/page
      open kar sakte hain.
    */
  };

  /* =====================================================
     CREATE ACCOUNT
  ===================================================== */

  const handleCreateAccount = () => {
    setIsOpen(false);

    window.dispatchEvent(
      new CustomEvent("open-signup")
    );
  };

  /* =====================================================
     UI
  ===================================================== */

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="login-overlay"
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
              event.target ===
              event.currentTarget
            ) {
              handleClose();
            }
          }}
        >
          <motion.div
            className="login-popup"
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
              className="login-close"
              onClick={handleClose}
              aria-label="Close login"
            >
              <X size={20} />
            </button>

            {/* =================================================
                HEADER
            ================================================= */}

            <div className="login-header">
              <div className="login-icon">
                <LogIn size={25} />
              </div>

              <div>
                <h2>
                  Welcome Back
                </h2>

                <p>
                  Sign in to continue
                </p>
              </div>
            </div>

            {/* =================================================
                FORM
            ================================================= */}

            <form
              className="login-form"
              onSubmit={handleSubmit}
            >
              {/* EMAIL */}

              <div className="login-field">
                <label htmlFor="login-email">
                  Email Address
                </label>

                <div className="login-input-wrapper">
                  <Mail
                    size={18}
                    className="login-input-icon"
                  />

                  <input
                    id="login-email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(event) =>
                      setEmail(
                        event.target.value
                      )
                    }
                    autoComplete="email"
                    required
                  />
                </div>
              </div>

              {/* PASSWORD */}

              <div className="login-field">
                <div className="login-label-row">
                  <label htmlFor="login-password">
                    Password
                  </label>

                  <button
                    type="button"
                    className="forgot-password"
                    onClick={
                      handleForgotPassword
                    }
                  >
                    Forgot password?
                  </button>
                </div>

                <div className="login-input-wrapper">
                  <Lock
                    size={18}
                    className="login-input-icon"
                  />

                  <input
                    id="login-password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    placeholder="Enter your password"
                    value={password}
                    onChange={(event) =>
                      setPassword(
                        event.target.value
                      )
                    }
                    autoComplete="current-password"
                    required
                  />

                  <button
                    type="button"
                    className="password-toggle"
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
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              {/* REMEMBER */}

              <div className="login-options">
                <label className="remember-me">
                  <input
                    type="checkbox"
                  />

                  <span>
                    Remember me
                  </span>
                </label>
              </div>

              {/* LOGIN BUTTON */}

              <button
                type="submit"
                className="login-submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2
                      size={19}
                      className="login-spinner"
                    />

                    Signing in...
                  </>
                ) : (
                  <>
                    <LogIn size={19} />

                    Sign In
                  </>
                )}
              </button>
            </form>

            {/* =================================================
                FOOTER
            ================================================= */}

            <div className="login-footer">
              <span>
                Don't have an account?
              </span>

              <button
                type="button"
                className="create-account"
                onClick={
                  handleCreateAccount
                }
              >
                Create account
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default LoginPopup;
