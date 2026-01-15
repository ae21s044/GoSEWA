import api from './auth.service';

export const getProductReviews = async (productId: string) => {
    const response = await api.get(`/reviews/product/${productId}`);
    return response.data;
};

export const createReview = async (data: {
    product_id: string;
    rating: number;
    comment?: string;
}) => {
    const response = await api.post('/reviews', data);
    return response.data;
};

export const deleteReview = async (id: string) => {
    const response = await api.delete(`/reviews/${id}`);
    return response.data;
};
