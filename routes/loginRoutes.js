import express from 'express';
import {
  login,
  register,
  verifyToken,
  logout
} from '../controllers/loginController.js';

const router = express.Router();


router.post('/', login);

router.post('/register', register);


router.get('/verify', verifyToken);

router.post('/logout', logout);

export default router;