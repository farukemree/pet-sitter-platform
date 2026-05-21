import axios from 'axios';

const API_URL = 'http://localhost:5000/api/messaging';

// LocalStorage'dan güncel JWT token'ı çeken yardımcı fonksiyon
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

export const messageService = {
  // 1. Karşı tarafa mesaj gönderme (POST /api/messaging/send)
  sendMessage: async (receiverId, content) => {
    const parsedReceiverId = Number(receiverId);
    if (!receiverId || Number.isNaN(parsedReceiverId)) {
      throw new Error('Geçerli bir sohbet alıcısı seçin.');
    }
    if (!content || content.trim().length === 0) {
      throw new Error('Mesaj içeriği boş olamaz.');
    }

    const response = await axios.post(
      `${API_URL}/send`, 
      { receiverId: parsedReceiverId, content: content.trim() }, 
      getAuthHeader()
    );
    return response.data.data;
  },

  // 2. Belirli bir kullanıcı ile olan geçmişi getirme (GET /api/messaging/history/:partnerId)
  getChatHistory: async (partnerId) => {
    const response = await axios.get(
      `${API_URL}/history/${partnerId}`, 
      getAuthHeader()
    );
    return response.data.data;
  },

  // 3. Sohbet listesi ve unread sayısı alma (GET /api/messaging/conversations)
  getConversations: async () => {
    const response = await axios.get(`${API_URL}/conversations`, getAuthHeader());
    return response.data.data;
  }
};