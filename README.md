# 🔐 Gatekeeper

A full-stack authentication system built from scratch — covering everything from user registration and JWT-based sessions to email OTP verification and password reset flows.

🌐 **Live Demo:** [gatekeeper-1-5o07.onrender.com](https://gatekeeper-1-5o07.onrender.com)
⚙️ **Backend API:** [gatekeeper-kh6c.onrender.com](https://gatekeeper-kh6c.onrender.com)

---

## ✨ Features

- 📝 User registration with hashed passwords
- 🔑 Login / Logout with JWT stored in HTTP-only cookies
- 📧 Welcome email on signup
- ✅ Email verification via 6-digit OTP
- 🔒 Forgot password & reset password flow
- 🛡️ Protected routes with JWT middleware
- 🌍 Cross-origin support for separate frontend/backend deployments

---

## 🛠️ Tech Stack

### Backend
| Package | Purpose |
|---|---|
| `express` | Web framework |
| `mongoose` | MongoDB ODM |
| `jsonwebtoken` | JWT auth tokens |
| `bcryptjs` | Password hashing |
| `axios` | Brevo HTTP API for emails |
| `cookie-parser` | Parsing cookies |
| `cors` | Cross-origin requests |
| `dotenv` | Environment variables |
| `nodemon` | Dev server auto-restart |

### Frontend
| Tool | Purpose |
|---|---|
| React + Vite | UI framework & build tool |
| React Router | Client-side routing |
| Axios | HTTP requests |
| React Toastify | Toast notifications |
| React Context API | Global auth state |
| Tailwind CSS | Styling |

---

## 📁 Project Structure

```
Gatekeeper/
│
├── Backend/
│   ├── config/
│   │   ├── db.js                  # MongoDB connection
│   │   ├── emailTemplates.js      # HTML email templates
│   │   └── nodemailer.js          # Brevo HTTP API email sender
│   │
│   ├── controllers/
│   │   ├── authController.js      # register, login, logout, OTP logic
│   │   └── userController.js      # get user data
│   │
│   ├── middlewares/
│   │   └── authMiddleware.js      # JWT cookie verification
│   │
│   ├── models/
│   │   └── userModel.js           # User schema
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── userRoutes.js
│   │
│   ├── .env
│   └── server.js
│
├── Frontend/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── Header.jsx
│   │   │   └── Navbar.jsx
│   │   ├── context/
│   │   │   └── AppContext.jsx     # Global auth state
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── EmailVerify.jsx
│   │   │   └── ResetPassword.jsx
│   │   └── App.jsx
│   │
│   ├── .env
│   └── index.html
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- MongoDB Atlas account (or local MongoDB)
- [Brevo](https://brevo.com) account for transactional emails

### 1. Clone the repo

```bash
git clone https://github.com/sahilnikalje/Gatekeeper.git
cd Gatekeeper
```

### 2. Backend setup

```bash
cd Backend
npm install
```

Create a `.env` file in `Backend/`:

```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
SENDER_EMAIL=your_sender@email.com
BREVO_API_KEY=your_brevo_api_key
FRONTEND_URI=http://localhost:5173
NODE_ENV=development
```

```bash
npm run server   # starts on port 3000
```

### 3. Frontend setup

```bash
cd Frontend
npm install
```

Create a `.env` file in `Frontend/`:

```env
VITE_BACKEND_URL=http://localhost:3000
```

```bash
npm run dev   # starts on port 5173
```

---

## 📡 API Reference

### Auth — `/api/auth`

| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| POST | `/register` | ❌ | Register a new user |
| POST | `/login` | ❌ | Login and receive JWT cookie |
| POST | `/logout` | ❌ | Clear JWT cookie |
| POST | `/send-verify-otp` | ✅ | Send OTP to user's email |
| POST | `/verify-account` | ✅ | Verify account with OTP |
| GET | `/is-auth` | ✅ | Check if user is authenticated |
| POST | `/send-reset-otp` | ❌ | Send password reset OTP |
| POST | `/reset-password` | ❌ | Reset password with OTP |

### User — `/api/user`

| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| GET | `/data` | ✅ | Get authenticated user's data |

---

## 🔄 Auth Flow

```
Register → JWT cookie set → Send welcome email
              ↓
         Click "Verify Email" → OTP sent → Enter OTP → Account verified
              ↓
         Forgot Password → Enter email → OTP sent → Enter OTP + new password → Reset
```

---

## 🌍 Deployment Notes

- **Frontend** hosted on [Vercel](https://vercel.com)
- **Backend** hosted on [Render](https://render.com)
- Render's free tier blocks outbound SMTP — email is sent via **Brevo's HTTP API** instead of SMTP
- Cookies use `sameSite: 'none'` + `secure: true` for cross-origin cookie support

---

