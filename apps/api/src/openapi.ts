import {
  OpenAPIRegistry,
  OpenApiGeneratorV3,
} from "@asteasolutions/zod-to-openapi";
import { z } from "zod";
import {
  projectSchema,
  skillSchema,
  experienceSchema,
  registerSchema,
  loginSchema,
} from "./middleware/validation";

const registry = new OpenAPIRegistry();

// Bearer JWT (use token from POST /api/v1/auth/login)
registry.registerComponent("securitySchemes", "bearerAuth", {
  type: "http",
  scheme: "bearer",
  bearerFormat: "JWT",
  description: "Access token from POST /api/v1/auth/login",
});

// Auth paths
registry.registerPath({
  method: "post",
  path: "/api/v1/auth/register",
  summary: "Create a new CMS user (admin only)",
  description: "Only an authenticated admin can add users. New user signs in via POST /login.",
  security: [{ bearerAuth: [] }],
  request: { body: { content: { "application/json": { schema: registerSchema } } } },
  responses: {
    201: {
      description: "User created",
      content: {
        "application/json": {
          schema: z
            .object({
              success: z.literal(true),
              data: z.object({
                user: z.object({ id: z.string(), name: z.string(), email: z.string(), role: z.string() }),
              }),
            })
            .openapi("RegisterResponse"),
        },
      },
    },
    400: { description: "Validation failed or user exists" },
    401: { description: "Not authenticated" },
    403: { description: "Admin only" },
  },
});

registry.registerPath({
  method: "post",
  path: "/api/v1/auth/login",
  summary: "Login",
  request: { body: { content: { "application/json": { schema: loginSchema } } } },
  responses: {
    200: {
      description: "Tokens",
      content: {
        "application/json": {
          schema: z
            .object({
              success: z.literal(true),
              data: z.object({
                user: z.object({ id: z.string(), name: z.string(), email: z.string(), role: z.string() }),
                token: z.string(),
                refreshToken: z.string(),
              }),
            })
            .openapi("LoginResponse"),
        },
      },
    },
    401: { description: "Invalid credentials" },
  },
});

registry.registerPath({
  method: "get",
  path: "/api/v1/auth/me",
  summary: "Get current user",
  security: [{ bearerAuth: [] }],
  responses: { 200: { description: "Current user" }, 401: { description: "Unauthorized" } },
});

registry.registerPath({
  method: "post",
  path: "/api/v1/auth/logout",
  summary: "Logout",
  security: [{ bearerAuth: [] }],
  responses: { 200: { description: "Logged out" }, 401: { description: "Unauthorized" } },
});

// Projects
registry.registerPath({
  method: "get",
  path: "/api/v1/projects",
  summary: "List projects",
  request: {
    query: z
      .object({
        page: z.string().optional().openapi({ description: "Page number" }),
        limit: z.string().optional().openapi({ description: "Page size" }),
        category: z.enum(["web", "mobile", "fullstack", "other"]).optional(),
        featured: z.enum(["true", "false"]).optional(),
      })
      .openapi("ProjectListQuery"),
  },
  responses: { 200: { description: "Paginated projects" } },
});

registry.registerPath({
  method: "get",
  path: "/api/v1/projects/{slug}",
  summary: "Get project by slug",
  request: { params: z.object({ slug: z.string() }) },
  responses: { 200: { description: "Project" }, 404: { description: "Not found" } },
});

registry.registerPath({
  method: "post",
  path: "/api/v1/projects",
  summary: "Create project",
  security: [{ bearerAuth: [] }],
  request: {
    body: { content: { "application/json": { schema: projectSchema } } },
  },
  responses: { 201: { description: "Created" }, 400: { description: "Validation failed" }, 401: { description: "Unauthorized" } },
});

registry.registerPath({
  method: "put",
  path: "/api/v1/projects/{id}",
  summary: "Update project",
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({ id: z.string() }),
    body: { content: { "application/json": { schema: projectSchema } } },
  },
  responses: { 200: { description: "Updated" }, 400: { description: "Validation failed" }, 401: { description: "Unauthorized" }, 404: { description: "Not found" } },
});

