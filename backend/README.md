# CKCET Smart Bus Management System - Backend API

Production-ready Node.js & Express REST API backend for the **CKCET Smart Bus Management System**, powered by **Supabase (PostgreSQL)**, **JWT Authentication**, and **express-validator**.

---

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── env.js                # Environment configuration & validation
│   │   └── supabase.js           # Reusable Supabase JavaScript client
│   │
│   ├── middleware/
│   │   ├── auth.js               # JWT verification & role-based permissions (admin, driver, parent, student)
│   │   ├── errorHandler.js       # Centralized 404 and 500 error handlers
│   │   └── validate.js           # Input validation handler using express-validator
│   │
│   ├── controllers/
│   │   ├── authController.js     # User login, registration & profile
│   │   ├── studentController.js  # Student management & student features
│   │   ├── parentController.js   # Parent management & child tracking
│   │   ├── driverController.js   # Driver management, route lookup & attendance marking
│   │   ├── adminController.js    # System administration & dashboard statistics
│   │   ├── busController.js      # Bus fleet management (CRUD)
│   │   ├── routeController.js    # Route management (CRUD)
│   │   ├── stopController.js     # Bus stop management (CRUD)
│   │   ├── attendanceController.js # Attendance logging (CRUD)
│   │   ├── complaintController.js  # Grievance handling (CRUD)
│   │   ├── leaveController.js      # Student leave requests (CRUD)
│   │   ├── notificationController.js # System notification broadcasts (CRUD)
│   │   ├── scheduleController.js   # Driver work schedule (CRUD)
│   │   └── assignmentController.js # Student bus assignment history (CRUD)
│   │
│   ├── services/
│   │   └── supabaseService.js   # Generic Supabase data access layer
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── studentRoutes.js
│   │   ├── parentRoutes.js
│   │   ├── driverRoutes.js
│   │   ├── adminRoutes.js
│   │   ├── busRoutes.js
│   │   ├── routeRoutes.js
│   │   ├── stopRoutes.js
│   │   ├── attendanceRoutes.js
│   │   ├── complaintRoutes.js
│   │   ├── leaveRoutes.js
│   │   ├── notificationRoutes.js
│   │   ├── scheduleRoutes.js
│   │   ├── assignmentRoutes.js
│   │   └── index.js              # Central API router aggregator (/api)
│   │
│   ├── utils/
│   │   ├── response.js           # Standard JSON response helpers
│   │   └── helpers.js            # Password hashing (bcryptjs) & JWT utilities
│   │
│   ├── app.js                    # Express application configuration
│   └── server.js                 # Server entry point
│
├── .env.example                  # Environment configuration template
├── package.json                  # Dependencies & scripts
└── README.md                     # Documentation
```

---

## ⚡ Quick Start & Installation

### 1. Install Dependencies
Navigate to the `backend/` folder and install NPM packages:
```bash
cd backend
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env` and fill in your Supabase database credentials:
```bash
cp .env.example .env
```
Edit `.env`:
```env
PORT=5000
NODE_ENV=development
SUPABASE_URL=https://your-supabase-project.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key-here
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d
```

### 3. Run the Server
- **Development Mode (with Nodemon):**
  ```bash
  npm run dev
  ```
- **Production Mode:**
  ```bash
  npm start
  ```

Server will start listening at: `http://localhost:5000`

---

## 📡 API Endpoints Overview

All endpoints use standardized JSON responses:

- **Success Standard:**
  ```json
  { "success": true, "message": "...", "data": {} }
  ```
- **Error Standard:**
  ```json
  { "success": false, "message": "...", "error": {} }
  ```

### 🔐 Authentication (`/api/auth`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/login` | Public | Log in user with email & password, returns JWT |
| `POST` | `/api/auth/register` | Public / Admin | Register new user with specified role |
| `GET` | `/api/auth/me` | Protected | Fetch logged in user's profile |

---

### 🎓 Students (`/api/students`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/students/me/attendance` | Student | View student's bus attendance history |
| `GET` | `/api/students/me/notifications` | Student | View notifications sent to students |
| `POST` | `/api/students/me/complaint` | Student | Submit a complaint regarding bus services |
| `POST` | `/api/students/me/leave` | Student | Submit a leave request |
| `POST` | `/api/students/:id/assign` | Admin | Assign bus, stop, and route to student |
| `GET` | `/api/students` | Admin, Driver | Get list of all students |
| `GET` | `/api/students/:id` | Protected | Get student by ID |
| `POST` | `/api/students` | Admin | Create student record |
| `PUT` | `/api/students/:id` | Admin | Update student record |
| `DELETE` | `/api/students/:id` | Admin | Delete student record |

