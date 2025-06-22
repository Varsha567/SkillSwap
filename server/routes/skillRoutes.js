const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // Your authentication middleware
const skillController = require('../controllers/skillController'); // Your skill controller

// @route   POST api/skills
// @desc    Create a new skill listing
// @access  Private (auth required)
router.post('/', auth, skillController.createSkillListing);

// @route   GET api/skills
// @desc    Get all active skill listings
// @access  Public
router.get('/', skillController.getAllSkills);

// @route   GET api/skills/user/:userId
// @desc    Get all skill listings by a specific user
// @access  Public
router.get('/user/:userId', skillController.getUserSkills);

// @route   PUT api/skills/:id/status
// @desc    Update the status of a skill listing (e.g., to completed, closed)
// @access  Private (auth required)
router.put('/:id/status', auth, skillController.updateSkillStatus);


// @route   DELETE api/skills/:id
// @desc    Delete a skill listing
// @access  Private
router.delete('/:id', auth, skillController.deleteSkillListing);

module.exports = router;
