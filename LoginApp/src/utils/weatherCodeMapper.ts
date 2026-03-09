export const weatherCodeToCondition = (code: number): string => {
  if (code === 0) return 'Cerah';
  if (code === 1 || code === 2) return 'Cerah Berawan';
  if (code === 3) return 'Berawan';

  if (code === 45 || code === 48) return 'Kabut';

  if (code >= 51 && code <= 55) return 'Gerimis';

  if (code >= 61 && code <= 65) return 'Hujan';

  if (code >= 80 && code <= 82) return 'Hujan Lebat';

  if (code >= 95) return 'Badai Petir';

  return 'Berawan';
};
