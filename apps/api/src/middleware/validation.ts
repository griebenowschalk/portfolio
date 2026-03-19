import { Request, Response, NextFunction } from 'express';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

/**
 * Coercion helpers for multipart/form-data bodies.
 * The CMS sends all non-file fields as strings; numbers, booleans, and
 * arrays/objects must be coerced before Zod validates them.
 */
const parseJson = (v: unknown): unknown => {
  if (typeof v === 'string') {
    try {
      return JSON.parse(v);
    } catch {
      return v;
    }
  }
  return v;
};

const coerceBool = (v: unknown): unknown =>
  v === 'true' ? true : v === 'false' ? false : v;

const jsonStringArray = z.preprocess(parseJson, z.array(z.string()));

// Request body schemas (single source for validation + OpenAPI doc)
export const projectSchema = z
  .object({
    title: z.string().min(3).max(100),
    description: z.string().min(10).max(500),
    fullDescription: z.string().optional(),
    category: z.enum(['web', 'mobile', 'fullstack', 'other']),
    status: z
      .enum(['planning', 'in-progress', 'completed', 'archived'])
      .optional(),
    technologies: jsonStringArray.optional(),
    featured: z.preprocess(coerceBool, z.boolean()).optional(),
    links: z
      .preprocess(
        parseJson,
        z
          .object({
            github: z.string().url().optional(),
            live: z.string().url().optional(),
            documentation: z.string().url().optional(),
          })
          .optional()
      )
      .optional(),
  })
  .openapi('ProjectBody');

export const skillSchema = z
  .object({
    name: z.string().min(2).max(100),
    category: z.enum(['frontend', 'backend', 'tools', 'soft-skills', 'other']),
    proficiency: z.coerce.number().min(0).max(100),
    yearsOfExperience: z.coerce.number().min(0).max(50).optional(),
    description: z.string().max(500).optional(),
    link: z.string().url().optional(),
    isActive: z.preprocess(coerceBool, z.boolean()).optional(),
  })
  .openapi('SkillBody');

export const experienceSchema = z
  .object({
    type: z.enum(['job', 'education']).optional(),
    company: z.string().min(2).max(100).optional(),
    education: z.string().min(2).max(100).optional(),
    position: z.string().min(2).max(100),
    location: z.string().max(100).optional(),
    startDate: z.coerce.date(),
    endDate: z.coerce.date().optional(),
    current: z.preprocess(coerceBool, z.boolean()).optional(),
    description: z.string().min(10),
    achievements: jsonStringArray.optional(),
    technologies: jsonStringArray.optional(),
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
      // Important: we want the *parsed* + coerced values (JSON strings -> objects,
      // booleans coerced, etc.) to be available to the controller.
      const parsed = schema.parse(req.body);
      req.body = parsed;
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
