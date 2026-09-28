const express = require('express');
const router = express.Router();
const {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  togglePin,
  addRelatedProject,
  removeRelatedProject,
  getProjectStats
} = require('../controllers/projectController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/stats', getProjectStats);
router.get('/', getProjects);
router.post('/', createProject);
router.get('/:id', getProjectById);
router.put('/:id', updateProject);
router.delete('/:id', deleteProject);
router.patch('/:id/pin', togglePin);
router.post('/:id/related', addRelatedProject);
router.delete('/:id/related/:relatedId', removeRelatedProject);

module.exports = router;
