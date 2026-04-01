# MediCare — Patient Management System

MediCare is a full-stack healthcare management system that helps manage patients, doctors, and appointments efficiently. It provides a clean UI with secure authentication and complete CRUD functionality.

---

## 🌐 Live Demo

https://patient-management-system-eight-xi.vercel.app/

**Login Credentials**
- Email: admin@gmail.com  
- Password: admin123  

---

## 📌 Project Overview

This project demonstrates a real-world full-stack application with:

- Authentication using JWT
- Patient, Doctor, and Appointment management
- Search, filtering, and pagination
- Responsive UI for desktop and mobile

It follows a structured architecture with separate frontend and backend.

---

## ⚙️ Tech Stack

- Frontend: React, Tailwind CSS
- Backend: Node.js, Express
- Database: MongoDB
- Authentication: JWT

---

## 🚀 Setup Instructions

### 1. Clone the project

cd patient-mgmt

---

### 2. Backend Setup

cd backend  
npm install  

Create `.env` file:

PORT=5000  
MONGO_URI=mongodb://localhost:27017/patient_management  
JWT_SECRET=your_secret_key  
JWT_EXPIRES_IN=7d  
CLIENT_URL=http://localhost:5173  

Run backend:

npm run dev  

Backend runs on: http://localhost:5000  

---

### 3. Frontend Setup

cd frontend  
npm install  
npm run dev  

Frontend runs on: http://localhost:5173  

---

## 👤 Admin Setup

Create admin using API:

POST http://localhost:5000/api/auth/register  

{
  "name": "Admin",
  "email": "admin@clinic.com",
  "password": "admin123"
}

Then login from frontend.

---

## ✨ Features

- Secure login and authentication  
- Manage patients, doctors, appointments  
- Add, update, delete records  
- Search and pagination  
- Responsive design  

---

## 🧠 Summary

MediCare is a simple yet complete full-stack project suitable for learning and demonstrating real-world development skills.