registry.registerPath({
  method: "delete",
  path: "/api/v1/projects/{id}",
  summary: "Delete project",
  security: [{ bearerAuth: [] }],
  request: { params: z.object({ id: z.string() }) },
  responses: { 200: { description: "Deleted" }, 401: { description: "Unauthorized" }, 404: { description: "Not found" } },
});

// Skills (GET supports query: category, isActive)
registry.registerPath({
  method: "get",
  path: "/api/v1/skills",
  summary: "List skills",
  request: {
    query: z
      .object({
        category: z.string().optional().openapi({ description: "Filter by category" }),
        isActive: z.enum(["true", "false"]).optional(),
      })
      .openapi("SkillListQuery"),
  },
  responses: { 200: { description: "List of skills" } },
});

registry.registerPath({
  method: "get",
  path: "/api/v1/skills/{id}",
  summary: "Get skill by ID",
  request: { params: z.object({ id: z.string() }) },
  responses: { 200: { description: "Skill" }, 404: { description: "Not found" } },
});

registry.registerPath({
  method: "post",
  path: "/api/v1/skills",
  summary: "Create skill",
  security: [{ bearerAuth: [] }],
  request: { body: { content: { "application/json": { schema: skillSchema } } } },
  responses: { 201: { description: "Created" }, 400: { description: "Validation failed" }, 401: { description: "Unauthorized" } },
});

registry.registerPath({
  method: "put",
  path: "/api/v1/skills/{id}",
  summary: "Update skill",
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({ id: z.string() }),
    body: { content: { "application/json": { schema: skillSchema } } },
  },
  responses: { 200: { description: "Updated" }, 400: { description: "Validation failed" }, 401: { description: "Unauthorized" }, 404: { description: "Not found" } },
});

registry.registerPath({
  method: "delete",
  path: "/api/v1/skills/{id}",
  summary: "Delete skill",
  security: [{ bearerAuth: [] }],
  request: { params: z.object({ id: z.string() }) },
  responses: { 200: { description: "Deleted" }, 401: { description: "Unauthorized" }, 404: { description: "Not found" } },
});

// Experience
registry.registerPath({
  method: "get",
  path: "/api/v1/experience",
  summary: "List experience",
  responses: { 200: { description: "List of experience" } },
});

registry.registerPath({
  method: "get",
  path: "/api/v1/experience/{id}",
  summary: "Get experience by ID",
  request: { params: z.object({ id: z.string() }) },
  responses: { 200: { description: "Experience" }, 404: { description: "Not found" } },
});

registry.registerPath({
  method: "post",
  path: "/api/v1/experience",
  summary: "Create experience",
  security: [{ bearerAuth: [] }],
  request: { body: { content: { "application/json": { schema: experienceSchema } } } },
  responses: { 201: { description: "Created" }, 400: { description: "Validation failed" }, 401: { description: "Unauthorized" } },
});

registry.registerPath({
  method: "put",
  path: "/api/v1/experience/{id}",
  summary: "Update experience",
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({ id: z.string() }),
    body: { content: { "application/json": { schema: experienceSchema } } },
  },
  responses: { 200: { description: "Updated" }, 400: { description: "Validation failed" }, 401: { description: "Unauthorized" }, 404: { description: "Not found" } },
});

registry.registerPath({
  method: "delete",
  path: "/api/v1/experience/{id}",
  summary: "Delete experience",
  security: [{ bearerAuth: [] }],
  request: { params: z.object({ id: z.string() }) },
  responses: { 200: { description: "Deleted" }, 401: { description: "Unauthorized" }, 404: { description: "Not found" } },
});

const generator = new OpenApiGeneratorV3(registry.definitions);

export const openApiDocument = generator.generateDocument({
  openapi: "3.0.3",
  info: {
    title: "Portfolio CMS API",
    version: "1.0.0",
    description: "Backend API for portfolio CMS. Use the token from POST /api/v1/auth/login in the Authorize button for protected routes.",
  },
  servers: [{ url: "/", description: "Current host" }],
  security: [],
});
