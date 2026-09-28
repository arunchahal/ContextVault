const Resource = require('../models/Resource');
const Project = require('../models/Project');

const getResources = async (req, res) => {
  const project = await Project.findOne({ _id: req.params.projectId, userId: req.user._id });
  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  const resources = await Resource.find({ projectId: req.params.projectId }).sort({ createdAt: -1 });
  res.json({ success: true, data: resources });
};

const createResource = async (req, res) => {
  const project = await Project.findOne({ _id: req.params.projectId, userId: req.user._id });
  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  const { title, url, type, description, tags } = req.body;

  if (!title || !url) {
    res.status(400);
    throw new Error('Title and URL are required');
  }

  const resource = await Resource.create({
    userId: req.user._id,
    projectId: req.params.projectId,
    title,
    url,
    type: type || 'documentation',
    description: description || '',
    tags: tags || []
  });

  res.status(201).json({ success: true, data: resource });
};

const updateResource = async (req, res) => {
  const resource = await Resource.findOne({ _id: req.params.id, userId: req.user._id });
  if (!resource) {
    res.status(404);
    throw new Error('Resource not found');
  }

  const updated = await Resource.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.json({ success: true, data: updated });
};

const deleteResource = async (req, res) => {
  const resource = await Resource.findOne({ _id: req.params.id, userId: req.user._id });
  if (!resource) {
    res.status(404);
    throw new Error('Resource not found');
  }

  await Resource.deleteOne({ _id: req.params.id });
  res.json({ success: true, message: 'Resource deleted' });
};

module.exports = { getResources, createResource, updateResource, deleteResource };
