/**
 * Student Routes
 * Mounted at: /api/students
 */

const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const { authenticate, authorize } = require('../middleware/auth');

// Protected features for logged-in Student
router.get('/me/attendance', authenticate, authorize('student', 'admin'), studentController.getMyAttendance);
router.get('/me/notifications', authenticate, authorize('student', 'admin'), studentController.getMyNotifications);
router.post('/me/complaint', authenticate, authorize('student'), studentController.submitComplaint);
router.post('/me/leave', authenticate, authorize('student'), studentController.submitLeaveRequest);

// Admin assignment action
router.post('/:id/assign', authenticate, authorize('admin'), studentController.assignBusStopRoute);

// Standard CRUD Endpoints
router.get('/', authenticate, authorize('admin', 'driver'), studentController.getAllStudents);
router.get('/:id', authenticate, authorize('admin', 'driver', 'parent', 'student'), studentController.getStudentById);
router.post('/', authenticate, authorize('admin'), studentController.createStudent);
router.put('/:id', authenticate, authorize('admin'), studentController.updateStudent);
router.delete('/:id', authenticate, authorize('admin'), studentController.deleteStudent);

module.exports = router;
