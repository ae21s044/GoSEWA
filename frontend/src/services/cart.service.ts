import api from './auth.service';

export const getCart = async () => {
    const response = await api.get('/marketplace/cart');
    return response.data;
};

export const addToCart = async (productId: string, quantity: number) => {
    const response = await api.post('/marketplace/cart', { 
        product_id: productId, 
        quantity 
    });
    return response.data;
};

export const updateCartItem = async (itemId: string, quantity: number) => {
    const response = await api.put(`/marketplace/cart/${itemId}`, { quantity });
    return response.data;
};

export const removeFromCart = async (itemId: string) => {
    const response = await api.delete(`/marketplace/cart/${itemId}`);
    return response.data;
};

export const clearCart = async () => {
    const response = await api.delete('/marketplace/cart');
    return response.data;
};
