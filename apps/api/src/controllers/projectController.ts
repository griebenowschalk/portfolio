import { Request, Response, NextFunction } from "express";
import type { ApiListResponse, ApiProject } from "@portfolio/shared";
import Project from "../models/Project";
import s3Service from "../services/s3Service";

class ProjectController {
  /**
   * GET /api/v1/projects
   * Get all projects with filtering and pagination
   */
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      // 1. EXTRACT QUERY PARAMETERS
      const {
        page = 1,
        limit = 10,
        category,
        featured,
        sort = "-createdAt",
      } = req.query;

      // 2. BUILD QUERY OBJECT
      const query: any = {};

      if (category) query.category = category;
      if (featured) query.featured = featured === "true";

      // 3. EXECUTE QUERY
      const skip = (Number(page) - 1) * Number(limit);

      // Run query and count in parallel for speed
      const [projects, total] = await Promise.all([
        Project.find(query)
          .sort(sort as string)
          .skip(skip)
          .limit(Number(limit))
          .lean(), // Returns plain JS objects (faster)
        Project.countDocuments(query),
      ]);

      // 4. SEND RESPONSE (shape defined in @portfolio/shared)
      const body: ApiListResponse<ApiProject> = {
        success: true,
        data: projects as unknown as ApiProject[],
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit)),
        },
      };
      res.json(body);
    } catch (error) {
      // Pass errors to error handling middleware
      next(error);
    }
  }

  /**
   * GET /api/v1/projects/:slug
   * Get single project by slug
   */
  async getBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const { slug } = req.params;

      const project = await Project.findOne({ slug });

      if (!project) {
        return res.status(404).json({
          success: false,
          error: "Project not found",
        });
      }

      res.json({
        success: true,
        data: project,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/projects
   * Create new project (requires auth)
   */
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      // 1. GET DATA FROM REQUEST BODY
      const projectData = req.body;

      // 2. HANDLE FILE UPLOADS (if images provided)
      if (req.files && Array.isArray(req.files)) {
        const uploadedImages = await s3Service.uploadMultiple(
          req.files as Express.Multer.File[],
          {
            folder: "projects",
            resize: { width: 1200, height: 800, fit: "cover" },
            generateThumbnail: true,
          },
        );

        projectData.images = uploadedImages.map((img, index) => ({
          ...img,
          alt: projectData.title,
          order: index,
        }));
      }

      // 3. CREATE PROJECT
      const project = await Project.create(projectData);

      // 4. SEND RESPONSE
      res.status(201).json({
        success: true,
        data: project,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/v1/projects/:id
   * Update project (requires auth)
   */
  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const updates = req.body;

      // Handle new images
      if (req.files && Array.isArray(req.files)) {
        const uploadedImages = await s3Service.uploadMultiple(
          req.files as Express.Multer.File[],
          {
            folder: "projects",
            resize: { width: 1200, height: 800, fit: "cover" },
            generateThumbnail: true,
          },
        );

        // Add new images to existing ones
        updates.images = [
          ...(updates.images || []),
          ...uploadedImages.map((img) => ({
            ...img,
            alt: updates.title,
          })),
        ];
      }

      const project = await Project.findByIdAndUpdate(id, updates, {
        new: true, // Return updated document
        runValidators: true, // Run schema validations
      });

      if (!project) {
        return res.status(404).json({
          success: false,
          error: "Project not found",
        });
      }

      res.json({
        success: true,
        data: project,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/v1/projects/:id
   * Delete project (requires auth)
   */
  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const project = await Project.findById(id);

      if (!project) {
        return res.status(404).json({
          success: false,
          error: "Project not found",
        });
      }

      // Delete images from S3
      if (project.images.length > 0) {
        await Promise.all(
          project.images.map((img) => s3Service.deleteFile(img.key)),
        );
      }

      await project.deleteOne();

      res.json({
        success: true,
        message: "Project deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new ProjectController();
