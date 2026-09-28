const Task = require('../models/Task');
const Project = require('../models/Project');

const STATUS_CYCLE = { todo: 'in-progress', 'in-progress': 'completed', completed: 'todo' };

const getTasks = async (req, res) => {
  const project = await Project.findOne({ _id: req.params.projectId, userId: req.user._id });
  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  const tasks = await Task.find({ projectId: req.params.projectId }).sort({ createdAt: -1 });
  res.json({ success: true, data: tasks });
};

const createTask = async (req, res) => {
  const project = await Project.findOne({ _id: req.params.projectId, userId: req.user._id });
  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  const { title, description, status, priority } = req.body;

  if (!title) {
    res.status(400);
    throw new Error('Task title is required');
  }

  const task = await Task.create({
    userId: req.user._id,
    projectId: req.params.projectId,
    title,
    description: description || '',
    status: status || 'todo',
    priority: priority || 'medium'
  });

  res.status(201).json({ success: true, data: task });
};

const updateTask = async (req, res) => {
  const task = await Task.findOne({ _id: req.params.id, userId: req.user._id });
  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  const updated = await Task.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.json({ success: true, data: updated });
};

const toggleTaskStatus = async (req, res) => {
  const task = await Task.findOne({ _id: req.params.id, userId: req.user._id });
  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  task.status = STATUS_CYCLE[task.status] || 'todo';
  await task.save();

  res.json({ success: true, data: task });
};

const deleteTask = async (req, res) => {
  const task = await Task.findOne({ _id: req.params.id, userId: req.user._id });
  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  await Task.deleteOne({ _id: req.params.id });
  res.json({ success: true, message: 'Task deleted' });
};

module.exports = { getTasks, createTask, updateTask, toggleTaskStatus, deleteTask };
