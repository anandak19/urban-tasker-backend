# Urban Tasker Backend

A production-ready backend for a real-time service marketplace supporting booking, communication, and task lifecycle management at scale.

---

## 📖 About

Urban Tasker is a backend platform designed to connect users with nearby service providers.
It enables task booking, real-time communication, secure payments, and complete task lifecycle management — all built with a modular and scalable architecture.

---

## 🛠 Tech Stack

### Backend

* NestJS (Modular Layered Architecture)
* Node.js

### Database

* MongoDB

### DevOps

* Docker & Docker Compose

### Communication

* WebSockets (for chat & real-time updates)
* WebRTC (for video calls)

---

## 🧱 Architecture

The application follows a **modular layered architecture**, ensuring:

*  Clear separation of concerns
*  Reusability of modules
*  Scalability for large systems
*  Easy testing and maintenance

### Layers Overview

* **Controller Layer** → Handles incoming requests
* **Service Layer** → Business logic
* **Repository/Data Layer** → Database interaction
* **Module Layer** → Feature-based organization

---

## ✨ Features

### 👤 User Features

* 🔍 Book taskers based on service and availability
* 💬 Real-time chat between users and taskers
* 📹 Video calling for better communication
* ⭐ Rate and review taskers
* 💳 Secure payment system

---

### 👷 Tasker Features

* 📝 Become a tasker (onboarding flow)
* 📅 Set availability and working hours
* 📂 Create portfolio showcasing skills/work
* 👤 Manage profile and service details
* 📊 Track assigned tasks and earnings

---

### 🛠 Task Management

* ✅ Controlled task lifecycle (request → accept → complete)
* 🔄 Real-time task updates
* 🔐 Role-based access control

---

### 🛡 Admin Panel

* 📊 Manage users and taskers
* 📋 Monitor tasks and transactions
* 🚫 Handle reports and moderation
* ⚙️ Full system control

## 🚀 Getting Started

### Prerequisites

* Node.js (v16+)
* Docker
* Docker Compose

---

### 🔧 Installation

```bash
git clone https://github.com/anandak19/urban-tasker-backend.git
cd urban-tasker-backend
npm install
```

---

### 🐳 Run with Docker

```bash
docker-compose up --build
```

---

### ▶️ Run Locally (without Docker)

```bash
npm run start:dev
```

---

## 📡 Real-Time Features

* WebSocket-based chat system
* Live task status updates
* Video call signaling support

---

## 🚀 Deployment

The backend is fully dockerized and can be deployed on:

* AWS EC2
* DigitalOcean
* Any container-based infrastructure

---

## 📌 Roadmap

* 📱 Mobile app integration
* 🤖 Smart tasker recommendation system
* 📍 Location-based matching optimization
* 🧾 Invoice & billing system

---

## 📄 License

This project is proprietary and not open-source.  
All rights reserved © 2026 Anandakrishnan H.

---

## 💡 Author Note

This project is built with a focus on scalability, real-time communication, and clean architecture — making it production-ready and extensible for future growth.
