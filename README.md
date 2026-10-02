# 🩸 Blood Bank Inventory Management System (BBIMS)

> A modern, healthcare-grade Blood Bank Inventory & Donor Management System built with a **Node.js (NestJS)** backend API and a **React (TypeScript + TailwindCSS v4)** frontend dashboard.

---

## 🌟 Key Features

- **🩸 Inventory & Stock Matrix**: Real-time tracking of blood units by blood group (`O-`, `O+`, `A+`, `A-`, `B+`, `B-`, `AB+`, `AB-`) and components (`PRBC`, `Platelets`, `Fresh Frozen Plasma`, `Whole Blood`, `Cryoprecipitate`).
- **👤 Donor Record Management**: Complete donor registration, eligibility screening metrics (Hb g/dL, BP, weight), and automated intake generation upon collection.
- **🚨 Expiry Risk Monitoring**: Visual alert badges for critical ($\le 3$ days) and warning ($\le 7$ days) stock expiry risks.
- **🏥 Hospital Orders & Cold-Chain Dispatch**: Urgent/Emergency stat order tracking, electronic unit reservation, courier code tracking, and transport temperature validation.
- **🧬 ABO/Rh Compatibility Engine**: Interactive cross-matching matrix and pair compatibility validation simulator.
- **📅 Donation Campaigns**: Schedule and track mobile collection drives, corporate events, and target goals.
- **🏬 Multi-Facility & Storage Telemetry**: Global stock visibility across processing hubs and hospital labs with live cold storage temperature sensor monitors.
- **🛡️ HIPAA & FDA Regulatory Compliance**: Immutable cryptographic hash audit logging for all intake, dispatch, and PHI operations with 1-click CSV report export.
- **🤖 AI Demand Forecasting**: Machine learning demand prediction chart and actionable stock allocation recommendation cards.

---

## 🛠️ Technology Stack

- **Frontend**: React 19, TypeScript, TailwindCSS v4, Inertia.js, Radix UI, Lucide Icons, Recharts, Sonner toasts
- **Backend**: Node.js, NestJS, TypeScript, REST API architecture
- **Core Framework**: Laravel 12 + Vite Plus

---

## 🚀 Getting Started

### 1. Prerequisites

- Node.js (v18+)
- PHP 8.3+ & Composer

### 2. Installation

```bash
# Clone the repository
git clone https://github.com/Talhay2k/BBIMS.git
cd BBIMS

# Install Node dependencies
npm install

# Install PHP dependencies
composer install
```

### 3. Environment Setup

```bash
cp .env.example .env
php artisan key:generate
```

### 4. Running Locally

```bash
# Start Node.js NestJS Backend Server (Port 5000)
npm run server

# Start Vite Frontend Dev Server
npm run dev
```

Open `http://localhost:8000` or `http://localhost:5173` to view the application.

---

## 📄 License

This project is open-source and licensed under the [MIT License](LICENSE).
