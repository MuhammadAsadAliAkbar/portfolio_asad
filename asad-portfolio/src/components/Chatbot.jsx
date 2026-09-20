import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Pusher from "pusher-js";
import notificationSound from "../assets/notification.mp3";
import "../css/Chatbot.css";

const API_URL =
  import.meta.env.VITE_API_URL || "https://your-api-url.com";

const PUSHER_KEY = import.meta.env.VITE_PUSHER_KEY;
const PUSHER_CLUSTER = import.meta.env.VITE_PUSHER_CLUSTER || "ap2";

function Chatbot() {
  /* =========================================================
     STATE
  ========================================================= */

  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);

  /* =========================================================
     REFS
  ========================================================= */

  const isOpenRef = useRef(false);
  const notificationAudioRef = useRef(null);
  const messagesEndRef = useRef(null);

  /* =========================================================
     SYNC OPEN STATE
  ========================================================= */

  useEffect(() => {
    isOpenRef.current = isOpen;

    if (isOpen) {
      setNotificationCount(0);
    }
  }, [isOpen]);

  /* =========================================================
     AUTO SCROLL
  ========================================================= */

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, isTyping]);

  /* =========================================================
     AUDIO INITIALIZATION
  ========================================================= */

  useEffect(() => {
    let audio;

    try {
      audio = new Audio(notificationSound);

      audio.preload = "auto";
      audio.volume = 0.65;

      notificationAudioRef.current = audio;

      const unlockAudio = async () => {
        const notificationAudio = notificationAudioRef.current;

        if (!notificationAudio) {
          return;
        }

        try {
          notificationAudio.muted = true;
          notificationAudio.currentTime = 0;

          await notificationAudio.play();

          notificationAudio.pause();
          notificationAudio.currentTime = 0;
          notificationAudio.muted = false;

          console.log("🔊 Notification audio unlocked");
        } catch (error) {
          console.warn(
            "Audio unlock failed:",
            error
          );
        }
      };

      window.addEventListener(
        "click",
        unlockAudio,
        { once: true }
      );

      window.addEventListener(
        "pointerdown",
        unlockAudio,
        { once: true }
      );

      window.addEventListener(
        "keydown",
        unlockAudio,
        { once: true }
      );

      window.addEventListener(
        "touchstart",
        unlockAudio,
        { once: true }
      );

      return () => {
        window.removeEventListener(
          "click",
          unlockAudio
        );

        window.removeEventListener(
          "pointerdown",
          unlockAudio
        );

        window.removeEventListener(
          "keydown",
          unlockAudio
        );

        window.removeEventListener(
          "touchstart",
          unlockAudio
        );

        if (audio) {
          audio.pause();
          audio.src = "";
        }
      };
    } catch (error) {
      console.error(
        "Notification audio initialization failed:",
        error
      );
    }
  }, []);

  /* =========================================================
     PLAY NOTIFICATION SOUND
  ========================================================= */

  const playNotificationSound = async () => {
    try {
      const audio = notificationAudioRef.current;

      if (!audio) {
        return;
      }

      audio.pause();
      audio.currentTime = 0;
      audio.volume = 0.65;
      audio.muted = false;

      await audio.play();
    } catch (error) {
      console.warn(
        "Notification sound could not play:",
        error
      );
    }
  };

  /* =========================================================
     SHOW NOTIFICATION
  ========================================================= */

  const showNotification = () => {
    /*
      Do not show notification while chatbot is already open.
    */

    if (isOpenRef.current) {
      return;
    }

    setNotificationCount((previousCount) => {
      const newCount = previousCount + 1;

      console.log(
        "🔔 Notification Count:",
        newCount
      );

      return newCount;
    });

    playNotificationSound();
  };

  /* =========================================================
     OPEN CHATBOT
  ========================================================= */

  const openChatbot = () => {
    setIsOpen(true);

    /*
      Reset badge immediately.
    */

    setNotificationCount(0);

    /*
      Update ref immediately.
      This avoids stale state issues with Pusher events.
    */

    isOpenRef.current = true;
  };

  /* =========================================================
     CLOSE CHATBOT
  ========================================================= */

  const closeChatbot = () => {
    setIsOpen(false);

    isOpenRef.current = false;
  };

  /* =========================================================
     PUSHER
  ========================================================= */

  useEffect(() => {
    if (!PUSHER_KEY) {
      console.warn(
        "VITE_PUSHER_KEY is not configured."
      );

      return;
    }

    let pusher;
    let channel;

    try {
      pusher = new Pusher(PUSHER_KEY, {
        cluster: PUSHER_CLUSTER,
        forceTLS: true,
      });

      channel = pusher.subscribe(
        "portfolio-channel"
      );

      /* =====================================================
         PORTFOLIO UPDATE
      ===================================================== */

      channel.bind(
        "portfolio-update",
        (data) => {
          console.log(
            "📢 Portfolio Update:",
            data
          );

          showNotification();

          if (data?.message) {
            setMessages((previousMessages) => [
              ...previousMessages,
              {
                id: Date.now(),
                sender: "system",
                text: data.message,
              },
            ]);
          }
        }
      );

      /* =====================================================
         CLIENT MESSAGE
      ===================================================== */

      channel.bind(
        "client-message",
        (data) => {
          console.log(
            "💬 Client Message:",
            data
          );

          showNotification();

          if (data?.message) {
            setMessages((previousMessages) => [
              ...previousMessages,
              {
                id: Date.now(),
                sender: "client",
                text: data.message,
              },
            ]);
          }
        }
      );

      /* =====================================================
         CHATBOT MESSAGE
      ===================================================== */

      channel.bind(
        "chatbot-message",
        (data) => {
          console.log(
            "🤖 Chatbot Message:",
            data
          );

          showNotification();

          if (data?.message) {
            setMessages((previousMessages) => [
              ...previousMessages,
              {
                id: Date.now(),
                sender: "bot",
                text: data.message,
              },
            ]);
          }
        }
      );

      /* =====================================================
         AI RESPONSE
      ===================================================== */

      channel.bind(
        "ai-response",
        (data) => {
          console.log(
            "🧠 AI Response:",
            data
          );

          showNotification();

          if (data?.message) {
            setMessages((previousMessages) => [
              ...previousMessages,
              {
                id: Date.now(),
                sender: "bot",
                text: data.message,
              },
            ]);
          }
        }
      );

      /* =====================================================
         CONNECTION EVENTS
      ===================================================== */

      pusher.connection.bind(
        "connected",
        () => {
          console.log(
            "🟢 Pusher connected"
          );
        }
      );

      pusher.connection.bind(
        "error",
        (error) => {
          console.error(
            "🔴 Pusher connection error:",
            error
          );
        }
      );
    } catch (error) {
      console.error(
        "Pusher initialization failed:",
        error
      );
    }

    /* =======================================================
       CLEANUP
    ======================================================= */

    return () => {
      if (channel) {
        channel.unbind_all();

        pusher?.unsubscribe(
          "portfolio-channel"
        );
      }

      if (pusher) {
        pusher.disconnect();
      }
    };
  }, []);

  /* =========================================================
     SEND MESSAGE
  ========================================================= */

  const sendMessage = async () => {
    const trimmedMessage = message.trim();

    if (!trimmedMessage || isTyping) {
      return;
    }

    const userMessage = {
      id: Date.now(),
      sender: "user",
      text: trimmedMessage,
    };

    setMessages((previousMessages) => [
      ...previousMessages,
      userMessage,
    ]);

    setMessage("");
    setIsTyping(true);

    try {
      /*
        Change this endpoint according to your backend.
      */

      const response = await fetch(
        `${API_URL}/api/chat`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            message: trimmedMessage,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          `HTTP Error: ${response.status}`
        );
      }

      const data = await response.json();

      const botResponse =
        data?.response ||
        data?.message ||
        data?.answer ||
        "Sorry, I couldn't process your request.";

      setMessages((previousMessages) => [
        ...previousMessages,
        {
          id: Date.now() + 1,
          sender: "bot",
          text: botResponse,
        },
      ]);
    } catch (error) {
      console.error(
        "Chat API Error:",
        error
      );

      setMessages((previousMessages) => [
        ...previousMessages,
        {
          id: Date.now() + 1,
          sender: "bot",
          text:
            "Sorry, something went wrong. Please try again or contact me directly.",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  /* =========================================================
     ENTER KEY
  ========================================================= */

  const handleKeyDown = (event) => {
    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {
      event.preventDefault();

      sendMessage();
    }
  };

  /* =========================================================
     QUICK QUESTIONS
  ========================================================= */

  const quickQuestions = [
    "Tell me about your experience",
    "What technologies do you use?",
    "Show me your projects",
    "How can I contact you?",
  ];

  const handleQuickQuestion = (
    question
  ) => {
    setMessage(question);
  };

  /* =========================================================
     WHATSAPP
  ========================================================= */

  const openWhatsApp = () => {
    const whatsappMessage =
      encodeURIComponent(
        "Hello Muhammad, I would like to discuss a project with you."
      );

    window.open(
      `https://wa.me/?text=${whatsappMessage}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <>
      {/* =====================================================
          CHATBOT WINDOW
      ===================================================== */}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="chatbot-window"
            initial={{
              opacity: 0,
              scale: 0.85,
              y: 30,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: 0.85,
              y: 30,
            }}
            transition={{
              duration: 0.25,
              ease: "easeOut",
            }}
          >
            {/* =================================================
                HEADER
            ================================================= */}

            <div className="chatbot-header">
              <div className="chatbot-header-info">
                <div className="chatbot-avatar">
                  <i className="fas fa-robot"></i>
                </div>

                <div>
                  <h3>AI Assistant</h3>

                  <span>
                    <span className="online-dot"></span>
                    Online
                  </span>
                </div>
              </div>

              <button
                type="button"
                className="chatbot-close"
                onClick={closeChatbot}
                aria-label="Close chatbot"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            {/* =================================================
                MESSAGES
            ================================================= */}

            <div className="chatbot-messages">
              {messages.length === 0 && (
                <div className="chatbot-welcome">
                  <div className="welcome-icon">
                    <i className="fas fa-robot"></i>
                  </div>

                  <h3>
                    Hi! I'm your AI Assistant 👋
                  </h3>

                  <p>
                    Ask me anything about my
                    experience, skills, projects,
                    or services.
                  </p>

                  {/* ===========================================
                      QUICK QUESTIONS
                  =========================================== */}

                  <div className="quick-questions">
                    {quickQuestions.map(
                      (question, index) => (
                        <button
                          type="button"
                          key={index}
                          onClick={() =>
                            handleQuickQuestion(
                              question
                            )
                          }
                        >
                          {question}
                        </button>
                      )
                    )}
                  </div>
                </div>
              )}

              {messages.map((item) => (
                <motion.div
                  key={item.id}
                  className={`chat-message ${item.sender}`}
                  initial={{
                    opacity: 0,
                    y: 10,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                >
                  <div className="message-content">
                    {item.text}
                  </div>
                </motion.div>
              ))}

              {/* =================================================
                  TYPING
              ================================================= */}

              {isTyping && (
                <div className="chat-message bot">
                  <div className="message-content typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              )}

              <div
                ref={messagesEndRef}
              />
            </div>

            {/* =================================================
                QUICK CONTACT
            ================================================= */}

            <div className="chatbot-actions">
              <button
                type="button"
                onClick={openWhatsApp}
              >
                <i className="fab fa-whatsapp"></i>
                WhatsApp
              </button>
            </div>

            {/* =================================================
                INPUT
            ================================================= */}

            <div className="chatbot-input-area">
              <textarea
                value={message}
                onChange={(event) =>
                  setMessage(
                    event.target.value
                  )
                }
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
                rows={1}
              />

              <button
                type="button"
                onClick={sendMessage}
                disabled={
                  !message.trim() ||
                  isTyping
                }
                aria-label="Send message"
              >
                <i className="fas fa-paper-plane"></i>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* =======================================================
          FLOATING CHATBOT BUTTON
      ======================================================= */}

      <div className="chatbot-toggle-wrap">
        <motion.button
          type="button"
          className="chatbot-toggle"
          onClick={openChatbot}
          aria-label="Open chatbot"
          whileHover={{
            scale: 1.05,
          }}
          whileTap={{
            scale: 0.95,
          }}
        >
          <i className="fas fa-robot"></i>
        </motion.button>

        {/* =====================================================
            NOTIFICATION BADGE

            IMPORTANT:
            Badge is OUTSIDE the motion button.
            This prevents Framer Motion transform
            from affecting the badge position.
        ===================================================== */}

        <AnimatePresence>
          {notificationCount > 0 && (
            <motion.span
              className="chatbot-notification-badge"
              initial={{
                opacity: 0,
                scale: 0,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                scale: 0,
              }}
              transition={{
                type: "spring",
                stiffness: 500,
                damping: 25,
              }}
            >
              {notificationCount > 99
                ? "99+"
                : notificationCount}
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

export default Chatbot;