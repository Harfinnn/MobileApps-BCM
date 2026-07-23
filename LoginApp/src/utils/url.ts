import { ENV } from '../config/env';

export const Url = {
  beritaImage: (filename?: string) =>
    `${ENV.BASE_URL}/img/berita/${filename?.trim()}`,

  playbookImage: (filename?: string) =>
    `${ENV.BASE_URL}/img/playbook/${filename?.trim()}`,

  avatar: (filename?: string) =>
    `${ENV.BASE_URL}/img/profile/${filename?.trim()}`,

  logo: () => `${ENV.BASE_URL}/img/newlogo.png`,
};
