import React, { useState } from 'react';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Textarea from '../ui/Textarea';
import Button from '../ui/Button';
import { createResource } from '../../services/resourceService';
import { useToast } from '../ui/Toast';

const resourceTypeOptions = [
  { value: 'documentation', label: 'Documentation' },
  { value: 'github', label: 'GitHub Repository' },
  { value: 'article', label: 'Article / Blog Post' },
  { value: 'tutorial', label: 'Tutorial' },
  { value: 'video', label: 'YouTube / Video' },
  { value: 'paper', label: 'Research Paper' },
  { value: 'website', label: 'Official Website' },
  { value: 'other', label: 'Other' }
];

export default function AddResourceModal({ isOpen, onClose, projectId, onCreated }) {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    type: 'documentation',
    description: '',
    tagInput: '',
    tags: []
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleAddTag = (e) => {
    e.preventDefault();
    if (formData.tagInput.trim() && !formData.tags.includes(formData.tagInput.trim().toLowerCase())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, prev.tagInput.trim().toLowerCase()],
        tagInput: ''
      }));
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tagToRemove)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Resource title is required';
    if (!formData.url.trim()) newErrors.url = 'URL is required';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const resource = createResource({
        projectId,
        title: formData.title.trim(),
        url: formData.url.trim(),
        type: formData.type,
        description: formData.description.trim(),
        tags: formData.tags
      });
      showToast('Resource added successfully', 'success');
      if (onCreated) onCreated(resource);
      onClose();
      setFormData({
        title: '',
        url: '',
        type: 'documentation',
        description: '',
        tagInput: '',
        tags: []
      });
    } catch (err) {
      showToast('Failed to add resource', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Project Resource" size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Resource Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          error={errors.title}
          placeholder="e.g. Redis Documentation, Token Bucket Algorithm"
        />

        <Input
          label="URL / Link"
          name="url"
          value={formData.url}
          onChange={handleChange}
          error={errors.url}
          placeholder="https://..."
        />

        <Select
          label="Resource Type"
          name="type"
          value={formData.type}
          onChange={handleChange}
          options={resourceTypeOptions}
        />

        <Textarea
          label="Description / Context"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          placeholder="Why is this resource useful for the project?"
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
          <div className="flex gap-2 mb-2">
            <Input
              placeholder="Add tag (e.g. redis, architecture)"
              value={formData.tagInput}
              onChange={(e) => setFormData(prev => ({ ...prev, tagInput: e.target.value }))}
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
              {formData.tags.map((tag, idx) => (
                <span key={idx} className="inline-flex items-center gap-1 text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">
                  #{tag}
                  <button type="button" onClick={() => handleRemoveTag(tag)} className="hover:text-red-500">×</button>
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" loading={loading}>
            Save Resource
          </Button>
        </div>
      </form>
    </Modal>
  );
}
