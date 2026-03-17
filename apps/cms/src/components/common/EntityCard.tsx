import { Edit, Trash2 } from "lucide-react";
import type { EntityConfig } from "../../config/types";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { cn } from "../../lib/utils";

interface EntityCardProps<T> {
  config: EntityConfig<T>;
  entity: T;
  onEdit: (entity: T) => void;
  onDelete: (entity: T) => void;
}

const TAG_COLOR_MAP: Record<string, string> = {
  blue: "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20",
  green:
    "bg-green-500/10 text-green-700 dark:text-green-300 border-green-500/20",
  yellow:
    "bg-yellow-500/10 text-yellow-700 dark:text-yellow-300 border-yellow-500/20",
  red: "bg-red-500/10 text-red-700 dark:text-red-300 border-red-500/20",
  purple:
    "bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/20",
  gray: "bg-gray-500/10 text-gray-700 dark:text-gray-300 border-gray-500/20",
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
    <Card className="group overflow-hidden transition-all hover:shadow-lg">
      {/* Image */}
      {image && (
        <div className="relative aspect-video overflow-hidden border-b">
          <img
            src={image}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>
      )}

      <CardHeader className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="line-clamp-1">{title}</CardTitle>
          {tags.length > 0 && tags[0] && (
            <Badge
              variant="outline"
              className={cn(
                "shrink-0",
                TAG_COLOR_MAP[tags[0].color] || TAG_COLOR_MAP.gray,
              )}
            >
              {tags[0].label}
            </Badge>
          )}
        </div>

        {subtitle && (
          <CardDescription className="line-clamp-1">{subtitle}</CardDescription>
        )}
      </CardHeader>

      {description && (
        <CardContent>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {description}
          </p>
        </CardContent>
      )}

      {/* Tags */}
      {tags.length > 1 && (
        <CardContent className="pt-0">
          <div className="flex flex-wrap gap-1.5">
            {tags.slice(1).map((tag, index) => (
              <Badge
                key={index}
                variant="outline"
                className={cn(
                  "text-xs",
                  TAG_COLOR_MAP[tag.color] || TAG_COLOR_MAP.gray,
                )}
              >
                {tag.label}
              </Badge>
            ))}
          </div>
        </CardContent>
      )}

      <CardFooter className="gap-2 border-t pt-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit(entity)}
          className="flex-1"
        >
          <Edit className="mr-2 h-4 w-4" />
          Edit
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleDelete}
          className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}

export default EntityCard;
