
import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  motion,
  AnimatePresence,
} from "framer-motion";

import Pusher from "pusher-js";

import notificationSound from "../assets/notification.mp3";

import "../css/Chatbot.css";

/* =========================================================
   CONFIG
========================================================= */

const API_URL =
  import.meta.env.VITE_API_URL;

const PUSHER_KEY =
  import.meta.env.VITE_PUSHER_KEY;

const PUSHER_CLUSTER =
  import.meta.env.VITE_PUSHER_CLUSTER ||
  "ap2";

/* =========================================================
   QUICK QUESTIONS
========================================================= */

const quickQuestions = [
  "Tell me about yourself",
  "What are your skills?",
  "Show me your projects",
  "How can I contact you?",
];

/* =========================================================
   FALLBACK RESPONSE
========================================================= */

const getBotReply = (message) => {
  const text = message.toLowerCase();

  if (
    text.includes("hello") ||
    text.includes("hi") ||
    text.includes("hey") ||
    text.includes("salam") ||
    text.includes("assalam")
  ) {
    return (
      "Hi! 👋 Welcome to Muhammad Asad Ali Akbar's portfolio. How can I help you?"
    );
  }

  if (
    text.includes("yourself") ||
    text.includes("about")
  ) {
    return (
      "I'm Muhammad Asad Ali Akbar, a Senior Full Stack / MERN Stack Developer with 5+ years of professional experience building scalable, secure and high-performance web applications."
    );
  }

  if (
    text.includes("skill") ||
    text.includes("technology") ||
    text.includes("stack")
  ) {
    return (
      "My core technologies include React.js, Next.js, Angular, TypeScript, Node.js, Express.js, NestJS, MongoDB, MySQL, PostgreSQL, Redis, Docker, AWS, Kafka, RabbitMQ, Elasticsearch and REST/gRPC APIs. I also work with AI technologies including OpenAI, Gemini, LangChain, LangGraph, RAG and AI Agents."
    );
  }

  if (
    text.includes("project") ||
    text.includes("work")
  ) {
    return (
      "I've worked on enterprise dashboards, SaaS platforms, REST APIs, real-time applications, scalable backend systems, AI-powered applications and cloud-based solutions."
    );
  }

  if (
    text.includes("experience") ||
    text.includes("5 years")
  ) {
    return (
      "I have 5+ years of professional experience in full-stack development, working across frontend, backend, databases, APIs, cloud deployment, performance optimization and scalable software architecture."
    );
  }

  if (
    text.includes("contact") ||
    text.includes("hire") ||
    text.includes("email")
  ) {
    return (
      "You can contact me through email at crypton.futuremedia1989@gmail.com or connect with me on LinkedIn. You can also send me a message directly on WhatsApp."
    );
  }

  if (
    text.includes("whatsapp") ||
    text.includes("message")
  ) {
    return (
      "Sure! You can contact me directly on WhatsApp using the button below."
    );
  }

  if (text.includes("github")) {
    return (
      "You can explore my GitHub projects here: github.com/cryptonfuture"
    );
  }

  if (text.includes("linkedin")) {
    return (
      "You can connect with me on LinkedIn through my portfolio's LinkedIn link."
    );
  }

  return (
    "Thanks for your message! 😊 You can ask me about my experience, skills, projects, technologies or contact information."
  );
};

/* =========================================================
   COMPONENT
========================================================= */

