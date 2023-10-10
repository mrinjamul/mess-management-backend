# Mess Management System Backend Server

This system is designed to help manage our Mess. It is used to members, attendance, transactions and generate billing per month for members based on their attendance.

Hosted at [akhp](https://akhp.onrender.com/).

you can system up status at [system status](https://6zlj5dx9.status.cron-job.org/).

Mobile App can be found at [AKHP-mobile](https://github.com/manish7479dlp/AKHP)

## Table of Contents

1. System Overview
2. Prerequisites
3. Installation
4. Configuration
5. Running the Server
6. API Endpoints
7. Data Models
8. Billing System
9. Contributing
10. License

---

## 1. System Overview

The Mess Management System Backend Server provides a RESTful API for managing members, recording meal attendance, and generating monthly billing for members. The key features include:

- Authentication: Secure API endpoints using authentication to ensure data privacy and integrity.
- Member Management: Add, update, and remove members from the system.
- Attendance Tracking: Record attendance for lunch and dinner meals for each member.
- Expenses tracking: Record expenses for the mess.
- Billing System: Automatically generate monthly billing reports for each member based on their meal attendance. (Not implemented Yet)

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
DEPLOY_HOOK_DEV="deploy web hook url"
```

## 5. Running the Server

Start the backend server by running the following command:

```sh
pnpm run start
```

The server will start on the default port 3000. You can change the port in the config.js file if needed.

## 6. API Endpoints

The backend server provides the following API endpoints:

### Authentication

To access certain endpoints, authentication is required. Users can sign up and log in to obtain an authentication token. The following endpoints are related to authentication:

- `POST /api/auth/signup`: Sign up a new user.
- `POST /api/auth/login`: Log in and obtain an authentication token.
- `GET /api/auth/logout`: Log out and invalidate the authentication token.

### User Management

The user management endpoints allow you to create, retrieve, update, and delete user information.

- `GET /api/v1/user`: Get a list of all users.
- `POST /api/v1/user`: Create a new user.
- `GET /api/v1/user/:mobile`: Get user details by mobile number.
- `PUT /api/v1/user/:mobile`: Update user details by mobile number.
- `PATCH /api/v1/user/:mobile/forgot-password`: Reset a user's password by mobile number.
- `DELETE /api/v1/user/:mobile`: Delete a user by mobile number.

### Routine Management

The routine management endpoints enable you to create, retrieve, update, and delete meal routines.

- `GET /api/v1/routine`: Get a list of all routines.
- `POST /api/v1/routine`: Create a new routine.
- `GET /api/v1/routine/:day`: Get routine details by day.
- `PUT /api/v1/routine/:id`: Update routine details by ID.
- `DELETE /api/v1/routine/:id`: Delete a routine by ID.

### Attendance

Attendance endpoints allow you to record and retrieve attendance information.

- `GET /api/v1/attendance`: Get a list of all attendance records.
- `GET /api/v1/attendance/attend`: Get attendance records for a specific meal.
- `GET /api/v1/attendance/:mobile`: Get attendance records by user mobile number.

### Transaction Management

The transaction management endpoints enable you to create, retrieve, update, and delete financial transactions.

- `GET /api/v1/transaction`: Get a list of all transactions.
- `GET /api/v1/transaction/:id`: Get transaction details by ID.
- `PUT /api/v1/transaction/:id`: Update transaction details by ID.
- `DELETE /api/v1/transaction/:id`: Delete a transaction by ID.

### Money Management

Money management endpoints are used to add and spend money, as well as retrieve financial summaries and expenses.

- `POST /api/v1/money/add`: Add money to a user's account.
- `POST /api/v1/money/spend`: Spend money from a user's account.
- `GET /api/v1/money/summary`: Get a summary of financial transactions.
- `GET /api/v1/money/expenses`: Get a list of expenses.

### Health Check

- `GET /health`: Check the health status of the server.

### Authentication Tokens

For endpoints that require authentication, include the authentication token in the request headers as follows:

```
Authorization: Bearer <token>
```

## 7. Data models

### Attendance Data Model

#### Attendance

Represents attendance records for members during meals.

**Attributes:**

- `user_mobile` (string, required): The mobile number of the user for whom attendance is recorded.
- `date` (string, required): The date on which attendance is recorded.
- `lunch` (boolean): Indicates whether the user attended lunch on the specified date.
- `dinner` (boolean): Indicates whether the user attended dinner on the specified date.
- `createdAt` (timestamp): The date and time when the attendance record was created.
- `updatedAt` (timestamp): The date and time when the attendance record was last updated.

### Routine Data Model

#### Routine

Represents the meal routine for a specific day.

**Attributes:**

- `day` (string, required, unique): The day for which the routine is defined (e.g., "Monday").
- `lunch` (string, required): The meal planned for lunch on the specified day.
- `dinner` (string, required): The meal planned for dinner on the specified day.
- `createdAt` (timestamp): The date and time when the routine was created.
- `updatedAt` (timestamp): The date and time when the routine was last updated.

### Transaction Data Model

#### Transaction

Represents financial transactions related to the mess management system.

**Attributes:**

- `type` (string, required): The type of transaction (e.g., "add" or "spend").
- `method` (string, required): The method used for the transaction.
- `sender` (string, required): The sender of the transaction.
- `recipient` (string, required): The recipient of the transaction.
- `amount` (number, required): The amount of the transaction.
- `description` (string): A description of the transaction.
- `item` (string): The item related to the transaction.
- `quantity` (string): The quantity of the item.
- `month` (string): The month associated with the transaction.
- `createdAt` (timestamp): The date and time when the transaction was created.
- `updatedAt` (timestamp): The date and time when the transaction was last updated.

### User Data Model

#### User

Represents a member of the mess management system.

**Attributes:**

- `id` (UUID): The unique identifier for the user.
- `firstName` (string): The first name of the user.
- `middleName` (string): The middle name of the user.
- `lastName` (string): The last name of the user.
- `mobile` (string, required, unique): The mobile number of the user.
- `password` (string): The hashed password of the user.
- `year` (string): The year associated with the user.
- `advance` (number): The advance payment amount made by the user.
- `due` (number): The due payment amount of the user.
- `role` (string): The role of the user (e.g., "user" or "admin").
- `level` (number, required): The level of the user.
- `createdAt` (timestamp): The date and time when the user account was created.
- `updatedAt` (timestamp): The date and time when the user account was last updated.

## 8. Billing System

The billing system calculates monthly bills based on meal attendance. Bills are generated at the end of each month.

## 9. Contributing

We welcome contributions to improve this system. If you find issues or have ideas for enhancements, please submit a pull request or open an issue on the GitHub repository.

## 10. License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

---

Thank you for using the Mess Management System Backend Server. If you have any questions or need further assistance, please don't hesitate to contact us.

Happy managing your mess! 🍽️
