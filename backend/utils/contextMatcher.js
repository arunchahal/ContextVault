const Decision = require('../models/Decision');
const Resource = require('../models/Resource');
const Task = require('../models/Task');

const findRelatedContext = async (projectId, changedFiles) => {
  if (!changedFiles || changedFiles.length === 0) {
    return { decisions: [], resources: [], tasks: [] };
  }

  const decisions = await Decision.find({ projectId });
  const matchedDecisions = decisions
    .filter((decision) => {
      if (!decision.relatedFiles || decision.relatedFiles.length === 0) return false;
      const intersection = decision.relatedFiles.filter((file) =>
        changedFiles.some(
          (cf) =>
            cf === file ||
            cf.endsWith('/' + file) ||
            file.endsWith('/' + cf) ||
            cf.includes(file) ||
            file.includes(cf)
        )
      );
      return intersection.length > 0;
    })
    .map((d) => ({
      _id: d._id,
      title: d.title,
      finalChoice: d.finalChoice,
      relatedFiles: d.relatedFiles
    }));

  const resources = await Resource.find({ projectId });
  const matchedResources = resources
    .filter((resource) => {
      if (!resource.tags || resource.tags.length === 0) return false;
      const lowerFiles = changedFiles.map((f) => f.toLowerCase());
      return resource.tags.some((tag) =>
        lowerFiles.some((f) => f.includes(tag.toLowerCase()))
      );
    })
    .map((r) => ({
      _id: r._id,
      title: r.title,
      url: r.url,
      type: r.type
    }));

  const tasks = await Task.find({ projectId, status: { $ne: 'completed' } });
  const matchedTasks = tasks
    .filter((task) => {
      const lowerFiles = changedFiles.map((f) => f.toLowerCase());
      const titleWords = task.title.toLowerCase().split(/\s+/);
      return titleWords.some(
        (word) => word.length > 4 && lowerFiles.some((f) => f.includes(word))
      );
    })
    .map((t) => ({
      _id: t._id,
      title: t.title,
      status: t.status,
      priority: t.priority
    }));

  return {
    decisions: matchedDecisions,
    resources: matchedResources,
    tasks: matchedTasks
  };
};

module.exports = { findRelatedContext };
