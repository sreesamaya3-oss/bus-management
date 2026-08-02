/**
 * Bus Stop Management Routes
 * Mounted at: /api/stops
 */

const express = require('express');
const router = express.Router();
const stopController = require('../controllers/stopController');
const { authenticate, authorize } = require('../middleware/auth');

router.get('/', authenticate, stopController.getAllStops);
router.get('/:id', authenticate, stopController.getStopById);
router.post('/', authenticate, authorize('admin'), stopController.createStop);
router.put('/:id', authenticate, authorize('admin'), stopController.updateStop);
router.delete('/:id', authenticate, authorize('admin'), stopController.deleteStop);

module.exports = router;