function Chatbot() {
  /* =======================================================
     CHATBOT OPEN / CLOSE
  ======================================================= */

  const [isOpen, setIsOpen] =
    useState(false);

  /* =======================================================
     MESSAGES
  ======================================================= */

  const [messages, setMessages] =
    useState([
      {
        id: 1,
        sender: "bot",
        text:
          "Hi! 👋 I'm Asad's virtual assistant. How can I help you today?",
      },
    ]);

  /* =======================================================
     INPUT
  ======================================================= */

  const [input, setInput] =
    useState("");

  /* =======================================================
     TYPING
  ======================================================= */

  const [isTyping, setIsTyping] =
    useState(false);

  /* =======================================================
     PUSHER STATUS
  ======================================================= */

  const [
    isPusherConnected,
    setIsPusherConnected,
  ] = useState(false);

  /* =======================================================
     NOTIFICATION COUNT
  ======================================================= */

  const [
    notificationCount,
    setNotificationCount,
  ] = useState(0);

  /* =======================================================
     REFS
  ======================================================= */

  const pusherRef =
    useRef(null);

  const channelRef =
    useRef(null);

  const messagesEndRef =
    useRef(null);

  const isOpenRef =
    useRef(false);

  const notificationAudioRef =
    useRef(null);

  /* =======================================================
     CREATE + UNLOCK NOTIFICATION AUDIO
  ======================================================= */

  useEffect(() => {
    let audio;

    try {
      audio = new Audio(notificationSound);

      audio.preload = "auto";
      audio.volume = 0.65;

      notificationAudioRef.current = audio;

      /*
        Browser autoplay policy:

        Audio ko first user interaction par unlock
        kiya jata hai. Iske baad Pusher events se
        notification sound play ho sakta hai.
      */

      const unlockAudio = async () => {
        const notificationAudio =
          notificationAudioRef.current;

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

          console.log(
            "🔊 Notification sound unlocked"
          );

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
        } catch (error) {
          console.warn(
            "⚠️ Notification sound waiting for user interaction:",
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
          audio.currentTime = 0;
        }

        notificationAudioRef.current =
          null;
      };
    } catch (error) {
      console.error(
        "❌ Notification audio initialization error:",
        error
      );
    }
  }, []);

  /* =======================================================
     PLAY NOTIFICATION SOUND
  ======================================================= */

  const playNotificationSound =
    async () => {
      try {
        const audio =
          notificationAudioRef.current;

        if (!audio) {
          console.warn(
            "⚠️ Notification audio is not initialized"
          );

          return;
        }

        audio.pause();

        audio.currentTime = 0;

        audio.volume = 0.65;

        audio.muted = false;

        await audio.play();

        console.log(
          "🔊 Notification sound played"
        );
      } catch (error) {
        console.warn(
          "⚠️ Notification sound could not be played:",
          error
        );
      }
    };

  /* =======================================================
     SHOW NOTIFICATION
  ======================================================= */

  const showNotification =
    () => {
      /*
        Chatbot open hai to notification badge
        aur sound nahi dena.
      */

      if (isOpenRef.current) {
        return;
      }

      setNotificationCount(
        (prev) => prev + 1
      );

      playNotificationSound();
    };

  /* =======================================================
     KEEP OPEN STATE IN REF
  ======================================================= */

  useEffect(() => {
    isOpenRef.current =
      isOpen;

    /*
      Chatbot open karte hi notifications
      clear kar dein.
    */

    if (isOpen) {
      setNotificationCount(0);
    }
  }, [isOpen]);

  /* =======================================================
     EXTERNAL OPEN CHATBOT EVENT
  ======================================================= */

  useEffect(() => {
    const handleOpenChatbot =
      () => {
        setIsOpen(true);

        setNotificationCount(0);
      };

    window.addEventListener(
      "open-chatbot",
      handleOpenChatbot
    );

    return () => {
      window.removeEventListener(
        "open-chatbot",
        handleOpenChatbot
      );
    };
  }, []);

  /* =======================================================
     PUSHER CONNECTION
  ======================================================= */

  useEffect(() => {
    if (!PUSHER_KEY) {
      console.warn(
        "⚠️ Pusher key missing. Add VITE_PUSHER_KEY to .env"
      );

      return;
    }

    /* -----------------------------------------------------
       CREATE PUSHER
    ----------------------------------------------------- */

    const pusher =
      new Pusher(
        PUSHER_KEY,
        {
          cluster:
            PUSHER_CLUSTER,

          forceTLS:
            true,
        }
      );

    pusherRef.current =
      pusher;

    /* =====================================================
       CONNECTED
    ===================================================== */

    const onConnected =
      () => {
        console.log(
          "✅ Pusher connected"
        );

        setIsPusherConnected(
          true
        );
      };

    /* =====================================================
       DISCONNECTED
    ===================================================== */

    const onDisconnected =
      () => {
        console.log(
          "⚠️ Pusher disconnected"
        );

        setIsPusherConnected(
          false
        );
      };

    /* =====================================================
       ERROR
    ===================================================== */

    const onError =
      (error) => {
        console.error(
          "❌ Pusher error:",
          error
        );

        setIsPusherConnected(
          false
        );
      };

    pusher.connection.bind(
      "connected",
      onConnected
    );

    pusher.connection.bind(
      "disconnected",
      onDisconnected
    );

    pusher.connection.bind(
      "error",
      onError
    );

    /* =====================================================
       SUBSCRIBE
    ===================================================== */

    const channel =
      pusher.subscribe(
        "portfolio-updates"
      );

    channelRef.current =
      channel;

    /* =====================================================
       PORTFOLIO UPDATE
    ===================================================== */

    channel.bind(
      "portfolio-update",
      (data) => {
        console.log(
          "🔔 Portfolio update received:",
          data
        );

        const title =
          data?.title ||
          "Portfolio Update";

        const updateMessage =
          data?.message ||
          "A new portfolio update is available.";

        setMessages(
          (prev) => [
            ...prev,
            {
              id:
                Date.now() +
                Math.random(),

              sender:
                "bot",

              text:
                `🔔 ${title}\n\n${updateMessage}`,
            },
          ]
        );

        /*
          Notification only when chatbot is closed.
        */

        showNotification();
      }
    );

    /* =====================================================
       CLIENT MESSAGE
    ===================================================== */

    channel.bind(
      "client-message",
      (data) => {
        console.log(
          "💬 New client message received:",
          data
        );

        if (!data?.message) {
          return;
        }

        /*
          Count + sound when chatbot closed.
        */

        showNotification();
      }
    );

    /* =====================================================
       GENERAL CHATBOT MESSAGE
    ===================================================== */

    channel.bind(
      "chatbot-message",
      (data) => {
        console.log(
          "💬 Chatbot message received:",
          data
        );

        if (!data?.message) {
          return;
        }

        setMessages(
          (prev) => [
            ...prev,
            {
              id:
                Date.now() +
                Math.random(),

              sender:
                data.sender ===
                "user"
                  ? "user"
                  : "bot",

              text:
                data.message,
            },
          ]
        );

        /*
          Count + sound when chatbot closed.
        */

        showNotification();
      }
    );

    /* =====================================================
       AI RESPONSE
    ===================================================== */

    channel.bind(
      "ai-response",
      (data) => {
        console.log(
          "🤖 AI response received:",
          data
        );

        if (!data?.reply) {
          return;
        }

        setIsTyping(false);

        setMessages(
          (prev) => [
            ...prev,
            {
              id:
                Date.now() +
                Math.random(),

              sender:
                "bot",

              text:
                data.reply,
            },
          ]
        );

        /*
          AI response bhi notification generate karega
          jab chatbot closed ho.
        */

        showNotification();
      }
    );

    /* =====================================================
       SUBSCRIPTION ERROR
    ===================================================== */

    channel.bind(
      "pusher:subscription_error",
      (error) => {
        console.error(
          "❌ Pusher subscription error:",
          error
        );
      }
    );

    /* =====================================================
       CLEANUP
    ===================================================== */

    return () => {
      channel.unbind_all();

      pusher.unsubscribe(
        "portfolio-updates"
      );

      pusher.connection.unbind(
        "connected",
        onConnected
      );

      pusher.connection.unbind(
        "disconnected",
        onDisconnected
      );

      pusher.connection.unbind(
        "error",
        onError
      );

      pusher.disconnect();

      pusherRef.current =
        null;

      channelRef.current =
        null;
    };
  }, []);

  /* =======================================================
     AUTO SCROLL
  ======================================================= */

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView(
      {
        behavior:
          "smooth",
      }
    );
  }, [
    messages,
    isTyping,
  ]);

  /* =======================================================
     PORTFOLIO UPDATE API
  ======================================================= */

  const sendPortfolioUpdate =
    async ({
      title = "Portfolio Update",
      message,
      type = "portfolio",
    }) => {
      try {
        if (!message?.trim()) {
          console.warn(
            "Portfolio update message is required."
          );

          return null;
        }

        const response =
          await fetch(
            `${API_URL}/api/portfolio/update`,
            {
              method:
                "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body:
                JSON.stringify({
                  title,
                  message,
                  type,
                }),
            }
          );

        const data =
          await response.json();

        if (
          !response.ok ||
          !data?.success
        ) {
          throw new Error(
            data?.message ||
              `Portfolio update failed: ${response.status}`
          );
        }

        console.log(
          "🔔 Portfolio update sent:",
          data
        );

        return data;
      } catch (error) {
        console.error(
          "❌ Portfolio update API error:",
          error
        );

        return null;
      }
    };

  /* =======================================================
     CHATBOT BROADCAST API
  ======================================================= */

  const broadcastChatbotMessage =
    async ({
      message,
      sender = "bot",
    }) => {
      try {
        if (!message?.trim()) {
          console.warn(
            "Chatbot broadcast message is required."
          );

          return null;
        }

        const response =
          await fetch(
            `${API_URL}/api/chatbot/broadcast`,
            {
              method:
                "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body:
                JSON.stringify({
                  message,
                  sender,
                }),
            }
          );

        const data =
          await response.json();

        if (
          !response.ok ||
          !data?.success
        ) {
          throw new Error(
            data?.message ||
              `Chatbot broadcast failed: ${response.status}`
          );
        }

        console.log(
          "💬 Chatbot broadcast sent:",
          data
        );

        return data;
      } catch (error) {
        console.error(
          "❌ Chatbot broadcast API error:",
          error
        );

        return null;
      }
    };

  /* =======================================================
     SEND MESSAGE
  ======================================================= */

  const sendMessage =
    async (
      messageText = input
    ) => {
      const message =
        messageText.trim();

      if (
        !message ||
        isTyping
      ) {
        return;
      }

      /* ---------------------------------------------------
         ADD USER MESSAGE
      --------------------------------------------------- */

      setMessages(
        (prev) => [
          ...prev,
          {
            id:
              Date.now(),

            sender:
              "user",

            text:
              message,
          },
        ]
      );

      setInput("");

      setIsTyping(
        true
      );

      /* ---------------------------------------------------
         API REQUEST
      --------------------------------------------------- */

      try {
        const response =
          await fetch(
            `${API_URL}/api/chat`,
            {
              method:
                "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body:
                JSON.stringify({
                  message,
                }),
            }
          );

        if (!response.ok) {
          throw new Error(
            `Chat API failed: ${response.status}`
          );
        }

        const data =
          await response.json();

        /* -------------------------------------------------
           DIRECT RESPONSE
        -------------------------------------------------

          Backend already sends ai-response
          through Pusher.

          If Pusher is unavailable,
          use direct API response.
        */

        if (
          !isPusherConnected &&
          data?.reply
        ) {
          setIsTyping(false);

          setMessages(
            (prev) => [
              ...prev,
              {
                id:
                  Date.now() +
                  Math.random(),

                sender:
                  "bot",

                text:
                  data.reply,
              },
            ]
          );
        }
      } catch (error) {
        console.error(
          "❌ Chat API error:",
          error
        );

        /* -------------------------------------------------
           LOCAL FALLBACK
        ------------------------------------------------- */

        setTimeout(
          () => {
            setIsTyping(
              false
            );

            setMessages(
              (prev) => [
                ...prev,
                {
                  id:
                    Date.now() +
                    Math.random(),

                  sender:
                    "bot",

                  text:
                    getBotReply(
                      message
                    ),
                },
              ]
            );
          },
          700
        );
      }
    };

  /* =======================================================
     KEYBOARD
  ======================================================= */

  const handleKeyDown =
    (event) => {
      if (
        event.key === "Enter" &&
        !event.shiftKey
      ) {
        event.preventDefault();

        sendMessage();
      }
    };

  /* =======================================================
     OPEN CHATBOT
  ======================================================= */

  const openChatbot =
    () => {
      setIsOpen(
        true
      );

      setNotificationCount(
        0
      );
    };

  /* =======================================================
     CLOSE CHATBOT
  ======================================================= */

  const closeChatbot =
    () => {
      setIsOpen(
        false
      );
    };

  /* =======================================================
     UI
  ======================================================= */

  return (
    <>
      {/* ===================================================
          FLOATING CHATBOT BUTTON
      =================================================== */}

      <motion.button
        type="button"
        className="chatbot-toggle"
        onClick={
          openChatbot
        }
        aria-label="Open chatbot"
        whileHover={{
          scale:
            1.05,
        }}
        whileTap={{
          scale:
            0.95,
        }}
      >
        <i className="fas fa-robot"></i>

        {/* =================================================
            NOTIFICATION BADGE
        ================================================= */}

        <AnimatePresence>
          {notificationCount >
            0 && (
            <motion.span
              className="chatbot-notification"
              initial={{
                scale: 0,
                opacity: 0,
              }}
              animate={{
                scale: 1,
                opacity: 1,
              }}
              exit={{
                scale: 0,
                opacity: 0,
              }}
              transition={{
                type:
                  "spring",

                stiffness:
                  500,

                damping:
                  20,
              }}
            >
              {notificationCount >
              99
                ? "99+"
                : notificationCount}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      {/* ===================================================
          CHAT WINDOW
      =================================================== */}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="chatbot-window"
            initial={{
              opacity: 0,
              scale: 0.88,
              y: 30,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: 0.88,
              y: 30,
            }}
            transition={{
              duration:
                0.3,

              ease: [
                0.22,
                1,
                0.36,
                1,
              ],
            }}
          >
            {/* =================================================
                HEADER
            ================================================= */}

            <div className="chatbot-header">
              <div className="chatbot-profile">
                <div className="chatbot-avatar-wrap">
                  <div className="chatbot-avatar">
                    <i className="fas fa-robot"></i>
                  </div>

                  <span
                    className={`chatbot-online ${
                      isPusherConnected
                        ? "connected"
                        : "disconnected"
                    }`}
                  />
                </div>

                <div className="chatbot-profile-info">
                  <div className="chatbot-title-row">
                    <h3>
                      Asad's Assistant
                    </h3>

                    <span className="ai-badge">
                      AI
                    </span>
                  </div>

                  <span className="chatbot-status">
                    <i
                      className="fas fa-circle"
                      style={{
                        color:
                          isPusherConnected
                            ? "#22c55e"
                            : "#f59e0b",
                      }}
                    />

                    {isPusherConnected
                      ? "Live & ready to help"
                      : "Connecting..."}
                  </span>
                </div>
              </div>

              <button
                type="button"
                className="chatbot-close"
                onClick={
                  closeChatbot
                }
                aria-label="Close chatbot"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            {/* =================================================
                BODY
            ================================================= */}

            <div className="chatbot-body">
              {/* =================================================
                  WELCOME
              ================================================= */}

              <div className="chatbot-welcome">
                <div className="welcome-icon">
                  <i className="fas fa-sparkles"></i>
                </div>

                <div>
                  <h4>
                    How can I help?
                  </h4>

                  <p>
                    Ask me about Asad's
                    experience, skills,
                    projects or contact
                    details.
                  </p>
                </div>
              </div>

              {/* =================================================
                  MESSAGES
              ================================================= */}

              <div className="chatbot-messages">
                {messages.map(
                  (message) => (
                    <motion.div
                      key={
                        message.id
                      }
                      className={`chat-message ${
                        message.sender ===
                        "user"
                          ? "user-message"
                          : "bot-message"
                      }`}
                      initial={{
                        opacity: 0,
                        y: 10,
                        scale: 0.97,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                        scale: 1,
                      }}
                      transition={{
                        duration:
                          0.25,
                      }}
                    >
                      {message.sender ===
                        "bot" && (
                        <div className="message-avatar">
                          <i className="fas fa-robot"></i>
                        </div>
                      )}

                      <div className="message-bubble">
                        <div className="message-content">
                          {message.text}
                        </div>

                        <span className="message-time">
                          {message.sender ===
                          "user"
                            ? "You"
                            : "Assistant"}
                        </span>
                      </div>
                    </motion.div>
                  )
                )}

                {/* =================================================
                    TYPING
                ================================================= */}

                {isTyping && (
                  <motion.div
                    className="chat-message bot-message"
                    initial={{
                      opacity: 0,
                      y: 8,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                  >
                    <div className="message-avatar">
                      <i className="fas fa-robot"></i>
                    </div>

                    <div className="typing-bubble">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </motion.div>
                )}

                <div
                  ref={
                    messagesEndRef
                  }
                />
              </div>

              {/* =================================================
                  QUICK QUESTIONS
              ================================================= */}

              {messages.length <=
                1 && (
                <div className="quick-questions">
                  <div className="quick-title">
                    <i className="fas fa-bolt"></i>
                    Quick questions
                  </div>

                  <div className="quick-question-list">
                    {quickQuestions.map(
                      (question) => (
                        <button
                          key={
                            question
                          }
                          type="button"
                          onClick={() =>
                            sendMessage(
                              question
                            )
                          }
                          disabled={
                            isTyping
                          }
                        >
                          {question}

                          <i className="fas fa-arrow-right"></i>
                        </button>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* =================================================
                WHATSAPP
            ================================================= */}

            <a
              href="https://wa.me/923222382819"
              target="_blank"
              rel="noreferrer"
              className="chatbot-whatsapp"
            >
              <span className="whatsapp-icon">
                <i className="fab fa-whatsapp"></i>
              </span>

              <span className="whatsapp-text">
                <strong>
                  Prefer WhatsApp?
                </strong>

                <small>
                  Let's talk directly
                </small>
              </span>

              <i className="fas fa-arrow-right whatsapp-arrow"></i>
            </a>

            {/* =================================================
                INPUT
            ================================================= */}

            <div className="chatbot-input-area">
              <div className="chatbot-input-wrapper">
                <i className="fas fa-message chatbot-input-icon"></i>

                <input
                  type="text"
                  value={
                    input
                  }
                  onChange={(
                    event
                  ) =>
                    setInput(
                      event.target
                        .value
                    )
                  }
                  onKeyDown={
                    handleKeyDown
                  }
                  placeholder="Type your message..."
                  aria-label="Type your message"
                  disabled={
                    isTyping
                  }
                />

                <button
                  type="button"
                  onClick={() =>
                    sendMessage()
                  }
                  disabled={
                    !input.trim() ||
                    isTyping
                  }
                  aria-label="Send message"
                >
                  <i className="fas fa-paper-plane"></i>
                </button>
              </div>

              {/* =================================================
                  POWERED
              ================================================= */}

              <div className="chatbot-powered">
                <span>
                  <i className="fas fa-shield-halved"></i>
                  Secure Portfolio Assistant
                </span>

                <span className="powered-dot"></span>

                <span>
                  {isPusherConnected
                    ? "Live Updates"
                    : "Connecting"}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Chatbot;

