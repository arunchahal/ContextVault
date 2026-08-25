import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProjectForm from '../components/project/ProjectForm';
import { useToast } from '../components/ui/Toast';
import { createProject } from '../../src/services/projectService';

export default function CreateProject() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSubmit = (data) => {
    setLoading(true);
    try {
      const newProject = createProject(data);
      showToast('Project context created successfully!', 'success');
      navigate(`/projects/${newProject.id}`);
    } catch (error) {
      showToast('Failed to create project', 'error');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">Add New Project</h1>
        <p className="text-gray-500 text-sm mt-1">
          Define your project repository, tech stack, architecture context, and team members.
        </p>
      </div>

      <ProjectForm onSubmit={handleSubmit} isEditing={false} loading={loading} />
    </div>
  );
}
