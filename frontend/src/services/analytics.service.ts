import api from './auth.service';

export const getSalesAnalytics = async (params?: {
    start_date?: string;
    end_date?: string;
    period?: 'daily' | 'weekly' | 'monthly';
}) => {
    const response = await api.get('/analytics/sales', { params });
    return response.data;
};

export const getRevenueMetrics = async () => {
    const response = await api.get('/analytics/revenue');
    return response.data;
};

export const getTopProducts = async (limit: number = 10) => {
    const response = await api.get('/analytics/products/top', { params: { limit } });
    return response.data;
};

export const getCustomerInsights = async () => {
    const response = await api.get('/analytics/customers');
    return response.data;
};
