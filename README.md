# MediCare — Patient Management System

A full-stack healthcare patient management system built with React, Tailwind CSS, Node.js, Express, and MongoDB.

---

## Project Structure

```
patient-mgmt/
├── backend/
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── patient.controller.js
│   │   ├── doctor.controller.js
│   │   ├── appointment.controller.js
│   │   └── dashboard.controller.js
│   ├── middleware/
│   │   └── auth.middleware.js
│   ├── models/
│   │   ├── Admin.model.js
│   │   ├── Patient.model.js
│   │   ├── Doctor.model.js
│   │   └── Appointment.model.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── patient.routes.js
│   │   ├── doctor.routes.js
│   │   ├── appointment.routes.js
│   │   └── dashboard.routes.js
│   ├── .env.example
│   ├── package.json
│   └── server.js
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Layout.jsx
    │   │   ├── Modal.jsx
    │   │   ├── ConfirmDialog.jsx
    │   │   └── StatCard.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── pages/
    │   │   ├── HomePage.jsx
    │   │   ├── LoginPage.jsx
    │   │   ├── DashboardPage.jsx
    │   │   ├── PatientsPage.jsx
    │   │   ├── DoctorsPage.jsx
    │   │   └── AppointmentsPage.jsx
    │   ├── utils/
    │   │   └── api.js
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    └── postcss.config.js
```

---

## Prerequisites

- Node.js v18+
- MongoDB (local installation or MongoDB Atlas)
- npm

---

## Setup & Installation

### 1. Clone / unzip the project

```bash
cd patient-mgmt
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create your `.env` file:

```bash
cp .env.example .env
```

Edit `.env` with your values:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/patient_management
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRES_IN=7d
```

Start the backend:

```bash
# Development (with auto-restart)
npm run dev

# Production
npm start
```

The API will be running at `http://localhost:5000`.

### 3. Frontend Setup

```bash
cd ../frontend
npm install
npm run dev
```

The frontend will be running at `http://localhost:5173`.

---

## First-Time Admin Registration

The system uses JWT-based authentication. To create your first admin account, make a POST request:

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Admin","email":"admin@clinic.com","password":"admin123"}'
```

Or use Postman / any REST client to call:

**POST** `http://localhost:5000/api/auth/register`
```json
{
  "name": "Admin",
  "email": "admin@clinic.com",
  "password": "admin123"
}
```

You can then log in at `http://localhost:5173/login`.

---

## API Endpoints

### Auth
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register admin | No |
| POST | `/api/auth/login` | Login admin | No |
| GET | `/api/auth/me` | Get current admin | Yes |

### Patients
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/patients` | Get all patients (supports `?search=&page=&limit=`) | Yes |
| GET | `/api/patients/:id` | Get patient by ID | Yes |
| POST | `/api/patients` | Create patient | Yes |
| PUT | `/api/patients/:id` | Update patient | Yes |
| DELETE | `/api/patients/:id` | Soft-delete patient | Yes |

### Doctors
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/doctors` | Get all doctors (supports `?search=&specialization=`) | Yes |
| GET | `/api/doctors/:id` | Get doctor by ID | Yes |
| POST | `/api/doctors` | Create doctor | Yes |
| PUT | `/api/doctors/:id` | Update doctor | Yes |
| DELETE | `/api/doctors/:id` | Soft-delete doctor | Yes |

### Appointments
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/appointments` | Get all appointments (supports `?status=&date=&page=&limit=`) | Yes |
| GET | `/api/appointments/:id` | Get appointment by ID | Yes |
| POST | `/api/appointments` | Create appointment | Yes |
| PUT | `/api/appointments/:id` | Update appointment | Yes |
| DELETE | `/api/appointments/:id` | Delete appointment | Yes |

### Dashboard
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/dashboard/stats` | Get overview statistics | Yes |

---

## Features

### Pages
- **Home Page** — Landing page with feature overview
- **Login Page** — Admin authentication with JWT
- **Dashboard** — Stats cards, recent appointments, status breakdown
- **Patients** — Add/Edit/Delete with search and pagination
- **Doctors** — Card-based layout with specialization and availability
- **Appointments** — Tabular view with status filtering and booking modal

### Core Features
- JWT-based admin authentication with protected routes
- Full CRUD for patients, doctors, and appointments
- Soft-delete for patients and doctors (preserves data integrity)
- Real-time search and status filtering
- Pagination on patients and appointments
- Responsive design (mobile + desktop)
- Toast notifications for all actions

### Tech Stack
| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router v6, Tailwind CSS 3 |
| HTTP Client | Axios |
| Backend | Node.js, Express 4 |
| Database | MongoDB with Mongoose |
| Auth | JWT + bcryptjs |
| Dev Tools | Vite, Nodemon |

---

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Backend server port | `5000` |
| `MONGO_URI` | MongoDB connection string | — |
| `JWT_SECRET` | Secret key for signing tokens | — |
| `JWT_EXPIRES_IN` | Token expiry duration | `7d` |
| `CLIENT_URL` | Frontend origin for CORS | `http://localhost:5173` |
