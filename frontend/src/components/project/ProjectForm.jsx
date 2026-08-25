import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Code2, 
  Globe, 
  BookOpen, 
  Layers, 
  Plus, 
  Search, 
  X, 
  Briefcase 
} from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Textarea from '../ui/Textarea';
import Modal from '../ui/Modal';
import { mockTechList, mockStatusOptions } from '../../data/mockData';
import { getProjects } from '../../services/projectService';
import RelatedProjectCard from './RelatedProjectCard';

export default function ProjectForm({ initialData, onSubmit, isEditing = false, loading = false }) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    detailedDescription: '',
    status: 'in-progress',
    techStack: [],
    tags: [],
    links: {
      github: '',
      liveDemo: '',
      documentation: '',
      figma: ''
    },
    team: ['Arun'],
    pinned: false,
    relatedProjects: []
  });

  const [errors, setErrors] = useState({});
  const [techInput, setTechInput] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [teamInput, setTeamInput] = useState('');

  // Related projects modal state
  const [isRelModalOpen, setIsRelModalOpen] = useState(false);
  const [availableProjects, setAvailableProjects] = useState([]);
  const [relSearchQuery, setRelSearchQuery] = useState('');
  const [selectedRelIds, setSelectedRelIds] = useState([]);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        description: initialData.description || '',
        detailedDescription: initialData.detailedDescription || '',
        status: initialData.status || 'in-progress',
        techStack: initialData.techStack || [],
        tags: initialData.tags || [],
        links: {
          github: initialData.links?.github || '',
          liveDemo: initialData.links?.liveDemo || '',
          documentation: initialData.links?.documentation || '',
          figma: initialData.links?.figma || ''
        },
        team: initialData.team || ['Arun'],
        pinned: Boolean(initialData.pinned),
        relatedProjects: initialData.relatedProjects || []
      });
    }
  }, [initialData]);

  useEffect(() => {
    if (isRelModalOpen) {
      const all = getProjects();
      setAvailableProjects(all);
    }
  }, [isRelModalOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleLinkChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      links: {
        ...prev.links,
        [field]: value
      }
    }));
  };

  // Tech Stack Handlers
  const handleToggleTech = (tech) => {
    setFormData(prev => ({
      ...prev,
      techStack: prev.techStack.includes(tech)
        ? prev.techStack.filter(t => t !== tech)
        : [...prev.techStack, tech]
    }));
  };

  const handleAddCustomTech = (e) => {
    e.preventDefault();
    if (techInput.trim() && !formData.techStack.includes(techInput.trim())) {
      setFormData(prev => ({
        ...prev,
        techStack: [...prev.techStack, techInput.trim()]
      }));
      setTechInput('');
    }
  };

  // Tag Handlers
  const handleAddTag = (e) => {
    e.preventDefault();
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  // Team Handlers
  const handleAddTeamMember = (e) => {
    e.preventDefault();
    if (teamInput.trim() && !formData.team.includes(teamInput.trim())) {
      setFormData(prev => ({
        ...prev,
        team: [...prev.team, teamInput.trim()]
      }));
      setTeamInput('');
    }
  };

  const handleRemoveTeamMember = (member) => {
    setFormData(prev => ({
      ...prev,
      team: prev.team.filter(m => m !== member)
    }));
  };

  // Related Projects Modal
  const openRelatedModal = () => {
    setSelectedRelIds([...formData.relatedProjects]);
    setRelSearchQuery('');
    setIsRelModalOpen(true);
  };

  const toggleSelectRelated = (id) => {
    setSelectedRelIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleSaveRelatedSelection = () => {
    setFormData(prev => ({
      ...prev,
      relatedProjects: selectedRelIds
    }));
    setIsRelModalOpen(false);
  };

  const handleRemoveRelated = (id) => {
    setFormData(prev => ({
      ...prev,
      relatedProjects: prev.relatedProjects.filter(rId => rId !== id)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Project name is required';
    if (!formData.description.trim()) newErrors.description = 'Short description is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    onSubmit(formData);
  };

  const filteredModalProjects = availableProjects.filter(p => {
    if (initialData && p.id === initialData.id) return false;
    return p.name.toLowerCase().includes(relSearchQuery.toLowerCase()) ||
           p.description.toLowerCase().includes(relSearchQuery.toLowerCase());
  });

  const allProjectsMap = getProjects().reduce((acc, p) => ({ ...acc, [p.id]: p }), {});

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* 1. Basic Information */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-xs space-y-5">
        <h2 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
          <Briefcase size={18} className="text-indigo-600" />
          Basic Project Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <Input
              label="Project Name *"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
              placeholder="e.g. Rate Limiter, ReliefLink, CodeInsight AI"
            />
          </div>

          <div>
            <Select
              label="Project Status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              options={mockStatusOptions}
            />
          </div>
        </div>

        <Input
          label="Short Description *"
          name="description"
          value={formData.description}
          onChange={handleChange}
          error={errors.description}
          placeholder="One-sentence elevator pitch describing what this software does..."
        />

        <Textarea
          label="Detailed Project Context (Problem, Solution, Architecture)"
          name="detailedDescription"
          value={formData.detailedDescription}
          onChange={handleChange}
          rows={6}
          placeholder="Describe the problem, key technical requirements, system architecture, and trade-offs..."
        />
      </div>

      {/* 2. Links & Repositories */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3">
          Project Links & Repositories
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1.5">
              <Code2 size={15} /> GitHub Repository URL
            </label>
            <Input
              value={formData.links.github}
              onChange={(e) => handleLinkChange('github', e.target.value)}
              placeholder="https://github.com/username/project"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1.5">
              <Globe size={15} /> Live Demo URL
            </label>
            <Input
              value={formData.links.liveDemo}
              onChange={(e) => handleLinkChange('liveDemo', e.target.value)}
              placeholder="https://myproject.example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1.5">
              <BookOpen size={15} /> Documentation / Wiki URL
            </label>
            <Input
              value={formData.links.documentation}
              onChange={(e) => handleLinkChange('documentation', e.target.value)}
              placeholder="https://docs.myproject.org"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1.5">
              <Layers size={15} /> Figma Design URL (Optional)
            </label>
            <Input
              value={formData.links.figma}
              onChange={(e) => handleLinkChange('figma', e.target.value)}
              placeholder="https://figma.com/file/..."
            />
          </div>
        </div>
      </div>

      {/* 3. Tech Stack & Tags */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-xs space-y-6">
        <h2 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3">
          Technology Stack & Tags
        </h2>

        {/* Tech Stack */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tech Stack (Click to toggle or add custom)
          </label>
          <div className="flex flex-wrap gap-2 mb-3">
            {mockTechList.map((tech) => {
              const selected = formData.techStack.includes(tech);
              return (
                <button
                  key={tech}
                  type="button"
                  onClick={() => handleToggleTech(tech)}
                  className={`px-3 py-1 text-xs font-medium rounded-lg border transition-all ${
                    selected
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xs'
                      : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  {selected && '✓ '}
                  {tech}
                </button>
              );
            })}
          </div>

          <div className="flex gap-2 max-w-md">
            <Input
              placeholder="Other technology (e.g. GraphQL, Tailwind, PyTorch)..."
              value={techInput}
              onChange={(e) => setTechInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddCustomTech(e);
                }
              }}
            />
            <Button type="button" variant="secondary" onClick={handleAddCustomTech}>
              Add
            </Button>
          </div>

          {/* Selected custom tech list */}
          {formData.techStack.length > 0 && (
            <div className="mt-3 flex items-center gap-2 flex-wrap">
              <span className="text-xs text-gray-500 font-medium">Selected ({formData.techStack.length}):</span>
              {formData.techStack.map((tech) => (
                <span key={tech} className="inline-flex items-center gap-1 text-xs bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded-md font-medium">
                  {tech}
                  <button type="button" onClick={() => handleToggleTech(tech)} className="hover:text-indigo-900">×</button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Project Tags */}
        <div className="pt-4 border-t border-gray-100">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Project Tags (e.g. Backend, Full Stack, Hackathon, College)
          </label>
          <div className="flex gap-2 max-w-md mb-2">
            <Input
              placeholder="Add a tag..."
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddTag(e);
                }
              }}
            />
            <Button type="button" variant="secondary" onClick={handleAddTag}>
              Add
            </Button>
          </div>
          {formData.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {formData.tags.map((tag) => (
                <span key={tag} className="inline-flex items-center gap-1 text-xs bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full">
                  #{tag}
                  <button type="button" onClick={() => handleRemoveTag(tag)} className="hover:text-red-500 font-bold">×</button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Team Members */}
        <div className="pt-4 border-t border-gray-100">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Team Members
          </label>
          <div className="flex gap-2 max-w-md mb-2">
            <Input
              placeholder="Add member (e.g. Arun (Lead), Priya)..."
              value={teamInput}
              onChange={(e) => setTeamInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddTeamMember(e);
                }
              }}
            />
            <Button type="button" variant="secondary" onClick={handleAddTeamMember}>
              Add
            </Button>
          </div>
          {formData.team.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {formData.team.map((member) => (
                <span key={member} className="inline-flex items-center gap-1 text-xs bg-gray-100 text-gray-800 px-2.5 py-1 rounded-md font-medium">
                  👤 {member}
                  <button type="button" onClick={() => handleRemoveTeamMember(member)} className="hover:text-red-500 ml-1">×</button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 4. Related Projects & Pinning */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <h2 className="text-base font-bold text-gray-900">
            Related Projects
          </h2>
          <Button type="button" variant="secondary" size="sm" icon={Plus} onClick={openRelatedModal}>
            Link Existing Project
          </Button>
        </div>

        {formData.relatedProjects.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {formData.relatedProjects.map((relId) => {
              const relProject = allProjectsMap[relId];
              return (
                <RelatedProjectCard
                  key={relId}
                  project={relProject || { id: relId, name: 'Project ' + relId }}
                  onRemove={handleRemoveRelated}
                />
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-gray-500">
            No related projects linked. Connect related microservices or complementary projects.
          </p>
        )}

        <div className="pt-4 border-t border-gray-100 flex items-center gap-2">
          <input
            type="checkbox"
            id="pinned"
            name="pinned"
            checked={formData.pinned}
            onChange={handleChange}
            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
          />
          <label htmlFor="pinned" className="text-sm font-medium text-gray-700 cursor-pointer">
            Pin this project for fast access on Dashboard
          </label>
        </div>
      </div>

      {/* Form Buttons */}
      <div className="flex justify-end gap-3 pb-8">
        <Button type="button" variant="secondary" onClick={() => navigate(-1)}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" loading={loading} size="lg">
          {isEditing ? 'Save Changes' : 'Create Project'}
        </Button>
      </div>

      {/* Modal: Link Related Project */}
      <Modal isOpen={isRelModalOpen} onClose={() => setIsRelModalOpen(false)} title="Link Related Project" size="md">
        <div className="space-y-4">
          <Input
            placeholder="Search projects..."
            value={relSearchQuery}
            onChange={(e) => setRelSearchQuery(e.target.value)}
            icon={Search}
          />
          <div className="max-h-60 overflow-y-auto space-y-2">
            {filteredModalProjects.length > 0 ? (
              filteredModalProjects.map((p) => {
                const isSelected = selectedRelIds.includes(p.id);
                return (
                  <div
                    key={p.id}
                    onClick={() => toggleSelectRelated(p.id)}
                    className={`p-3 rounded-lg border cursor-pointer flex items-center justify-between transition-colors ${
                      isSelected
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div>
                      <p className="font-semibold text-sm text-gray-900">{p.name}</p>
                      <p className="text-xs text-gray-500 line-clamp-1">{p.description}</p>
                    </div>
                    {isSelected && <span className="text-indigo-600 font-bold text-sm">✓ Selected</span>}
                  </div>
                );
              })
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">No projects found.</p>
            )}
          </div>
          <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
            <Button variant="secondary" onClick={() => setIsRelModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSaveRelatedSelection}>
              Confirm Selection ({selectedRelIds.length})
            </Button>
          </div>
        </div>
      </Modal>
    </form>
  );
}
