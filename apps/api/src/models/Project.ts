import mongoose, { Schema, Document } from "mongoose";

export interface IProject extends Document {
  title: string;
  slug: string;
  description: string;
  fullDescription: string;
  category: "web" | "mobile" | "fullstack" | "other";
  technologies: string[];
  featured: boolean;
  status: "planning" | "in-progress" | "completed" | "archived";
  images: Array<{
    url: string;
    thumbnailUrl: string;
    key: string;
    alt: string;
    order: number;
  }>;
  links: {
    github?: string;
    live?: string;
    documentation?: string;
  };
  metrics?: {
    performance: number;
    accessibility: number;
    bestPractices: number;
    seo: number;
  };
  highlights: string[];
  challenges: string[];
  learnings: string[];
  order: number;
  views: number;
  likes: number;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const projectSchema = new Schema<IProject>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    fullDescription: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: {
        values: ["web", "mobile", "fullstack", "other"],
        message: "{VALUE} is not a valid category",
      },
      default: "web",
      index: true,
    },
    technologies: {
      type: [String],
      default: [],
      index: true,
    },
    featured: {
      type: Boolean,
      default: false,
      index: true,
    },
    status: {
      type: String,
      enum: ["planning", "in-progress", "completed", "archived"],
      default: "in-progress",
    },
    images: [
      {
        url: { type: String, required: true },
        thumbnailUrl: { type: String, required: true },
        key: { type: String, required: true },
        alt: { type: String, default: "" },
        order: { type: Number, default: 0 },
      },
    ],
    links: {
      github: String,
      live: String,
      documentation: String,
    },
    metrics: {
      performance: { type: Number, min: 0, max: 100 },
      accessibility: { type: Number, min: 0, max: 100 },
      bestPractices: { type: Number, min: 0, max: 100 },
      seo: { type: Number, min: 0, max: 100 },
    },
    highlights: [String],
    challenges: [String],
    learnings: [String],
    order: {
      type: Number,
      default: 0,
      index: true,
    },
    views: {
      type: Number,
      default: 0,
    },
    likes: {
      type: Number,
      default: 0,
    },
    publishedAt: Date,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Compound indexes for performance
projectSchema.index({ featured: 1, order: 1 });
projectSchema.index({ category: 1, publishedAt: -1 });
projectSchema.index({ createdAt: -1 });

// Virtual for featured image
projectSchema.virtual("featuredImage").get(function () {
  return this.images.length > 0
    ? this.images.sort((a, b) => a.order - b.order)[0]
    : null;
});

// Pre-save middleware to generate slug
projectSchema.pre("save", function () {
  if (this.isModified("title") && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }
});

// Ensure unique slug
projectSchema.post("save", function (error: any, _doc: any, next: any) {
  if (error.name === "MongoServerError" && error.code === 11000) {
    next(new Error("Project with this slug already exists"));
  } else {
    next(error);
  }
});

export default mongoose.model<IProject>("Project", projectSchema);
