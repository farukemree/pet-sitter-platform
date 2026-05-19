/**
 * Message Service
 * Manages business logic and validation for messaging
 */
const messageRepository = require('./message.repository');

class MessageService {
  async sendMessage(senderId, { receiverId, content }) {
    // Validasyonlar
    if (!receiverId) {
      throw new Error('Mesaj gönderilecek alıcı (receiverId) belirtilmelidir');
    }
    if (!content || content.trim().length === 0) {
      throw new Error('Mesaj içeriği boş bırakılamaz');
    }
    if (parseInt(senderId) === parseInt(receiverId)) {
      throw new Error('Kendinize mesaj gönderemezsiniz');
    }

    return await messageRepository.create(senderId, receiverId, content.trim());
  }

  async getConversation(userId, chatPartnerId) {
    if (!chatPartnerId) {
      throw new Error('Sohbet geçmişi için partner ID gereklidir');
    }

    // Geçmişi getirmeden önce, karşı taraftan gelen mesajları okundu yapalım
    await messageRepository.markAsRead(userId, chatPartnerId);

    return await messageRepository.getChatHistory(userId, chatPartnerId);
  }
}

module.exports = new MessageService();