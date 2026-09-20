
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  motion,
  AnimatePresence,
} from "framer-motion";

import Pusher from "pusher-js";

import "../css/MessageChat.css";

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
   VISITOR ID
========================================================= */

const getVisitorId = () => {
  let visitorId =
    localStorage.getItem(
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

  const [isOpen, setIsOpen] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [messages, setMessages] =
    useState([]);

  const [isLoading, setIsLoading] =
    useState(false);

  const [isSending, setIsSending] =
    useState(false);

  const [connectionStatus, setConnectionStatus] =
    useState("connecting");

  /* =======================================================
     REFS
  ======================================================= */

  const messagesEndRef =
    useRef(null);

  const pusherRef =
    useRef(null);

  const channelRef =
    useRef(null);

  /*
    Keep visitor ID stable
    for the entire browser session.
  */

  const visitorId =
    useRef(
      getVisitorId()
    ).current;

  /*
    Every visitor gets a unique conversation.
  */

  const conversationId =
    `portfolio-${visitorId}`;

  /* =========================================================
     SCROLL
  ========================================================= */

  const scrollToBottom =
    useCallback(
      (smooth = true) => {
        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView(
            {
              behavior: smooth
                ? "smooth"
                : "auto",
              block: "end",
            }
          );
        }, 100);
      },
      []
    );

  /* =========================================================
     OPEN CHAT EVENT
  ========================================================= */

  useEffect(() => {
    const handleOpen =
      () => {
        console.log(
          "💬 Opening one-to-one chat"
        );

        setIsOpen(true);
      };

    window.addEventListener(
      "open-message-chat",
      handleOpen
    );

    return () => {
      window.removeEventListener(
        "open-message-chat",
        handleOpen
      );
    };
  }, []);

  /* =========================================================
     CLOSE CHAT
  ========================================================= */

  const closeChat = () => {
    setIsOpen(false);
  };

  /* =========================================================
     FORMAT MESSAGE
  ========================================================= */

  const formatMessage =
    useCallback(
      (item, index = 0) => {
        return {
          id:
            item.messageId ||
            item._id ||
            `message-${index}-${Date.now()}`,

          sender:
            item.senderType ===
            "visitor"
              ? "user"
              : "admin",

          senderType:
            item.senderType,

          senderId:
            item.senderId,

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
      },
      []
    );

  /* =========================================================
     LOAD CONVERSATION
  ========================================================= */

  const loadMessages =
    useCallback(
      async () => {
        if (!API_URL) {
          console.error(
            "❌ VITE_API_URL missing"
          );

          setConnectionStatus(
            "error"
          );

          return;
        }

        try {
          setIsLoading(true);

          const url =
            `${API_URL}/api/messages/${encodeURIComponent(
              conversationId
            )}`;

          console.log(
            "================================="
          );

          console.log(
            "📥 ONE-TO-ONE CHAT LOAD"
          );

          console.log(
            "🆔 Visitor:",
            visitorId
          );

          console.log(
            "💬 Conversation:",
            conversationId
          );

          console.log(
            "🔗 URL:",
            url
          );

          console.log(
            "================================="
          );

          /* =================================================
             GET MESSAGES
          ================================================= */

          const response =
            await fetch(url, {
              method: "GET",

              headers: {
                Accept:
                  "application/json",
              },
            });

          const data =
            await response.json();

          console.log(
            "📦 MongoDB response:",
            data
          );

          if (!response.ok) {
            throw new Error(
              data?.message ||
                "Failed to load conversation"
            );
          }

          /*
            Expected:
            {
              success: true,
              messages: [...]
            }
          */

          const serverMessages =
            Array.isArray(
              data?.messages
            )
              ? data.messages
              : [];

          /* =================================================
             IMPORTANT:
             Only current conversation
          ================================================= */

          const currentConversationMessages =
            serverMessages.filter(
              (item) =>
                String(
                  item.conversationId
                ) ===
                String(
                  conversationId
                )
            );

          console.log(
            "📨 Messages found:",
            currentConversationMessages.length
          );

          /* =================================================
             FORMAT
          ================================================= */

          const formattedMessages =
            currentConversationMessages.map(
              formatMessage
            );

          console.log(
            "💬 Chat messages:",
            formattedMessages
          );

          /* =================================================
             SET CHAT
          ================================================= */

          setMessages(
            formattedMessages
          );

          /* =================================================
             SCROLL
          ================================================= */

          setTimeout(() => {
            messagesEndRef.current?.scrollIntoView(
              {
                behavior: "auto",
                block: "end",
              }
            );
          }, 150);

        } catch (error) {
          console.error(
            "❌ Load conversation error:",
            error
          );

          setConnectionStatus(
            "error"
          );

        } finally {
          setIsLoading(false);
        }
      },
      [
        conversationId,
        visitorId,
        formatMessage,
      ]
    );

  /* =========================================================
     ADD MESSAGE
  ========================================================= */

  const addMessage =
    useCallback(
      (incomingMessage) => {
        if (
          !incomingMessage ||
          !incomingMessage.id
        ) {
          return;
        }

        /*
          Make sure message belongs
          to this conversation.
        */

        if (
          incomingMessage.conversationId &&
          incomingMessage.conversationId !==
            conversationId
        ) {
          console.log(
            "🚫 Message belongs to another conversation"
          );

          return;
        }

        setMessages(
          (previousMessages) => {
            const exists =
              previousMessages.some(
                (item) =>
                  item.id ===
                  incomingMessage.id
              );

            if (exists) {
              console.log(
                "⚠️ Duplicate message ignored:",
                incomingMessage.id
              );

              return previousMessages;
            }

            return [
              ...previousMessages,
              incomingMessage,
            ];
          }
        );

        scrollToBottom(true);
      },
      [
        conversationId,
        scrollToBottom,
      ]
    );

  /* =========================================================
     CONNECT PUSHER
  ========================================================= */

  const connectPusher =
    useCallback(() => {
      if (!PUSHER_KEY) {
        console.error(
          "❌ VITE_PUSHER_KEY missing"
        );

        setConnectionStatus(
          "error"
        );

        return;
      }

      if (!API_URL) {
        console.error(
          "❌ VITE_API_URL missing"
        );

        setConnectionStatus(
          "error"
        );

        return;
      }

      /*
        Don't create another Pusher
        connection.
      */

      if (pusherRef.current) {
        console.log(
          "📡 Pusher already connected"
        );

        return;
      }

      try {
        setConnectionStatus(
          "connecting"
        );

        /* =================================================
           PUSHER
        ================================================= */

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

        /* =================================================
           CHANNEL
        ================================================= */

        const channelName =
          `private-chat-${conversationId}`;

        console.log(
          "📡 One-to-one Pusher channel:",
          channelName
        );

        const channel =
          pusher.subscribe(
            channelName
          );

        channelRef.current =
          channel;

        /* =================================================
           CONNECTION
        ================================================= */

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
              "❌ Pusher error:",
              error
            );

            setConnectionStatus(
              "error"
            );
          }
        );

        /* =================================================
           SUBSCRIPTION SUCCESS
        ================================================= */

        channel.bind(
          "pusher:subscription_succeeded",
          () => {
            console.log(
              "🟢 One-to-one channel connected"
            );

            setConnectionStatus(
              "online"
            );
          }
        );

        /* =================================================
           SUBSCRIPTION ERROR
        ================================================= */

        channel.bind(
          "pusher:subscription_error",
          (error) => {
            console.error(
              "❌ Channel subscription error:",
              error
            );

            setConnectionStatus(
              "error"
            );
          }
        );

        /* =================================================
           NEW MESSAGE
        ================================================= */

        channel.bind(
          "new-message",
          (data) => {
            console.log(
              "📩 One-to-one message:",
              data
            );

            if (
              !data ||
              !data.messageId
            ) {
              return;
            }

            /*
              IMPORTANT:
              Ignore messages from
              another conversation.
            */

            if (
              data.conversationId !==
              conversationId
            ) {
              console.log(
                "🚫 Different conversation ignored"
              );

              return;
            }

            const incomingMessage =
              {
                id:
                  data.messageId,

                conversationId:
                  data.conversationId,

                sender:
                  data.senderType ===
                  "visitor"
                    ? "user"
                    : "admin",

                senderType:
                  data.senderType,

                senderId:
                  data.senderId,

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
    }, [
      API_URL,
      PUSHER_KEY,
      PUSHER_CLUSTER,
      conversationId,
      addMessage,
    ]);

  /* =========================================================
     INITIALIZE CHAT
  ========================================================= */

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    /*
      Load old MongoDB messages.
    */

    loadMessages();

    /*
      Connect to this visitor's
      private Pusher channel.
    */

    connectPusher();

  }, [
    isOpen,
    loadMessages,
    connectPusher,
  ]);

  /* =========================================================
     SEND MESSAGE
  ========================================================= */

  const handleSendMessage =
    async (e) => {
      e.preventDefault();

      const trimmedMessage =
        message.trim();

      if (!trimmedMessage) {
        return;
      }

      if (isSending) {
        return;
      }

      if (!API_URL) {
        console.error(
          "❌ VITE_API_URL missing"
        );

        return;
      }

      try {
        setIsSending(true);

        console.log(
          "📤 Sending one-to-one message..."
        );

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
                  /*
                    VERY IMPORTANT:
                    Same conversation ID
                  */

                  conversationId,

                  /*
                    Same visitor ID
                  */

                  senderId:
                    visitorId,

                  senderName:
                    "Website Visitor",

                  message:
                    trimmedMessage,
                }),
            }
          );

        const data =
          await response.json();

        console.log(
          "📦 Send response:",
          data
        );

        if (!response.ok) {
          throw new Error(
            data?.message ||
              "Failed to send message"
          );
        }

        /*
          We don't manually add the
          message here.

          Backend:
          MongoDB save
              ↓
          Pusher broadcast
              ↓
          new-message event
              ↓
          addMessage()
        */

        setMessage("");

        scrollToBottom(true);

      } catch (error) {
        console.error(
          "❌ Send message error:",
          error
        );

      } finally {
        setIsSending(false);
      }
    };

  /* =========================================================
     ENTER
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

            <button
              type="button"
              className="message-chat-close"
              onClick={
                closeChat
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
                EMPTY
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
                (item) => {

                  const isVisitor =
                    item.senderType ===
                      "visitor" ||
                    item.sender ===
                      "user";

                  return (
                    <motion.div
                      key={item.id}

                      className={`message-row ${
                        isVisitor
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
                          isVisitor
                            ? "message-bubble-user"
                            : "message-bubble-admin"
                        }`}
                      >

                        <div className="message-text">
                          {item.text}
                        </div>

                        <div className="message-time">
                          {formatTime(
                            item.createdAt
                          )}
                        </div>

                      </div>

                    </motion.div>
                  );
                }
              )}

              <div
                ref={
                  messagesEndRef
                }
              />

            </div>

          </div>

          {/* =================================================
              INPUT
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
              Secure one-to-one messaging
            </span>

          </div>

        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default MessageChat;

