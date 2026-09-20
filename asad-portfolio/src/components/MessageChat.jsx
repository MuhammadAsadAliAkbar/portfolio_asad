
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import {
  MessageCircle,
  X,
  Search,
  Send,
  MoreVertical,
  Phone,
  Video,
  UserRound,
  CheckCheck,
  PanelLeft,
} from "lucide-react";

import "../css/MessageChat.css";

/* =========================================================
   DEMO USERS
========================================================= */

const initialUsers = [
  {
    id: "user-001",
    name: "Muhammad Asad",
    email: "asad@example.com",
    avatar: "MA",
    online: true,
    lastMessage: "Hello, how can I help you?",
    time: "10:24 PM",
    unread: 2,
  },

  {
    id: "user-002",
    name: "Ahmed Khan",
    email: "ahmed@example.com",
    avatar: "AK",
    online: true,
    lastMessage: "I need some help with my account.",
    time: "10:12 PM",
    unread: 1,
  },

  {
    id: "user-003",
    name: "Ali Raza",
    email: "ali@example.com",
    avatar: "AR",
    online: false,
    lastMessage: "Thank you!",
    time: "09:48 PM",
    unread: 0,
  },

  {
    id: "user-004",
    name: "Visitor",
    email: "visitor@example.com",
    avatar: "V",
    online: true,
    lastMessage: "Can you help me?",
    time: "09:31 PM",
    unread: 3,
  },
];

/* =========================================================
   DEMO MESSAGES
========================================================= */

const initialMessages = {
  "user-001": [
    {
      id: 1,
      sender: "user-001",
      text: "Hello, how are you?",
      time: "10:20 PM",
    },

    {
      id: 2,
      sender: "me",
      text: "I'm good, thanks! How can I help you?",
      time: "10:21 PM",
    },

    {
      id: 3,
      sender: "user-001",
      text: "I wanted to ask about my project.",
      time: "10:23 PM",
    },
  ],

  "user-002": [
    {
      id: 4,
      sender: "user-002",
      text: "I need some help with my account.",
      time: "10:12 PM",
    },
  ],

  "user-003": [
    {
      id: 5,
      sender: "me",
      text: "Is everything okay?",
      time: "09:45 PM",
    },

    {
      id: 6,
      sender: "user-003",
      text: "Yes, everything is fine. Thank you!",
      time: "09:48 PM",
    },
  ],

  "user-004": [
    {
      id: 7,
      sender: "user-004",
      text: "Can you help me?",
      time: "09:31 PM",
    },
  ],
};

/* =========================================================
   COMPONENT
========================================================= */

