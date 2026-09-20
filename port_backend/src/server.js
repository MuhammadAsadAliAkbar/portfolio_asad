
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Pusher from "pusher";
import mongoose from "mongoose";
import nodemailer from "nodemailer";

import Contact from "./models/Contact.js";

dotenv.config();

/* =========================================================
   APP CONFIG
========================================================= */

const app = express();

const PORT =
  process.env.PORT || 5000;

const PYTHON_API =
  process.env.PYTHON_API

/* =========================================================
   MIDDLEWARE
========================================================= */

app.use(cors());

app.use(
  express.json()
);

/* =========================================================
   MONGODB
========================================================= */

if (process.env.MONGODB_URI) {
  mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
      console.log("🍃 MongoDB connected");
    })
    .catch((error) => {
      console.error(
        "❌ MongoDB connection error:",
        error
      );
    });
} else {
  console.warn(
    "⚠️ MONGODB_URI is not configured"
  );
}

/* =========================================================
   GMAIL SMTP / NODEMAILER
========================================================= */

const transporter =
  nodemailer.createTransport({
    host:
      process.env.SMTP_HOST ||
      "smtp.gmail.com",

    port:
      Number(
        process.env.SMTP_PORT || 465
      ),

    secure:
      process.env.SMTP_SECURE === "true",

    auth: {
      user:
        process.env.SMTP_USER,

      pass:
        process.env.SMTP_PASSWORD,
    },
  });

/* =========================================================
   VERIFY SMTP
========================================================= */

transporter.verify(
  (error) => {

    if (error) {

      console.error(
        "❌ SMTP connection failed:",
        error
      );

    } else {

      console.log(
        "📧 Gmail SMTP is ready"
      );

    }

  }
);

/* =========================================================
   PUSHER
========================================================= */

const pusher =
  new Pusher({
    appId:
      process.env.PUSHER_APP_ID,

    key:
      process.env.PUSHER_KEY,

    secret:
      process.env.PUSHER_SECRET,

    cluster:
      process.env.PUSHER_CLUSTER,

    useTLS:
      true,
  });

/* =========================================================
   HOME
========================================================= */

app.get(
  "/",
  (req, res) => {

    res.json({
      success: true,

      service:
        "Asad Portfolio Backend",

      python:
        PYTHON_API,

      pusher:
        true,

      time:
        new Date().toISOString(),
    });

  }
);

/* =========================================================
   HEALTH
========================================================= */

app.get(
  "/health",
  (req, res) => {

    res.json({
      success: true,

      status:
        "healthy",

      time:
        new Date().toISOString(),
    });

  }
);

/* =========================================================
   CHAT
   EXISTING API
========================================================= */

