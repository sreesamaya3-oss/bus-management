/**
 * Driver Schedule Routes
 * Mounted at: /api/schedule
 */

const express = require('express');
const router = express.Router();
const scheduleController = require('../controllers/scheduleController');
const { authenticate, authorize } = require('../middleware/auth');

router.get('/', authenticate, scheduleController.getAllSchedules);
router.get('/:id', authenticate, scheduleController.getScheduleById);
router.post('/', authenticate, authorize('admin'), scheduleController.createSchedule);
router.put('/:id', authenticate, authorize('admin'), scheduleController.updateSchedule);
router.delete('/:id', authenticate, authorize('admin'), scheduleController.deleteSchedule);

module.exports = router;
