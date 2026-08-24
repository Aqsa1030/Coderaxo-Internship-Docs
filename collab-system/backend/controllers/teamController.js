const Team = require('../models/Team');

// @desc Create a new team
// @route POST /api/teams
exports.createTeam = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Team name is required' });
    }

    const team = await Team.create({
      name,
      description,
      createdBy: req.user._id,
      members: [{ user: req.user._id, role: 'admin' }],
    });

    res.status(201).json(team);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc Get all teams the logged-in user belongs to
// @route GET /api/teams
exports.getTeams = async (req, res) => {
  try {
    const teams = await Team.find({ 'members.user': req.user._id })
      .populate('createdBy', 'name email')
      .populate('members.user', 'name email');

    res.status(200).json(teams);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc Get single team by ID
// @route GET /api/teams/:id
exports.getTeamById = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('members.user', 'name email');

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    res.status(200).json(team);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc Add a member to a team
// @route POST /api/teams/:id/members
exports.addMember = async (req, res) => {
  try {
    const { userId, role } = req.body;
    const team = await Team.findById(req.params.id);

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    // Only admin of this team can add members
    const requester = team.members.find(
      (m) => m.user.toString() === req.user._id.toString()
    );
    if (!requester || requester.role !== 'admin') {
      return res.status(403).json({ message: 'Only team admin can add members' });
    }

    // Check if user already in team
    const alreadyMember = team.members.some(
      (m) => m.user.toString() === userId
    );
    if (alreadyMember) {
      return res.status(400).json({ message: 'User already in team' });
    }

    team.members.push({ user: userId, role: role || 'member' });
    await team.save();

    const updatedTeam = await Team.findById(req.params.id).populate(
      'members.user',
      'name email'
    );

    res.status(200).json(updatedTeam);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc Remove a member from a team
// @route DELETE /api/teams/:id/members/:userId
exports.removeMember = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    const requester = team.members.find(
      (m) => m.user.toString() === req.user._id.toString()
    );
    if (!requester || requester.role !== 'admin') {
      return res.status(403).json({ message: 'Only team admin can remove members' });
    }

    team.members = team.members.filter(
      (m) => m.user.toString() !== req.params.userId
    );
    await team.save();

    res.status(200).json({ message: 'Member removed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};