# Mini EdTech CRM Platform

A modern, full-stack EdTech CRM platform for managing student data, segmentation, and campaign automation. Built for speed, reliability, and scalability with robust background processing and a clean, professional UI.

---

## 🚀 Features

- **Google OAuth Authentication**
- **Student Management**
  - Single and bulk student upload (CSV/Excel)
  - View, paginate, and delete student records
  - Batch background processing with Redis queue (robust, non-blocking)
- **Campaign Management**
  - Create, segment, and manage campaigns
  - Rule-based segmentation (age, cgpa, course, etc.)
  - Campaign history and delivery tracking
- **Dashboard**
  - Quick stats and recent campaigns
  - Quick actions for common tasks
- **Robust Error Handling**
  - Upload validation, duplicate checks, and failure logging
- **Modern UI/UX**
  - Responsive, clean, and professional design

---

## 🛠️ Tech Stack

- **Frontend:** React, Vite, Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose)
- **Authentication:** Passport.js (Google OAuth)
- **File Uploads:** Multer, csv-parse, xlsx
- **Background Processing:** Redis (queue), custom Node.js worker
- **Session Management:** express-session + RedisStore

---

## 📦 Project Structure

```
Minicrm/
├── backend/
│   ├── config/
│   │   ├── db.js
│   │   ├── passport.js
│   │   └── studentWorker.js
│   ├── models/
│   ├── routes/
│   ├── index.js
│   ├── dev.js
│   └── package.json
├── frontend/
│   ├── src/
│   ├── public/
│   ├── index.html
│   └── package.json
└── README.md
```

---

## ⚡ Getting Started

### 1. **Clone the repository**
```sh
git clone <your-repo-url>
cd Minicrm
```

### 2. **Install dependencies**
- Backend:
  ```sh
  cd backend
  npm install
  ```
- Frontend:
  ```sh
  cd ../frontend
  npm install
  ```

### 3. **Setup Environment Variables**
- Copy `.env.example` to `.env` in `backend/` and fill in your MongoDB URI, Google OAuth credentials, and JWT secret.

### 4. **Start Redis Server**
- Make sure Redis is running on your machine (see README for install instructions).

### 5. **Run the App**
- Start backend (server + worker):
  ```sh
  cd backend
  npm run dev
  ```
- Start frontend:
  ```sh
  cd ../frontend
  npm run dev
  ```

---

## 📄 Bulk Upload Template

- Use a CSV/Excel file with columns: `name, age, email, cgpa, courseName`
- See the Bulk Upload page for a downloadable template and instructions.

---

## 📝 License

MIT

---
