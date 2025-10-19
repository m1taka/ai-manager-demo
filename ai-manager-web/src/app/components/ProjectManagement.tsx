'use client';

import { useProjects } from '../hooks/useApi';
import { StatCard, Card, LoadingSpinner, ErrorState, Badge, Button } from './ui';
import { PageHeader, StatsGrid } from './layout';
import { Project } from '../types';
import PageChatSection from '@/components/PageChatSection';

const ProjectManagement = () => {
  const { data: projects, loading, error, refetch } = useProjects();

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
        action={<Button>+ New Project</Button>}
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
                <Button variant="ghost" size="sm">Edit</Button>
                <Button variant="ghost" size="sm">View Details</Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default ProjectManagement;