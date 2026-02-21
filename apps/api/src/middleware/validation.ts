import { Request, Response, NextFunction } from 'express';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

// Request body schemas (single source for validation + OpenAPI doc)
export const projectSchema = z
  .object({
    title: z.string().min(3).max(100),
    description: z.string().min(10).max(500),
    category: z.enum(['web', 'mobile', 'fullstack', 'other']),
    technologies: z.array(z.string()).optional(),
    featured: z.boolean().optional(),
    links: z
      .object({
        github: z.string().url().optional(),
        live: z.string().url().optional(),
      })
      .optional(),
  })
  .openapi('ProjectBody');

export const skillSchema = z
  .object({
    name: z.string().min(3).max(100),
    description: z.string().min(10).max(500),
    icon: z.string().url().optional(),
  })
  .openapi('SkillBody');

export const experienceSchema = z
  .object({
    type: z.enum(['job', 'education']),
    company: z.string().min(3).max(100).optional(),
    education: z.string().min(3).max(100).optional(),
    position: z.string().min(3).max(100),
    location: z.string().min(3).max(100),
    startDate: z.coerce.date(),
    endDate: z.coerce.date().optional(),
  })
  .openapi('ExperienceBody');

export const registerSchema = z
  .object({
    name: z.string().min(2).max(50),
    email: z.string().email(),
    password: z.string().min(8),
  })
  .openapi('RegisterBody');

export const loginSchema = z
  .object({
    email: z.string().email(),
    password: z.string(),
  })
  .openapi('LoginBody');

export const validate = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: error.message,
        });
      }
      return next(error);
    }
  };
};

export const validateProject = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  validate(projectSchema)(req, res, next);
};

export const validateSkill = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  validate(skillSchema)(req, res, next);
};

export const validateExperience = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  validate(experienceSchema)(req, res, next);
};

export const validateRegister = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  validate(registerSchema)(req, res, next);
};

export const validateLogin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  validate(loginSchema)(req, res, next);
};
