
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ExternalLink,
  ArrowRight,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ServerCog
} from "lucide-react";

import Patient from "../assets/patient.png";
import Expense from "../assets/expense.png";
import Masjid from "../assets/masjid.png";
import Inventory from "../assets/inventory.png";
import Water from "../assets/water.jpeg";
import Rfid from "../assets/rfid.jpeg";
import Back from "../assets/Back.jpg"
import Bus from "../assets/Bus.png"
import Train from "../assets/train.png"
import Flight from "../assets/flight.png"
import Medical from "../assets/Medical.png"
import Lucky from "../assets/Lucky.jpeg"
import Visa from "../assets/visa.jpeg"
import POS from "../assets/POS.jpeg"
import ERP from "../assets/erp.jpeg"
import Account from "../assets/account.jpeg"
import Banking from "../assets/Banking.jpeg"
import Qibla from "../assets/qibla.jpeg"
import Blood from "../assets/blood.jpeg"
import Pandemic from "../assets/Pandemic.jpeg"

import "../css/Projects.css";

const projects = [
  {
    title: "Patient Tracker Application",
    category: "web",
    type: "Full Stack",
    image: Patient,
    description:
      "AI-powered patient tracking platform with authentication, conversations and scalable backend architecture.",
    tech: [
      "React",
      "Node.js",
      "Express.js",
      "MongoDB",
      "Python",
      "Flask",
      "LLM",
    ],
    liveUrl: "https://patienttrackerfrontend.vercel.app/",
    githubUrl: "https://github.com/CryptonFuture/patient_tracker_app",
  },

  {
    title: "Masjid NearBy Application",
    category: "web",
    type: "Full Stack",
    image: Masjid,
    description:
      "Secure authentication API with JWT access tokens, refresh tokens and role-based authorization.",
    tech: [
      "React",
      "Node.js",
      "Express",
      "MongoDB",
      "Python",
      "Flask",
      "LLM",
    ],
    liveUrl: "https://masjidnearbyfrontend.vercel.app/",
    githubUrl: "https://github.com/CryptonFuture/masjid_nearby_app",
  },

  {
    title: "Expense Tracker Application",
    category: "web",
    type: "Full Stack",
    image: Expense,
    description:
      "Responsive analytics dashboard with charts, CRUD operations and REST API integration.",
    tech: [
      "React",
      "Node.js",
      "Express.js",
      "MongoDB",
      "Python",
      "Flask",
      "LLM",
    ],
    liveUrl: "https://expensetrackerfrontend-nine.vercel.app/",
    githubUrl: "https://github.com/yourusername/expense-tracker",
  },

  {
    title: "Inventory Management System",
    category: "web",
    type: "Full Stack",
    image: Inventory,
    description:
      "Containerized Node.js application with Docker and automated GitHub Actions CI/CD.",
    tech: [
      "React",
      "Node.js",
      "Express.js",
      "MongoDB",
      "Python",
      "FastAPI",
      "LLM",
    ],
    liveUrl: "https://invfrontend.vercel.app/",
    githubUrl: "https://github.com/CryptonFuture/inventory_management_system",
  },

  {
    title: "Water Planet Management System",
    category: "web",
    type: "Full Stack",
    image: Water,
    description:
      "Scalable REST API with authentication, CRUD operations and MongoDB integration.",
    tech: [
      "React",
      "Node.js",
      "Express.js",
      "MongoDB",
      "Python",
      "FastAPI",
      "LLM",
    ],
    liveUrl: "https://waterfrontend-three.vercel.app/",
    githubUrl: "https://github.com/CryptonFuture/water_planet_management_system",
  },

  {
    title: "RFID Management System",
    category: "web",
    type: "Full Stack",
    image: Rfid,
    description:
      "Modern RFID management system with real-time tag scanning, inventory tracking and scalable backend architecture.",
    tech: [
      "React",
      "Node.js",
      "Express.js",
      "MongoDB",
      "Python",
      "FastAPI",
      "LLM",
    ],
    liveUrl: "https://rfidfrontend-two.vercel.app/",
    githubUrl: "https://github.com/CryptonFuture/rfid_management_system",
  },

    {
    title: "Bus Ticketing System",
    category: "web",
    type: "Full Stack",
    image: Bus,
    description:
      "A modern full-stack bus ticketing platform for managing routes, schedules, seat reservations, passenger bookings and ticket operations with a scalable backend architecture.",
    tech: [
      "React",
      "Node.js",
      "Express.js",
      "MongoDB",
      "Python",
      "FastAPI",
      "LLM",
    ],
    liveUrl: "https://busticketfrontend.vercel.app/",
    githubUrl: "https://github.com/CryptonFuture/Bus-Ticket",
  },

     {
    title: "Train Ticketing System",
    category: "web",
    type: "Full Stack",
    image: Train,
    description:
      "A modern full-stack bus ticketing platform for managing routes, schedules, seat reservations, passenger bookings and ticket operations with a scalable backend architecture.",
    tech: [
      "React",
      "Node.js",
      "Express.js",
      "MongoDB",
      "Python",
      "FastAPI",
      "LLM",
    ],
    liveUrl: "https://trainticketfrontend.vercel.app/",
    githubUrl: "https://github.com/CryptonFuture/train_ticketing_app",
  },

     {
    title: "Flight Ticketing System",
    category: "web",
    type: "Full Stack",
    image: Flight,
    description:
      "A modern full-stack bus ticketing platform for managing routes, schedules, seat reservations, passenger bookings and ticket operations with a scalable backend architecture.",
    tech: [
      "React",
      "Node.js",
      "Express.js",
      "MongoDB",
      "Python",
      "FastAPI",
      "LLM",
    ],
    liveUrl: "https://flightticketfrontend.vercel.app/",
    githubUrl: "https://github.com/CryptonFuture/flight_ticket_app",
  },

       {
    title: "Ai Homeopathic Inventory System",
    category: "web",
    type: "Full Stack",
    image: Medical,
    description:
      "AI-powered medicine inventory system that intelligently identifies medicines and displays real-time availability using smart status indicators.",
    tech: [
     "React",
      "Node.js",
      "Express.js",
      "MongoDB",
      "Python",
      "FastApi",
      "LLM"
    ],
    liveUrl: "https://ai-homeopathic-inventory-frontend.vercel.app/",
    githubUrl: "#",
  },

  {
    title: "Lucky Draw Application",
    category: "web",
    type: "Full Stack",
    image: Lucky,
    description:
      "AI-powered medicine inventory system that intelligently identifies medicines and displays real-time availability using smart status indicators.",
    tech: [
     "React",
      "Node.js",
      "Express.js",
      "MongoDB",
      "Python",
      "FastApi",
      "LLM"
    ],
    liveUrl: "https://luckyfrontend.vercel.app/",
    githubUrl: "https://github.com/CryptonFuture/lucky_draw_backend",
  },

    {
    title: "Visa Management System",
    category: "web",
    type: "Full Stack",
    image: Visa,
    description:
      "AI-powered medicine inventory system that intelligently identifies medicines and displays real-time availability using smart status indicators.",
    tech: [
      "React",
      "Node.js",
      "Express.js",
      "MongoDB",
      "Python",
      "FastApi",
      "LLM"
    ],
    liveUrl: "https://visafrontend-three.vercel.app/",
    githubUrl: "https://github.com/CryptonFuture/visa_management_system",
  },

    {
    title: "POS Management System",
    category: "web",
    type: "Full Stack",
    image: POS,
    description:
      "AI-powered medicine inventory system that intelligently identifies medicines and displays real-time availability using smart status indicators.",
    tech: [
      "React",
      "Node.js",
      "Express.js",
      "MongoDB",
      "Python",
      "FastApi",
      "LLM"
    ],
    liveUrl: "https://posfrontend-dun.vercel.app/",
    githubUrl: "https://github.com/CryptonFuture/pos_management_system",
  },

    {
    title: "ERP Management System",
    category: "web",
    type: "Full Stack",
    image: ERP,
    description:
      "AI-powered medicine inventory system that intelligently identifies medicines and displays real-time availability using smart status indicators.",
    tech: [
      "React",
      "Node.js",
      "Express.js",
      "MongoDB",
      "Python",
      "FastApi",
      "LLM"
    ],
    liveUrl: "https://erpfrontend-two.vercel.app/",
    githubUrl: "https://github.com/CryptonFuture/erp_management_system",
  },

     {
    title: "Accounting Application",
    category: "web",
    type: "Full Stack",
    image: Account,
    description:
      "AI-powered medicine inventory system that intelligently identifies medicines and displays real-time availability using smart status indicators.",
    tech: [
      "React",
      "Node.js",
      "Express.js",
      "MongoDB",
      "Python",
      "FastApi",
      "LLM"
    ],
    liveUrl: "https://accountfrontend.vercel.app/",
    githubUrl: "https://github.com/CryptonFuture/accounting_app",
  },

   {
    title: "Banking Application",
    category: "web",
    type: "Full Stack",
    image: Banking,
    description:
      "AI-powered medicine inventory system that intelligently identifies medicines and displays real-time availability using smart status indicators.",
    tech: [
      "React",
      "Node.js",
      "Express.js",
      "MongoDB",
      "Python",
      "FastApi",
      "LLM"
    ],
    liveUrl: "https://bankingfrontend-pied.vercel.app/",
    githubUrl: "https://github.com/CryptonFuture/banking_app",
  },

   {
    title: "Qibla Application",
    category: "web",
    type: "Full Stack",
    image: Qibla,
    description:
      "AI-powered medicine inventory system that intelligently identifies medicines and displays real-time availability using smart status indicators.",
    tech: [
      "React",
      "Node.js",
      "Express.js",
      "MongoDB",
      "Python",
      "FastApi",
      "LLM"
    ],
    liveUrl: "https://qiblafrontend.vercel.app/",
    githubUrl: "https://github.com/CryptonFuture/qibla_app",
  },

   {
    title: "Blood Bank Application",
    category: "web",
    type: "Full Stack",
    image: Blood,
    description:
      "AI-powered medicine inventory system that intelligently identifies medicines and displays real-time availability using smart status indicators.",
    tech: [
      "React",
      "Node.js",
      "Express.js",
      "MongoDB",
      "Python",
      "FastApi",
      "LLM"
    ],
    liveUrl: "https://bloodfrontend-six.vercel.app/",
    githubUrl: "https://github.com/CryptonFuture/blood_bank_management_system",
  },

     {
    title: "Pandemic Tracker Application",
    category: "web",
    type: "Full Stack",
    image: Pandemic,
    description:
      "AI-powered medicine inventory system that intelligently identifies medicines and displays real-time availability using smart status indicators.",
    tech: [
      "React",
      "Node.js",
      "Express.js",
      "MongoDB",
      "Python",
      "FastApi",
      "LLM"
    ],
    liveUrl: "https://pandemicfrontend.vercel.app/",
    githubUrl: "https://github.com/CryptonFuture/Pandemic_Tracker",
  },
  

   {
    title: "Backend",
    category: "backend",
    type: "backend",
    image: Back,
    description:
      "Backend Development & API Engineering",
    tech: [
      "Node.js",
      "Express.js",
      "MongoDB",
      "Postgresql",
      "MySql",
      "Mssql",
      "Nest.js",
      "Prisma",
      "sequelize",
      "Adonis.js",
      "Knex"
    ],
  },
];

