import { Router } from 'express';
import authController from '../controllers/authController';
import { validateRegister, validateLogin } from '../middleware/validation';
import { authenticate } from '../middleware/auth';

const router = Router();

// PUBLIC ROUTES

router.post('/register', validateRegister, authController.register);
router.post('/login', validateLogin, authController.login);

// PROTECTED ROUTES

router.get('/me', authenticate, authController.getMe);
router.post('/logout', authenticate, authController.logout);

export default router;
