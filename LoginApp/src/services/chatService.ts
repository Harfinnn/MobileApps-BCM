import API from './api';

export const sendMessage = async (message: string) => {
  const response = await API.post('/chat', {
    message,
  });

  return response.data;
};

export const getChatHistory = async () => {
  const response = await API.get('/chat/history');
  return response.data;
};

export const clearChatHistory = async () => {
  await API.delete('/chat/clear');
};

export const getRemainingChat = async () => {
  const response = await API.get('/chat/remaining');
  return response.data;
};