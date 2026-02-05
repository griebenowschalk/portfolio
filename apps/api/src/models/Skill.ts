import mongoose, { Schema, Document } from "mongoose";

export interface ISkill extends Document {
  name: string;
  category: "frontend" | "backend" | "tools" | "soft-skills" | "other";
  proficiency: number; // 0-100
  yearsOfExperience?: number;
  icon?: {
    url: string;
    key: string;
  };
  description?: string;
  link?: string;
  relatedSkills: string[];
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const skillSchema = new Schema<ISkill>(
  {
    name: {
      type: String,
      required: [true, "Skill name is required"],
      trim: true,
      unique: true,
    },
    category: {
      type: String,
      enum: {
        values: ["frontend", "backend", "tools", "soft-skills", "other"],
        message: "{VALUE} is not a valid category",
      },
      required: true,
      index: true,
    },
    proficiency: {
      type: Number,
      required: true,
      min: [0, "Proficiency must be at least 0"],
      max: [100, "Proficiency cannot exceed 100"],
    },
    yearsOfExperience: {
      type: Number,
      min: 0,
    },
    icon: {
      url: String,
      key: String,
    },
    description: {
      type: String,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    link: {
      type: String,
      trim: true,
    },
    relatedSkills: [String],
    order: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

// Indexes
skillSchema.index({ category: 1, order: 1 });
skillSchema.index({ isActive: 1 });

export default mongoose.model<ISkill>("Skill", skillSchema);
