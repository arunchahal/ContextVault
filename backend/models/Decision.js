const mongoose = require('mongoose');

const decisionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true
    },
    title: {
      type: String,
      required: [true, 'Decision title is required'],
      trim: true,
      maxlength: [500, 'Title cannot exceed 500 characters']
    },
    description: {
      type: String,
      trim: true,
      default: ''
    },
    reason: {
      type: String,
      trim: true,
      default: ''
    },
    alternatives: {
      type: [String],
      default: []
    },
    finalChoice: {
      type: String,
      required: [true, 'Final choice is required'],
      trim: true
    },
    relatedFiles: {
      type: [String],
      default: []
    },
    relatedCommitIds: {
      type: [String],
      default: []
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Decision', decisionSchema);