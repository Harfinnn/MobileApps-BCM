import API from './api';

export const getDashboardSummary = () =>
  API.get('/dashboard/bencana/summary');

export const getDashboardHistory = (params?: any) =>
  API.get('/dashboard/bencana', { params });
