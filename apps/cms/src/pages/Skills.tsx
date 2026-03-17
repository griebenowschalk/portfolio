import React, { useState } from "react";
import Layout from "../components/layout/Layout";
import EntityForm from "../components/common/EntityForm";
import EntityList from "../components/common/EntityList";
import { useEntity } from "../hooks/useEntity";
import { skillsConfig } from "../config/entities/skills.config";
import { Plus } from "lucide-react";
import type { ApiSkill } from "@portfolio/shared";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";

const Skills: React.FC = () => {
  const { entities, isLoading, isError, mutate } =
    useEntity<ApiSkill>(skillsConfig);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEntity, setEditingEntity] = useState<ApiSkill | null>(null);

  const handleCreate = () => {
    setEditingEntity(null);
    setIsFormOpen(true);
  };

  const handleEdit = (entity: ApiSkill) => {
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
            <h1 className="text-4xl font-bold tracking-tight">Skills</h1>
            <p className="mt-2 text-muted-foreground">
              Manage your skills and proficiencies
            </p>
          </div>
          <Button onClick={handleCreate}>
            <Plus className="mr-2 h-4 w-4" />
            New Skill
          </Button>
        </div>

        {isLoading ? (
          <Card>
            <CardContent className="py-6 text-center text-muted-foreground">
              Loading skills...
            </CardContent>
          </Card>
        ) : isError ? (
          <Card>
            <CardContent className="py-6 text-center text-destructive">
              Failed to load skills. Please try again.
            </CardContent>
          </Card>
        ) : (
          <EntityList
            config={skillsConfig}
            entities={entities}
            onEdit={handleEdit}
            onDelete={() => mutate()}
          />
        )}

        {isFormOpen && (
          <EntityForm
            config={skillsConfig}
            entity={editingEntity}
            onClose={handleClose}
            onSuccess={handleSuccess}
          />
        )}
      </div>
    </Layout>
  );
};

export default Skills;
