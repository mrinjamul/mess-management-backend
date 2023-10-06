# Mess Management System Backend Server

This system is designed to help manage our Mess. It is used to members, attendance, transactions and generate billing per month for members based on their attendance.

Hosted at [akhp](https://akhp.onrender.com/).

you can system up status at [system status](https://6zlj5dx9.status.cron-job.org/).

## Table of Contents

1. System Overview
2. Prerequisites
3. Installation
4. Configuration
5. Running the Server
6. API Endpoints
7. Authentication
8. Data Models
9. Billing System
10. Contributing
11. License

---

## 1. System Overview

The Mess Management System Backend Server provides a RESTful API for managing members, recording meal attendance, and generating monthly billing for members. The key features include:

- Member Management: Add, update, and remove members from the system.
- Attendance Tracking: Record attendance for lunch and dinner meals for each member. (Not implemented Yet)
- Billing System: Automatically generate monthly billing reports for each member based on their meal attendance. (Not implemented Yet)
- Authentication: Secure API endpoints using authentication to ensure data privacy and integrity.

## 2. Prerequisites

Before setting up the backend server, ensure you have the following prerequisites:

- Node.js: Install Node.js and [pnpm](https://pnpm.io) (Node Package Manager) on your server. You can download them from nodejs.org.
- MongoDB: Set up a MongoDB database to store member data and attendance records. You can install MongoDB by following the instructions on mongodb.com.

## 3. Installation

1. Clone this repository to your server:

```sh
git clone https://github.com/your/repo.git
```

2. Navigate to the project directory:

```sh
cd mess-management-backend
```

3. Install the required Node.js packages:

```sh
pnpm install
```

## 4. Configuration

Open the `.env` file in the project's root directory and configure the following settings:

- MongoDB Connection: Set the MongoDB connection string.
- JWT Secret: Set a secret key for JSON Web Token (JWT) authentication.
- Billing Settings: Configure billing calculation parameters, such as meal prices and billing cycle.

Example,

```sh
DB_URL="mongodb-uri-string"
JWT_SECRET="really-secret-key"
DEPLOY_HOOK="deploy web hook url"
```

## 5. Running the Server

Start the backend server by running the following command:

```sh
pnpm run start
```

The server will start on the default port 3000. You can change the port in the config.js file if needed.

## 6. API Endpoints

The backend server provides the following API endpoints:

**User Management Endpoints:**

- GET /api/v1/user: Retrieve a list of users.
- GET /api/v1/user/:mobile: Retrieve a specific user by mobile number.
- PUT /api/v1/user/:mobile: Update a specific user's information.
- DELETE /api/v1/user/:mobile: Delete a specific user.
- POST /api/auth/signup: Register a new user.
- POST /api/auth/login: Authenticate and log in a user.
- GET /api/auth/logout: Log out the currently authenticated user.

**Routine Management Endpoints:**

- GET /api/v1/routine: Retrieve a list of routines.
- POST /api/v1/routine: Create a new routine.
- GET /api/v1/routine/:day: Retrieve a routine for a specific day.
- PUT /api/v1/routine/:id: Update a specific routine by its ID.
- DELETE /api/v1/routine/:id: Delete a specific routine by its ID.

**Health Check Endpoint:**

- GET /health: Check the health/status of the application.

## 7. Authentication

To access protected API endpoints, you need to include an authentication token in the request header. You can obtain a token by making a POST request to /api/auth/login with valid credentials. The token should be included in the Authorization header as a bearer token.

Example:

```
Authorization: Bearer your_token_here
```

## 9. Billing System

The billing system calculates monthly bills based on meal attendance. Bills are generated at the end of each month.

## 10. Contributing

We welcome contributions to improve this system. If you find issues or have ideas for enhancements, please submit a pull request or open an issue on the GitHub repository.

## 11. License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

---

Thank you for using the Mess Management System Backend Server. If you have any questions or need further assistance, please don't hesitate to contact us.

Happy managing your mess! 🍽️
