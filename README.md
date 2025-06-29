# SkillSwap

**Live Demo:** [https://skillswap-platform.netlify.app](https://skillswap-platform.netlify.app)

## 🌟 Project Overview

**SkillSwap** is a dynamic, full-stack MERN (MongoDB, Express.js, React, Node.js) web application designed to foster a vibrant community where users can seamlessly exchange skills and knowledge. Beyond traditional skill-sharing, this platform integrates cutting-edge Artificial Intelligence to enhance user interaction and provide an intelligent conversational experience.

## ✨ Key Features

* **User Authentication:** Secure user registration, login, and profile management with **JWT-based authentication**.
* **Google OAuth 2.0 Integration:** Effortless social login for a streamlined user onboarding experience.
* **Skill Posting & Discovery:** Users can post skills they offer and skills they seek, browse available skills, and connect with other users.
* **AI Chatbot Integration:** Powered by the **Google Generative Language API (Gemini)**, an interactive chatbot assists users with queries, provides suggestions, and enhances engagement within the platform.
* **User Profiles:** Dedicated user profiles to showcase skills, interests, and contact information.
* **Password Management:** Secure forgot password and reset password functionalities via email using **Nodemailer**.
* **Real-time Interaction:** Features designed for dynamic content updates and user engagement.
* **Scheduled Reminders:** Backend cron jobs (**node-cron**) for automated tasks like post reminders.
* **Responsive Design:** Optimized for seamless experience across various devices (desktop, tablet, mobile).

## 🚀 Technologies Used

**Frontend:**
* **React.js:** JavaScript library for building user interfaces.
* **React Router DOM:** For client-side routing.
* **HTML & CSS:** Standard web markup and styling.
* **Context API:** For global state management.

**Backend:**
* **Node.js:** JavaScript runtime.
* **Express.js:** Web framework for Node.js.
* **MongoDB:** NoSQL database for flexible data storage.
* **Mongoose:** MongoDB object data modeling (ODM) for Node.js.
* **Passport.js:** Authentication middleware for Node.js.
* **JSON Web Tokens (JWT):** For secure, stateless authentication.
* **Nodemailer:** For sending emails.
* **Node-cron:** For scheduling recurring tasks.

**APIs & Services:**
* **Google Generative Language API (Gemini):** For AI chatbot functionality.
* **Google OAuth 2.0 API:** For social login.
* **MongoDB Atlas:** Cloud-hosted MongoDB service.

**Deployment:**
* **Netlify:** For deploying the React frontend as a Static Site.
* **Render:** For deploying the Node.js/Express backend as a Web Service.

**Development Tools:**
* **Git:** Version control system.
* **GitHub:** Code hosting platform.
* **Dotenv:** For managing environment variables.

## ⚙️ Local Setup Instructions

Follow these steps to get a local copy of AI SkillSwap up and running.

### **Prerequisites**

* Node.js (LTS version recommended)
* npm (comes with Node.js)
* MongoDB Atlas account (or local MongoDB instance)
* Google Cloud Platform account (for OAuth and Gemini API keys)

### **1. Clone the Repository**

```bash
git clone [https://github.com/Varsha567/SkillSwap.git](https://github.com/Varsha567/SkillSwap.git)
cd SkillSwap
````

### **2. Backend Setup**

Navigate to the `server` directory and install dependencies:

```bash
cd server
npm install
```

Create a `.env` file in the `server` directory and add your environment variables. **Do NOT commit this file to public repositories.**

**Run the Backend:**

```bash
npm start
```

The backend server will start on `http://localhost:5000`.

### **3. Frontend Setup**

Open a new terminal, navigate to the `client` directory, and install dependencies:

```bash
cd client
npm install
```

Create a `.env` file in the `client` directory:

**Run the Frontend:**

```bash
npm start
```

The React development server will start on `http://localhost:3000`. Open your browser and navigate to `http://localhost:3000`.

## 🚀 Deployment

The **SkillSwap** application is deployed using:

  * **Frontend:** Hosted on **Netlify** at [https://skillswap-platform.netlify.app](https://skillswap-platform.netlify.app)
  * **Backend:** Hosted on **Render** at [https://skillswap-8r3w.onrender.com](https://skillswap-8r3w.onrender.com)

Appropriate environment variables and rewrite rules are configured on both platforms to ensure seamless communication and client-side routing.

## ✨ Future Enhancements

  * Real-time chat functionality between users.
  * Skill rating and review system.
  * Advanced search and filtering for skills.
  * Recommendation engine for skill matching.
  * Notification system for new requests or messages.

## ✉️ Contact

For any questions or collaborations, feel free to reach out.


```
```
