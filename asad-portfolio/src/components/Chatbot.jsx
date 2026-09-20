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
  const text =
    message.toLowerCase();

  if (
    text.includes("hello") ||
    text.includes("hi") ||
    text.includes("hey") ||
    text.includes("salam") ||
    text.includes("assalam")
  ) {
    return "Hi! 👋 Welcome to Muhammad Asad Ali Akbar's portfolio. How can I help you?";
  }

  if (
    text.includes("yourself") ||
    text.includes("about")
  ) {
    return "I'm Muhammad Asad Ali Akbar, a Senior Full Stack / MERN Stack Developer with 5+ years of professional experience building scalable, secure and high-performance web applications.";
  }

  if (
    text.includes("skill") ||
    text.includes("technology") ||
    text.includes("stack")
  ) {
    return "My core technologies include React.js, Next.js, Angular, TypeScript, Node.js, Express.js, NestJS, MongoDB, MySQL, PostgreSQL, Redis, Docker, AWS, Kafka, RabbitMQ, Elasticsearch and REST/gRPC APIs. I also work with AI technologies including OpenAI, Gemini, LangChain, LangGraph, RAG and AI Agents.";
  }

  if (
    text.includes("project") ||
    text.includes("work")
  ) {
    return "I've worked on enterprise dashboards, SaaS platforms, REST APIs, real-time applications, scalable backend systems, AI-powered applications and cloud-based solutions.";
  }

  if (
    text.includes("experience") ||
    text.includes("5 years")
  ) {
    return "I have 5+ years of professional experience in full-stack development, working across frontend, backend, databases, APIs, cloud deployment, performance optimization and scalable software architecture.";
  }

  if (
    text.includes("contact") ||
    text.includes("hire") ||
    text.includes("email")
  ) {
    return "You can contact me through email at crypton.futuremedia1989@gmail.com or connect with me on LinkedIn. You can also send me a message directly on WhatsApp.";
  }

  if (
    text.includes("whatsapp") ||
    text.includes("message")
  ) {
    return "Sure! You can contact me directly on WhatsApp using the button below.";
  }

  if (
    text.includes("github")
  ) {
    return "You can explore my GitHub projects here: github.com/cryptonfuture";
  }

  if (
    text.includes("linkedin")
  ) {
    return "You can connect with me on LinkedIn through my portfolio's LinkedIn link.";
  }

  return "Thanks for your message! 😊 You can ask me about my experience, skills, projects, technologies or contact information.";
};

/* =========================================================
   COMPONENT
========================================================= */

