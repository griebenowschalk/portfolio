import { NextFunction, Request, Response } from 'express';
import Experience from '../models/Experience';
import type { ExperienceType } from '../models/Experience';
import { paginate, parsePaginationQuery } from '../utils/paginate';

class ExperienceController {
  /**
   * GET /api/v1/experience
   * Get all experience with filtering and pagination
   */
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { type, sort = "startDate", ...rest } = req.query;
      const { page, limit } = parsePaginationQuery(rest as Record<string, unknown>);

      const filter: Record<string, unknown> = {};
      if (type) filter.type = type as ExperienceType;

      const { data, pagination } = await paginate(Experience, filter, {
        page,
        limit,
        sort: sort as string,
      });
      res.json({ success: true, data, pagination });
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
