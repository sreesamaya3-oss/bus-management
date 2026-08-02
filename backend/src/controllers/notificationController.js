/**
 * Notification Controller
 * Handles CRUD operations for broadcast and targeted notifications.
 */

const SupabaseService = require('../services/supabaseService');
const { sendSuccess, sendError } = require('../utils/response');

const notificationService = new SupabaseService('notifications');

const getAllNotifications = async (req, res, next) => {
  try {
    const notifications = await notificationService.getAll();
    return sendSuccess(res, 'Notifications fetched successfully', notifications);
  } catch (error) {
    next(error);
  }
};

const getNotificationById = async (req, res, next) => {
  try {
    const notification = await notificationService.getById(req.params.id);
    if (!notification) return sendError(res, 'Notification not found', {}, 404);
    return sendSuccess(res, 'Notification details fetched successfully', notification);
  } catch (error) {
    next(error);
  }
};

const createNotification = async (req, res, next) => {
  try {
    const newNotification = await notificationService.create({
      ...req.body,
      created_by: req.user ? req.user.id : req.body.created_by
    });
    return sendSuccess(res, 'Notification created successfully', newNotification, 201);
  } catch (error) {
    next(error);
  }
};

const updateNotification = async (req, res, next) => {
  try {
    const updated = await notificationService.update(req.params.id, req.body);
    return sendSuccess(res, 'Notification updated successfully', updated);
  } catch (error) {
    next(error);
  }
};

const deleteNotification = async (req, res, next) => {
  try {
    const deleted = await notificationService.delete(req.params.id);
    return sendSuccess(res, 'Notification deleted successfully', deleted);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllNotifications,
  getNotificationById,
  createNotification,
  updateNotification,
  deleteNotification
};
