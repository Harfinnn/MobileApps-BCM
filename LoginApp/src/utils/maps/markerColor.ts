export function getMarkerColor(type: string): string {
  const t = type.toLowerCase();

  if (t.includes('kebakaran')) return '#DC2626';
  if (t.includes('banjir bandang')) return '#1D4ED8';
  if (t.includes('banjir')) return '#2563EB';
  if (t.includes('tsunami')) return '#0EA5E9';
  if (t.includes('tanah longsor')) return '#92400E';
  if (t.includes('letusan gunung')) return '#7C2D12';
  if (t.includes('angin besar')) return '#0D9488';
  if (t.includes('demonstrasi')) return '#7C3AED';
  if (t.includes('ancaman bom')) return '#991B1B';
  if (t.includes('gangguan utilitas')) return '#4B5563';
  if (t.includes('sengatan listrik')) return '#FACC15';

  return '#6B7280';
}
