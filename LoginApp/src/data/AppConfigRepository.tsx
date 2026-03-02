import API from '../services/api'; // sesuaikan path

export const fetchAppConfig = async () => {
  const response = await API.get('/app-config');
  return response.data.data;
};
