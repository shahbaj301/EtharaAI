# 🚀 TeamFlow – Full Stack Team Task Manager

TeamFlow is a modern full-stack collaborative task management web application built using the MERN stack.  
The application allows teams to create projects, manage members, assign tasks, and track work progress through a responsive dashboard interface.

This project was developed as a full-stack coding assignment demonstrating frontend, backend, authentication, database management, REST APIs, role-based access control, and deployment skills.

---

# ✨ Features

## 🔐 Authentication
- User Signup & Login
- JWT Authentication
- Protected Routes
- Secure Password Hashing using bcrypt

---

## 📁 Project Management
- Create Projects
- Project Creator becomes Admin automatically
- Add and Remove Members
- View Joined Projects

---

## ✅ Task Management
- Create Tasks
- Assign Tasks to Members
- Task Priority Support
  - Low
  - Medium
  - High
- Task Status Tracking
  - To Do
  - In Progress
  - Done
- Due Date Management

---

## 👥 Role-Based Access Control

### 👑 Admin
- Create Projects
- Add/Remove Members
- Create Tasks
- Delete Tasks
- View All Tasks

### 👨‍💻 Member / Student
- View Assigned Projects
- View Assigned Tasks
- Update Assigned Task Status

---

## 📊 Dashboard Analytics
- Total Projects
- Total Tasks
- Tasks by Status
- Tasks per User
- Overdue Tasks

---

# 🛠️ Tech Stack

## Frontend
- React.js
- Tailwind CSS
- React Router DOM
- Axios
- Lucide React Icons

## Backend
- Node.js
- Express.js
- JWT Authentication
- bcryptjs

## Database
- MongoDB Atlas
- Mongoose ODM

## Deployment
- Railway

---

# 📂 Folder Structure

```txt
teamflow/
│
├── server/
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── dashboard.controller.js
│   │   ├── project.controller.js
│   │   └── task.controller.js
│   │
│   ├── middleware/
│   │   └── auth.middleware.js
│   │
│   ├── models/
│   │   ├── project.model.js
│   │   ├── task.model.js
│   │   └── user.model.js
│   │
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── dashboard.routes.js
│   │   ├── project.routes.js
│   │   └── task.routes.js
│   │
│   ├── utils/
│   │   └── generateToken.js
│   │
│   ├── .env
│   ├── index.js
│   └── package.json
│
└── client/
    └── vite-project/
        ├── src/
        │   ├── api/
        │   │   └── api.js
        │   │
        │   ├── components/
        │   │   ├── Layout.jsx
        │   │   └── ProtectedRoute.jsx
        │   │
        │   ├── context/
        │   │   └── AuthContext.jsx
        │   │
        │   ├── pages/
        │   │   ├── Dashboard.jsx
        │   │   ├── Login.jsx
        │   │   ├── ProjectDetails.jsx
        │   │   ├── Projects.jsx
        │   │   └── Signup.jsx
        │   │
        │   ├── App.jsx
        │   ├── main.jsx
        │   └── index.css
        │
        ├── .env
        └── package.json
