const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    name: {
      type: String,
      required: [true, 'Project name is required'],
      trim: true,
      maxlength: [200, 'Project name cannot exceed 200 characters']
    },
    description: {
      type: String,
      required: [true, 'Short description is required'],
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters']
    },
    detailedDescription: {
      type: String,
      trim: true,
      default: ''
    },
    status: {
      type: String,
      enum: ['planning', 'in-progress', 'completed', 'on-hold', 'archived'],
      default: 'planning'
    },
    techStack: {
      type: [String],
      default: []
    },
    tags: {
      type: [String],
      default: []
    },
    links: {
      github: { type: String, default: '' },
      liveDemo: { type: String, default: '' },
      documentation: { type: String, default: '' },
      figma: { type: String, default: '' }
    },
    team: {
      type: [String],
      default: []
    },
    pinned: {
      type: Boolean,
      default: false
    },
    relatedProjects: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project'
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model('Project', projectSchema);
