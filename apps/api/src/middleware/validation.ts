import { Request, Response, NextFunction } from "express";
import { z } from "zod";

// Define validation schema using Zod
const projectSchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().min(10).max(500),
  category: z.enum(["web", "mobile", "fullstack", "other"]),
  technologies: z.array(z.string()).optional(),
  featured: z.boolean().optional(),
  links: z
    .object({
      github: z.string().url().optional(),
      live: z.string().url().optional(),
    })
    .optional(),
});

export const validateProject = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // Validate request body against schema
    projectSchema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: "Validation failed",
        details: error.errors,
      });
    }
    next(error);
  }
};
