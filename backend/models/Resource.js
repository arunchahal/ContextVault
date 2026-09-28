const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema(
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
      required: [true, 'Resource title is required'],
      trim: true,
      maxlength: [300, 'Title cannot exceed 300 characters']
    },
    url: {
      type: String,
      required: [true, 'URL is required'],
      trim: true
    },
    type: {
      type: String,
      enum: ['documentation', 'github', 'article', 'tutorial', 'video', 'paper', 'website', 'other'],
      default: 'documentation'
    },
    description: {
      type: String,
      trim: true,
      default: ''
    },
    tags: {
      type: [String],
      default: []
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Resource', resourceSchema);
