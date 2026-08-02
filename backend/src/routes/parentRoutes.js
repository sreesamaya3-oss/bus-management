/**
 * Parent Routes
 * Mounted at: /api/parents
 */

const express = require('express');
const router = express.Router();
const parentController = require('../controllers/parentController');
const { authenticate, authorize } = require('../middleware/auth');

// Protected features for logged-in Parent
router.get('/me/child-attendance', authenticate, authorize('parent', 'admin'), parentController.getChildAttendance);
router.get('/me/child-bus', authenticate, authorize('parent', 'admin'), parentController.getChildBusDetails);
router.get('/me/live-route', authenticate, authorize('parent', 'admin'), parentController.getLiveRouteInfo);
router.get('/me/notifications', authenticate, authorize('parent', 'admin'), parentController.getMyNotifications);

// Standard CRUD Endpoints
router.get('/', authenticate, authorize('admin'), parentController.getAllParents);
router.get('/:id', authenticate, authorize('admin', 'parent'), parentController.getParentById);
router.post('/', authenticate, authorize('admin'), parentController.createParent);
router.put('/:id', authenticate, authorize('admin'), parentController.updateParent);
router.delete('/:id', authenticate, authorize('admin'), parentController.deleteParent);

module.exports = router;
