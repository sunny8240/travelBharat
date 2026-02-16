# TravelBharat Backend

This is the Node.js/Express backend for TravelBharat, a tourism information platform for Indian states and destinations.

## Quick Start

1. Install dependencies: `npm install`
2. Create `.env` file with MongoDB URI, JWT secret, and admin credentials
3. Start the server: `npm run dev` (development) or `npm start` (production)

## Main Features

- RESTful API for states and destinations
- Admin authentication with JWT tokens
- MongoDB database for data storage
- Image upload support
- CORS enabled for frontend integration

## API Routes

- `GET /api/states` - Get all states
- `GET /api/destinations` - Get all destinations
- `POST /api/auth/admin-login` - Admin login
- Management endpoints for creating/updating content (protected)

## Deployment

Deploy to Render by connecting your GitHub repo and setting environment variables. The backend runs on the production URL for API calls.
