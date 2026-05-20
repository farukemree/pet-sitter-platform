/**
 * Message Routes
 * Defines routing endpoints for messaging system
 */
const express = require('express');
const router = express.Router();
const messageController = require('./message.controller');
const authMiddleware = require('../../shared/middlewares/auth.middleware');

// Mesajlaşma işlemlerinde kullanıcının sisteme giriş yapmış olması şarttır
router.use(authMiddleware);

// Mesaj Gönder: POST /api/messaging/send
router.post('/send', messageController.send);

// Sohbet Listesini Getir: GET /api/messaging/conversations
router.get('/conversations', messageController.getConversations);

// Sohbet Geçmişini Getir: GET /api/messaging/history/:partnerId
router.get('/history/:partnerId', messageController.getHistory);

module.exports = router;