import { supabase } from '../lib/supabase';

const DISTRICT_CACHE: Record<string, any> = {};

export const getDistrictFromSupabase = async (lat: number, lon: number) => {
  try {
    console.log('🌐 FETCH DISTRICT (SUPABASE)');

    const { data, error } = await supabase.rpc('nearest_district', {
      lat,
      lon,
    });

    if (error) throw error;

    console.log('📦 RAW SUPABASE:', data);

    return data ?? null;
  } catch (err) {
    console.log('❌ SUPABASE ERROR:', err);
    return null;
  }
};