---

### 👨‍👩‍👧 Parents (`/api/parents`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/parents/me/child-attendance` | Parent | View child's attendance records |
| `GET` | `/api/parents/me/child-bus` | Parent | View child's assigned bus details |
| `GET` | `/api/parents/me/live-route` | Parent | View live bus tracking data (API placeholder) |
| `GET` | `/api/parents/me/notifications` | Parent | View notifications targeted at parents |
| `GET` | `/api/parents` | Admin | List all parent profiles |
| `GET` | `/api/parents/:id` | Admin, Parent | Get parent profile by ID |
| `POST` | `/api/parents` | Admin | Create parent profile |
| `PUT` | `/api/parents/:id` | Admin | Update parent profile |
| `DELETE` | `/api/parents/:id` | Admin | Delete parent profile |

---

### 🚍 Drivers (`/api/drivers`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/drivers/me/bus` | Driver | View assigned bus details |
| `GET` | `/api/drivers/me/route` | Driver | View today's route schedule |
| `GET` | `/api/drivers/me/students` | Driver | View list of students assigned to driver's bus |
| `POST` | `/api/drivers/me/attendance` | Driver | Mark student attendance (Present/Absent) |
| `PUT` | `/api/drivers/me/trip-status` | Driver | Update live trip status ('Started', 'In Transit', 'Completed') |
| `GET` | `/api/drivers` | Admin | List all driver profiles |
| `GET` | `/api/drivers/:id` | Admin, Driver | Get driver profile by ID |
| `POST` | `/api/drivers` | Admin | Create driver profile |
| `PUT` | `/api/drivers/:id` | Admin | Update driver profile |
| `DELETE` | `/api/drivers/:id` | Admin | Delete driver profile |

---

### 🛡️ Admin (`/api/admins`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/admins/dashboard/counts` | Admin | Retrieve summary counts (students, drivers, buses, routes, pending leaves, complaints) |
| `POST` | `/api/admins/assign-student` | Admin | Assign student to bus/stop/route |
| `POST` | `/api/admins/assign-driver` | Admin | Assign driver to bus |
| `PUT` | `/api/admins/complaints/:id` | Admin | Resolve complaint |
| `PUT` | `/api/admins/leaves/:id` | Admin | Approve or reject leave request |
| `POST` | `/api/admins/notifications` | Admin | Create system broadcast notification |
| `GET` | `/api/admins` | Admin | List all admin profiles |
| `GET` | `/api/admins/:id` | Admin | Get admin details by ID |
| `POST` | `/api/admins` | Admin | Create admin profile |
| `PUT` | `/api/admins/:id` | Admin | Update admin profile |
| `DELETE` | `/api/admins/:id` | Admin | Delete admin profile |

---

### 📦 Infrastructure Module Endpoints (CRUD)
Each module supports standard `GET /`, `GET /:id`, `POST /`, `PUT /:id`, `DELETE /:id`:

- **Buses:** `/api/buses`
- **Routes:** `/api/routes`
- **Stops:** `/api/stops`
- **Attendance:** `/api/attendance`
- **Complaints:** `/api/complaints`
- **Leave Requests:** `/api/leave-requests`
- **Notifications:** `/api/notifications`
- **Driver Schedule:** `/api/schedule`
- **Student Bus Assignments:** `/api/assignments`

---

## 📮 Postman Integration

To import into **Postman**:
1. Open Postman -> Click **Import**.
2. Create a collection named `CKCET Smart Bus Management API`.
3. Set Collection Variables:
   - `baseUrl`: `http://localhost:5000`
   - `token`: `<JWT Token from /api/auth/login>`
4. In Authorization tab of Postman request, set:
   - Type: `Bearer Token`
   - Token: `{{token}}`

---

## 🔒 Security Features
- **Helmet:** Protects against standard HTTP vulnerabilities.
- **CORS:** Configured for cross-origin frontend communication.
- **Password Security:** All user passwords are encrypted using `bcryptjs`.
- **JWT Protection:** Token verification on protected endpoints.
- **Role Enforcement:** Middleware ensures restricted endpoints require appropriate roles.
