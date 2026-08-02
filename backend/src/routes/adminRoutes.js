/**
 * Admin Management Routes
 * Mounted at: /api/admins
 */

const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticate, authorize } = require('../middleware/auth');

// All Admin routes require admin authorization
router.use(authenticate, authorize('admin'));

// Dashboard Counts API
router.get('/dashboard/counts', adminController.getDashboardCounts);

// Feature Assignments & Actions
router.post('/assign-student', adminController.assignStudentToBus);
router.post('/assign-driver', adminController.assignDriverToBus);
router.put('/complaints/:id', adminController.resolveComplaint);
router.put('/leaves/:id', adminController.approveLeaveRequest);
router.post('/notifications', adminController.createNotification);

// Admin Profile CRUD
router.get('/', adminController.getAllAdmins);
router.get('/:id', adminController.getAdminById);
router.post('/', adminController.createAdmin);
router.put('/:id', adminController.updateAdmin);
router.delete('/:id', adminController.deleteAdmin);

module.exports = router;
