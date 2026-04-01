# MediCare — Patient Management System

A simple full-stack web app to manage patients, doctors, and appointments. Built using React, Node.js, Express, and MongoDB.

---

## Live Demo

URL: https://patient-management-system-eight-xi.vercel.app/

Login Credentials:
- Email: admin@gmail.com
- Password: admin123

---

## How to Run

### Backend
cd backend
npm install
cp .env.example .env
npm run dev

Backend: http://localhost:5000

### Frontend
cd frontend
npm install
npm run dev

Frontend: http://localhost:5173

---

## .env Example

Create a `.env` file inside backend folder:

PORT=5000
MONGO_URI=mongodb://localhost:27017/patient_management
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173

---

## Create Admin

POST http://localhost:5000/api/auth/register

{
  "name": "Admin",
  "email": "admin@clinic.com",
  "password": "admin123"
}

---

## Features

- JWT Authentication  
- Manage patients, doctors, appointments  
- CRUD operations  
- Search & pagination  
- Responsive UI  

---

## Tech Stack

- React, Tailwind CSS  
- Node.js, Express  
- MongoDB  
- JWT Auth  

---

## Overview

Basic healthcare management system demonstrating full-stack development.
