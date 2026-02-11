import { NextFunction, Request, Response } from 'express';
import Experience from '../models/Experience';

class ExperienceController {
  /**
   * GET /api/v1/experience
   * Get all experience
   */
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const experience = await Experience.find();
      res.json({
        success: true,
        data: experience,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/experience/:id
   * Get a experience by id
   */
  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const experience = await Experience.findById(id);
      if (!experience) {
        res.status(404).json({
          success: false,
          error: 'Experience not found',
        });

        return;
      }
      res.json({
        success: true,
        data: experience,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/experience
   * Create a new experience
   */
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const experience = await Experience.create(req.body);
      res.status(201).json({
        success: true,
        data: experience,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/v1/experience/:id
   * Update a experience
   */
  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const experience = await Experience.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      if (!experience) {
        res.status(404).json({
          success: false,
          error: 'Experience not found',
        });
      }
      res.json({
        success: true,
        data: experience,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/v1/experience/:id
   * Delete a experience
   */
  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const experience = await Experience.findByIdAndDelete(id);
      if (!experience) {
        res.status(404).json({
          success: false,
          error: 'Experience not found',
        });
      }
      res.json({
        success: true,
        data: experience,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new ExperienceController();
