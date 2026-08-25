import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Briefcase } from 'lucide-react';
import ProjectForm from '../components/project/ProjectForm';
import EmptyState from '../components/ui/EmptyState';
import { useToast } from '../components/ui/Toast';
import { getProjectById, updateProject } from '../../src/services/projectService';

export default function EditProject() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  const [initialData, setInitialData] = useState(null);
  const [fetching, setFetching] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      const p = getProjectById(id);
      setInitialData(p);
    } catch (error) {
      showToast('Error loading project for edit', 'error');
    } finally {
      setFetching(false);
    }
  }, [id, showToast]);

  const handleSubmit = (data) => {
    setLoading(true);
    try {
      updateProject(id, data);
      showToast('Project updated successfully', 'success');
      navigate(`/projects/${id}`);
    } catch (error) {
      showToast('Failed to update project', 'error');
      setLoading(false);
    }
  };

  if (fetching) return <div className="text-center py-20 text-gray-500">Loading project...</div>;

  if (!initialData) {
    return (
      <EmptyState
        icon={Briefcase}
        title="Project Not Found"
        description="The project you are trying to edit does not exist."
        action={{ label: 'Back to Projects', onClick: () => navigate('/projects') }}
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">Edit Project</h1>
        <p className="text-gray-500 text-sm mt-1">
          Update repository details, tech stack, and architectural context for {initialData.name}.
        </p>
      </div>

      <ProjectForm
        initialData={initialData}
        onSubmit={handleSubmit}
        isEditing={true}
        loading={loading}
      />
    </div>
  );
}
