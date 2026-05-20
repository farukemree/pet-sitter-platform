/**
 * Message Controller
 * Handles HTTP requests for the messaging endpoints
 */
const messageService = require('./message.service');

class MessageController {
  // Mesaj gönderme endpoint'i
  async send(req, res) {
    try {
      const senderId = req.user.id; // authMiddleware'den enjekte edilen ID
      const { receiverId, content } = req.body;

      const message = await messageService.sendMessage(senderId, { receiverId, content });

      res.status(201).json({
        success: true,
        message: 'Mesaj başarıyla gönderildi',
        data: message
      });
    } catch (error) {
      console.error('Send message error:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Mesaj gönderilemedi'
      });
    }
  }

  // Belirli bir kullanıcı ile olan sohbet geçmişini getirme endpoint'i
  async getHistory(req, res) {
    try {
      const userId = req.user.id;
      const { partnerId } = req.params; // URL'den gelecek: /api/messaging/history/5

      const chatHistory = await messageService.getConversation(userId, partnerId);

      res.status(200).json({
        success: true,
        data: chatHistory
      });
    } catch (error) {
      console.error('Get chat history error:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Mesaj geçmişi yüklenemedi'
      });
    }
  }

  async getConversations(req, res) {
    try {
      const userId = req.user.id;
      const conversations = await messageService.getConversations(userId);

      res.status(200).json({
        success: true,
        data: conversations
      });
    } catch (error) {
      console.error('Get conversations error:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Sohbet listesi yüklenemedi'
      });
    }
  }
}

module.exports = new MessageController();