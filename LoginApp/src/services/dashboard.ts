import API from './api';

// Tambahkan (params?: any) dan { params } pada getDashboardSummary
export const getDashboardSummary = (params?: any) =>
  API.get('/dashboard/bencana/summary', { params });

// Ini sudah benar, biarkan saja
export const getDashboardHistory = (params?: any) =>
  API.get('/dashboard/bencana', { params });