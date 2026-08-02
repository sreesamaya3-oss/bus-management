/**
 * Complaint Management Routes
 * Mounted at: /api/complaints
 */

const express = require('express');
const router = express.Router();
const complaintController = require('../controllers/complaintController');
const { authenticate, authorize } = require('../middleware/auth');

router.get('/', authenticate, complaintController.getAllComplaints);
router.get('/:id', authenticate, complaintController.getComplaintById);
router.post('/', authenticate, complaintController.createComplaint);
router.put('/:id', authenticate, authorize('admin'), complaintController.updateComplaint);
router.delete('/:id', authenticate, authorize('admin'), complaintController.deleteComplaint);

module.exports = router;
