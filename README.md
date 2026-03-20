# Lab 07: Multi-Role User System (RBAC)

## Student Details
- **Name:** Kunal Sharma
- **Enrollment:** CS-2341057
- **Section:** 3CSE15 (G1)
- **GitHub Repo:** [https://github.com/Roshians/Web-Tech-Lab-06](https://github.com/Roshians/Web-Tech-Lab-06)

## Overview
This project implements a Fullstack Role-Based Access Control (RBAC) system with **USER**, **ADMIN**, and **SUPER_ADMIN** roles.

## Setup Instructions

### Backend (Node.js + Express)
1.  Navigate to the `backend/` directory.
2.  Install dependencies: `npm install`
3.  Set up the `.env` file (see `.env.example` if needed):
    - `PORT=3007`
    - `JWT_SECRET=supersecretlab07jwt`
4.  Start the server: `npm start`

### Frontend (React + Vite)
1.  Navigate to the `frontend/` directory.
2.  Install dependencies: `npm install`
3.  Start the development server: `npm start`
4.  Open `http://localhost:3008` in your browser.

## Test Accounts (Seed/Startup Credentials)
- **SUPER_ADMIN:** `super@lab.com` (password: `super123`)
- *(Additional ADMINs and USERs can be created via the Super Admin dashboard or the Register feature)*

## Features & RBAC
- **SUPER_ADMIN:** Full control (manage all users, change roles, delete accounts).
- **ADMIN:** Manage USER role accounts (view USERs, create USER, delete USER).
- **USER:** Restricted to own profile view (`/api/users/me`).

## Project Structure
- `backend/`: Express server, auth middleware, role-based controllers.
- `frontend/`: React components (`Login.jsx`, `Dashboard.jsx`, `UserManagement.jsx`).
- `report.tex`: LaTeX source for the Lab 07 report.
