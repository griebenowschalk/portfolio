import React, { useState } from "react";
import Layout from "../components/layout/Layout";
import EntityForm from "../components/common/EntityForm";
import EntityList from "../components/common/EntityList";
import { useEntity } from "../hooks/useEntity";
import { experienceConfig } from "../config/entities/experience.config";
import { Plus } from "lucide-react";
import type { ApiExperience } from "@portfolio/shared";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";

const Experience: React.FC = () => {
  const { entities, isLoading, isError, mutate } =
    useEntity<ApiExperience>(experienceConfig);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEntity, setEditingEntity] = useState<ApiExperience | null>(
    null,
  );

  const handleCreate = () => {
    setEditingEntity(null);
    setIsFormOpen(true);
  };

  const handleEdit = (entity: ApiExperience) => {
    setEditingEntity(entity);
    setIsFormOpen(true);
  };

  const handleClose = () => {
    setIsFormOpen(false);
    setEditingEntity(null);
  };

  const handleSuccess = () => {
    mutate();
    handleClose();
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Experience</h1>
            <p className="mt-2 text-muted-foreground">
              Manage your work and education experience
            </p>
          </div>
          <Button onClick={handleCreate}>
            <Plus className="mr-2 h-4 w-4" />
            New Experience
          </Button>
        </div>

        {isLoading ? (
          <Card>
            <CardContent className="py-6 text-center text-muted-foreground">
              Loading experience...
            </CardContent>
          </Card>
        ) : isError ? (
          <Card>
            <CardContent className="py-6 text-center text-destructive">
              Failed to load experience. Please try again.
            </CardContent>
          </Card>
        ) : (
          <EntityList
            config={experienceConfig}
            entities={entities}
            onEdit={handleEdit}
            onDelete={() => mutate()}
          />
        )}

        {isFormOpen && (
          <EntityForm
            config={experienceConfig}
            entity={editingEntity}
            onClose={handleClose}
            onSuccess={handleSuccess}
          />
        )}
      </div>
    </Layout>
  );
};

export default Experience;
