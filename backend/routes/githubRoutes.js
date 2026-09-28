const express = require('express');
const router = express.Router({ mergeParams: true });
const {
  syncGitHubActivities,
  getGitHubActivities,
  getGitHubActivityById,
  getQuickNotes,
  createQuickNote
} = require('../controllers/githubController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/sync', syncGitHubActivities);
router.get('/activities', getGitHubActivities);
router.get('/activities/:activityId', getGitHubActivityById);

router.get('/notes', getQuickNotes);
router.post('/notes', createQuickNote);

module.exports = router;
