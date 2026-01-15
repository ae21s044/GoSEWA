import api from './auth.service';

export const getMarketplaceProducts = async (params?: {
    search?: string;
    category_id?: string;
    page?: number;
    limit?: number;
}) => {
    // Using inventory/products since marketplace/products doesn't exist in backend
    const response = await api.get('/inventory/products', { params });
    return response.data;
};

export const getProductById = async (id: string) => {
    const response = await api.get(`/inventory/products/${id}`);
    return response.data;
};

export const searchProducts = async (query: string) => {
    const response = await api.get('/marketplace/search', { params: { query } });
    return response.data;
};

export const addToCart = async (productId: string, quantity: number) => {
    const response = await api.post('/marketplace/cart', { product_id: productId, quantity });
    return response.data;
};

export const getCart = async () => {
    const response = await api.get('/marketplace/cart');
    return response.data;
};
