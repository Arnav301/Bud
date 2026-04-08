# 💰 Smart Budget Manager (AI + SMS Powered)

An intelligent personal finance platform that enables users to track, analyze, and optimize their spending using bank statements (CSV/PDF) and SMS-based transaction extraction. The system leverages a hybrid analytics + AI engine to deliver actionable financial insights, anomaly detection, and smart budgeting recommendations.

## 🚀 Core Features

### 📥 Multi-Source Data Ingestion
* **Upload bank statements:** Securely parse CSV and PDF bank statements.
* **SMS Parsing (NEW 🔥):**
  * Automatically extract transactions from bank SMS alerts.
  * Supports multiple bank formats using pattern recognition.
  * Real-time transaction capture without manual uploads.

### ⚙️ Intelligent Transaction Parsing Engine
* **Robust parsing system:** Supporting multi-bank formats.
* **Regex + rule-based extraction:** Designed for high accuracy.
* **Handles:** Different date formats, currency normalization, duplicate transaction detection.
* **Processing:** Asynchronous batch processing for large files.

### 🧠 Smart Categorization System
* **Auto-categorizes transactions into:** Food 🍔, Utilities ⚡, Travel ✈️, Shopping 🛍️, etc.
* **User-editable categories:** Featuring adaptive learning capability.
* **Logic:** Rule-based combined with AI-driven categorization.

### 📊 Advanced Financial Analytics
* **Tracking:** Income vs Expense tracking.
* **Analysis:** Monthly cash flow analysis and spending trends visualization.
* **Metrics:** Savings ratio, burn rate calculation, and a proprietary Financial Health Score (0–100).

### 🤖 AI-Powered Financial Insights
* **Hybrid system:** Rule-based + AI via OpenAI API.
* **Features:**
  * Subscription detection (e.g., Netflix, Spotify).
  * Spending anomaly alerts & budget overrun warnings.
  * Personalized savings tips based on behavior.

### 🎯 Goal-Based Budgeting
* **Create financial goals:** e.g., Emergency Fund, Vacation, Investments.
* **Track progress:** Automatically allocates and logs progress against established goals.
* **Suggestions:** Receives smart monthly budget allocation suggestions.

### 📈 Interactive Dashboard
* **Clean, modern UI:** Featuring pie charts (category-wise spending) and line graphs (monthly trends).
* **Real-time insights panel.**
* **Charting:** Built using robust charting libraries like Chart.js or Recharts.

### 💬 AI Financial Assistant (Advanced Feature 🔥)
* **Conversational AI:** Ask questions like:
  * *"Where did I spend the most this month?"*
  * *"How can I save more?"*
* Conversational insights powered by OpenAI.

---

## 🛠️ Tech Stack

### 📱 Mobile Frontend
* **Framework:** React Native (managed by Expo) or Flutter
* **Styling:** NativeWind (Tailwind for React Native) or Native UI Components
* **Charts:** React Native Chart Kit / Victory Native
* **State Management:** Redux Toolkit / React Context API

### ⚙️ Backend
* **Runtime:** Node.js + Express.js
* **Parsing Engine:**
  * `csv-parser` (for CSV processing)
  * `pdf-parse` (for PDF processing)
  * Native SMS Integration (Device SMS Read Permissions) & Backend regex/NLP-based extraction
* **AI Engine:** OpenAI API
* **Auth:** JSON Web Tokens (JWT) / OAuth / Firebase Authentication

### 🗄️ Database
* **Relational/NoSQL Database:** PostgreSQL, MongoDB, or Firebase Firestore
* **ORM/ODM:** Prisma (for SQL) / Mongoose (for NoSQL)

### ☁️ Cloud & BaaS
* **Firebase:** For Authentication, Realtime Database/Firestore, and cloud services (Hosting, Functions).

### ⚡ Performance & Scalability
* **Job Queues:** Asynchronous job execution (e.g., BullMQ) for parsing tasks.
* **Caching:** Caching parsed transactions for faster dashboard loads.
* **UI Performance:** Lazy loading components and optimized large file handling.

---

## 🔒 Security & Privacy

* **No Direct Bank Integration:**
  * No banking credentials required.
  * Fully user-controlled data input via uploads or localized SMS reads.
* **End-to-End Encryption:**
  * AES-256 encryption for data at rest.
  * TLS (HTTPS) protocols for data in transit.
* **Read-Only System:**
  * Cannot initiate any financial transactions.
  * Only analyzes user-provided raw data.
* **Auto-Deletion Policy:**
  * Original uploaded files (CSV/PDF) are securely removed from storage immediately after parsing.
* **Secure Authentication:**
  * Robust, secure JWT-based authentication system.
  * Short-lived tokens with secure refresh mechanisms.

---

## 🧩 System Architecture

```text
[ User Input ]
       ↓
(CSV / PDF Uploads)      (SMS Data from Mobile Client)
       ↓                             ↓
  [ Parsing Engine (Async Job Queues + Regex/NLP) ]
                                     ↓
                         [ Data Normalization ]
                                     ↓
                        [ Secure Database (Encrypted) ]
                                     ↓
                       [ Analytics + AI Engine (OpenAI) ]
                                     ↓
                            [ Dashboard + Insights ]
```

---

## 🌐 Future Enhancements
* 🔗 Option for explicit Bank API Integration via Plaid / Setu.
* 📱 Full-fledged standalone Mobile App (React Native/Flutter).
* 📊 Comprehensive Investment & Portfolio Tracking integrations.
* 🧾 OCR integration for analyzing scanned physical receipts.
* 🔔 Smart push notifications & alerts for budget thresholds.

---

## 💡 Unique Selling Points (USP)
* ✅ **Multi-source ingestion:** Securely tracks CSV, PDF, and real-time SMS.
* ✅ **Zero dependency:** Doesn't strictly rely on paid or regionally limited bank APIs.
* ✅ **Hybrid intelligence:** Powerful AI mixed with fast, reliable rule-based categorization.
* ✅ **Privacy-first architecture:** Your bank credentials stay with your bank.
* ✅ **Real-world fintech utility:** Scalable data techniques standard across top apps.

---

## 🧠 Ideal Use Cases
* **Students:** Managing monthly allowances and shared expenses.
* **Professionals:** Tracking personal saving habits, identifying unused subscriptions.
* **Privacy-conscious Users:** Tracking wealth without risky real-time bank logins.
* **Financial Planning:** Strategic budget planning and holistic financial awareness.

---

### 🏁 Conclusion

Smart Budget Manager is a secure, scalable, and intelligent personal finance solution designed to simplify money management without relying on direct bank integrations. With SMS parsing, AI insights, and advanced analytics, it delivers a powerful, real-world fintech experience.
