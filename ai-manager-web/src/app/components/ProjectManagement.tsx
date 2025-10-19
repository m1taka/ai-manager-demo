'use client';

import { useState } from 'react';
import { useProjects } from '../hooks/useApi';
import { StatCard, Card, LoadingSpinner, ErrorState, Badge, Button, ConfirmDialog } from './ui';
import { PageHeader, StatsGrid } from './layout';
import { Project } from '../types';
import { projectsAPI } from '../../services/api';
import { useMutation } from '../../hooks/useAPI';
import PageChatSection from '@/components/PageChatSection';
import ProjectForm from './forms/ProjectForm';

const ProjectManagement = () => {
  const { data: projects, loading, error, refetch } = useProjects();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | undefined>(undefined);
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; project?: Project }>({ isOpen: false });

  // Mutations for CRUD operations
  const createMutation = useMutation(projectsAPI.create, {
    onSuccess: () => {
      setIsFormOpen(false);
      setEditingProject(undefined);
      refetch();
    }
  });

  const updateMutation = useMutation(
    ({ id, data }: { id: string; data: any }) => projectsAPI.update(id, data),
    {
      onSuccess: () => {
        setIsFormOpen(false);
        setEditingProject(undefined);
        refetch();
      }
    }
  );

  const deleteMutation = useMutation(projectsAPI.delete, {
    onSuccess: () => {
      setDeleteConfirm({ isOpen: false });
      refetch();
    }
  });

  const handleAddProject = () => {
    setEditingProject(undefined);
    setIsFormOpen(true);
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setIsFormOpen(true);
  };

  const handleDeleteProject = (project: Project) => {
    setDeleteConfirm({ isOpen: true, project });
  };

  const handleFormSubmit = (formData: Partial<Project>) => {
    if (editingProject) {
      updateMutation.mutate({ id: editingProject._id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleConfirmDelete = () => {
    if (deleteConfirm.project) {
      deleteMutation.mutate(deleteConfirm.project._id);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return <ErrorState message={error} onRetry={refetch} />;
  }

  const calculateProgress = (project: Project) => {
    if (project.status === 'completed') return 100;
    if (project.status === 'planning') return 10;
    if (project.status === 'in-progress') return Math.round((project.spent / project.budget) * 100);
    return 0;
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'completed': return 'success';
      case 'in-progress': return 'info';
      case 'planning': return 'neutral';
      case 'on-hold': return 'warning';
      default: return 'neutral';
    }
  };

  const getPriorityVariant = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'neutral';
    }
  };

  const totalBudget = projects.reduce((sum, project) => sum + project.budget, 0);
  const totalSpent = projects.reduce((sum, project) => sum + project.spent, 0);
  const activeProjects = projects.filter(project => project.status === 'in-progress');
  const completedProjects = projects.filter(project => project.status === 'completed');

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Project Management" 
        description="Oversee project progress and timelines"
        action={<Button onClick={handleAddProject}>+ New Project</Button>}
      />

      {/* AI Assistant */}
      <PageChatSection category="projects" title="Project Assistant" />

      {/* Stats */}
      <StatsGrid columns={4}>
        <StatCard
          title="Total Projects"
          value={projects.length}
          icon="📊"
          trend={`${activeProjects.length} active`}
          color="blue"
        />
        <StatCard
          title="Completed Projects"
          value={completedProjects.length}
          icon="✅"
          trend={`${Math.round((completedProjects.length / projects.length) * 100)}% success rate`}
          color="green"
        />
        <StatCard
          title="Total Budget"
          value={`$${totalBudget.toLocaleString()}`}
          icon="💰"
          trend={`$${totalSpent.toLocaleString()} spent`}
          color="purple"
        />
        <StatCard
          title="Budget Utilization"
          value={`${Math.round((totalSpent / totalBudget) * 100)}%`}
          icon="📈"
          trend={totalBudget > 0 ? 'On track' : 'No budget'}
          color="yellow"
        />
      </StatsGrid>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {projects.map((project) => {
          const progress = calculateProgress(project);
          return (
            <Card key={project._id} className="space-y-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{project.title}</h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{project.description}</p>
                </div>
                <div className="flex flex-col gap-2 ml-4">
                  <Badge variant={getStatusVariant(project.status)} size="sm">
                    {project.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </Badge>
                  <Badge variant={getPriorityVariant(project.priority)} size="sm">
                    {project.priority}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Budget:</span>
                  <span className="font-medium">${project.budget.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Spent:</span>
                  <span className="font-medium">${project.spent.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Manager:</span>
                  <span className="font-medium truncate">{project.manager}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Team:</span>
                  <span className="font-medium">{project.team.length} members</span>
                </div>
              </div>

              <div className="pt-3 border-t">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-500">Progress</span>
                  <span className="font-medium">{progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t">
                <Button variant="ghost" size="sm" onClick={() => handleEditProject(project)}>
                  Edit
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleDeleteProject(project)}>
                  Delete
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Project Form Modal */}
      <ProjectForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingProject(undefined);
        }}
        onSubmit={handleFormSubmit}
        project={editingProject}
        loading={createMutation.loading || updateMutation.loading}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false })}
        onConfirm={handleConfirmDelete}
        title="Delete Project"
        message={`Are you sure you want to delete "${deleteConfirm.project?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />
    </div>
  );
};

export default ProjectManagement;