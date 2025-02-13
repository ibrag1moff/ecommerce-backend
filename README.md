# eCommerce Backend

This is the backend service for an eCommerce application, built using Node.js, TypeScript, Express, and MongoDB.

## Features
- User authentication (JWT-based login & registration, Forgot Password, Reset Password, Verify Email)
- Admin role with product management capabilities
- CRUD operations for products and orders
- Shopping cart functionality
- Payment integration 
- Secure API endpoints
- Data validation with Mongoose schemas
- Error handling and logging

## Technologies Used
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework for Node.js
- **TypeScript** - Strongly typed JavaScript
- **MongoDB & Mongoose** - NoSQL database and ODM
- **bcrypt** - Password hashing
- **jsonwebtoken (JWT)** - Authentication
- **dotenv** - Environment variable management
- **cors** - Security middleware
- **nodemon** - Development tool for auto-restarting server

## Installation
### Prerequisites
- Node.js (latest LTS version recommended)
- MongoDB (local or cloud-based, e.g., MongoDB Atlas)

### Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/ecommerce-backend.git
   cd ecommerce-backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file and configure environment variables:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```
4. Start the server:
   ```bash
   npm run dev  # for development
   npm start    # for production
   ```

## API Endpoints
### Auth Routes
- `POST /auth/signup` - Register a new user
- `POST /auth/login` - Login and receive a JWT
- `POST /auth/forgot-password` - Request a password reset link
- `POST /auth/reset-password` - Reset password with a valid token
- `POST /auth/delete` - Delete account

### Product Routes
- `GET /products` - Get all products
- `POST /products/add` - Create a product (Admin only)
- `PUT /products/update/:id` - Update a product (Admin only)
- `DELETE /products/delete/:id` - Delete a product (Admin only)

## Folder Structure
```
/ecommerce-backend
│── controllers  # Business logic for routes
│── middlewares  # Authentication and error handling
│── models       # Mongoose schemas
│── routes       # API route handlers
│── utils        # Helper functions
│── index.ts    # Server entry point
│── .env         # Environment variables
│── package.json # Dependencies and scripts
│── tsconfig.json # TypeScript configuration
│── README.md    # Documentation
```

## License
This project is licensed under the MIT License.

---
Feel free to modify this README to better suit your project.

