const express = require('express');
const router = express.Router({ mergeParams: true });
const { getDecisions, createDecision, updateDecision, deleteDecision } = require('../controllers/decisionController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', getDecisions);
router.post('/', createDecision);
router.put('/:id', updateDecision);
router.delete('/:id', deleteDecision);

module.exports = router;