function Chatbot() {
  /* =======================================================
     STATE
  ======================================================= */

  const [
    isOpen,
    setIsOpen,
  ] = useState(false);

  const [
    messages,
    setMessages,
  ] = useState([
    {
      id: "initial-message",
      sender: "bot",
      text:
        "Hi! 👋 I'm Asad's virtual assistant. How can I help you today?",
    },
  ]);

  const [
    input,
    setInput,
  ] = useState("");

  const [
    isTyping,
    setIsTyping,
  ] = useState(false);

  const [
    isPusherConnected,
    setIsPusherConnected,
  ] = useState(false);

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

  /*
   * IMPORTANT:
   * Keeps IDs of messages already displayed.
   * This prevents Pusher + local/API responses
   * from creating duplicate messages.
   */
  const processedMessageIdsRef =
    useRef(new Set());

  /* =======================================================
     ADD MESSAGE ONCE
  ======================================================= */

  const addMessageOnce = ({
    id,
    sender,
    text,
  }) => {
    if (!text?.trim()) {
      return false;
    }

    const messageId =
      id ||
      `${sender}-${text.trim()}`;

    /*
     * Already displayed?
     */
    if (
      processedMessageIdsRef.current.has(
        messageId
      )
    ) {
      console.log(
        "⛔ Duplicate message ignored:",
        messageId
      );

      return false;
    }

    /*
     * Mark as processed BEFORE adding.
     */
    processedMessageIdsRef.current.add(
      messageId
    );

    setMessages(
      (prev) => [
        ...prev,
        {
          id:
            messageId,

          sender,

          text:
            text.trim(),
        },
      ]
    );

    return true;
  };

  /* =======================================================
     CREATE MESSAGE ID
  ======================================================= */

  const createMessageId =
    (prefix = "message") =>
      `${prefix}-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 10)}`;

  /* =======================================================
     NOTIFICATION AUDIO
  ======================================================= */

  useEffect(() => {
    let audio;

    try {
      audio =
        new Audio(
          notificationSound
        );

      audio.preload =
        "auto";

      audio.volume =
        0.65;

      notificationAudioRef.current =
        audio;

      const unlockAudio =
        async () => {
          const notificationAudio =
            notificationAudioRef.current;

          if (
            !notificationAudio
          ) {
            return;
          }

          try {
            notificationAudio.muted =
              true;

            notificationAudio.currentTime =
              0;

            await notificationAudio.play();

            notificationAudio.pause();

            notificationAudio.currentTime =
              0;

            notificationAudio.muted =
              false;

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
              "⚠️ Waiting for user interaction:",
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
          audio.currentTime =
            0;
        }

        notificationAudioRef.current =
          null;
      };
    } catch (error) {
      console.error(
        "❌ Audio initialization error:",
        error
      );
    }
  }, []);

  /* =======================================================
     PLAY NOTIFICATION
  ======================================================= */

  const playNotificationSound =
    async () => {
      try {
        const audio =
          notificationAudioRef.current;

        if (!audio) {
          return;
        }

        audio.pause();

        audio.currentTime =
          0;

        audio.volume =
          0.65;

        audio.muted =
          false;

        await audio.play();
      } catch (error) {
        console.warn(
          "⚠️ Notification sound error:",
          error
        );
      }
    };

  /* =======================================================
     SHOW NOTIFICATION
  ======================================================= */

  const showNotification =
    () => {
      if (
        isOpenRef.current
      ) {
        return;
      }

      setNotificationCount(
        (prev) =>
          prev + 1
      );

      playNotificationSound();
    };

  /* =======================================================
     OPEN STATE REF
  ======================================================= */

  useEffect(() => {
    isOpenRef.current =
      isOpen;

    if (isOpen) {
      setNotificationCount(
        0
      );
    }
  }, [isOpen]);

  /* =======================================================
     EXTERNAL EVENTS
  ======================================================= */

  useEffect(() => {
    const handleOpenChatbot =
      () => {
        setIsOpen(true);

        setNotificationCount(
          0
        );
      };

    const handleCloseChatbot =
      () => {
        setIsOpen(false);

        setNotificationCount(
          0
        );
      };

    const handleToggleChatbot =
      () => {
        setIsOpen(
          (prev) => {
            const next =
              !prev;

            if (next) {
              setNotificationCount(
                0
              );
            }

            return next;
          }
        );
      };

    window.addEventListener(
      "open-chatbot",
      handleOpenChatbot
    );

    window.addEventListener(
      "close-chatbot",
      handleCloseChatbot
    );

    window.addEventListener(
      "toggle-chatbot",
      handleToggleChatbot
    );

    return () => {
      window.removeEventListener(
        "open-chatbot",
        handleOpenChatbot
      );

      window.removeEventListener(
        "close-chatbot",
        handleCloseChatbot
      );

      window.removeEventListener(
        "toggle-chatbot",
        handleToggleChatbot
      );
    };
  }, []);

  /* =======================================================
     PUSHER
  ======================================================= */

  useEffect(() => {
    if (!PUSHER_KEY) {
      console.warn(
        "⚠️ VITE_PUSHER_KEY is missing."
      );

      return;
    }

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

    const onConnected =
      () => {
        console.log(
          "✅ Pusher connected"
        );

        setIsPusherConnected(
          true
        );
      };

    const onDisconnected =
      () => {
        console.log(
          "⚠️ Pusher disconnected"
        );

        setIsPusherConnected(
          false
        );
      };

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
          "🔔 Portfolio update:",
          data
        );

        const messageId =
          data?.messageId ||
          data?.id ||
          data?.eventId ||
          createMessageId(
            "portfolio"
          );

        const title =
          data?.title ||
          "Portfolio Update";

        const updateMessage =
          data?.message ||
          "A new portfolio update is available.";

        const isChatbotUpdate =
          data?.type ===
          "chatbot";

        const wasAdded =
          addMessageOnce({
            id:
              messageId,

            sender:
              "bot",

            text:
              isChatbotUpdate
                ? updateMessage
                : `🔔 ${title}\n\n${updateMessage}`,
          });

        if (
          wasAdded &&
          !isChatbotUpdate
        ) {
          showNotification();
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
          "💬 Client message:",
          data
        );

        if (
          data?.message
        ) {
          showNotification();
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
          "💬 Chatbot message:",
          data
        );

        if (
          !data?.message
        ) {
          return;
        }

        const messageId =
          data?.messageId ||
          data?.id ||
          data?.eventId ||
          `${data?.sender || "bot"}-${data.message}`;

        const wasAdded =
          addMessageOnce({
            id:
              messageId,

            sender:
              data.sender ===
              "user"
                ? "user"
                : "bot",

            text:
              data.message,
          });

        if (
          wasAdded &&
          data.sender !==
            "user"
        ) {
          showNotification();
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
          "🤖 AI response:",
          data
        );

        if (
          !data?.reply
        ) {
          return;
        }

        const messageId =
          data?.messageId ||
          data?.id ||
          data?.eventId ||
          `ai-${data.reply}`;

        const wasAdded =
          addMessageOnce({
            id:
              messageId,

            sender:
              "bot",

            text:
              data.reply,
          });

        if (wasAdded) {
          setIsTyping(
            false
          );

          showNotification();
        }
      }
    );

    /* =====================================================
       SUBSCRIPTION ERROR
    ===================================================== */

    channel.bind(
      "pusher:subscription_error",
      (error) => {
        console.error(
          "❌ Subscription error:",
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
      messageId,
    }) => {
      try {
        if (
          !message?.trim()
        ) {
          return null;
        }

        if (!API_URL) {
          console.error(
            "❌ VITE_API_URL is not defined."
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

                Accept:
                  "application/json",
              },

              body:
                JSON.stringify({
                  title:
                    title.trim(),

                  message:
                    message.trim(),

                  type,

                  /*
                   * IMPORTANT:
                   * Backend should return/broadcast
                   * this same ID if possible.
                   */
                  messageId:
                    messageId ||
                    undefined,
                }),
            }
          );

        const contentType =
          response.headers.get(
            "content-type"
          ) || "";

        let data;

        if (
          contentType.includes(
            "application/json"
          )
        ) {
          data =
            await response.json();
        } else {
          const text =
            await response.text();

          data = {
            success:
              false,

            message:
              text,
          };
        }

        console.log(
          "📥 Portfolio API:",
          {
            status:
              response.status,

            data,
          }
        );

        if (
          !response.ok
        ) {
          throw new Error(
            data?.message ||
              `Portfolio update failed: ${response.status}`
          );
        }

        if (
          !data?.success
        ) {
          throw new Error(
            data?.message ||
              "Portfolio update API returned success=false"
          );
        }

        return data;
      } catch (error) {
        console.error(
          "❌ Portfolio API error:",
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
      messageId,
    }) => {
      try {
        if (
          !message?.trim()
        ) {
          return null;
        }

        if (!API_URL) {
          console.error(
            "❌ VITE_API_URL is not defined."
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

                Accept:
                  "application/json",
              },

              body:
                JSON.stringify({
                  message:
                    message.trim(),

                  sender,

                  /*
                   * IMPORTANT:
                   * This allows backend/Pusher to
                   * preserve the same message ID.
                   */
                  messageId:
                    messageId ||
                    undefined,
                }),
            }
          );

        const contentType =
          response.headers.get(
            "content-type"
          ) || "";

        let data;

        if (
          contentType.includes(
            "application/json"
          )
        ) {
          data =
            await response.json();
        } else {
          const text =
            await response.text();

          data = {
            success:
              false,

            message:
              text,
          };
        }

        console.log(
          "📥 Broadcast API:",
          {
            status:
              response.status,

            data,
          }
        );

        if (
          !response.ok
        ) {
          throw new Error(
            data?.message ||
              `Broadcast failed: ${response.status}`
          );
        }

        if (
          !data?.success
        ) {
          throw new Error(
            data?.message ||
              "Broadcast API returned success=false"
          );
        }

        return data;
      } catch (error) {
        console.error(
          "❌ Broadcast API error:",
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

      /* ===================================================
         UNIQUE USER MESSAGE ID
      =================================================== */

      const userMessageId =
        createMessageId(
          "user"
        );

      /* ===================================================
         ADD USER MESSAGE LOCALLY
      =================================================== */

      addMessageOnce({
        id:
          userMessageId,

        sender:
          "user",

        text:
          message,
      });

      setInput("");

      setIsTyping(
        true
      );

      /* ===================================================
         BROADCAST USER MESSAGE
      =================================================== */

      await broadcastChatbotMessage({
        message,

        sender:
          "user",

        messageId:
          userMessageId,
      });

      try {
        /* =================================================
           CHECK API URL
        ================================================= */

        if (!API_URL) {
          throw new Error(
            "VITE_API_URL is not configured."
          );
        }

        /* =================================================
           CHAT API
        ================================================= */

        console.log(
          "📡 Calling Chat API:",
          `${API_URL}/api/chat`
        );

        const response =
          await fetch(
            `${API_URL}/api/chat`,
            {
              method:
                "POST",

              headers: {
                "Content-Type":
                  "application/json",

                Accept:
                  "application/json",
              },

              body:
                JSON.stringify({
                  message,
                }),
            }
          );

        if (
          !response.ok
        ) {
          throw new Error(
            `Chat API failed: ${response.status}`
          );
        }

        const data =
          await response.json();

        console.log(
          "📥 Chat API response:",
          data
        );

        /* =================================================
           AI RESPONSE
        ================================================= */

        if (
          data?.reply
        ) {
          const botReply =
            data.reply;

          const botMessageId =
            data?.messageId ||
            createMessageId(
              "bot"
            );

          /* ===============================================
             ADD BOT MESSAGE LOCALLY ONLY ONCE
             
             This is the most important change.
          =============================================== */

          addMessageOnce({
            id:
              botMessageId,

            sender:
              "bot",

            text:
              botReply,
          });

          /* ===============================================
             BROADCAST BOT MESSAGE
          =============================================== */

          await broadcastChatbotMessage({
            message:
              botReply,

            sender:
              "bot",

            messageId:
              botMessageId,
          });

          /* ===============================================
             PORTFOLIO UPDATE
             
             Same message ID.
          =============================================== */

          await sendPortfolioUpdate({
            title:
              "AI Assistant",

            message:
              botReply,

            type:
              "chatbot",

            messageId:
              botMessageId,
          });

          /*
           * Stop typing immediately because we already
           * displayed the response locally.
           */
          setIsTyping(
            false
          );
        } else {
          setIsTyping(
            false
          );

          console.warn(
            "⚠️ Chat API did not return reply."
          );
        }
      } catch (error) {
        console.error(
          "❌ Chat API error:",
          error
        );

        /* =================================================
           FALLBACK
        ================================================= */

        const fallbackReply =
          getBotReply(
            message
          );

        const fallbackMessageId =
          createMessageId(
            "fallback"
          );

        /* =================================================
           SHOW FALLBACK LOCALLY
        ================================================= */

        addMessageOnce({
          id:
            fallbackMessageId,

          sender:
            "bot",

          text:
            fallbackReply,
        });

        /* =================================================
           BROADCAST FALLBACK
        ================================================= */

        await broadcastChatbotMessage({
          message:
            fallbackReply,

          sender:
            "bot",

          messageId:
            fallbackMessageId,
        });

        /* =================================================
           PORTFOLIO UPDATE
        ================================================= */

        await sendPortfolioUpdate({
          title:
            "AI Assistant",

          message:
            fallbackReply,

          type:
            "chatbot",

          messageId:
            fallbackMessageId,
        });

        setIsTyping(
          false
        );
      }
    };

  /* =======================================================
     KEYBOARD
  ======================================================= */

  const handleKeyDown =
    (event) => {
      if (
        event.key ===
          "Enter" &&
        !event.shiftKey
      ) {
        event.preventDefault();

        sendMessage();
      }
    };

  /* =======================================================
     OPEN
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
     CLOSE
  ======================================================= */

  const closeChatbot =
    () => {
      setIsOpen(
        false
      );

      setNotificationCount(
        0
      );
    };

  /* =======================================================
     TOGGLE
  ======================================================= */

  const toggleChatbot =
    () => {
      setIsOpen(
        (prev) => {
          const next =
            !prev;

          if (next) {
            setNotificationCount(
              0
            );
          }

          return next;
        }
      );
    };

  /* =======================================================
     UI
  ======================================================= */

  return (
    <>
      {/* ===================================================
          FLOATING BUTTON
      =================================================== */}

      <motion.button
        type="button"
        className="chatbot-toggle"
        onClick={
          toggleChatbot
        }
        aria-label={
          isOpen
            ? "Close chatbot"
            : "Open chatbot"
        }
        title={
          isOpen
            ? "Close chatbot"
            : "Open chatbot"
        }
        whileHover={{
          scale:
            1.05,
        }}
        whileTap={{
          scale:
            0.95,
        }}
      >
        <i
          className={
            isOpen
              ? "fas fa-chevron-down"
              : "fas fa-robot"
          }
        />

        <AnimatePresence>
          {notificationCount >
            0 &&
            !isOpen && (
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
                      (
                        question
                      ) => (
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