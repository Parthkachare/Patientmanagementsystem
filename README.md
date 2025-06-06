
# 🏥 Healthcare Management System

A full-stack Healthcare Management System built using **Node.js**, **Express**, **MongoDB**, and a modern **HTML/CSS/JavaScript frontend**. 
This project provides secure user authentication, patient record management, data analytics, and a responsive admin dashboard.

---

## 🔍 Project Overview

This project is designed to help healthcare providers manage:
- Patient records
- Medical condition statistics
- Appointments
- User authentication with JWT and sessions
- Role-based dashboards (e.g., Admin)

It includes:
- RESTful APIs for managing data
- Secure authentication with bcrypt & JWT
- A clean, responsive frontend dashboard

---

## 🧰 Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MongoDB with Mongoose
- **Frontend:** HTML, CSS, JavaScript
- **Authentication:** JWT, express-session, bcryptjs
- **Tools:** VSCode, Postman, MongoDB Compass

---

## 🚀 Project Setup

Follow these steps to run the project locally:

### 1. Clone the Repository

```bash
https://github.com/Parthkachare/Patientmanagementsystem
cd healthcare-system
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up MongoDB

- Install **MongoDB** locally OR use **MongoDB Atlas**.
- Create a database (e.g., `healthcare`).
- Update MongoDB connection URI in your `.env` or `server.js` if applicable.

### 4. Seed Initial Data (Optional)

```bash
node seedPatients.js
```

### 5. Start the Server

```bash
node server.js
```

Server will run on [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```
healthcare-system/
│
├── models/                # Mongoose models (User, Patients)
├── routes/                # Express route handlers (auth, patients)
├── controllers/           # Logic for handling routes
├── middleware/            # Custom middleware (auth, session)
├── public/                # Frontend files (HTML, CSS, JS)
│   ├── login.html
│   ├── admin-dashboard.html
│   └── style.css
├── server.js              # Main backend server file
├── package.json
└── README.md
```

---

## 🔐 Authentication

- Registration (`/signup`)
- Login (`/login`)
- JWT is stored in localStorage
- Protected routes like `/dashboard/data` require JWT in `Authorization` header.

---

## 🧪 API Testing

You can test APIs using **Postman**:

- `POST /signup` → Register a user
- `POST /login` → Login and receive JWT
- `GET /dashboard/data` → Get patient data (requires token)
- `POST /patients` → Add patient
- `GET /patients/search?name=...` → Search patients

---

## 📊 Features

- Admin dashboard with:
  - Total patient stats
  - Condition-wise breakdown
  - Recent visits table
- Search and filter patients
- Delete and manage records
- Logout functionality

---

## 🛡 Security

- Passwords are hashed with `bcryptjs`
- Authentication via JWT & session middleware
- Server validates all requests and handles errors securely

---

## 📌 Future Improvements

- Role-based access (Admin, Doctor, Nurse)
- Appointment booking and calendar integration
- Data visualization using Chart.js or Recharts
- Export patient data to PDF/Excel

---

## 🙋‍♂️ Author

**Parth Ravindra Kachare**  
CSE Student • Developer • UI/UX Designer

---

## 📜 License

This project is licensed under the **MIT License**.
