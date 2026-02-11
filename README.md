# Mini EdTech CRM Platform

A modern, full-stack EdTech CRM platform for managing student data, automated segmentation, and campaign delivery. Built with production-ready architecture featuring Redis Cloud integration, batch processing, and persistent session management.

---

## 🚀 Key Features

### 🔐 **Authentication & Security**
- Google OAuth 2.0 integration with Passport.js
- Redis-powered session management (sessions persist across server restarts)
- Production-ready CORS and cookie security

### 👥 **Student Management**
- **Bulk Upload**: CSV/Excel files with intelligent batch processing
- **Background Processing**: Redis queue system processes large uploads without blocking
- **Scalable Processing**: Configurable batch sizes (100 students per batch with 1s delays)
- **Data Validation**: Robust file validation and error handling
- **CRUD Operations**: View, paginate, search, and delete student records

### 📊 **Campaign Management**
- **Smart Segmentation**: Rule-based student filtering (age, CGPA, course, etc.)
- **Campaign Creation**: Multi-channel campaign setup and delivery
- **History Tracking**: Complete campaign delivery logs and analytics
- **Performance Metrics**: Track campaign success rates and engagement

### 📈 **Dashboard & Analytics**
- Real-time student and campaign statistics
- Quick action buttons for common tasks
- Recent activity feed
- Performance overview charts

---

## 🛠️ Tech Stack

### **Frontend**
- **React 18** with Vite for lightning-fast development
- **Tailwind CSS** for modern, responsive design
- **Axios** for API communication with credential support
- **React Router** for client-side routing

### **Backend**
- **Node.js & Express.js** for robust server architecture
- **MongoDB** with Mongoose ODM for data persistence
- **Redis Cloud** for session storage and job queuing
- **Passport.js** for Google OAuth authentication
- **Multer** for file upload handling

### **Background Processing**
- **Redis Queue System** for non-blocking bulk operations
- **Custom Worker Process** for batch student processing
- **Configurable Processing** with batch sizes and delays

### **File Processing**
- **CSV Support** with csv-parse library
- **Excel Support** with xlsx library
- **File Validation** and error handling

---

## 📦 Project Architecture

```
Minicrm/
├── backend/
│   ├── config/
│   │   ├── db.js                 # MongoDB connection
│   │   ├── passport.js           # Google OAuth configuration
│   │   ├── redisClient.js        # Redis Cloud connection
│   │   └── studentWorker.js      # Background job processor
│   ├── models/
│   │   ├── studentModel.js       # Student data schema
│   │   ├── campaignModel.js      # Campaign schema
│   │   ├── userModel.js          # User authentication schema
│   │   └── communicationLog.js   # Campaign delivery logs
│   ├── routes/
│   │   ├── authRouter.js         # Authentication endpoints
│   │   ├── studentRoute.js       # Student CRUD & bulk upload
│   │   └── campaignRoutes.js     # Campaign management
│   ├── uploads/                  # Temporary file storage
│   ├── index.js                  # Main server entry point
│   ├── dev.js                    # Development server
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/           # Reusable UI components
│   │   ├── pages/               # Main application pages
│   │   ├── context/             # React context providers
│   │   └── App.jsx              # Main application component
│   ├── public/
│   ├── index.html
│   └── package.json
└── README.md
```

---

## ⚡ Quick Start

### **Prerequisites**
- Node.js 18+ and npm
- MongoDB Atlas account (or local MongoDB)
- Redis Cloud account (free tier available)
- Google Cloud Console project for OAuth

### **1. Clone & Install**
```bash
git clone <your-repo-url>
cd Minicrm

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### **2. Environment Configuration**

Create `backend/.env`:
```env
# Database
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/minicrm?retryWrites=true&w=majority

# Redis Cloud
REDIS_HOST=your-redis-host
REDIS_PORT=your-redis-port
REDIS_USERNAME=default
REDIS_PASSWORD=your-redis-password

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Security
JWT_SECRET=your-super-secure-jwt-secret
SESSION_SECRET=your-session-secret

# Environment
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

Create `frontend/.env.development`:
```env
VITE_API_URL=http://localhost:3000
```

### **3. Start the Application**

```bash
# Terminal 1: Start backend server
cd backend
npm run dev

# Terminal 2: Start background worker
cd backend
node config/studentWorker.js

# Terminal 3: Start frontend
cd frontend
npm run dev
```

Access the application at `http://localhost:5173`

---

## 🎯 Core Workflows

### **Student Bulk Upload Process**
1. **Upload**: User uploads CSV/Excel file via frontend
2. **Queue**: File is parsed and job is queued in Redis
3. **Process**: Background worker processes students in batches of 100
4. **Progress**: Real-time logging of batch processing progress
5. **Cleanup**: Temporary files are automatically cleaned up

### **Campaign Creation Flow**
1. **Setup**: Define campaign name, message, and delivery channel
2. **Segment**: Use rule builder to filter target students
3. **Preview**: Review segment size and student list
4. **Launch**: Campaign is queued for delivery
5. **Track**: Monitor delivery status and engagement metrics

---

## 📋 File Upload Template

For bulk student uploads, use CSV/Excel files with these columns:

| Column | Type | Required | Example |
|--------|------|----------|---------|
| name | String | Yes | John Doe |
| age | Number | Yes | 22 |
| email | String | Yes | john@example.com |
| cgpa | Number | Yes | 8.5 |
| courseName | String | Yes | Computer Science |

**Download template**: Available in the Bulk Upload section of the application

---

## 🚀 Production Deployment

### **Environment Variables for Production**
```env
NODE_ENV=production
FRONTEND_URL=https://your-frontend-domain.com
REDIS_URL=redis://username:password@host:port  # Alternative Redis config
```

### **Hosting Recommendations**
- **Frontend**: Vercel, Netlify (static hosting)
- **Backend**: Render, Railway, Heroku
- **Database**: MongoDB Atlas
- **Redis**: Redis Cloud, Upstash
- **File Storage**: Consider AWS S3 for production file handling

### **Production Optimizations**
- Redis session persistence ensures zero-downtime deployments
- Background job processing prevents request timeouts
- Configurable batch processing for optimal performance
- Production-ready CORS and security headers

---