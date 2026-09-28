const mongoose = require('mongoose');

const quickNoteSchema = new mongoose.Schema(
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
    type: {
      type: String,
      enum: ['note', 'resource', 'idea', 'reminder'],
      default: 'note'
    },
    content: {
      type: String,
      required: [true, 'Note content is required'],
      trim: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('QuickNote', quickNoteSchema);
