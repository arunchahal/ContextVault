const Project = require('../models/Project');
const Resource = require('../models/Resource');
const Decision = require('../models/Decision');
const Task = require('../models/Task');

const globalSearch = async (req, res) => {
  const { q } = req.query;

  if (!q || q.trim() === '') {
    return res.json({
      success: true,
      data: { projects: [], resources: [], decisions: [], tasks: [] }
    });
  }

  const regex = new RegExp(q.trim(), 'i');
  const userId = req.user._id;

  const projects = await Project.find({
    userId,
    $or: [
      { name: regex },
      { description: regex },
      { detailedDescription: regex },
      { techStack: regex },
      { tags: regex }
    ]
  }).select('name description status techStack tags updatedAt').limit(10);

  const userProjectIds = (await Project.find({ userId }).select('_id')).map((p) => p._id);

  const resources = await Resource.find({
    projectId: { $in: userProjectIds },
    $or: [{ title: regex }, { description: regex }, { tags: regex }]
  }).select('title url type description projectId').limit(10);

  const decisions = await Decision.find({
    projectId: { $in: userProjectIds },
    $or: [{ title: regex }, { description: regex }, { reason: regex }, { finalChoice: regex }]
  }).select('title finalChoice projectId').limit(10);

  const tasks = await Task.find({
    projectId: { $in: userProjectIds },
    $or: [{ title: regex }, { description: regex }]
  }).select('title status priority projectId').limit(10);

  res.json({
    success: true,
    data: { projects, resources, decisions, tasks }
  });
};

module.exports = { globalSearch };
