import React, { useState } from 'react';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';
import Button from '../ui/Button';
import { createDecision } from '../../services/decisionService';
import { useToast } from '../ui/Toast';
import { Plus, X } from 'lucide-react';

export default function AddDecisionModal({ isOpen, onClose, projectId, onCreated }) {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    reason: '',
    altInput: '',
    alternatives: [],
    finalChoice: ''
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

  const handleAddAlt = (e) => {
    e.preventDefault();
    if (formData.altInput.trim()) {
      setFormData(prev => ({
        ...prev,
        alternatives: [...prev.alternatives, prev.altInput.trim()],
        altInput: ''
      }));
    }
  };

  const handleRemoveAlt = (idx) => {
    setFormData(prev => ({
      ...prev,
      alternatives: prev.alternatives.filter((_, i) => i !== idx)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Decision title is required';
    if (!formData.finalChoice.trim()) newErrors.finalChoice = 'Final choice is required';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const decision = createDecision({
        projectId,
        title: formData.title.trim(),
        description: formData.description.trim(),
        reason: formData.reason.trim(),
        alternatives: formData.alternatives,
        finalChoice: formData.finalChoice.trim()
      });
      showToast('Technical decision recorded', 'success');
      if (onCreated) onCreated(decision);
      onClose();
      setFormData({
        title: '',
        description: '',
        reason: '',
        altInput: '',
        alternatives: [],
        finalChoice: ''
      });
    } catch (err) {
      showToast('Failed to record decision', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Record Technical Decision" size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Decision Title / Question"
          name="title"
          value={formData.title}
          onChange={handleChange}
          error={errors.title}
          placeholder="e.g. Why Token Bucket over Leaky Bucket? or Redis vs PostgreSQL"
        />

        <Textarea
          label="Context / Problem Statement"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={2}
          placeholder="What architecture or engineering choice needed to be made?"
        />

        <Textarea
          label="Rationale & Trade-offs (Why was this choice made?)"
          name="reason"
          value={formData.reason}
          onChange={handleChange}
          rows={3}
          placeholder="e.g. Redis provides fast sub-millisecond atomic memory operations whereas writing every counter to disk in Postgres causes bottleneck..."
        />

        {/* Alternatives Considered */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Alternatives Considered
          </label>
          <div className="flex gap-2 mb-2">
            <Input
              placeholder="e.g. In-memory HashMap, Leaky Bucket, Kafka"
              value={formData.altInput}
              onChange={(e) => setFormData(prev => ({ ...prev, altInput: e.target.value }))}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddAlt(e);
                }
              }}
            />
            <Button type="button" variant="secondary" icon={Plus} onClick={handleAddAlt}>
              Add
            </Button>
          </div>

          {formData.alternatives.length > 0 && (
            <ul className="space-y-1.5 mb-2">
              {formData.alternatives.map((alt, idx) => (
                <li key={idx} className="flex items-center justify-between text-xs bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-lg">
                  <span className="text-gray-700 font-medium">• {alt}</span>
                  <button type="button" onClick={() => handleRemoveAlt(idx)} className="text-gray-400 hover:text-red-600">
                    <X size={14} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <Input
          label="Final Decision / Choice"
          name="finalChoice"
          value={formData.finalChoice}
          onChange={handleChange}
          error={errors.finalChoice}
          placeholder="e.g. Token Bucket with Redis Lua Scripts and Lettuce Pool"
        />

        <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" loading={loading}>
            Save Decision
          </Button>
        </div>
      </form>
    </Modal>
  );
}
