/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X } from "lucide-react";
import toast from "react-hot-toast";
import type { EntityConfig } from "../../config/types";
import FormField from "./form/FormField";
import apiClient from "../../lib/api-client";

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

function EntityForm<T>({
  config,
  entity,
  onClose,
  onSuccess,
}: EntityFormProps<T>) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fileFields, setFileFields] = useState<Record<string, File[]>>({});

  const { schema, defaultValues } = useMemo(() => {
    const schemaShape: Record<string, z.ZodTypeAny> = {};
    const values: Record<string, any> = {};

    Object.entries(config.fields).forEach(([key, field]) => {
      schemaShape[key] = field.validation || z.unknown().optional();

      if (entity) {
        const value = getNestedValue(entity, key);
        values[key] = value !== undefined ? value : field.defaultValue;
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
          if (value && Array.isArray(value)) {
            formData.append(key, JSON.stringify(value));
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
          const value = data[key as keyof FormData];
          if (value !== undefined && value !== null && value !== "") {
            nestedObjects[parent][child] = value;
          }
        }
      });

      Object.entries(nestedObjects).forEach(([key, value]) => {
        formData.append(key, JSON.stringify(value));
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {entity ? `Edit ${config.name}` : `New ${config.name}`}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          {Object.entries(config.fields).map(([fieldName, fieldConfig]) => (
            <FormField
              key={fieldName}
              name={fieldName as keyof FormData & string}
              config={fieldConfig}
              register={register}
              errors={errors}
              value={formValues[fieldName as keyof FormData]}
              onChange={(value) => handleControlledChange(fieldName, value)}
            />
          ))}

          <div className="flex gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary flex-1"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary flex-1"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EntityForm;