const filters = [
  { id: "all", label: "All Projects" },
  { id: "web", label: "Web Development" },
  { id: "backend", label: "Backend & DevOps" },
];

function Projects() {
  const [filter, setFilter] = useState("all");

  // ============================================================
  // Pagination
  // ============================================================

  const [currentPage, setCurrentPage] = useState(1);

  // Projects per page
  const projectsPerPage = 3;

  // ============================================================
  // Filter Projects
  // ============================================================

  const filtered =
    filter === "all"
      ? projects
      : projects.filter(
          (project) => project.category === filter
        );

  // ============================================================
  // Pagination Calculations
  // ============================================================

  const totalPages = Math.ceil(
    filtered.length / projectsPerPage
  );

  const startIndex =
    (currentPage - 1) * projectsPerPage;

  const endIndex =
    startIndex + projectsPerPage;

  const paginatedProjects = filtered.slice(
    startIndex,
    endIndex
  );

  // ============================================================
  // Reset Page When Filter Changes
  // ============================================================

  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

  // ============================================================
  // Pagination Handlers
  // ============================================================

  const goToPage = (page) => {
    setCurrentPage(page);

    // Smooth scroll back to projects
    document
      .getElementById("projects")
      ?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      goToPage(currentPage + 1);
    }
  };

  const previousPage = () => {
    if (currentPage > 1) {
      goToPage(currentPage - 1);
    }
  };

  return (
    <section id="projects" className="section projects">
      <div className="container">

        {/* Background decoration */}
        <div className="projects-bg-orb projects-bg-orb-1" />
        <div className="projects-bg-orb projects-bg-orb-2" />

        {/* =====================================================
            Heading
        ====================================================== */}

        <motion.div
          className="section-heading projects-heading"
          initial={{
            opacity: 0,
            y: 35,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            duration: 0.7,
          }}
        >
          <div className="heading-number">
            <Sparkles size={15} />
            <span>05</span>
          </div>

          <h2>
            My <span>Projects</span>
          </h2>

          <p>
            Some things I've built with modern technologies
          </p>
        </motion.div>

        {/* =====================================================
            Filters
        ====================================================== */}

        <motion.div
          className="project-filters"
          initial={{
            opacity: 0,
            y: 20,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            duration: 0.6,
          }}
        >
          {filters.map((item) => (
            <button
              key={item.id}
              className={
                filter === item.id ? "active" : ""
              }
              onClick={() => setFilter(item.id)}
            >
              {item.label}

              {filter === item.id && (
                <motion.span
                  layoutId="activeFilter"
                  className="filter-active-bg"
                />
              )}
            </button>
          ))}
        </motion.div>

        {/* =====================================================
            Project Grid
        ====================================================== */}

        <motion.div
          layout
          className="projects-grid"
        >
          <AnimatePresence mode="popLayout">
            {paginatedProjects.map(
              (project, index) => (
                <motion.article
                  layout
                  key={project.title}
                  className="project-card"

                  initial={{
                    opacity: 0,
                    y: 40,
                    scale: 0.96,
                  }}

                  animate={{
                    opacity: 1,
                    y: 0,
                    scale: 1,
                  }}

                  exit={{
                    opacity: 0,
                    y: 25,
                    scale: 0.94,
                  }}

                  transition={{
                    duration: 0.5,
                    delay: index * 0.07,
                  }}

                  whileHover={{
                    y: -12,
                  }}
                >

                  {/* =================================================
                      Image
                  ================================================== */}

                  <div className="project-image">

                    <div className="project-image-grid" />

                    <div className="project-image-glow" />

                    <span className="project-number">
                      {String(
                        startIndex + index + 1
                      ).padStart(2, "0")}
                    </span>

                    <motion.div
                      className="project-image-inner"
                      whileHover={{
                        scale: 1.12,
                      }}
                      transition={{
                        duration: 0.6,
                        ease: "easeOut",
                      }}
                    >
                      <img
                        src={project.image}
                        alt={project.title}
                      />
                    </motion.div>

                    {/* Actions */}

                    <div className="project-actions">

                      <motion.a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="project-action"
                        aria-label={`View ${project.title} Live`}
                        whileHover={{
                          scale: 1.12,
                          y: -4,
                        }}
                        whileTap={{
                          scale: 0.95,
                        }}
                      >
                        <ExternalLink size={18} />
                      </motion.a>

                      <motion.a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="project-action"
                        aria-label={`${project.title} GitHub`}
                        whileHover={{
                          scale: 1.12,
                          y: -4,
                        }}
                        whileTap={{
                          scale: 0.95,
                        }}
                      >
                        <i className="fab fa-github" />
                      </motion.a>

                    </div>
                  </div>

                  {/* =================================================
                      Content
                  ================================================== */}

                  <div className="project-content">

                    <div className="project-category">
                      <span />
                      {project.type}
                    </div>

                    <h3>
                      {project.title}
                    </h3>

                    <p>
                      {project.description}
                    </p>

                    <div className="project-tech">
                      {project.tech.map(
                        (tech) => (
                          <span key={tech}>
                            {tech}
                          </span>
                        )
                      )}
                    </div>

                    <div className="project-card-footer">

                      <span>
                        View Project
                      </span>

                      <ArrowRight size={17} />

                    </div>

                  </div>

                </motion.article>
              )
            )}
          </AnimatePresence>
        </motion.div>

        {/* =====================================================
            Pagination
        ====================================================== */}

        {totalPages > 1 && (
          <motion.div
            className="projects-pagination"

            initial={{
              opacity: 0,
              y: 20,
            }}

            whileInView={{
              opacity: 1,
              y: 0,
            }}

            viewport={{
              once: true,
            }}

            transition={{
              duration: 0.6,
            }}
          >

            {/* Previous */}

            <button
              className="pagination-btn pagination-prev"
              onClick={previousPage}
              disabled={currentPage === 1}
              aria-label="Previous page"
            >
              <ChevronLeft size={18} />
              <span>Previous</span>
            </button>

            {/* Page Numbers */}

            <div className="pagination-numbers">

              {Array.from(
                { length: totalPages },
                (_, index) => index + 1
              ).map((page) => (

                <button
                  key={page}
                  className={
                    currentPage === page
                      ? "active"
                      : ""
                  }
                  onClick={() =>
                    goToPage(page)
                  }
                >
                  {String(page).padStart(2, "0")}
                </button>

              ))}

            </div>

            {/* Next */}

            <button
              className="pagination-btn pagination-next"
              onClick={nextPage}
              disabled={
                currentPage === totalPages
              }
              aria-label="Next page"
            >
              <span>Next</span>
              <ChevronRight size={18} />
            </button>

          </motion.div>
        )}

        {/* =====================================================
            Pagination Info
        ====================================================== */}

        {/* {filtered.length > 0 && (
          <motion.div
            className="pagination-info"

            initial={{
              opacity: 0,
            }}

            animate={{
              opacity: 1,
            }}
          >
            Showing{" "}
            <strong>
              {startIndex + 1}
            </strong>{" "}
            -{" "}
            <strong>
              {Math.min(
                endIndex,
                filtered.length
              )}
            </strong>{" "}
            of{" "}
            <strong>
              {filtered.length}
            </strong>{" "}
            projects
          </motion.div>
        )} */}

        {/* =====================================================
            CTA
        ====================================================== */}

        <motion.div
          className="projects-cta"

          initial={{
            opacity: 0,
            y: 30,
          }}

          whileInView={{
            opacity: 1,
            y: 0,
          }}

          viewport={{
            once: true,
          }}

          transition={{
            duration: 0.7,
          }}
        >

          <div className="projects-cta-icon">
            <i className="fab fa-github" />
          </div>

          <div className="projects-cta-text">

            <span>
              MORE PROJECTS
            </span>

            <p>
              Want to explore more of my work?
            </p>

          </div>

          <a
            href="https://github.com/MuhammadAsadAliAkbar"
            target="_blank"
            rel="noreferrer"
            className="github-btn"
          >
            <i className="fab fa-github" />

            <span>
              View My GitHub
            </span>

            <ArrowRight size={17} />
          </a>

        </motion.div>

      </div>
    </section>
  );
}

export default Projects;


