import { NextFunction, Request, Response } from 'express';
import Skill, { ISkill } from '../models/Skill';
import s3Service from '../services/s3Service';
import { FilterQuery } from 'mongoose';

class SkillController {
  /**
   * GET /api/v1/skills
   * Get all skills with filtering
   */
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { category, isActive } = req.query;
      const query: FilterQuery<ISkill> = {};

      if (category) query.category = category;
      if (isActive) query.isActive = isActive === 'true';

      const skills = await Skill.find(query).sort('order');
      res.json({
        success: true,
        data: skills,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/skills/:id
   * Get a skill by id
   */
  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const skill = await Skill.findById(id);

      if (!skill) {
        res.status(404).json({
          success: false,
          error: 'Skill not found',
        });
      }

      res.json({
        success: true,
        data: skill,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/skills
   * Create a new skill
   */
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const skillData = req.body;

      // Handle image upload
      if (req.file) {
        const uploadedImage = await s3Service.uploadImage(req.file, {
          folder: 'skills',
        });
        skillData.icon = uploadedImage;
      }

      const skill = await Skill.create(skillData);
      res.status(201).json({
        success: true,
        data: skill,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/v1/skills/:id
   * Update a skill
   */
  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const skillData = req.body;

      // Handle image upload
      // If updating, check if an icon already exists for this skill (by name or unique field)
      // If exists, delete the old one before uploading the new one
      if (req.file && skillData.icon && skillData.icon.key) {
        const exists = await s3Service.fileExists(skillData.icon.key);
        if (exists) {
          await s3Service.deleteFile(skillData.icon.key);
        }
      }
      if (req.file) {
        const uploadedImage = await s3Service.uploadImage(req.file, {
          folder: 'skills',
        });
        skillData.icon = uploadedImage;
      }

      const skill = await Skill.findByIdAndUpdate(id, skillData, { new: true });

      if (!skill) {
        res.status(404).json({
          success: false,
          error: 'Skill not found',
        });
      }

      res.json({
        success: true,
        data: skill,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/v1/skills/:id
   * Delete a skill
   */
  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const skill = await Skill.findById(id);
      if (!skill) {
        res.status(404).json({
          success: false,
          error: 'Skill not found',
        });
      } else {
        if (skill.icon && skill.icon.key) {
          await s3Service.deleteFile(skill.icon.key);
        }

        await skill.deleteOne();
      }

      res.json({
        success: true,
        data: skill,
      });
    } catch (error) {
      next(error);
    }
  }
}
export default new SkillController();