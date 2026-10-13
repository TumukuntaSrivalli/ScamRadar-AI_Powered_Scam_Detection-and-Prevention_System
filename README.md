# 🛡️ ScamRadar - AI-Powered Scam Detection & Prevention System

ScamRadar is an AI-powered cybersecurity platform that detects fraud in WhatsApp screenshots and voice call recordings using Google Gemini Vision and Speech neural models.

---

## ✨ Features

- **🌐 3D Interactive Cyber Radar**: Real-time 3D interactive holographic canvas and threat simulation lab.
- **📁 Upload Confirmation Popup**: Instant verified popup and toast notification upon selecting screenshots or audio.
- **👥 Role-Based Authentication**: Choose between **Regular User** or **System Admin** directly from the login modal.
- **📸 Screenshot Scanner**: Inspects WhatsApp chats, fake UPI payment QR codes, and bank SMS for phishing.
- **🎙️ Call Audio Analyzer**: Transcribes calls and detects AI voice cloning and extortion triggers.
- **📊 Admin SOC Dashboard**: Centralized console for tracking global threat reports and system telemetry.

---

## 🔑 Demo Credentials

| Role | Email | Password |
| :--- | :--- | :--- |
| **User** | `user@enterprise.com` | `user123` |
| **Admin** | `admin@scamradar.com` | `admin123` |

---

## 🚀 Quick Start

### 1. Backend (FastAPI)
```bash
cd backend
pip install -r requirements.txt
python -m uvicorn main:app --reload --port 8000
```

### 2. Frontend (React + Vite)
```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## 🌐 Deployment (Vercel)

Deploy frontend & backend with 1 click:
```bash
vercel deploy
```
Or import the GitHub repository directly into [Vercel](https://vercel.com).
