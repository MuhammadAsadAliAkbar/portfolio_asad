import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Pusher from "pusher-js";

import "../css/MessageChat.css";

/* =========================================================
   CONFIG
========================================================= */

const API_URL = import.meta.env.VITE_API_URL;

const PUSHER_KEY = import.meta.env.VITE_PUSHER_KEY;

const PUSHER_CLUSTER =
  import.meta.env.VITE_PUSHER_CLUSTER || "ap2";

/* =========================================================
   VISITOR ID
========================================================= */

const getVisitorId = () => {
  let visitorId = localStorage.getItem(
    "portfolio_visitor_id"
  );

  if (!visitorId) {
    visitorId =
      `visitor-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 10)}`;

    localStorage.setItem(
      "portfolio_visitor_id",
      visitorId
    );
  }

  return visitorId;
};

/* =========================================================
   COMPONENT
========================================================= */

function MessageChat() {
  /* =======================================================
     STATE
  ======================================================= */

  const [isOpen, setIsOpen] = useState(false);

  const [message, setMessage] = useState("");

  const [messages, setMessages] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  const [isSending, setIsSending] = useState(false);

  const [connectionStatus, setConnectionStatus] =
    useState("connecting");

  /* =======================================================
     REFS
  ======================================================= */

  const messagesEndRef = useRef(null);

  const pusherRef = useRef(null);

  const channelRef = useRef(null);

  const visitorId = useRef(getVisitorId()).current;

  /* =======================================================
     CONVERSATION ID
  ======================================================= */

  const conversationId =
    `portfolio-${visitorId}`;

  /* =========================================================
     SCROLL TO BOTTOM
  ========================================================= */

  const scrollToBottom = (smooth = true) => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({
        behavior: smooth ? "smooth" : "auto",
        block: "end",
      });
    }, 100);
  };

  /* =========================================================
     OPEN MESSAGE CHAT EVENT
  ========================================================= */

  useEffect(() => {
    const handleOpenMessageChat = () => {
      console.log("💬 Opening Message Chat");

      setIsOpen(true);
    };

    window.addEventListener(
      "open-message-chat",
      handleOpenMessageChat
    );

    return () => {
      window.removeEventListener(
        "open-message-chat",
        handleOpenMessageChat
      );
    };
  }, []);

  /* =========================================================
     CLOSE MESSAGE CHAT
  ========================================================= */

  const closeMessageChat = () => {
    setIsOpen(false);
  };

  /* =========================================================
     FORMAT API MESSAGE
  ========================================================= */

  const formatMessage = (item, index) => {
    return {
      id:
        item.messageId ||
        item._id ||
        `message-${index}-${Date.now()}`,

      sender:
        item.senderType === "visitor"
          ? "user"
          : "admin",

      senderName:
        item.senderName ||
        "Unknown",

      text:
        item.message ||
        "",

      createdAt:
        item.createdAt ||
        null,
    };
  };

  /* =========================================================
     LOAD MESSAGES FROM MONGODB
  ========================================================= */

  const loadMessages = async () => {
    if (!API_URL) {
      console.error(
        "❌ VITE_API_URL is not configured."
      );

      setConnectionStatus("error");

      return;
    }

    try {
      setIsLoading(true);

      const url =
        `${API_URL}/api/messages/${encodeURIComponent(
          conversationId
        )}`;

      console.log(
        "=========================================="
      );

      console.log(
        "📥 LOADING MESSAGES FROM MONGODB"
      );

      console.log(
        "🔗 URL:",
        url
      );

      console.log(
        "🆔 Conversation ID:",
        conversationId
      );

      console.log(
        "👤 Visitor ID:",
        visitorId
      );

      console.log(
        "=========================================="
      );

      /* =====================================================
         GET REQUEST
      ===================================================== */

      const response = await fetch(url, {
        method: "GET",

        headers: {
          Accept: "application/json",
        },
      });

      console.log(
        "📡 HTTP Status:",
        response.status
      );

      /* =====================================================
         RESPONSE TEXT
      ===================================================== */

      const rawText =
        await response.text();

      console.log(
        "📥 RAW API RESPONSE:",
        rawText
      );

      /* =====================================================
         PARSE JSON
      ===================================================== */

      let data;

      try {
        data = JSON.parse(rawText);
      } catch (jsonError) {
        console.error(
          "❌ Invalid JSON response:",
          jsonError
        );

        throw new Error(
          "Server returned invalid JSON response."
        );
      }

      console.log(
        "📦 PARSED API RESPONSE:",
        data
      );

      /* =====================================================
         HTTP ERROR
      ===================================================== */

      if (!response.ok) {
        throw new Error(
          data?.message ||
            `Failed to load messages (${response.status})`
        );
      }

      /* =====================================================
         CHECK SUCCESS
      ===================================================== */

      if (data?.success === false) {
        throw new Error(
          data?.message ||
            "API returned success=false"
        );
      }

      /* =====================================================
         GET MESSAGES
      ===================================================== */

      let apiMessages = [];

      if (Array.isArray(data?.messages)) {
        apiMessages = data.messages;
      } else if (Array.isArray(data?.data)) {
        apiMessages = data.data;
      } else if (Array.isArray(data)) {
        apiMessages = data;
      }

      console.log(
        "📨 TOTAL MESSAGES:",
        apiMessages.length
      );

      console.log(
        "📨 API MESSAGES:",
        apiMessages
      );

      /* =====================================================
         FORMAT MESSAGES
      ===================================================== */

      const formattedMessages =
        apiMessages.map(
          (item, index) =>
            formatMessage(
              item,
              index
            )
        );

      console.log(
        "💬 FORMATTED CHAT MESSAGES:",
        formattedMessages
      );

      /* =====================================================
         SET STATE
      ===================================================== */

      setMessages(
        formattedMessages
      );

      /* =====================================================
         SCROLL TO LAST MESSAGE
      ===================================================== */

      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({
          behavior: "auto",
          block: "end",
        });
      }, 200);

      console.log(
        "✅ MongoDB messages loaded successfully."
      );

    } catch (error) {
      console.error(
        "❌ LOAD MESSAGES ERROR:",
        error
      );

      /*
        Existing messages ko clear nahi karenge
        agar API temporarily fail ho.
      */

      setConnectionStatus(
        "error"
      );

    } finally {
      setIsLoading(false);
    }
  };

  /* =========================================================
     ADD MESSAGE WITHOUT DUPLICATE
  ========================================================= */

  const addMessage = (
    incomingMessage
  ) => {
    if (
      !incomingMessage ||
      !incomingMessage.id
    ) {
      return;
    }

    setMessages(
      (previousMessages) => {

        const alreadyExists =
          previousMessages.some(
            (item) =>
              item.id ===
              incomingMessage.id
          );

        if (alreadyExists) {
          console.log(
            "⚠️ Duplicate message ignored:",
            incomingMessage.id
          );

          return previousMessages;
        }

        console.log(
          "➕ Adding message:",
          incomingMessage
        );

        return [
          ...previousMessages,
          incomingMessage,
        ];
      }
    );

    scrollToBottom(true);
  };

  /* =========================================================
     CONNECT PUSHER
  ========================================================= */

  const connectPusher = () => {
    if (!PUSHER_KEY) {
      console.error(
        "❌ VITE_PUSHER_KEY is not configured."
      );

      setConnectionStatus(
        "error"
      );

      return;
    }

    if (!API_URL) {
      console.error(
        "❌ VITE_API_URL is not configured."
      );

      setConnectionStatus(
        "error"
      );

      return;
    }

    /* =====================================================
       ALREADY CONNECTED
    ===================================================== */

    if (pusherRef.current) {
      console.log(
        "ℹ️ Pusher already connected."
      );

      return;
    }

    try {
      setConnectionStatus(
        "connecting"
      );

      console.log(
        "📡 Initializing Pusher..."
      );

      /* =====================================================
         CREATE PUSHER
      ===================================================== */

      const pusher =
        new Pusher(
          PUSHER_KEY,
          {
            cluster:
              PUSHER_CLUSTER,

            authEndpoint:
              `${API_URL}/api/pusher/auth`,
          }
        );

      pusherRef.current =
        pusher;

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
        "disconnected",
        () => {
          console.log(
            "🟠 Pusher disconnected"
          );

          setConnectionStatus(
            "connecting"
          );
        }
      );

      pusher.connection.bind(
        "error",
        (error) => {
          console.error(
            "❌ Pusher connection error:",
            error
          );

          setConnectionStatus(
            "error"
          );
        }
      );

      /* =====================================================
         CHANNEL NAME
      ===================================================== */

      const channelName =
        `private-chat-${conversationId}`;

      console.log(
        "📡 Pusher Channel:",
        channelName
      );

      /* =====================================================
         SUBSCRIBE
      ===================================================== */

      const channel =
        pusher.subscribe(
          channelName
        );

      channelRef.current =
        channel;

      /* =====================================================
         SUBSCRIPTION SUCCESS
      ===================================================== */

      channel.bind(
        "pusher:subscription_succeeded",
        () => {
          console.log(
            "🟢 Private chat subscription successful"
          );

          setConnectionStatus(
            "online"
          );
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

          setConnectionStatus(
            "error"
          );
        }
      );

      /* =====================================================
         NEW MESSAGE
      ===================================================== */

      channel.bind(
        "new-message",
        (data) => {

          console.log(
            "=========================================="
          );

          console.log(
            "📩 NEW PUSHER MESSAGE"
          );

          console.log(
            "📦 Pusher Data:",
            data
          );

          console.log(
            "=========================================="
          );

          if (
            !data ||
            !data.messageId
          ) {
            console.warn(
              "⚠️ Invalid Pusher message."
            );

            return;
          }

          /* =================================================
             CONVERT PUSHER MESSAGE
          ================================================= */

          const incomingMessage = {
            id:
              data.messageId,

            sender:
              data.senderType ===
              "visitor"
                ? "user"
                : "admin",

            senderName:
              data.senderName ||
              "Unknown",

            text:
              data.message ||
              "",

            createdAt:
              data.createdAt ||
              new Date().toISOString(),
          };

          /* =================================================
             ADD TO CHAT
          ================================================= */

          addMessage(
            incomingMessage
          );
        }
      );

    } catch (error) {
      console.error(
        "❌ Pusher initialization error:",
        error
      );

      setConnectionStatus(
        "error"
      );
    }
  };

  /* =========================================================
     INITIALIZE CHAT
  ========================================================= */

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    console.log(
      "💬 Message Chat opened"
    );

    /*
      First MongoDB messages load.
    */

    loadMessages();

    /*
      Then Pusher real-time connection.
    */

    connectPusher();

  }, [isOpen]);

  /* =========================================================
     PUSHER CLEANUP
  ========================================================= */

  useEffect(() => {
    return () => {
      console.log(
        "🧹 Cleaning Pusher..."
      );

      try {
        if (
          channelRef.current
        ) {
          channelRef.current.unbind_all();

          pusherRef.current?.unsubscribe(
            `private-chat-${conversationId}`
          );
        }

        if (
          pusherRef.current
        ) {
          pusherRef.current.disconnect();
        }

      } catch (error) {
        console.error(
          "❌ Pusher cleanup error:",
          error
        );
      }

      channelRef.current =
        null;

      pusherRef.current =
        null;
    };
  }, [conversationId]);

  /* =========================================================
     SEND VISITOR MESSAGE
  ========================================================= */

  const handleSendMessage =
    async (e) => {

      e.preventDefault();

      const trimmedMessage =
        message.trim();

      /* =====================================================
         VALIDATION
      ===================================================== */

      if (!trimmedMessage) {
        return;
      }

      if (isSending) {
        return;
      }

      if (!API_URL) {
        console.error(
          "❌ VITE_API_URL is not configured."
        );

        return;
      }

      try {
        setIsSending(
          true
        );

        console.log(
          "📤 Sending visitor message..."
        );

        /* ===================================================
           POST REQUEST
        =================================================== */

        const response =
          await fetch(
            `${API_URL}/api/messages/send`,
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",

                Accept:
                  "application/json",
              },

              body:
                JSON.stringify({
                  conversationId,

                  senderId:
                    visitorId,

                  senderName:
                    "Website Visitor",

                  message:
                    trimmedMessage,
                }),
            }
          );

        /* ===================================================
           RESPONSE
        =================================================== */

        const data =
          await response.json();

        console.log(
          "📦 SEND API RESPONSE:",
          data
        );

        if (!response.ok) {
          throw new Error(
            data?.message ||
              `Failed to send message (${response.status})`
          );
        }

        /* ===================================================
           SUCCESS
        =================================================== */

        console.log(
          "✅ Message saved successfully."
        );

        /*
          Message manually add nahi kar rahe.

          Backend:
          1. MongoDB mein save karega
          2. Pusher event trigger karega
          3. Pusher "new-message" event yahan receive hoga
          4. addMessage() chatbox mein show karega
        */

        setMessage("");

        scrollToBottom(
          true
        );

      } catch (error) {

        console.error(
          "❌ SEND MESSAGE ERROR:",
          error
        );

      } finally {

        setIsSending(
          false
        );
      }
    };

  /* =========================================================
     ENTER KEY
  ========================================================= */

  const handleKeyDown =
    (e) => {

      if (
        e.key === "Enter" &&
        !e.shiftKey
      ) {

        e.preventDefault();

        if (
          message.trim() &&
          !isSending
        ) {
          e.currentTarget.form?.requestSubmit();
        }
      }
    };

  /* =========================================================
     FORMAT TIME
  ========================================================= */

  const formatTime =
    (date) => {

      if (!date) {
        return "";
      }

      try {

        return new Date(
          date
        ).toLocaleTimeString(
          [],
          {
            hour: "2-digit",
            minute: "2-digit",
          }
        );

      } catch {
        return "";
      }
    };

  /* =========================================================
     CONNECTION TEXT
  ========================================================= */

  const getConnectionText =
    () => {

      if (
        connectionStatus ===
        "online"
      ) {
        return "Online";
      }

      if (
        connectionStatus ===
        "error"
      ) {
        return "Connection issue";
      }

      return "Connecting...";
    };

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <AnimatePresence>
      {isOpen && (

        <motion.div
          className="message-chat-window"

          initial={{
            opacity: 0,
            y: 30,
            scale: 0.95,
          }}

          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
          }}

          exit={{
            opacity: 0,
            y: 30,
            scale: 0.95,
          }}

          transition={{
            duration: 0.25,
            ease: "easeOut",
          }}
        >

          {/* =================================================
              HEADER
          ================================================= */}

          <div className="message-chat-header">

            <div className="message-chat-user">

              <div className="message-chat-avatar">

                <i className="fas fa-user"></i>

              </div>

              <div className="message-chat-user-info">

                <h3>
                  Muhammad Asad
                </h3>

                <span
                  className={`message-online ${
                    connectionStatus ===
                    "error"
                      ? "offline"
                      : ""
                  }`}
                >

                  <i className="fas fa-circle"></i>

                  {getConnectionText()}

                </span>

              </div>

            </div>

            {/* =================================================
                CLOSE
            ================================================= */}

            <button
              type="button"
              className="message-chat-close"
              onClick={
                closeMessageChat
              }
              aria-label="Close message chat"
            >

              <i className="fas fa-times"></i>

            </button>

          </div>

          {/* =================================================
              CHAT BODY
          ================================================= */}

          <div className="message-chat-body">

            {/* =================================================
                LOADING
            ================================================= */}

            {isLoading && (

              <div className="message-chat-loading">

                <i className="fas fa-spinner fa-spin"></i>

                <span>
                  Loading messages...
                </span>

              </div>

            )}

            {/* =================================================
                EMPTY CHAT
            ================================================= */}

            {!isLoading &&
              messages.length === 0 && (

                <div className="message-welcome">

                  <div className="message-welcome-icon">

                    <i className="fas fa-comments"></i>

                  </div>

                  <h4>
                    Let's Connect
                  </h4>

                  <p>
                    Have a question,
                    project idea, or
                    opportunity?
                    Send me a message.
                  </p>

                </div>

            )}

            {/* =================================================
                MESSAGE LIST
            ================================================= */}

            <div className="message-list">

              {messages.map(
                (item) => (

                  <motion.div
                    key={item.id}

                    className={`message-row ${
                      item.sender ===
                      "user"
                        ? "message-row-user"
                        : "message-row-admin"
                    }`}

                    initial={{
                      opacity: 0,
                      y: 8,
                    }}

                    animate={{
                      opacity: 1,
                      y: 0,
                    }}

                    transition={{
                      duration: 0.2,
                    }}
                  >

                    <div
                      className={`message-bubble ${
                        item.sender ===
                        "user"
                          ? "message-bubble-user"
                          : "message-bubble-admin"
                      }`}
                    >

                      {/* =======================================
                          MESSAGE TEXT
                      ======================================= */}

                      <div className="message-text">
                        {item.text}
                      </div>

                      {/* =======================================
                          MESSAGE TIME
                      ======================================= */}

                      <div className="message-time">

                        {formatTime(
                          item.createdAt
                        )}

                      </div>

                    </div>

                  </motion.div>

              ))}

              {/* =============================================
                  SCROLL TARGET
              ============================================= */}

              <div
                ref={
                  messagesEndRef
                }
              />

            </div>

          </div>

          {/* =================================================
              INPUT AREA
          ================================================= */}

          <form
            className="message-chat-input-area"
            onSubmit={
              handleSendMessage
            }
          >

            <input
              type="text"

              value={
                message
              }

              onChange={(e) =>
                setMessage(
                  e.target.value
                )
              }

              onKeyDown={
                handleKeyDown
              }

              placeholder="Type your message..."

              aria-label="Type your message"

              maxLength={5000}

              disabled={
                isSending
              }
            />

            {/* =================================================
                SEND BUTTON
            ================================================= */}

            <button
              type="submit"

              disabled={
                !message.trim() ||
                isSending
              }

              aria-label="Send message"
            >

              {isSending ? (

                <i className="fas fa-spinner fa-spin"></i>

              ) : (

                <i className="fas fa-paper-plane"></i>

              )}

            </button>

          </form>

          {/* =================================================
              FOOTER
          ================================================= */}

          <div className="message-chat-footer">

            <i className="fas fa-shield-alt"></i>

            <span>
              Secure real-time messaging
            </span>

          </div>

        </motion.div>

      )}
    </AnimatePresence>
  );
}

export default MessageChat;