import express from 'express';
import {
  login,
  register,
  verifyToken,
  logout
} from '../controllers/loginController.js';

const router = express.Router();

/*
==================== SIMPLE LOGIN API ROUTES ====================

Base URL: http://localhost:5000/api/login

1. POST /login - Login with email and password
2. POST /login/register - Register new user
3. GET /login/verify - Verify token and get user info
4. POST /login/logout - Logout (client removes token)

Sample JSON for Login:
{
  "email": "admin@parishrama.com",
  "password": "admin123"
}

Sample JSON for Register:
{
  "email": "admin@parishrama.com",
  "password": "admin123"
}

Headers for protected routes:
Authorization: Bearer YOUR_JWT_TOKEN

Response Format:
{
  "success": true,
  "message": "Login successful",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "email": "user_email"
  }
}
*/

// @route   POST /api/login
// @desc    Login with email and password
// @access  Public
router.post('/', login);

// @route   POST /api/login/register
// @desc    Register new user
// @access  Public
router.post('/register', register);

// @route   GET /api/login/verify
// @desc    Verify token and get user info
// @access  Private (requires token)
router.get('/verify', verifyToken);

// @route   POST /api/login/logout
// @desc    Logout (client-side token removal)
// @access  Public
router.post('/logout', logout);

export default router;