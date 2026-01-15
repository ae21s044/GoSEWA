import api from './auth.service';

export const getNotifications = async (params?: {
    unread_only?: boolean;
    page?: number;
    limit?: number;
}) => {
    const response = await api.get('/notifications', { params });
    return response.data;
};

export const markAsRead = async (id: string) => {
    const response = await api.put(`/notifications/${id}/read`);
    return response.data;
};

export const markAllAsRead = async () => {
    const response = await api.put('/notifications/read-all');
    return response.data;
};

export const deleteNotification = async (id: string) => {
    const response = await api.delete(`/notifications/${id}`);
    return response.data;
};

export const getUnreadCount = async () => {
    const response = await api.get('/notifications/unread/count');
    return response.data;
};
