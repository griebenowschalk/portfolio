import mongoose, { Schema, Document } from "mongoose";

export type ExperienceType = "job" | "education";

export interface IExperience extends Document {
  type: ExperienceType;
  company?: string;
  education?: string; // institution name when type === "education"
  position: string;
  location?: string;
  startDate: Date;
  endDate?: Date;
  current: boolean;
  description: string;
  achievements: string[];
  technologies: string[];
  logo?: {
    url: string;
    key: string;
  };
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const experienceSchema = new Schema<IExperience>(
  {
    type: {
      type: String,
      enum: { values: ["job", "education"], message: "{VALUE} is not a valid type" },
      default: "job",
      index: true,
    },
    company: {
      type: String,
      trim: true,
    },
    education: {
      type: String,
      trim: true,
    },
    position: {
      type: String,
      required: [true, "Position is required"],
      trim: true,
    },
    location: {
      type: String,
      trim: true,
    },
    startDate: {
      type: Date,
      required: [true, "Start date is required"],
    },
    endDate: Date,
    current: {
      type: Boolean,
      default: false,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    achievements: {
      type: [String],
      default: [],
    },
    technologies: {
      type: [String],
      default: [],
    },
    logo: {
      url: String,
      key: String,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

// Indexes
experienceSchema.index({ type: 1, startDate: -1 });
experienceSchema.index({ startDate: -1 });
experienceSchema.index({ current: 1 });

// Virtual for duration
experienceSchema.virtual("duration").get(function () {
  const start = this.startDate;
  const end = this.endDate || new Date();
  const months = Math.floor(
    (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 30),
  );
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;

  if (years > 0) {
    return remainingMonths > 0
      ? `${years} year${years > 1 ? "s" : ""} ${remainingMonths} month${remainingMonths > 1 ? "s" : ""}`
      : `${years} year${years > 1 ? "s" : ""}`;
  }
  return `${months} month${months > 1 ? "s" : ""}`;
});

export default mongoose.model<IExperience>("Experience", experienceSchema);
