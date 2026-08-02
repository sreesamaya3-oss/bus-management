/**
 * Student Bus Assignment Routes
 * Mounted at: /api/assignments
 */

const express = require('express');
const router = express.Router();
const assignmentController = require('../controllers/assignmentController');
const { authenticate, authorize } = require('../middleware/auth');

router.get('/', authenticate, assignmentController.getAllAssignments);
router.get('/:id', authenticate, assignmentController.getAssignmentById);
router.post('/', authenticate, authorize('admin'), assignmentController.createAssignment);
router.put('/:id', authenticate, authorize('admin'), assignmentController.updateAssignment);
router.delete('/:id', authenticate, authorize('admin'), assignmentController.deleteAssignment);

module.exports = router;