app.post(
  "/api/chat",
  async (req, res) => {

    try {

      const {
        message,
      } = req.body;

      /* ---------------------------------------------------
         VALIDATION
      --------------------------------------------------- */

      if (!message) {

        return res.status(400).json({
          success: false,

          message:
            "Message is required",
        });

      }

      /* ===================================================
         CLIENT MESSAGE NOTIFICATION
      =================================================== */

      try {

        await pusher.trigger(
          "portfolio-updates",
          "client-message",
          {
            sender:
              "user",

            message:
              message,

            createdAt:
              new Date().toISOString(),
          }
        );

        console.log(
          "📩 Client message notification sent"
        );

      } catch (pusherError) {

        console.error(
          "Pusher client-message error:",
          pusherError
        );

      }

      /* ===================================================
         SEND MESSAGE TO PYTHON
      =================================================== */

      const pythonResponse =
        await fetch(
          `${PYTHON_API}/api/chat`,
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

      /* ---------------------------------------------------
         PYTHON ERROR
      --------------------------------------------------- */

      if (
        !pythonResponse.ok
      ) {

        throw new Error(
          `Python API returned ${pythonResponse.status}`
        );

      }

      /* ---------------------------------------------------
         PYTHON RESPONSE
      --------------------------------------------------- */

      const data =
        await pythonResponse.json();

      const reply =
        data.reply ||
        "I couldn't generate a response.";

      /* ===================================================
         PUSH AI RESPONSE
      =================================================== */

      try {

        await pusher.trigger(
          "portfolio-updates",
          "ai-response",
          {
            reply:

              reply,

            createdAt:
              new Date().toISOString(),
          }
        );

      } catch (pusherError) {

        console.error(
          "Pusher AI response error:",
          pusherError
        );

      }

      /* ===================================================
         RESPONSE TO CLIENT
      =================================================== */

      return res.json({
        success: true,

        reply,
      });

    } catch (error) {

      console.error(
        "❌ Chat error:",
        error
      );

      return res.status(500).json({
        success: false,

        message:
          "Python AI service unavailable",
      });

    }

  }
);

/* =========================================================
   PORTFOLIO UPDATE
   EXISTING API
========================================================= */

app.post(
  "/api/portfolio/update",
  async (req, res) => {

    try {

      const {
        title,
        message,
        type = "portfolio",
      } = req.body;

      /* ---------------------------------------------------
         VALIDATION
      --------------------------------------------------- */

      if (!message) {

        return res.status(400).json({
          success: false,

          message:
            "message is required",
        });

      }

      /* ---------------------------------------------------
         UPDATE OBJECT
      --------------------------------------------------- */

      const update = {

        title:
          title ||
          "Portfolio Update",

        message,

        type,

        createdAt:
          new Date().toISOString(),

      };

      /* ---------------------------------------------------
         PUSH UPDATE
      --------------------------------------------------- */

      await pusher.trigger(
        "portfolio-updates",
        "portfolio-update",
        update
      );

      console.log(
        "🔔 Portfolio update sent:",
        update
      );

      /* ---------------------------------------------------
         RESPONSE
      --------------------------------------------------- */

      return res.json({

        success: true,

        message:
          "Portfolio update sent",

        update,

      });

    } catch (error) {

      console.error(
        "Portfolio update error:",
        error
      );

      return res.status(500).json({

        success: false,

        message:
          "Failed to send update",

      });

    }

  }
);

/* =========================================================
   BROADCAST CHATBOT MESSAGE
   EXISTING API
========================================================= */

app.post(
  "/api/chatbot/broadcast",
  async (req, res) => {

    try {

      const {
        message,
      } = req.body;

      if (!message) {

        return res.status(400).json({
          success: false,

          message:
            "message is required",
        });

      }

      await pusher.trigger(
        "portfolio-updates",
        "chatbot-message",
        {
          sender:
            "bot",

          message,

          createdAt:
            new Date().toISOString(),
        }
      );

      return res.json({

        success: true,

        message:
          "Message broadcasted",

      });

    } catch (error) {

      console.error(
        "Broadcast error:",
        error
      );

      return res.status(500).json({

        success: false,

        message:
          "Broadcast failed",

      });

    }

  }
);

/* =========================================================
   CONTACT API
   NEW
========================================================= */

app.post(
  "/api/contact",
  async (req, res) => {

    try {

      const {
        name,
        email,
        subject,
        message,
      } = req.body;

      /* ===================================================
         VALIDATION
      =================================================== */

      if (
        !name ||
        !email ||
        !subject ||
        !message
      ) {

        return res.status(400).json({

          success: false,

          message:
            "Name, email, subject and message are required",

        });

      }

      /* ===================================================
         EMAIL VALIDATION
      =================================================== */

      const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (
        !emailRegex.test(
          email.trim()
        )
      ) {

        return res.status(400).json({

          success: false,

          message:
            "Please provide a valid email address",

        });

      }

      /* ===================================================
         CLEAN DATA
      =================================================== */

      const cleanName =
        name.trim();

      const cleanEmail =
        email.trim().toLowerCase();

      const cleanSubject =
        subject.trim();

      const cleanMessage =
        message.trim();

      /* ===================================================
         SAVE TO MONGODB
      =================================================== */

      const contact =
        await Contact.create({

          name:
            cleanName,

          email:
            cleanEmail,

          subject:
            cleanSubject,

          message:
            cleanMessage,

        });

      console.log(
        "💾 Contact saved:",
        contact._id.toString()
      );

      /* ===================================================
         SEND EMAIL THROUGH GMAIL
      =================================================== */

      const mailOptions = {

        from:
          `"Muhammad Asad Portfolio" <${process.env.SMTP_USER}>`,

        to:
          process.env.CONTACT_RECEIVER_EMAIL ||
          process.env.SMTP_USER,

        replyTo:
          cleanEmail,

        subject:
          `Portfolio Contact: ${cleanSubject}`,

        text:
`New message received from your portfolio.

Name: ${cleanName}
Email: ${cleanEmail}
Subject: ${cleanSubject}

Message:
${cleanMessage}

Contact ID:
${contact._id}

Received:
${new Date().toISOString()}
`,

        html:
`
<!DOCTYPE html>

<html>

<head>

  <meta charset="UTF-8" />

  <title>
    Portfolio Contact
  </title>

</head>

<body
  style="
    margin:0;
    padding:30px;
    background:#f4f4f5;
    font-family:Arial,Helvetica,sans-serif;
  "
>

  <div
    style="
      max-width:650px;
      margin:auto;
      background:#ffffff;
      border-radius:14px;
      padding:30px;
      box-shadow:0 10px 30px rgba(0,0,0,0.08);
    "
  >

    <h2
      style="
        margin-top:0;
        color:#111827;
      "
    >
      📩 New Portfolio Contact
    </h2>

    <p
      style="
        color:#6b7280;
        font-size:14px;
      "
    >
      Someone submitted the contact form
      on your portfolio.
    </p>

    <hr
      style="
        border:none;
        border-top:1px solid #e5e7eb;
        margin:20px 0;
      "
    />

    <p>
      <strong>Name:</strong>
      ${cleanName}
    </p>

    <p>
      <strong>Email:</strong>
      ${cleanEmail}
    </p>

    <p>
      <strong>Subject:</strong>
      ${cleanSubject}
    </p>

    <div
      style="
        margin-top:20px;
        padding:20px;
        background:#f9fafb;
        border-radius:10px;
        color:#374151;
        line-height:1.7;
      "
    >

      <strong>
        Message
      </strong>

      <p>
        ${cleanMessage.replace(
          /\n/g,
          "<br />"
        )}
      </p>

    </div>

    <p
      style="
        margin-top:25px;
        color:#9ca3af;
        font-size:12px;
      "
    >
      Contact ID:
      ${contact._id}
    </p>

  </div>

</body>

</html>
`,

      };

      await transporter.sendMail(
        mailOptions
      );

      console.log(
        "📧 Contact email sent successfully"
      );

      /* ===================================================
         PUSHER CONTACT NOTIFICATION
      =================================================== */

      try {

        await pusher.trigger(
          "portfolio-updates",
          "client-message",
          {

            sender:
              "client",

            name:
              cleanName,

            email:
              cleanEmail,

            subject:
              cleanSubject,

            message:
              cleanMessage,

            contactId:
              contact._id.toString(),

            createdAt:
              new Date().toISOString(),

          }
        );

        console.log(
          "📡 Contact notification sent through Pusher"
        );

      } catch (pusherError) {

        console.error(
          "Pusher contact notification error:",
          pusherError
        );

      }

      /* ===================================================
         SUCCESS RESPONSE
      =================================================== */

      return res.status(201).json({

        success: true,

        message:
          "Your message has been sent successfully.",

        contactId:
          contact._id,

      });

    } catch (error) {

      console.error(
        "❌ Contact API error:",
        error
      );

      return res.status(500).json({

        success: false,

        message:
          "Failed to send your message.",

      });

    }

  }
);

/* =========================================================
   START SERVER
========================================================= */

app.listen(
  PORT,
  () => {

    console.log(
      `🚀 Backend running on http://localhost:${PORT}`
    );

    console.log(
      `🐍 Python API: ${PYTHON_API}`
    );

    console.log(
      `📡 Pusher cluster: ${process.env.PUSHER_CLUSTER}`
    );

  }
);

