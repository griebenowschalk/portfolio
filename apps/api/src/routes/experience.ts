import { Router } from 'express';
import experienceController from '../controllers/experienceController';
import { authenticate } from '../middleware/auth';
import { validateExperience } from '../middleware/validation';

const router = Router();

/**
 * PUBLIC ROUTES - No authentication required
 */

// GET /api/v1/experience
router.get('/', experienceController.getAll);

// GET /api/v1/experience/:id
router.get('/:id', experienceController.getById);

/**
 * PROTECTED ROUTES - Authentication required
 */

// POST /api/v1/experience
router.post('/', authenticate, validateExperience, experienceController.create);

// PUT /api/v1/experience/:id
router.put(
  '/:id',
  authenticate,
  validateExperience,
  experienceController.update
);

// DELETE /api/v1/experience/:id
router.delete('/:id', authenticate, experienceController.delete);

export default router;
