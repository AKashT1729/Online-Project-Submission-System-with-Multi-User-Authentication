# Online Project Submission System with Multi-User Authentication

This project is an Online Project Submission System that allows students to submit their projects for approval by a Project Guide and Head of Department (HoD). The system supports multi-user authentication and role-based access control.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Setup](#project-setup)
- [API Endpoints](#api-endpoints)
- [Environment Variables](#environment-variables)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- **Multi-User Authentication:**
  - Roles: `Student`, `ProjectGuide`, and `HoD`
  - OTP verification for Email verification 
  - Access Token & Refresh Token-based authentication
- **Project Submission Workflow:**
  - Students can submit projects with details and upload SRS files.
  - Project Guides can review, approve, or reject submitted projects.
  - HoD reviews the final approval.
- **Dashboard:**
  - Each user has a role-based dashboard with appropriate options.
  - Project status notifications (Approved/Rejected).
- **Forgot Password:**
  - OTP-based password reset functionality.

## Tech Stack

### Frontend:
- **React.js**
- **Tailwind CSS**

### Backend:
- **Node.js** with **Express.js**
- **MongoDB** with **Mongoose**
- **JWT** for authentication
- **bcrypt** for password hashing
- **Nodemailer** for sending OTP via email

### Tools & Libraries:
- **crypto** for secure OTP hashing
- **cookie-parser** for managing cookies
- **dotenv** for managing environment variables

## Project Setup

### Prerequisites
Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (version 14.x or higher)
- [MongoDB](https://www.mongodb.com/) (or use MongoDB Atlas)

### Steps to Run the Project

1. **Clone the repository:**
   ```bash
   git clone 
   
