import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { createReview } from '../services/review.service';
import { Star } from 'lucide-react';
import toast from 'react-hot-toast';

interface ReviewFormProps {
    productId: string;
    onSuccess: () => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ productId, onSuccess }) => {
    const [hoveredRating, setHoveredRating] = useState(0);

    const formik = useFormik({
        initialValues: {
            rating: 0,
            comment: ''
        },
        validationSchema: Yup.object({
            rating: Yup.number().min(1, 'Please select a rating').max(5).required('Required'),
            comment: Yup.string()
        }),
        onSubmit: async (values) => {
            try {
                await createReview({
                    product_id: productId,
                    rating: values.rating,
                    comment: values.comment || undefined
                });
                toast.success('Review submitted!');
                formik.resetForm();
                onSuccess();
            } catch (error: any) {
                toast.error(error.response?.data?.message || 'Failed to submit review');
            }
        },
    });

    return (
        <form onSubmit={formik.handleSubmit} style={{background: 'white', padding: '1.5rem', borderRadius: '12px', marginBottom: '1.5rem'}}>
            <h3 style={{margin: '0 0 1rem 0'}}>Write a Review</h3>
            
            <div style={{marginBottom: '1rem'}}>
                <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 500}}>Rating</label>
                <div style={{display: 'flex', gap: '0.5rem'}}>
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            type="button"
                            onClick={() => formik.setFieldValue('rating', star)}
                            onMouseEnter={() => setHoveredRating(star)}
                            onMouseLeave={() => setHoveredRating(0)}
                            style={{
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                padding: 0
                            }}
                        >
                            <Star
                                size={32}
                                fill={(hoveredRating || formik.values.rating) >= star ? '#f59e0b' : 'none'}
                                color="#f59e0b"
                            />
                        </button>
                    ))}
                </div>
                {formik.touched.rating && formik.errors.rating && (
                    <div style={{color: '#e53e3e', fontSize: '0.85rem', marginTop: '0.25rem'}}>
                        {formik.errors.rating}
                    </div>
                )}
            </div>

            <div style={{marginBottom: '1rem'}}>
                <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 500}}>Comment (Optional)</label>
                <textarea
                    {...formik.getFieldProps('comment')}
                    rows={4}
                    placeholder="Share your experience with this product..."
                    style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        outline: 'none',
                        resize: 'vertical'
                    }}
                />
            </div>

            <button
                type="submit"
                style={{
                    padding: '0.75rem 1.5rem',
                    background: '#3182ce',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: 600
                }}
            >
                Submit Review
            </button>
        </form>
    );
};

export default ReviewForm;
