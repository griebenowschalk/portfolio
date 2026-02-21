import React, { useState } from "react";
import Layout from "../components/layout/Layout";
import EntityForm from "../components/common/EntityForm";
import EntityList from "../components/common/EntityList";
import { useEntity } from "../hooks/useEntity";
import { skillsConfig } from "../config/entities/skills.config";
import { Plus } from "lucide-react";
import type { ApiSkill } from "@portfolio/shared";

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
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Skills
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Manage your skills and proficiencies
            </p>
          </div>
          <button onClick={handleCreate} className="btn btn-primary">
            <Plus className="w-5 h-5 mr-2" />
            New Skill
          </button>
        </div>

        {isLoading ? (
          <div className="card">
            <p className="text-center text-gray-600 dark:text-gray-400">
              Loading skills...
            </p>
          </div>
        ) : isError ? (
          <div className="card">
            <p className="text-center text-red-600">
              Failed to load skills. Please try again.
            </p>
          </div>
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
