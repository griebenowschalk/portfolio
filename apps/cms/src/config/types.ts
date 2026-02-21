/* eslint-disable @typescript-eslint/no-explicit-any */
import { z } from "zod";
import type {
  UseFormRegister,
  FieldErrors,
  FieldValues,
  Path,
} from "react-hook-form";

// Field types
export type FieldType =
  | "text"
  | "textarea"
  | "select"
  | "checkbox"
  | "file"
  | "date"
  | "number"
  | "tags"
  | "url";

// Base field configuration
export interface BaseFieldConfig {
  type: FieldType;
  label: string;
  placeholder?: string;
  required?: boolean;
  defaultValue?: unknown;
  validation?: z.ZodTypeAny;
  helperText?: string;
  className?: string;
}

// Specific field configurations
export interface TextFieldConfig extends BaseFieldConfig {
  type: "text" | "url";
  maxLength?: number;
}

export interface TextAreaFieldConfig extends BaseFieldConfig {
  type: "textarea";
  rows?: number;
  maxLength?: number;
}

export interface SelectFieldConfig extends BaseFieldConfig {
  type: "select";
  options: Array<{ value: string; label: string }>;
}

export interface CheckboxFieldConfig extends BaseFieldConfig {
  type: "checkbox";
}

export interface FileFieldConfig extends BaseFieldConfig {
  type: "file";
  accept?: string;
  multiple?: boolean;
  maxFiles?: number;
}

export interface DateFieldConfig extends BaseFieldConfig {
  type: "date";
}

export interface NumberFieldConfig extends BaseFieldConfig {
  type: "number";
  min?: number;
  max?: number;
  step?: number;
}

export interface TagsFieldConfig extends BaseFieldConfig {
  type: "tags";
  suggestions?: string[];
}

// Union of all field configs
export type FieldConfig =
  | TextFieldConfig
  | TextAreaFieldConfig
  | SelectFieldConfig
  | CheckboxFieldConfig
  | FileFieldConfig
  | DateFieldConfig
  | NumberFieldConfig
  | TagsFieldConfig;

// Fields map
export type FieldsMap = Record<string, FieldConfig>;

// Display configuration
export interface DisplayConfig<T = any> {
  card?: {
    image?: (item: T) => string | undefined;
    title: (item: T) => string;
    subtitle?: (item: T) => string;
    description?: (item: T) => string;
    tags?: (item: T) => Array<{ label: string; color: string }>;
  };
}

export interface EntityConfig<T = any> {
  name: string;
  pluralName: string;
  endpoints: {
    list: string;
    create: string;
    update: (id: string) => string;
    delete: (id: string) => string;
  };
  fields: FieldsMap;
  display: DisplayConfig<T>;
  idField?: string;
}

// Form field props
export interface FormFieldProps {
  name: Path<FieldValues>;
  config: FieldConfig;
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors<FieldValues>;
  value?: unknown;
  onChange?: (value: unknown) => void;
}
