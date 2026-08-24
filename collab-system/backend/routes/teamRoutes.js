const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const {
  createTeam,
  getTeams,
  getTeamById,
  addMember,
  removeMember,
} = require('../controllers/teamController');

router.post('/', protect, createTeam);
router.get('/', protect, getTeams);
router.get('/:id', protect, getTeamById);
router.post('/:id/members', protect, addMember);
router.delete('/:id/members/:userId', protect, removeMember);

module.exports = router;