# Apartment360 – Apartment Housing Management System

A full-stack, role-based web application engineered to streamline residential property operations, tenant leases, and maintenance request lifecycles. Developed as a collaborative capstone project for **Principles of Software Engineering**.

---

## Overview

Managing multi-unit residential properties through spreadsheets and paper logs leads to communication silos, unrecorded maintenance requests, and administrative overhead. **Apartment360** provides a centralized digital solution built on the **MERN stack** (MongoDB, Express.js, React.js, Node.js), integrating real-time unit occupancy tracking, role-guarded portals, and end-to-end maintenance ticket workflows.

---

## Who This Is Made For

* **Property Managers & Administrators:** Need unified visibility over building occupancy, apartment unit inventories, maintenance contractor queues, and tenant lease assignments.
* **Apartment Residents (Tenants):** Need a self-service portal to review assigned unit details, log repair/maintenance tickets, monitor resolution progress, and check billing records.
* **Software Engineering Evaluators & Instructors:** Demonstrates an end-to-end Agile software development lifecycle, featuring formal IEEE-style requirements, four-tier UML models, Git branching/PR workflows, and structured test matrices.

---

## Key Features

### Property Manager (Admin) Portal
* **Real-Time KPI Dashboard:** Dynamic summary cards tracking Total Units, Occupancy Rate (%), and Pending Maintenance Requests.
* **Unit Inventory Management:** Create and track apartment units with attributes including unit number, floor, bedroom count, and monthly rent.
* **1-Click Tenant Assignment:** Assign registered tenants to vacant units and vacate occupied units with synchronized cross-collection updates.
* **Maintenance Triage Queue:** Review incoming resident repair tickets and transition statuses sequentially (`Pending` → `In Progress` → `Resolved`).

### Resident (Tenant) Portal
* **Apartment Overview:** Instant card view showing assigned unit number, floor, monthly rent rate, and occupancy badge.
* **Maintenance Request Dispatch:** Submit detailed service tickets categorized by issue type (Plumbing, Electrical, Appliance, General) and priority level (Low, Medium, High).
* **Live Ticket Tracking:** Real-time log table displaying submission dates, categories, and administrative status updates.
* **Rent & Billing History:** Review rent dues, due dates, payment methods, and verification status.

---

## Tech Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | React 18 (Vite) | Single Page Application (SPA) client architecture |
| **Routing & State** | React Router v6, Context API | Dynamic role-based route guarding & session state |
| **Styling** | Plain CSS / Responsive Flex & Grid | Custom, dependency-free UI layout |
| **Backend API** | Node.js, Express.js | Modular RESTful API routing and controllers |
| **Database** | MongoDB & Mongoose ODM | Document-oriented schema models with data validation |
| **Security** | JSON Web Tokens (JWT), BCrypt.js | Stateless authentication & cryptographic password hashing |
| **Project Management** | Trello, GitHub | Agile Sprint tracking, user stories, and Git PR workflows |

---

## Repository Structure

```text
Apartment Housing Management System/
├── requirements/               # Software Engineering Specifications
│   ├── SRS_Document.md         # Functional & Non-Functional Requirements
│   └── Stakeholder_Analysis.md # Stakeholder Matrix & Elicitation Notes
├── design/                     # Architectural Models & Diagrams
│   ├── UseCase_Specification.md# Use case specs & Draw.io XML
│   ├── Class_Diagram.md        # Mongoose data structures & Class Diagram XML
│   ├── Sequence_Diagram.md     # JWT Auth & Ticket Submission Sequence XML
│   └── Activity_Diagram.md     # Maintenance lifecycle swimlane Activity XML
├── testing/                    # Quality Assurance & Verification
│   ├── Test_Matrix.xlsx        # 14 formal test cases (Unit, Int, Sys, UAT)
│   └── Test_Execution_Summary.md # QA execution summary report
├── client/                     # React + Vite Frontend Application
│   ├── src/
│   │   ├── components/         # Navbar, ProtectedRoute
│   │   ├── context/            # AuthContext (JWT session management)
│   │   ├── pages/              # Login, Register, AdminDashboard, TenantDashboard
│   │   ├── App.jsx             # Route definitions & guards
│   │   └── index.css           # Global stylesheet
│   └── package.json
└── server/                     # Node.js + Express Backend REST API
    ├── config/                 # MongoDB connection initialization
    ├── controllers/            # Auth, Unit, Ticket, Payment business logic
    ├── middleware/             # JWT verification & role-based route protection
    ├── models/                 # Mongoose schemas (User, Unit, Ticket, Payment)
    ├── routes/                 # Express API endpoint declarations
    ├── .env                    # Environment configuration
    ├── package.json
    └── server.js               # Application entry point


---


## Getting Started


Prerequisites
Node.js (v18.x or higher)

npm (v9.x or higher)

MongoDB (Local instance running on mongodb://127.0.0.1:27017 or MongoDB Atlas URI)

Step 1: Clone Repository
git clone https://github.com/DhirenShah76/Apartment-Housing-Management-System
cd Apartment Housing Management System

Step 2: Configure & Start Backend Server
Navigate to the server folder and install dependencies:

cd server
npm install
Create a .env file inside /server with the following variables:
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/apartment360
JWT_SECRET=apartment360_super_secret_jwt_key_2026


Start the backend development server:
npm run dev
Expected output: [Server Running]: http://localhost:5000 and [MongoDB Connected].

Step 3: Configure & Start Frontend Client
Open a new terminal tab, navigate to /client, and install dependencies:
cd client
npm install

Start the Vite React client:
npm run dev
Open your browser and navigate to http://localhost:5173.

