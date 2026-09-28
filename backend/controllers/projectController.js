const mongoose = require('mongoose');
const Project = require('../models/Project');
const Resource = require('../models/Resource');
const Decision = require('../models/Decision');
const Task = require('../models/Task');
const GitHubActivity = require('../models/GitHubActivity');
const QuickNote = require('../models/QuickNote');

const getProjects = async (req, res) => {
  const { q, status, tech, pinned, sortBy } = req.query;

  const filter = { userId: req.user._id };

  if (status && status !== 'all') filter.status = status;
  if (pinned === 'true') filter.pinned = true;
  if (tech && tech !== 'all') {
    filter.techStack = { $elemMatch: { $regex: new RegExp(`^${tech}$`, 'i') } };
  }

  if (q && q.trim()) {
    const regex = new RegExp(q.trim(), 'i');
    filter.$or = [
      { name: regex },
      { description: regex },
      { detailedDescription: regex },
      { techStack: regex },
      { tags: regex }
    ];
  }

  let sortOption = { updatedAt: -1 };
  if (sortBy === 'newest') sortOption = { createdAt: -1 };
  else if (sortBy === 'oldest') sortOption = { createdAt: 1 };
  else if (sortBy === 'alphabetical') sortOption = { name: 1 };

  const projects = await Project.find(filter).sort(sortOption);

  res.json({ success: true, data: projects });
};

const getProjectById = async (req, res) => {
  const project = await Project.findOne({ _id: req.params.id, userId: req.user._id }).populate(
    'relatedProjects',
    'name description status techStack'
  );

  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  res.json({ success: true, data: project });
};

const createProject = async (req, res) => {
  const { name, description, detailedDescription, status, techStack, tags, links, team, pinned, relatedProjects } =
    req.body;

  if (!name || !description) {
    res.status(400);
    throw new Error('Project name and description are required');
  }

  const project = await Project.create({
    userId: req.user._id,
    name,
    description,
    detailedDescription: detailedDescription || '',
    status: status || 'planning',
    techStack: techStack || [],
    tags: tags || [],
    links: links || { github: '', liveDemo: '', documentation: '', figma: '' },
    team: team || [],
    pinned: pinned || false,
    relatedProjects: relatedProjects || []
  });

  res.status(201).json({ success: true, data: project });
};

const updateProject = async (req, res) => {
  const project = await Project.findOne({ _id: req.params.id, userId: req.user._id });

  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  const updatedProject = await Project.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.json({ success: true, data: updatedProject });
};

const deleteProject = async (req, res) => {
  const project = await Project.findOne({ _id: req.params.id, userId: req.user._id });

  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  await Project.deleteOne({ _id: req.params.id });
  await Resource.deleteMany({ projectId: req.params.id });
  await Decision.deleteMany({ projectId: req.params.id });
  await Task.deleteMany({ projectId: req.params.id });
  await GitHubActivity.deleteMany({ projectId: req.params.id });
  await QuickNote.deleteMany({ projectId: req.params.id });

  await Project.updateMany(
    { relatedProjects: req.params.id },
    { $pull: { relatedProjects: new mongoose.Types.ObjectId(req.params.id) } }
  );

  res.json({ success: true, message: 'Project deleted successfully' });
};

const togglePin = async (req, res) => {
  const project = await Project.findOne({ _id: req.params.id, userId: req.user._id });

  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  project.pinned = !project.pinned;
  await project.save();

  res.json({ success: true, data: project });
};

const addRelatedProject = async (req, res) => {
  const { relatedId } = req.body;

  if (!relatedId) {
    res.status(400);
    throw new Error('relatedId is required');
  }

  const project = await Project.findOne({ _id: req.params.id, userId: req.user._id });
  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  const relatedProject = await Project.findOne({ _id: relatedId, userId: req.user._id });
  if (!relatedProject) {
    res.status(404);
    throw new Error('Related project not found');
  }

  const relObjId = new mongoose.Types.ObjectId(relatedId);

  if (!project.relatedProjects.some((id) => id.equals(relObjId))) {
    project.relatedProjects.push(relObjId);
    await project.save();
  }

  if (!relatedProject.relatedProjects.some((id) => id.equals(project._id))) {
    relatedProject.relatedProjects.push(project._id);
    await relatedProject.save();
  }

  res.json({ success: true, data: project });
};

const removeRelatedProject = async (req, res) => {
  const project = await Project.findOne({ _id: req.params.id, userId: req.user._id });
  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  const relObjId = new mongoose.Types.ObjectId(req.params.relatedId);

  project.relatedProjects = project.relatedProjects.filter((id) => !id.equals(relObjId));
  await project.save();

  const relatedProject = await Project.findById(req.params.relatedId);
  if (relatedProject) {
    relatedProject.relatedProjects = relatedProject.relatedProjects.filter(
      (id) => !id.equals(project._id)
    );
    await relatedProject.save();
  }

  res.json({ success: true, data: project });
};

const getProjectStats = async (req, res) => {
  const userId = req.user._id;

  const total = await Project.countDocuments({ userId });
  const inProgress = await Project.countDocuments({ userId, status: 'in-progress' });
  const completed = await Project.countDocuments({ userId, status: 'completed' });
  const pinned = await Project.countDocuments({ userId, pinned: true });

  res.json({
    success: true,
    data: { total, inProgress, completed, pinned }
  });
};

module.exports = {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  togglePin,
  addRelatedProject,
  removeRelatedProject,
  getProjectStats
};
