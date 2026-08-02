/**
 * Driver Routes
 * Mounted at: /api/drivers
 */

const express = require('express');
const router = express.Router();
const driverController = require('../controllers/driverController');
const { authenticate, authorize } = require('../middleware/auth');

// Protected features for logged-in Driver
router.get('/me/bus', authenticate, authorize('driver', 'admin'), driverController.getAssignedBus);
router.get('/me/route', authenticate, authorize('driver', 'admin'), driverController.getTodayRoute);
router.get('/me/students', authenticate, authorize('driver', 'admin'), driverController.getAssignedStudents);
router.post('/me/attendance', authenticate, authorize('driver', 'admin'), driverController.markStudentAttendance);
router.put('/me/trip-status', authenticate, authorize('driver', 'admin'), driverController.updateTripStatus);

// Standard CRUD Endpoints
router.get('/', authenticate, authorize('admin'), driverController.getAllDrivers);
router.get('/:id', authenticate, authorize('admin', 'driver'), driverController.getDriverById);
router.post('/', authenticate, authorize('admin'), driverController.createDriver);
router.put('/:id', authenticate, authorize('admin'), driverController.updateDriver);
router.delete('/:id', authenticate, authorize('admin'), driverController.deleteDriver);

module.exports = router;
