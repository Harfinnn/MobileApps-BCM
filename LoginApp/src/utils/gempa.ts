import { haversineDistance } from './geo';

export type UnitKerja = {
  mjs_id: number;
  mjs_nama: string;
  mjs_alamat: string;
  mjs_lat: string;
  mjs_long: string;
};

export type UnitWithDistance = UnitKerja & {
  distance: number;
};

export const getUnitsInRadius = (
  lat: number,
  lng: number,
  units: UnitKerja[],
  radius: number = 50,
): UnitWithDistance[] => {
  return units
    .map(unit => {
      if (!unit.mjs_lat || !unit.mjs_long) return null;

      const distance = haversineDistance(
        lat,
        lng,
        Number(unit.mjs_lat),
        Number(unit.mjs_long),
      );

      return {
        ...unit,
        distance,
      };
    })
    .filter((u): u is UnitWithDistance => !!u && u.distance <= radius)
    .sort((a, b) => a.distance - b.distance);
};

export const getBearingDirection = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
) => {
  const y =
    Math.sin((lon2 - lon1) * (Math.PI / 180)) *
    Math.cos(lat2 * (Math.PI / 180));
  const x =
    Math.cos(lat1 * (Math.PI / 180)) * Math.sin(lat2 * (Math.PI / 180)) -
    Math.sin(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.cos((lon2 - lon1) * (Math.PI / 180));

  let brng = (Math.atan2(y, x) * 180) / Math.PI;
  brng = (brng + 360) % 360; // Normalisasi ke 0-360 derajat

  const directions = [
    'UTARA',
    'TIMUR LAUT',
    'TIMUR',
    'TENGGARA',
    'SELATAN',
    'BARAT DAYA',
    'BARAT',
    'BARAT LAUT',
  ];

  // Membagi 360 derajat ke 8 arah (45 derajat per arah)
  const index = Math.round(brng / 45) % 8;
  return directions[index];
};
