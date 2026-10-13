# 🛡️ ScamRadar - AI-Powered Scam Detection & Threat Intelligence

> **Next-Gen Threat Intelligence to Detect, Expose & Neutralize Cyber Scams Before Financial Loss.**

ScamRadar is an AI-driven cybersecurity platform designed to protect users against WhatsApp extortion, digital arrest frauds, fake UPI payment QR codes, Telegram part-time job schemes, and AI-synthesized deepfake voice calls.

---

## ✨ Features

- **🌐 3D Interactive Cyber Radar**: Real-time holographic 3D radar canvas with touch & gesture support for all mobile devices.
- **📁 Verified Upload Modal**: Instant popup confirmation with SHA-256 vector verification upon selecting evidence files.
- **👥 Role-Based Authentication**: Seamless role switcher between **Regular User** and **System Admin** directly in the login portal.
- **📸 Multimodal Vision Scanner**: Analyzes WhatsApp screenshots, payment QR codes, and SMS messages using Google Gemini Vision.
- **🎙️ Neural Audio Analyzer**: Transcribes call recordings and flags high-pressure urgency triggers and voice cloning indicators.
- **📱 Fully Responsive**: Flawless experience across desktops, tablets, and mobile smartphones.
- **📊 SOC Admin Operations Console**: Comprehensive telemetry and case moderation console for security analysts.

---

## 🔑 Access Credentials

| Role | Email | Password |
| :--- | :--- | :--- |
| **User** | `user@enterprise.com` | `user123` |
| **Admin** | `admin@scamradar.com` | `admin123` |

---

## 🚀 Quick Start (Local Run)

### 1. Backend (FastAPI)
```bash
cd backend
python -m uvicorn main:app --host 0.0.0.0 --port 8000
```

### 2. Frontend (React + Vite)
```bash
cd frontend
npm install
npm run dev
```

* **Desktop URL**: `http://localhost:5173/`
* **Mobile Phone Access**: `http://<your-ip-address>:5173/`

---

## 🌐 Deploy to Vercel

Import the GitHub repository directly at [Vercel](https://vercel.com) or deploy with Vercel CLI:
```bash
vercel deploy --prod
```
