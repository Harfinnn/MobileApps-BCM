export const reverseGeocode = async (lat: number, lon: number) => {
  const res = await fetch(
    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`,
    {
      headers: {
        'User-Agent': 'loginapp-weather',
        Accept: 'application/json',
      },
    },
  );

  const text = await res.text();

  try {
    return JSON.parse(text);
  } catch (e) {
    console.log('GEOCODE RAW RESPONSE:', text);
    throw new Error('Geocode returned invalid JSON');
  }
};
