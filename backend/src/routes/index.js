/**
 * Central API Router Index
 * Combines all feature routers into a single master endpoint aggregator.
 */

const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const studentRoutes = require('./studentRoutes');
const parentRoutes = require('./parentRoutes');
const driverRoutes = require('./driverRoutes');
const adminRoutes = require('./adminRoutes');
const busRoutes = require('./busRoutes');
const routeRoutes = require('./routeRoutes');
const stopRoutes = require('./stopRoutes');
const attendanceRoutes = require('./attendanceRoutes');
const complaintRoutes = require('./complaintRoutes');
const leaveRoutes = require('./leaveRoutes');
const notificationRoutes = require('./notificationRoutes');
const scheduleRoutes = require('./scheduleRoutes');
const assignmentRoutes = require('./assignmentRoutes');

// Mount sub-routers
router.use('/auth', authRoutes);
router.use('/students', studentRoutes);
router.use('/parents', parentRoutes);
router.use('/drivers', driverRoutes);
router.use('/admins', adminRoutes);
router.use('/buses', busRoutes);
router.use('/routes', routeRoutes);
router.use('/stops', stopRoutes);
router.use('/attendance', attendanceRoutes);
router.use('/complaints', complaintRoutes);
router.use('/leave-requests', leaveRoutes);
router.use('/notifications', notificationRoutes);
router.use('/schedule', scheduleRoutes);
router.use('/assignments', assignmentRoutes);

module.exports = router;
