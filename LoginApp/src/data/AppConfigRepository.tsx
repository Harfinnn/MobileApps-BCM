import API from '../services/api'; // sesuaikan path

export const fetchAppConfig = async () => {
  const response = await API.get('/app-config');
  return response.data.data;
};

export const updateAppConfig = async (payload: any) => {
  const response = await API.post(
    '/app-config?_method=PUT', // Laravel trick
    payload,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );

  return response.data;
};
