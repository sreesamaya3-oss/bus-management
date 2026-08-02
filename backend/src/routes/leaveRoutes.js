/**
 * Leave Request Management Routes
 * Mounted at: /api/leave-requests
 */

const express = require('express');
const router = express.Router();
const leaveController = require('../controllers/leaveController');
const { authenticate, authorize } = require('../middleware/auth');

router.get('/', authenticate, leaveController.getAllLeaveRequests);
router.get('/:id', authenticate, leaveController.getLeaveRequestById);
router.post('/', authenticate, leaveController.createLeaveRequest);
router.put('/:id', authenticate, authorize('admin'), leaveController.updateLeaveRequest);
router.delete('/:id', authenticate, authorize('admin'), leaveController.deleteLeaveRequest);

module.exports = router;
