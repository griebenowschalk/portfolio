import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { upload } from '../middleware/upload';
import { validateSkill } from '../middleware/validation';
import skillController from '../controllers/skillController';

const router = Router();

/**
 * PUBLIC ROUTES - No authentication required
 */

// GET /api/v1/skills
router.get('/', skillController.getAll);

// GET /api/v1/skills/:id
router.get('/:id', skillController.getById);

/**
 * PROTECTED ROUTES - Authentication required
 */

// POST /api/v1/skills
router.post(
  '/',
  authenticate,
  upload.single('icon'),
  validateSkill,
  skillController.create
);

// PUT /api/v1/skills/:id
router.put(
  '/:id',
  authenticate,
  upload.single('icon'),
  validateSkill,
  skillController.update
);

// DELETE /api/v1/skills/:id
router.delete('/:id', authenticate, skillController.delete);

export default router;
