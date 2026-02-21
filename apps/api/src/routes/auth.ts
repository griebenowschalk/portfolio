import { Router } from 'express';
import authController from '../controllers/authController';
import { validateRegister, validateLogin } from '../middleware/validation';
import { authenticate, requireAdmin } from '../middleware/auth';

const router = Router();

// PUBLIC
router.post('/login', validateLogin, authController.login);

// ADMIN ONLY
router.post('/register', authenticate, requireAdmin, validateRegister, authController.register);

// PROTECTED ROUTES

router.get('/me', authenticate, authController.getMe);
router.post('/logout', authenticate, authController.logout);

export default router;
