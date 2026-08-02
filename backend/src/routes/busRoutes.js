/**
 * Bus Management Routes
 * Mounted at: /api/buses
 */

const express = require('express');
const router = express.Router();
const busController = require('../controllers/busController');
const { authenticate, authorize } = require('../middleware/auth');

router.get('/', authenticate, busController.getAllBuses);
router.get('/:id', authenticate, busController.getBusById);
router.post('/', authenticate, authorize('admin'), busController.createBus);
router.put('/:id', authenticate, authorize('admin'), busController.updateBus);
router.delete('/:id', authenticate, authorize('admin'), busController.deleteBus);

module.exports = router;
