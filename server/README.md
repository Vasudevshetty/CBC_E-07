# Express Server API

A RESTful API server built with Express.js with essential setup including JWT authentication, cookie parsing, CORS, Morgan logging, and more.

## Features

- Express framework for routing and middleware
- JWT-based authentication
- Cookie parsing
- CORS configuration
- MongoDB integration with Mongoose
- Request logging with Morgan
- Security with Helmet
- Rate limiting

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)

### Installation

1. Clone the repository
2. Navigate to the server directory
3. Install dependencies:
   ```
   npm install
   ```
4. Create a `.env` file based on the example provided
5. Start the server:
   ```
   npm start
   ```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/myapp
JWT_SECRET=your_jwt_secret_key_change_this_in_production
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login a user
- `GET /api/auth/logout` - Logout the current user
- `GET /api/auth/me` - Get the current logged-in user profile

### Users

- `GET /api/users/profile` - Get user profile (protected)
- `GET /api/users/admin` - Admin-only route (requires admin role)

## License

MIT
