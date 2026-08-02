/**
 * Notification Management Routes
 * Mounted at: /api/notifications
 */

const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { authenticate, authorize } = require('../middleware/auth');

router.get('/', authenticate, notificationController.getAllNotifications);
router.get('/:id', authenticate, notificationController.getNotificationById);
router.post('/', authenticate, authorize('admin'), notificationController.createNotification);
router.put('/:id', authenticate, authorize('admin'), notificationController.updateNotification);
router.delete('/:id', authenticate, authorize('admin'), notificationController.deleteNotification);

module.exports = router;
