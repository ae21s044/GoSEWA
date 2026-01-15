import api from './auth.service';

export const getOrders = async (params?: {
    status?: string;
    page?: number;
    limit?: number;
}) => {
    const response = await api.get('/marketplace/orders', { params });
    return response.data;
};

export const getOrderById = async (id: string) => {
    const response = await api.get(`/marketplace/orders/${id}`);
    return response.data;
};

export const createOrder = async (orderData: {
    delivery_address: string;
    payment_method: string;
    items: Array<{ product_id: string; quantity: number }>;
}) => {
    const response = await api.post('/marketplace/orders', orderData);
    return response.data;
};

export const cancelOrder = async (id: string) => {
    const response = await api.put(`/marketplace/orders/${id}/cancel`);
    return response.data;
};

export const trackOrder = async (id: string) => {
    const response = await api.get(`/logistics/shipments/order/${id}`);
    return response.data;
};
