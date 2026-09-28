const mongoose = require('mongoose');

const githubActivitySchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true
    },
    repository: {
      type: String,
      required: true
    },
    commitSha: {
      type: String,
      required: true
    },
    commitMessage: {
      type: String,
      required: true
    },
    author: {
      type: String,
      default: 'Unknown'
    },
    authorUsername: {
      type: String,
      default: ''
    },
    commitDate: {
      type: Date,
      required: true
    },
    commitUrl: {
      type: String,
      default: ''
    },
    changedFiles: {
      type: [String],
      default: []
    },
    additions: {
      type: Number,
      default: 0
    },
    deletions: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

githubActivitySchema.index({ projectId: 1, commitSha: 1 }, { unique: true });

module.exports = mongoose.model('GitHubActivity', githubActivitySchema);
