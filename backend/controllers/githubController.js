const Project = require('../models/Project');
const GitHubActivity = require('../models/GitHubActivity');
const QuickNote = require('../models/QuickNote');
const { parseGitHubUrl, fetchCommits, fetchCommitDetails } = require('../utils/githubService');
const { findRelatedContext } = require('../utils/contextMatcher');

const syncGitHubActivities = async (req, res) => {
  const project = await Project.findOne({ _id: req.params.projectId, userId: req.user._id });
  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  if (!project.links || !project.links.github) {
    res.status(400);
    throw new Error('This project has no GitHub repository URL set. Please add one in Edit Project.');
  }

  const parsed = parseGitHubUrl(project.links.github);
  if (!parsed) {
    res.status(400);
    throw new Error('Invalid GitHub URL format. Expected: https://github.com/owner/repo');
  }

  const { owner, repo } = parsed;

  const commits = await fetchCommits(owner, repo, 30);

  const savedActivities = [];

  for (const commit of commits) {
    const sha = commit.sha;

    const exists = await GitHubActivity.findOne({ projectId: project._id, commitSha: sha });
    if (exists) continue;

    let details;
    try {
      details = await fetchCommitDetails(owner, repo, sha);
    } catch {
      continue;
    }

    const changedFiles = (details.files || []).map((f) => f.filename);
    const additions = details.stats ? details.stats.additions : 0;
    const deletions = details.stats ? details.stats.deletions : 0;

    const activity = await GitHubActivity.create({
      projectId: project._id,
      repository: `${owner}/${repo}`,
      commitSha: sha,
      commitMessage: commit.commit.message,
      author: commit.commit.author.name || 'Unknown',
      authorUsername: commit.author ? commit.author.login : '',
      commitDate: new Date(commit.commit.author.date),
      commitUrl: commit.html_url || '',
      changedFiles,
      additions,
      deletions
    });

    savedActivities.push(activity);
  }

  res.json({
    success: true,
    message: `Synced ${savedActivities.length} new commits from ${owner}/${repo}`,
    data: savedActivities
  });
};

const getGitHubActivities = async (req, res) => {
  const project = await Project.findOne({ _id: req.params.projectId, userId: req.user._id });
  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  const activities = await GitHubActivity.find({ projectId: req.params.projectId }).sort({
    commitDate: -1
  });

  const activitiesWithContext = await Promise.all(
    activities.map(async (activity) => {
      const relatedContext = await findRelatedContext(project._id, activity.changedFiles);
      return {
        _id: activity._id,
        commitSha: activity.commitSha,
        commitMessage: activity.commitMessage,
        author: activity.author,
        authorUsername: activity.authorUsername,
        commitDate: activity.commitDate,
        commitUrl: activity.commitUrl,
        repository: activity.repository,
        changedFiles: activity.changedFiles,
        additions: activity.additions,
        deletions: activity.deletions,
        relatedContext
      };
    })
  );

  res.json({ success: true, data: activitiesWithContext });
};

const getGitHubActivityById = async (req, res) => {
  const project = await Project.findOne({ _id: req.params.projectId, userId: req.user._id });
  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  const activity = await GitHubActivity.findOne({
    _id: req.params.activityId,
    projectId: req.params.projectId
  });

  if (!activity) {
    res.status(404);
    throw new Error('Activity not found');
  }

  const relatedContext = await findRelatedContext(project._id, activity.changedFiles);

  res.json({
    success: true,
    data: {
      _id: activity._id,
      commitSha: activity.commitSha,
      commitMessage: activity.commitMessage,
      author: activity.author,
      authorUsername: activity.authorUsername,
      commitDate: activity.commitDate,
      commitUrl: activity.commitUrl,
      repository: activity.repository,
      changedFiles: activity.changedFiles,
      additions: activity.additions,
      deletions: activity.deletions,
      relatedContext
    }
  });
};

const getQuickNotes = async (req, res) => {
  const project = await Project.findOne({ _id: req.params.projectId, userId: req.user._id });
  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  const notes = await QuickNote.find({ projectId: req.params.projectId, userId: req.user._id }).sort({
    createdAt: -1
  });

  res.json({ success: true, data: notes });
};

const createQuickNote = async (req, res) => {
  const project = await Project.findOne({ _id: req.params.projectId, userId: req.user._id });
  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  const { content, type } = req.body;
  if (!content) {
    res.status(400);
    throw new Error('Note content is required');
  }

  const note = await QuickNote.create({
    userId: req.user._id,
    projectId: req.params.projectId,
    content,
    type: type || 'note'
  });

  res.status(201).json({ success: true, data: note });
};

module.exports = {
  syncGitHubActivities,
  getGitHubActivities,
  getGitHubActivityById,
  getQuickNotes,
  createQuickNote
};
