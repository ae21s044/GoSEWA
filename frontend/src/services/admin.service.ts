import api from './auth.service';

export const getAdminUsers = async (params?: {
    user_type?: string;
    verification_status?: string;
    page?: number;
    limit?: number;
}) => {
    const response = await api.get('/admin/users', { params });
    return response.data;
};

export const verifyUser = async (userId: string) => {
    const response = await api.put(`/admin/users/${userId}/verify`);
    return response.data;
};

export const suspendUser = async (userId: string) => {
    const response = await api.put(`/admin/users/${userId}/suspend`);
    return response.data;
};

export const getSystemMetrics = async () => {
    const response = await api.get('/monitoring/metrics');
    return response.data;
};

export const getSystemHealth = async () => {
    const response = await api.get('/monitoring/health');
    return response.data;
};
