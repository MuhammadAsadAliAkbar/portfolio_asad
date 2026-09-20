from fastapi import FastAPI
from pydantic import BaseModel
from datetime import datetime
from pymongo import MongoClient
from dotenv import load_dotenv

import os

load_dotenv()

app = FastAPI(
    title="Asad Portfolio AI Service",
    version="1.0.0"
)

# =========================================================
# CONFIG
# =========================================================

PORT = int(
    os.getenv(
        "PORT",
        "8000"
    )
)

MONGODB_URI = os.getenv(
    "MONGODB_URI",
    "mongodb://127.0.0.1:27017"
)

MONGODB_DB = os.getenv(
    "MONGODB_DB",
    "asad_portfolio"
)

# =========================================================
# MONGODB
# =========================================================

mongo_client = None
db = None

try:

    mongo_client = MongoClient(
        MONGODB_URI,
        serverSelectionTimeoutMS=3000
    )

    mongo_client.admin.command(
        "ping"
    )

    db = mongo_client[
        MONGODB_DB
    ]

    print(
        "MongoDB connected successfully"
    )

except Exception as error:

    print(
        "MongoDB connection failed:",
        error
    )


# =========================================================
# MODELS
# =========================================================

class ChatRequest(BaseModel):

    message: str


class ChatResponse(BaseModel):

    reply: str


# =========================================================
# PORTFOLIO
# =========================================================

PORTFOLIO = {

    "name":
        "Muhammad Asad Ali Akbar",

    "role":
        "Senior Full Stack / MERN Stack Developer",

    "experience":
        "5+ years",

    "skills": [

        "JavaScript",
        "TypeScript",

        "React.js",
        "Next.js",
        "Angular",

        "Node.js",
        "Express.js",
        "NestJS",

        "MongoDB",
        "MySQL",
        "PostgreSQL",
        "Redis",

        "Docker",
        "AWS",

        "Kafka",
        "RabbitMQ",
        "Elasticsearch",

        "REST API",
        "gRPC",

        "OpenAI",
        "Gemini",
        "LangChain",
        "LangGraph",
        "RAG",
        "AI Agents",

        "Shopify API"

    ],

    "frontend": [

        "React.js",
        "Next.js",
        "Angular",
        "TypeScript",
        "Tailwind CSS",
        "Material UI",
        "Ant Design"

    ],

    "backend": [

        "Node.js",
        "Express.js",
        "NestJS",
        "REST API",
        "gRPC",
        "Socket.IO",
        "WebSocket"

    ],

    "databases": [

        "MongoDB",
        "MySQL",
        "PostgreSQL",
        "Redis"

    ],

    "ai": [

        "OpenAI",
        "Gemini",
        "LangChain",
        "LangGraph",
        "RAG",
        "LLM",
        "AI Agents"

    ],

    "email":
        "crypton.futuremedia1989@gmail.com",

    "github":
        "https://github.com/cryptonfuture",

    "linkedin":
        "https://www.linkedin.com/in/asad-akbar-1890892b2/",

    "whatsapp":
        "https://wa.me/923222382819"

}


# =========================================================
# ROOT
# =========================================================

@app.get("/")
async def root():

    return {

        "success":
            True,

        "service":
            "Asad Portfolio AI Service",

        "status":
            "running",

        "time":
            datetime.utcnow().isoformat()

    }


# =========================================================
# HEALTH
# =========================================================

@app.get("/health")
async def health():

    mongodb = False

    if db is not None:
        try:
            mongo_client.admin.command("ping")
            mongodb = True
        except Exception:
            mongodb = False

    return {
        "success": True,
        "status": "healthy",
        "mongodb": mongodb,
        "time": datetime.utcnow().isoformat()
    }


# =========================================================
# PORTFOLIO API
# =========================================================

@app.get(
    "/api/portfolio"
)
async def get_portfolio():

    return {

        "success":
            True,

        "portfolio":
            PORTFOLIO

    }


# =========================================================
# RESPONSE ENGINE
# =========================================================

