# Agri Marketplace

A full-stack agricultural marketplace connecting farmers and traders.

## Setup

### Backend

1. Navigate to the backend folder:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the backend folder with:
   ```
   MONGODB_URI=mongodb://localhost:27017/agri
   PORT=5000
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
   ```

4. Start the server:
   ```bash
   node server.js
   ```

### Frontend

1. Navigate to the frontend folder:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the frontend folder with:
   ```
   VITE_API_URL=http://localhost:5000
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Features

- **User Authentication**: Register and login with role-based access (Farmer/Trader/Admin)
- **Product Management**: Farmers can create and manage product listings
- **Product Browsing**: Traders can browse all available products
- **Role-Based Access**: Protected routes based on user roles

## Tech Stack

- **Backend**: Node.js, Express, MongoDB, Mongoose, JWT
- **Frontend**: React, Vite, Tailwind CSS, React Router
