import { Request, Response, NextFunction } from "express";
import type { ApiListResponse, ApiProject } from "@portfolio/shared";
import Project from "../models/Project";
import s3Service from "../services/s3Service";
import { paginate, parsePaginationQuery } from "../utils/paginate";

class ProjectController {
  /**
   * GET /api/v1/projects
   * Get all projects with filtering and pagination
   */
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { category, featured, sort = "-createdAt", ...rest } = req.query;
      const { page, limit } = parsePaginationQuery(rest as Record<string, unknown>);

      const filter: Record<string, unknown> = {};
      if (category) filter.category = String(category);
      if (featured) filter.featured = featured === "true";

      const { data, pagination: pag } = await paginate(Project, filter, {
        page,
        limit,
        sort: sort as string,
        lean: true,
      });

      const body: ApiListResponse<ApiProject> = {
        success: true,
        data: data as unknown as ApiProject[],
        pagination: pag,
      };
      res.json(body);
    } catch (error) {
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
        res.status(404).json({
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
      const projectData = req.body;

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

      const project = await Project.create(projectData);

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
        res.status(404).json({
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
        res.status(404).json({
          success: false,
          error: "Project not found",
        });
        return;
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