def generate_reply(
    message: str
):

    text = (
        message
        .lower()
        .strip()
    )

    # -----------------------------------------------------
    # GREETING
    # -----------------------------------------------------

    if any(
        word in text
        for word in [
            "hello",
            "hi",
            "hey",
            "salam",
            "assalam"
        ]
    ):

        return (
            "Hi! 👋 I'm Asad's Portfolio Assistant. "
            "You can ask me about his skills, experience, "
            "projects, AI work or contact information."
        )

    # -----------------------------------------------------
    # ABOUT
    # -----------------------------------------------------

    if any(
        word in text
        for word in [
            "about",
            "yourself",
            "who is asad",
            "who are you"
        ]
    ):

        return (
            "Muhammad Asad Ali Akbar is a Senior Full Stack / "
            "MERN Stack Developer with 5+ years of professional "
            "experience building scalable web applications, "
            "enterprise dashboards, backend systems and APIs."
        )

    # -----------------------------------------------------
    # EXPERIENCE
    # -----------------------------------------------------

    if any(
        word in text
        for word in [
            "experience",
            "years",
            "career"
        ]
    ):

        return (
            "Asad has 5+ years of professional experience "
            "in full-stack development, including frontend, "
            "backend, databases, APIs, real-time systems, "
            "cloud deployment and software architecture."
        )

    # -----------------------------------------------------
    # SKILLS
    # -----------------------------------------------------

    if any(
        word in text
        for word in [
            "skill",
            "skills",
            "technology",
            "technologies",
            "stack"
        ]
    ):

        return (
            "Asad's main technologies include React.js, "
            "Next.js, Angular, TypeScript, Node.js, "
            "Express.js, NestJS, MongoDB, MySQL, "
            "PostgreSQL, Redis, Docker, AWS, Kafka, "
            "RabbitMQ, Elasticsearch, REST, gRPC, "
            "OpenAI, Gemini, LangChain, LangGraph, "
            "RAG and AI Agents."
        )

    # -----------------------------------------------------
    # FRONTEND
    # -----------------------------------------------------

    if any(
        word in text
        for word in [
            "frontend",
            "front end",
            "react",
            "angular",
            "nextjs",
            "next.js"
        ]
    ):

        return (
            "For frontend development, Asad works with "
            "React.js, Next.js, Angular, TypeScript, "
            "Tailwind CSS, Material UI and Ant Design."
        )

    # -----------------------------------------------------
    # BACKEND
    # -----------------------------------------------------

    if any(
        word in text
        for word in [
            "backend",
            "back end",
            "node",
            "express",
            "nestjs"
        ]
    ):

        return (
            "For backend development, Asad works with "
            "Node.js, Express.js, NestJS, REST APIs, "
            "gRPC, authentication, WebSocket, Socket.IO "
            "and scalable backend architecture."
        )

    # -----------------------------------------------------
    # DATABASE
    # -----------------------------------------------------

    if any(
        word in text
        for word in [
            "database",
            "mongodb",
            "mysql",
            "postgresql",
            "redis"
        ]
    ):

        return (
            "Asad works with MongoDB, MySQL, PostgreSQL "
            "and Redis, including database design, "
            "query optimization and scalable data access."
        )

    # -----------------------------------------------------
    # AI
    # -----------------------------------------------------

    if any(
        word in text
        for word in [
            "ai",
            "artificial intelligence",
            "openai",
            "gemini",
            "rag",
            "langchain",
            "langgraph",
            "agent",
            "llm"
        ]
    ):

        return (
            "Asad works with modern AI technologies "
            "including OpenAI, Gemini, LangChain, "
            "LangGraph, RAG, LLM applications and "
            "AI Agents."
        )

    # -----------------------------------------------------
    # PROJECT
    # -----------------------------------------------------

    if any(
        word in text
        for word in [
            "project",
            "projects",
            "portfolio",
            "work"
        ]
    ):

        return (
            "Asad has worked on enterprise dashboards, "
            "SaaS applications, REST APIs, real-time "
            "applications, ERP/POS systems, AI-powered "
            "applications and cloud-based solutions."
        )

    # -----------------------------------------------------
    # CONTACT
    # -----------------------------------------------------

    if any(
        word in text
        for word in [
            "contact",
            "hire",
            "hiring",
            "email"
        ]
    ):

        return (
            "You can contact Asad via email at "
            "crypton.futuremedia1989@gmail.com. "
            "You can also connect through LinkedIn "
            "or WhatsApp."
        )

    # -----------------------------------------------------
    # GITHUB
    # -----------------------------------------------------

    if "github" in text:

        return (
            "You can explore Asad's GitHub projects here: "
            "https://github.com/cryptonfuture"
        )

    # -----------------------------------------------------
    # LINKEDIN
    # -----------------------------------------------------

    if "linkedin" in text:

        return (
            "You can connect with Asad on LinkedIn here: "
            "https://www.linkedin.com/in/asad-akbar-1890892b2/"
        )

    # -----------------------------------------------------
    # WHATSAPP
    # -----------------------------------------------------

    if "whatsapp" in text:

        return (
            "You can contact Asad directly on WhatsApp: "
            "https://wa.me/923222382819"
        )

    # -----------------------------------------------------
    # DEFAULT
    # -----------------------------------------------------

    return (
        "I can help you with information about Asad's "
        "experience, skills, projects, frontend/backend "
        "development, AI work and contact details."
    )


# =========================================================
# CHAT API
# =========================================================

@app.post(
    "/api/chat",
    response_model=ChatResponse
)
async def chat(
    request: ChatRequest
):

    reply = generate_reply(
        request.message
    )

    # -----------------------------------------------------
    # SAVE CHAT
    # -----------------------------------------------------

    if db is not None:

        try:

            db[
                "chat_messages"
            ].insert_one({

                "message":
                    request.message,

                "reply":
                    reply,

                "createdAt":
                    datetime.utcnow()

            })

        except Exception as error:

            print(
                "MongoDB save error:",
                error
            )

    return {

        "reply":
            reply

    }


# =========================================================
# RUN
# =========================================================

if __name__ == "__main__":

    import uvicorn

    uvicorn.run(
        app,
        host="0.0.0.0",
        port=PORT
    )