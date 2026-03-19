/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import type { EntityConfig } from "../../config/types";
import FormField from "./form/FormField";
import apiClient from "../../lib/api-client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";

interface EntityFormProps<T> {
  config: EntityConfig<T>;
  entity?: T | null;
  onClose: () => void;
  onSuccess: () => void;
}

function getNestedValue(obj: any, path: string): unknown {
  const keys = path.split(".");
  let value: any = obj;

  for (const key of keys) {
    if (value && typeof value === "object" && key in value) {
      value = value[key];
    } else {
      return undefined;
    }
  }

  return value;
}

function normalizeTagsValue(value: unknown): string[] {
  // The CMS persists tag arrays as JSON strings in multipart requests.
  // If some existing DB rows got "double-encoded", we may receive:
  //   ['["Next.js","TailwindCSS"]']
  // or even JSON-stringified strings of JSON arrays.
  // Normalize into a flat string[] of tag labels.
  const result: string[] = [];

  const pushUnique = (tag: string) => {
    const cleaned = tag.trim();
    if (!cleaned) return;
    if (!result.includes(cleaned)) result.push(cleaned);
  };

  const normalizeFromRaw = (raw: string, depth: number): void => {
    const trimmed = raw.trim();

    // Case A: raw is JSON array like ["Next.js","React"]
    if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) {
          parsed.forEach((x) => {
            if (typeof x === "string") pushUnique(x);
          });
          return;
        }
      } catch {
        // fallthrough
      }
    }

    // Case B: double-encoded: JSON.parse('"[\"a\",\"b\"]"') => "[\"a\",\"b\"]"
    if (depth < 3) {
      try {
        const parsed = JSON.parse(trimmed);
        if (typeof parsed === "string") {
          normalizeFromRaw(parsed, depth + 1);
          return;
        }
      } catch {
        // fallthrough
      }
    }

    // Case C: plain string tag
    pushUnique(trimmed);
  };

  if (typeof value === "string") {
    normalizeFromRaw(value, 0);
    return result;
  }

  if (!Array.isArray(value)) return result;

  for (const item of value) {
    if (typeof item !== "string") continue;
    normalizeFromRaw(item, 0);
  }

  return result;
}

function EntityForm<T>({
  config,
  entity,
  onClose,
  onSuccess,
}: EntityFormProps<T>) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fileFields, setFileFields] = useState<Record<string, File[]>>({});
  const [removedFields, setRemovedFields] = useState<Set<string>>(new Set());

  const { schema, defaultValues } = useMemo(() => {
    const schemaShape: Record<string, z.ZodTypeAny> = {};
    const values: Record<string, any> = {};

    Object.entries(config.fields).forEach(([key, field]) => {
      schemaShape[key] = field.validation || z.unknown().optional();

      if (entity) {
        let value = getNestedValue(entity, key);
        // <input type="date"> requires YYYY-MM-DD; API returns full ISO strings
        if (field.type === "date" && value) {
          try {
            value = new Date(value as string).toISOString().split("T")[0];
          } catch {
            // leave as-is
          }
        }
        if (field.type === "tags") {
          values[key] = normalizeTagsValue(value);
        } else {
          values[key] = value !== undefined ? value : field.defaultValue;
        }
      } else {
        values[key] = field.defaultValue;
      }
    });

    const zodSchema = z.object(schemaShape);
    return { schema: zodSchema, defaultValues: values };
  }, [config.fields, entity]);

  type FormData = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as FormData,
  });

  const formValues = watch();

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);

    try {
      const formData = new FormData();

      Object.entries(config.fields).forEach(([key, field]) => {
        const value = data[key as keyof FormData];

        if (field.type === "file") {
          const files = fileFields[key] || [];
          files.forEach((file) => {
            const fieldName = field.multiple ? key : key.replace(/s$/, "");
            formData.append(fieldName, file);
          });
        } else if (field.type === "tags") {
          const tags = normalizeTagsValue(value);
          if (tags.length > 0) {
            formData.append(key, JSON.stringify(tags));
          }
        } else if (!key.includes(".")) {
          if (value !== undefined && value !== null && value !== "") {
            formData.append(key, String(value));
          }
        }
      });

      const nestedObjects: Record<string, Record<string, any>> = {};

      Object.entries(config.fields).forEach(([key]) => {
        if (key.includes(".")) {
          const [parent, child] = key.split(".");
          if (!nestedObjects[parent]) {
            nestedObjects[parent] = {};
          }
          // react-hook-form stores dotted field names as nested paths
          // (e.g. "links.github" → formValues.links.github), so `data` from
          // zodResolver strips these as unknown keys. Read from formValues instead.
          const value = getNestedValue(formValues, key);
          if (value !== undefined && value !== null && value !== "") {
            nestedObjects[parent][child] = value;
          }
        }
      });

      Object.entries(nestedObjects).forEach(([key, value]) => {
        formData.append(key, JSON.stringify(value));
      });

      // Signal image removals (only when no replacement file was uploaded)
      removedFields.forEach((fieldName) => {
        const hasReplacement = (fileFields[fieldName] || []).length > 0;
        if (!hasReplacement) {
          formData.append(`remove_${fieldName}`, "true");
        }
      });

      const idField = config.idField || "_id";
      const entityId = entity ? (entity as any)[idField] : undefined;

      if (entity && entityId && typeof entityId === "string") {
        await apiClient.put(config.endpoints.update(entityId), formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success(`${config.name} updated successfully`);
      } else {
        await apiClient.post(config.endpoints.create, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success(`${config.name} created successfully`);
      }

      onSuccess();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : `Failed to save ${config.name}`;
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (fieldName: string, files: File[]) => {
    setFileFields((prev) => ({ ...prev, [fieldName]: files }));
  };

  const handleTagsChange = (fieldName: string, tags: string[]) => {
    setValue(fieldName as keyof FormData, tags as any);
  };

  const handleControlledChange = (fieldName: string, value: unknown) => {
    if (config.fields[fieldName]?.type === "file") {
      handleFileChange(fieldName, value as File[]);
    } else if (config.fields[fieldName]?.type === "tags") {
      handleTagsChange(fieldName, value as string[]);
    }
  };

  const handleRemoveCurrent = (fieldName: string) => {
    setRemovedFields((prev) => {
      const next = new Set(prev);
      if (next.has(fieldName)) {
        next.delete(fieldName); // undo
      } else {
        next.add(fieldName);
      }
      return next;
    });
  };

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {entity ? `Edit ${config.name}` : `New ${config.name}`}
          </DialogTitle>
        </DialogHeader>

        <Separator />

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {Object.entries(config.fields).map(([fieldName, fieldConfig]) => (
            <FormField
              key={fieldName}
              name={fieldName as keyof FormData & string}
              config={fieldConfig}
              register={register}
              errors={errors}
              value={formValues[fieldName as keyof FormData]}
              onChange={(value) => handleControlledChange(fieldName, value)}
              onRemoveCurrent={
                fieldConfig.type === "file"
                  ? () => handleRemoveCurrent(fieldName)
                  : undefined
              }
            />
          ))}

          <Separator />

          <div className="flex gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default EntityForm;
