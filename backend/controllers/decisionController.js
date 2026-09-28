const Decision = require('../models/Decision');
const Project = require('../models/Project');

const getDecisions = async (req, res) => {
  const project = await Project.findOne({ _id: req.params.projectId, userId: req.user._id });
  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  const decisions = await Decision.find({ projectId: req.params.projectId }).sort({ createdAt: -1 });
  res.json({ success: true, data: decisions });
};

const createDecision = async (req, res) => {
  const project = await Project.findOne({ _id: req.params.projectId, userId: req.user._id });
  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  const { title, description, reason, alternatives, finalChoice, relatedFiles, relatedCommitIds } = req.body;

  if (!title || !finalChoice) {
    res.status(400);
    throw new Error('Title and finalChoice are required');
  }

  const decision = await Decision.create({
    userId: req.user._id,
    projectId: req.params.projectId,
    title,
    description: description || '',
    reason: reason || '',
    alternatives: alternatives || [],
    finalChoice,
    relatedFiles: relatedFiles || [],
    relatedCommitIds: relatedCommitIds || []
  });

  res.status(201).json({ success: true, data: decision });
};

const updateDecision = async (req, res) => {
  const decision = await Decision.findOne({ _id: req.params.id, userId: req.user._id });
  if (!decision) {
    res.status(404);
    throw new Error('Decision not found');
  }

  const updated = await Decision.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.json({ success: true, data: updated });
};

const deleteDecision = async (req, res) => {
  const decision = await Decision.findOne({ _id: req.params.id, userId: req.user._id });
  if (!decision) {
    res.status(404);
    throw new Error('Decision not found');
  }

  await Decision.deleteOne({ _id: req.params.id });
  res.json({ success: true, message: 'Decision deleted' });
};

module.exports = { getDecisions, createDecision, updateDecision, deleteDecision };
