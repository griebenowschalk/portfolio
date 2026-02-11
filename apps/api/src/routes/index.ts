import { Router } from 'express';
import projectRoutes from './projects';
import skillRoutes from './skills';
import experienceRoutes from './experience';

const router = Router();

// API routes
router.use('/projects', projectRoutes);
router.use('/skills', skillRoutes);
router.use('/experience', experienceRoutes);

export default router;
