import { Router } from 'express';
import projectRoutes from './projects';
import skillRoutes from './skills';
import experienceRoutes from './experience';
import authRoutes from './auth';

const router = Router();

// API routes
router.use('/projects', projectRoutes);
router.use('/skills', skillRoutes);
router.use('/experience', experienceRoutes);
router.use('/auth', authRoutes);

export default router;
