import { Router } from "express";
import projectController from "../controllers/projectController";
import { authenticate } from "../middleware/auth";
import { upload } from "../middleware/upload";
import { validateProject } from "../middleware/validation";

const router = Router();

/**
 * PUBLIC ROUTES - No authentication required
 */

// GET /api/v1/projects
// Query params: ?page=1&limit=10&category=web&featured=true
router.get("/", projectController.getAll);

// GET /api/v1/projects/:slug
router.get("/:slug", projectController.getBySlug);

/**
 * PROTECTED ROUTES - Authentication required
 */

// POST /api/v1/projects
// Body: { title, description, category, technologies, ... }
// Files: images[]
router.post(
  "/",
  authenticate, // Check JWT token
  upload.array("images", 5), // Handle up to 5 images
  validateProject, // Validate request body
  projectController.create,
);

// PUT /api/v1/projects/:id
router.put(
  "/:id",
  authenticate,
  upload.array("images", 5),
  validateProject,
  projectController.update,
);

// DELETE /api/v1/projects/:id
router.delete("/:id", authenticate, projectController.delete);

export default router;
