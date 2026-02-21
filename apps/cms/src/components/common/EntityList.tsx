import type { EntityConfig } from "../../config/types";
import EntityCard from "./EntityCard";
import toast from "react-hot-toast";
import apiClient from "../../lib/api-client";

interface EntityListProps<T> {
  config: EntityConfig<T>;
  entities: T[];
  onEdit: (entity: T) => void;
  onDelete: () => void;
}

function EntityList<T>({
  config,
  entities,
  onEdit,
  onDelete,
}: EntityListProps<T>) {
  const handleDelete = async (entity: T) => {
    try {
      const idField = config.idField || "_id";
      const entityId = entity[idField as keyof T];

      if (typeof entityId !== "string") {
        throw new Error("Invalid entity ID");
      }

      await apiClient.delete(config.endpoints.delete(entityId));
      toast.success(`${config.name} deleted`);
      onDelete();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : `Failed to delete ${config.name}`;
      toast.error(message);
    }
  };

  if (entities.length === 0) {
    return (
      <div className="card text-center">
        <p className="text-gray-600 dark:text-gray-400">
          No {config.pluralName} yet. Create your first one!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {entities.map((entity) => {
        const idField = config.idField || "_id";
        const entityId = entity[idField as keyof T];

        return (
          <EntityCard
            key={String(entityId)}
            config={config}
            entity={entity}
            onEdit={onEdit}
            onDelete={handleDelete}
          />
        );
      })}
    </div>
  );
}

export default EntityList;
