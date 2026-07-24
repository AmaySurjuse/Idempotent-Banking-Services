# Idempotent Banking Services API

A robust, RESTful banking backend engineered to handle secure financial transactions. Built with a layered architecture, this API ensures data integrity through ACID-compliant database operations and custom idempotency mechanisms.

## 🚀 Tech Stack
*   **Runtime/Framework:** Node.js, Express.js
*   **Database:** MongoDB, Mongoose
*   **Security:** JWT (JSON Web Tokens), Google reCAPTCHA
*   **Validation:** Zod

## ✨ Core Features
*   **ACID-Compliant Transactions:** Utilizes MongoDB sessions to ensure that multi-step financial transfers either succeed entirely or roll back cleanly, preventing phantom money.
*   **Idempotency Engine:** Prevents duplicate transaction processing during network retries by caching unique request keys.
*   **Secure Authentication:** JWT-based route protection to isolate user dashboards and financial actions.
*   **Strict Payload Validation:** Middleware intercepts and validates all incoming data using Zod before it reaches the controllers.

## 🔗 API Endpoints
*   `POST /api/register` - Create a new bank account
*   `POST /api/login` - Authenticate and retrieve JWT
*   `GET /api/dashboard` - Retrieve verified account balance and details
*   `POST /api/transfer` - Execute a secure financial transfer (requires Idempotency-Key)
