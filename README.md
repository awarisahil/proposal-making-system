# Proposal Making System

A full-stack **Proposal Management System** designed to help organizations create, manage, edit, version, and track business proposals through a centralized web application.

The system provides authentication, client management, product catalog management, proposal creation, proposal versioning, proposal workflow, organization branding, and proposal templates.

---

## 🚀 Features

### 🔐 Authentication & Authorization

* User login and authentication
* JWT-based authentication
* Access and refresh token handling
* Protected frontend routes
* Role-based access control
* Secure logout and token management

### 👥 Client Management

* Create and manage clients
* Store client information
* View and update client details
* Use client information while creating proposals

### 🏢 Organization Management

* Manage organization information
* Organization branding support
* Upload organization assets such as logos
* Centralized organization configuration

### 📦 Product Catalog

* Create and manage products
* Maintain product pricing
* Use products while preparing proposals
* Centralized product catalog

### 📄 Proposal Management

* Create proposals
* Edit proposals
* View proposal details
* Manage proposal information
* Proposal pricing calculations
* Proposal activity tracking
* Proposal workflow management

### 🔄 Proposal Versioning

* Maintain multiple versions of proposals
* Track proposal version status
* Create and manage proposal revisions
* Preserve proposal history

### 🎨 Proposal Templates

The backend includes multiple proposal templates:

* Corporate
* Minimal
* Modern

Templates are structured to allow proposals to be generated with different layouts and styles.

### 📎 Document & File Management

* Proposal document handling
* Organization file uploads
* Uploaded assets associated with proposals/organizations

### 📊 Dashboard

The frontend provides a dashboard for accessing the main proposal-management functionality.

---

## 🛠️ Tech Stack

### Frontend

* React
* TypeScript
* Vite
* React Router
* CSS
* API-based communication with backend

### Backend

* Node.js
* Express.js
* TypeScript
* Prisma ORM
* PostgreSQL
* JWT
* Zod

### Database

* PostgreSQL
* Prisma migrations

---

## 📁 Project Structure

```text
proposal-management-system/
│
├── backend/
│   ├── prisma/
│   │   ├── migrations/
│   │   ├── schema.prisma
│   │   └── seed.ts
│   │
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── templates/
│   │   ├── utils/
│   │   ├── validators/
│   │   └── server.ts
│   │
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── features/
│   │   ├── hooks/
│   │   ├── layouts/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── types/
│   │   └── utils/
│   │
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
│
└── README.md
```

---

## 🔄 Application Architecture

```text
                    ┌─────────────────────┐
                    │      Frontend       │
                    │  React + TypeScript │
                    │       + Vite        │
                    └──────────┬──────────┘
                               │
                               │ REST API
                               ▼
                    ┌─────────────────────┐
                    │       Backend       │
                    │ Node.js + Express   │
                    │      TypeScript     │
                    └──────────┬──────────┘
                               │
                         Prisma ORM
                               │
                               ▼
                    ┌─────────────────────┐
                    │     PostgreSQL      │
                    │      Database       │
                    └─────────────────────┘
```

---

## ⚙️ Prerequisites

Before running the project, make sure you have installed:

* Node.js
* npm
* PostgreSQL
* Git

---

# 🖥️ Backend Setup

Navigate to the backend:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

### Environment Variables

Create a `.env` file inside the `backend` directory.

Example:

```env
PORT=5000
NODE_ENV=development
DATABASE_URL="your-postgresql-connection-string"
```

Use your own database credentials and configuration.

### Database Setup

Run Prisma migrations:

```bash
npx prisma migrate dev
```

Generate the Prisma client:

```bash
npx prisma generate
```

If seed data is required, run the project's seed configuration.

### Start Backend

For development:

```bash
npm run dev
```

The backend runs on:

```text
http://localhost:5000
```

---

# 🌐 Frontend Setup

Open another terminal and navigate to:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Create the required environment configuration according to the frontend API configuration.

Start the development server:

```bash
npm run dev
```

Vite will provide the local frontend URL in the terminal, normally:

```text
http://localhost:5173
```

---

## 🔑 Authentication Flow

The application uses JWT-based authentication.

The general authentication flow is:

```text
User
 │
 ▼
Login Page
 │
 ▼
Authentication API
 │
 ▼
Backend validates credentials
 │
 ▼
JWT Access + Refresh Tokens
 │
 ▼
Authenticated Frontend
 │
 ▼
Protected API Routes
```

Protected frontend routes prevent unauthenticated users from accessing application functionality.

---

## 🗄️ Database

The project uses **PostgreSQL** with **Prisma ORM**.

Database changes are managed through Prisma migrations.

The project contains migrations covering areas such as:

* Initial database setup
* User email uniqueness
* Clients
* Product catalog
* Proposal core functionality
* Proposal versioning
* Proposal version status
* Organization branding

---

## 📋 Main Modules

| Module             | Purpose                               |
| ------------------ | ------------------------------------- |
| Authentication     | Login, tokens and user authentication |
| Users              | User-related functionality            |
| Organizations      | Organization information and branding |
| Clients            | Client management                     |
| Products           | Product catalog                       |
| Proposals          | Proposal creation and management      |
| Proposal Versions  | Proposal revision/version management  |
| Proposal Workflow  | Proposal status and workflow          |
| Proposal Documents | Proposal document handling            |
| Templates          | Proposal template system              |
| Dashboard          | Central application interface         |

---

## 🧪 Development

Backend development:

```bash
cd backend
npm run dev
```

Frontend development:

```bash
cd frontend
npm run dev
```

For database-related development:

```bash
cd backend
npx prisma migrate dev
```

---

## 🔒 Environment & Security

Environment files containing secrets should **not** be committed to Git.

Use environment variables for sensitive configuration such as:

* Database credentials
* JWT secrets
* API keys
* Other private configuration

A safe example configuration can be provided using `.env.example`.

---

## 📌 Project Status

The project currently contains a functional full-stack foundation with:

* React frontend
* Node/Express backend
* PostgreSQL database
* Prisma ORM
* Authentication
* Client management
* Product management
* Proposal management
* Proposal versioning
* Proposal workflow
* Organization branding
* Proposal templates

Further development can extend the system with additional proposal-generation, document-export, workflow, and deployment capabilities.

---

## 👨‍💻 Author

**Sahil Awari**

GitHub: [@awarisahil](https://github.com/awarisahil)

---

## 📄 License

This project is currently intended for development and project purposes.
