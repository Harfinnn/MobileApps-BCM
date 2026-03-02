import API from '../services/api';

export const uploadAppLogo = async (image: any) => {
  const formData = new FormData();

  formData.append('mla_logo', {
    uri: image.uri,
    name: image.fileName || 'logo.jpg',
    type: image.type || 'image/jpeg',
  } as any);

  return API.put('/app-config', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