function MessageChat() {
  /* =======================================================
     CHAT OPEN/CLOSE
  ======================================================= */

  const [isOpen, setIsOpen] = useState(false);

  /* =======================================================
     SIDEBAR DRAWER
  ======================================================= */

  const [showUsers, setShowUsers] = useState(true);

  /* =======================================================
     SELECTED USER
  ======================================================= */

  const [selectedUserId, setSelectedUserId] =
    useState("user-001");

  /* =======================================================
     SEARCH
  ======================================================= */

  const [search, setSearch] = useState("");

  /* =======================================================
     MESSAGE INPUT
  ======================================================= */

  const [message, setMessage] = useState("");

  /* =======================================================
     MESSAGES
  ======================================================= */

  const [messages, setMessages] =
    useState(initialMessages);

  /* =======================================================
     SELECTED USER
  ======================================================= */

  const selectedUser = useMemo(() => {
    return initialUsers.find(
      (user) => user.id === selectedUserId
    );
  }, [selectedUserId]);

  /* =======================================================
     FILTER USERS
  ======================================================= */

  const filteredUsers = useMemo(() => {
    const value = search
      .toLowerCase()
      .trim();

    if (!value) {
      return initialUsers;
    }

    return initialUsers.filter((user) => {
      return (
        user.name
          .toLowerCase()
          .includes(value) ||
        user.email
          .toLowerCase()
          .includes(value)
      );
    });
  }, [search]);

  /* =======================================================
     OPEN CHAT FROM OUTSIDE

     Footer:

     window.dispatchEvent(
       new CustomEvent("open-message-chat")
     );

  ======================================================= */

  useEffect(() => {
    const handleOpenMessage = () => {
      setIsOpen(true);

      // Desktop default
      if (window.innerWidth > 768) {
        setShowUsers(true);
      }
    };

    window.addEventListener(
      "open-message-chat",
      handleOpenMessage
    );

    return () => {
      window.removeEventListener(
        "open-message-chat",
        handleOpenMessage
      );
    };
  }, []);

  /* =======================================================
     CLOSE CHAT FROM OUTSIDE

     Optional:

     window.dispatchEvent(
       new CustomEvent("close-message-chat")
     );

  ======================================================= */

  useEffect(() => {
    const handleCloseMessage = () => {
      setIsOpen(false);
    };

    window.addEventListener(
      "close-message-chat",
      handleCloseMessage
    );

    return () => {
      window.removeEventListener(
        "close-message-chat",
        handleCloseMessage
      );
    };
  }, []);

  /* =======================================================
     OPEN CONVERSATION
  ======================================================= */

  const openConversation = (userId) => {
    setSelectedUserId(userId);

    if (window.innerWidth <= 768) {
      setShowUsers(false);
    }
  };

  /* =======================================================
     SEND MESSAGE
  ======================================================= */

  const sendMessage = () => {
    const text = message.trim();

    if (!text || !selectedUserId) {
      return;
    }

    const newMessage = {
      id: Date.now(),

      sender: "me",

      text,

      time: new Date().toLocaleTimeString(
        [],
        {
          hour: "2-digit",
          minute: "2-digit",
        }
      ),
    };

    setMessages((prev) => ({
      ...prev,

      [selectedUserId]: [
        ...(prev[selectedUserId] || []),
        newMessage,
      ],
    }));

    setMessage("");
  };

  /* =======================================================
     ENTER TO SEND
  ======================================================= */

  const handleKeyDown = (event) => {
    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {
      event.preventDefault();

      sendMessage();
    }
  };

  /* =======================================================
     TOGGLE SIDEBAR
  ======================================================= */

  const toggleDrawer = () => {
    setShowUsers((prev) => !prev);
  };

  /* =======================================================
     CLOSE CHAT
  ======================================================= */

  const closeChat = () => {
    setIsOpen(false);
  };

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <>
      {/* =====================================================
          NOTE:

          MessageChat floating button has been completely
          removed.

          Chat opens from Footer using:

          window.dispatchEvent(
            new CustomEvent("open-message-chat")
          );
      ===================================================== */}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="message-chat-overlay"
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
          >

            {/* =================================================
                CHAT WINDOW
            ================================================= */}

            <motion.div
              className="message-chat-window"
              initial={{
                opacity: 0,
                y: 35,
                scale: 0.96,
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                y: 35,
                scale: 0.96,
              }}
              transition={{
                duration: 0.25,
                ease: "easeOut",
              }}
            >

              {/* =================================================
                  TOP HEADER
              ================================================= */}

              <div className="message-chat-header">

                <div className="message-header-left">

                  {/* Drawer Toggle */}

                  <button
                    className={`message-drawer-toggle ${
                      showUsers
                        ? "drawer-active"
                        : ""
                    }`}
                    onClick={toggleDrawer}
                    aria-label={
                      showUsers
                        ? "Close conversations"
                        : "Open conversations"
                    }
                    title={
                      showUsers
                        ? "Close conversations"
                        : "Open conversations"
                    }
                  >
                    <PanelLeft size={19} />
                  </button>

                  {/* Chat Icon */}

                  <div className="message-header-icon">
                    <MessageCircle size={19} />
                  </div>

                  {/* Header Content */}

                  <div className="message-header-content">

                    <h3>
                      Messages
                    </h3>

                    <span>
                      {initialUsers.length} conversations
                    </span>

                  </div>

                </div>

                {/* Close Button */}

                <div className="message-header-actions">

                  <button
                    className="message-icon-button"
                    onClick={closeChat}
                    aria-label="Close messages"
                    title="Close"
                  >
                    <X size={19} />
                  </button>

                </div>

              </div>

              {/* =================================================
                  MAIN BODY
              ================================================= */}

              <div className="message-chat-body">

                {/* =================================================
                    SIDEBAR
                ================================================= */}

                <AnimatePresence
                  initial={false}
                >

                  {showUsers && (
                    <motion.aside
                      className="message-users-sidebar"

                      initial={{
                        width: 0,
                        minWidth: 0,
                        opacity: 0,
                      }}

                      animate={{
                        width: 335,
                        minWidth: 335,
                        opacity: 1,
                      }}

                      exit={{
                        width: 0,
                        minWidth: 0,
                        opacity: 0,
                      }}

                      transition={{
                        duration: 0.25,
                        ease: "easeInOut",
                      }}
                    >

                      {/* =================================================
                          SEARCH
                      ================================================= */}

                      <div className="message-search">

                        <Search size={17} />

                        <input
                          type="text"
                          placeholder="Search conversations..."
                          value={search}
                          onChange={(event) =>
                            setSearch(
                              event.target.value
                            )
                          }
                        />

                      </div>

                      {/* =================================================
                          LABEL
                      ================================================= */}

                      <div className="conversation-label">
                        Recent Conversations
                      </div>

                      {/* =================================================
                          USERS
                      ================================================= */}

                      <div className="message-users-list">

                        {filteredUsers.map(
                          (user) => (
                            <button
                              key={user.id}
                              className={`message-user-item ${
                                selectedUserId ===
                                user.id
                                  ? "active"
                                  : ""
                              }`}
                              onClick={() =>
                                openConversation(
                                  user.id
                                )
                              }
                            >

                              {/* Avatar */}

                              <div className="message-user-avatar-wrapper">

                                <div className="message-user-avatar">
                                  {user.avatar}
                                </div>

                                {user.online && (
                                  <span className="online-dot" />
                                )}

                              </div>

                              {/* User Info */}

                              <div className="message-user-info">

                                <div className="message-user-top">

                                  <strong>
                                    {user.name}
                                  </strong>

                                  <span>
                                    {user.time}
                                  </span>

                                </div>

                                <div className="message-user-bottom">

                                  <p>
                                    {
                                      user.lastMessage
                                    }
                                  </p>

                                  {user.unread >
                                    0 && (
                                    <span className="unread-count">
                                      {
                                        user.unread
                                      }
                                    </span>
                                  )}

                                </div>

                              </div>

                            </button>
                          )
                        )}

                        {/* No Users */}

                        {filteredUsers.length ===
                          0 && (
                          <div className="no-users">

                            <UserRound
                              size={32}
                            />

                            <p>
                              No users found
                            </p>

                          </div>
                        )}

                      </div>

                    </motion.aside>
                  )}

                </AnimatePresence>

                {/* =================================================
                    ONE TO ONE CONVERSATION
                ================================================= */}

                <section className="message-conversation">

                  {/* =================================================
                      CONVERSATION HEADER
                  ================================================= */}

                  {selectedUser && (
                    <div className="conversation-header">

                      {/* User */}

                      <div className="conversation-user">

                        <div className="conversation-avatar-wrapper">

                          <div className="conversation-avatar">
                            {
                              selectedUser.avatar
                            }
                          </div>

                          {selectedUser.online && (
                            <span className="conversation-online" />
                          )}

                        </div>

                        <div className="conversation-user-details">

                          <h4>
                            {
                              selectedUser.name
                            }
                          </h4>

                          <span
                            className={
                              selectedUser.online
                                ? "status-online"
                                : "status-offline"
                            }
                          >
                            {selectedUser.online
                              ? "Online"
                              : "Offline"}
                          </span>

                        </div>

                      </div>

                      {/* Actions */}

                      <div className="conversation-actions">

                        <button
                          type="button"
                          title="Call"
                          aria-label="Call"
                        >
                          <Phone size={17} />
                        </button>

                        <button
                          type="button"
                          title="Video call"
                          aria-label="Video call"
                        >
                          <Video size={18} />
                        </button>

                        <button
                          type="button"
                          title="More"
                          aria-label="More"
                        >
                          <MoreVertical
                            size={18}
                          />
                        </button>

                      </div>

                    </div>
                  )}

                  {/* =================================================
                      MESSAGES
                  ================================================= */}

                  <div className="messages-container">

                    {/* Date */}

                    <div className="chat-date">
                      <span>
                        Today
                      </span>
                    </div>

                    {/* Message List */}

                    {(messages[
                      selectedUserId
                    ] || []).map((item) => {

                      const isMine =
                        item.sender === "me";

                      return (
                        <motion.div
                          key={item.id}
                          className={`message-row ${
                            isMine
                              ? "message-row-mine"
                              : "message-row-user"
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

                          {/* Other User Avatar */}

                          {!isMine &&
                            selectedUser && (
                              <div className="small-avatar">
                                {
                                  selectedUser.avatar
                                }
                              </div>
                            )}

                          {/* Message Bubble */}

                          <div
                            className={`message-bubble ${
                              isMine
                                ? "message-mine"
                                : "message-user"
                            }`}
                          >

                            <p>
                              {item.text}
                            </p>

                            <div className="message-meta">

                              <span>
                                {item.time}
                              </span>

                              {isMine && (
                                <CheckCheck
                                  size={14}
                                />
                              )}

                            </div>

                          </div>

                        </motion.div>
                      );
                    })}

                  </div>

                  {/* =================================================
                      MESSAGE INPUT
                  ================================================= */}

                  <div className="message-input-area">

                    <div className="message-input-wrapper">

                      <textarea
                        value={message}
                        onChange={(event) =>
                          setMessage(
                            event.target.value
                          )
                        }
                        onKeyDown={
                          handleKeyDown
                        }
                        placeholder="Write a message..."
                        rows={1}
                      />

                      <motion.button
                        type="button"
                        className="send-message-button"
                        onClick={sendMessage}
                        disabled={
                          !message.trim()
                        }
                        whileHover={{
                          scale: 1.04,
                        }}
                        whileTap={{
                          scale: 0.94,
                        }}
                        aria-label="Send message"
                      >
                        <Send size={17} />
                      </motion.button>

                    </div>

                    <div className="input-hint">
                      Press Enter to send
                    </div>

                  </div>

                </section>

              </div>

            </motion.div>

          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default MessageChat;

