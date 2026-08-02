/**
 * Bus Route Management Routes
 * Mounted at: /api/routes
 */

const express = require('express');
const router = express.Router();
const routeController = require('../controllers/routeController');
const { authenticate, authorize } = require('../middleware/auth');

router.get('/', authenticate, routeController.getAllRoutes);
router.get('/:id', authenticate, routeController.getRouteById);
router.post('/', authenticate, authorize('admin'), routeController.createRoute);
router.put('/:id', authenticate, authorize('admin'), routeController.updateRoute);
router.delete('/:id', authenticate, authorize('admin'), routeController.deleteRoute);

module.exports = router;
