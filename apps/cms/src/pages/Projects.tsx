import { useState } from "react";
import Layout from "../components/layout/Layout";
import EntityForm from "../components/common/EntityForm";
import EntityList from "../components/common/EntityList";
import { useEntity } from "../hooks/useEntity";
import { projectsConfig } from "../config/entities/projects.config";
import { Plus } from "lucide-react";
import type { ApiProject } from "@portfolio/shared";

const Projects = () => {
  const { entities, isLoading, isError, mutate } =
    useEntity<ApiProject>(projectsConfig);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEntity, setEditingEntity] = useState<ApiProject | null>(null);

  const handleCreate = () => {
    setEditingEntity(null);
    setIsFormOpen(true);
  };

  const handleEdit = (entity: ApiProject) => {
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
              Projects
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Manage your portfolio projects
            </p>
          </div>
          <button onClick={handleCreate} className="btn btn-primary">
            <Plus className="w-5 h-5 mr-2" />
            New Project
          </button>
        </div>

        {isLoading ? (
          <div className="card">
            <p className="text-center text-gray-600 dark:text-gray-400">
              Loading projects...
            </p>
          </div>
        ) : isError ? (
          <div className="card">
            <p className="text-center text-red-600">
              Failed to load projects. Please try again.
            </p>
          </div>
        ) : (
          <EntityList
            config={projectsConfig}
            entities={entities}
            onEdit={handleEdit}
            onDelete={() => mutate()}
          />
        )}

        {isFormOpen && (
          <EntityForm
            config={projectsConfig}
            entity={editingEntity}
            onClose={handleClose}
            onSuccess={handleSuccess}
          />
        )}
      </div>
    </Layout>
  );
};

export default Projects;
