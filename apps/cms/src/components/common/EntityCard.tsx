import { Edit, Trash2 } from "lucide-react";
import type { EntityConfig } from "../../config/types";

interface EntityCardProps<T> {
  config: EntityConfig<T>;
  entity: T;
  onEdit: (entity: T) => void;
  onDelete: (entity: T) => void;
}

const TAG_COLORS: Record<string, string> = {
  blue: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  green: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  yellow:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  red: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  purple:
    "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  gray: "bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-200",
};

function EntityCard<T>({
  config,
  entity,
  onEdit,
  onDelete,
}: EntityCardProps<T>) {
  const { card } = config.display;

  if (!card) return null;

  const image = card.image?.(entity);
  const title = card.title(entity);
  const subtitle = card.subtitle?.(entity);
  const description = card.description?.(entity);
  const tags = card.tags?.(entity) || [];

  const handleDelete = () => {
    if (confirm(`Delete "${title}"?`)) {
      onDelete(entity);
    }
  };

  return (
    <div className="card group">
      {image && (
        <img
          src={image}
          alt={title}
          className="w-full h-48 object-cover rounded-lg mb-4"
        />
      )}

      <div className="flex-1">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
          {title}
        </h3>

        {subtitle && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            {subtitle}
          </p>
        )}

        {description && (
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
            {description}
          </p>
        )}

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {tags.map((tag, index) => (
              <span
                key={index}
                className={`px-2 py-1 text-xs rounded ${
                  TAG_COLORS[tag.color] || TAG_COLORS.gray
                }`}
              >
                {tag.label}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="flex gap-2 mt-4">
        <button
          onClick={() => onEdit(entity)}
          className="btn btn-secondary flex-1"
        >
          <Edit className="w-4 h-4 mr-2" />
          Edit
        </button>
        <button onClick={handleDelete} className="btn btn-danger">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default EntityCard;
