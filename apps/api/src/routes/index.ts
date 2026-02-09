import { Router } from 'express';
import projectRoutes from './projects';

const router = Router();

// API routes
router.use('/projects', projectRoutes);

export default router;