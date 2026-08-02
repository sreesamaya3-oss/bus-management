/**
 * Attendance Management Routes
 * Mounted at: /api/attendance
 */

const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');
const { authenticate, authorize } = require('../middleware/auth');

router.get('/', authenticate, attendanceController.getAllAttendance);
router.get('/:id', authenticate, attendanceController.getAttendanceById);
router.post('/', authenticate, authorize('admin', 'driver'), attendanceController.createAttendance);
router.put('/:id', authenticate, authorize('admin', 'driver'), attendanceController.updateAttendance);
router.delete('/:id', authenticate, authorize('admin'), attendanceController.deleteAttendance);

module.exports = router;
