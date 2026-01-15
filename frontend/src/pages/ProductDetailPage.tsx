import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById, addToCart } from '../services/marketplace.service';
import { ArrowLeft, ShoppingCart, Package, Star } from 'lucide-react';
import toast from 'react-hot-toast';

const ProductDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [product, setProduct] = useState<any>(null);
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) fetchProduct();
    }, [id]);

    const fetchProduct = async () => {
        try {
            const res = await getProductById(id!);
            if (res.success) setProduct(res.data.data);
        } catch (error) {
            toast.error('Failed to load product');
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = async () => {
        try {
            await addToCart(product.id, quantity);
            toast.success(`Added ${quantity} item(s) to cart!`);
        } catch (error) {
            toast.error('Failed to add to cart');
        }
    };

    if (loading) return <div>Loading product...</div>;
    if (!product) return <div>Product not found</div>;

    return (
        <div>
            {/* Back Button */}
            <button 
                onClick={() => navigate('/marketplace')}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem 1rem',
                    background: 'transparent',
                    border: 'none',
                    color: '#3182ce',
                    cursor: 'pointer',
                    marginBottom: '1.5rem',
                    fontSize: '1rem'
                }}
            >
                <ArrowLeft size={20} /> Back to Marketplace
            </button>

            {/* Product Detail */}
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', background: 'white', padding: '2rem', borderRadius: '12px'}}>
                {/* Image */}
                <div style={{background: '#f7fafc', borderRadius: '12px', height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    <span style={{fontSize: '8rem', color: '#cbd5e0'}}>📦</span>
                </div>

                {/* Details */}
                <div>
                    <h1 style={{fontSize: '2rem', margin: '0 0 0.5rem 0'}}>{product.name}</h1>
                    <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem'}}>
                        <Star size={16} fill="#f59e0b" color="#f59e0b" />
                        <span style={{color: '#718096'}}>4.5 (24 reviews)</span>
                    </div>

                    <div style={{fontSize: '2.5rem', fontWeight: 'bold', color: '#2b6cb0', marginBottom: '1rem'}}>
                        ₹{product.price_per_unit}
                        <span style={{fontSize: '1rem', color: '#718096', fontWeight: 'normal'}}>/{product.unit_type}</span>
                    </div>

                    <p style={{color: '#4a5568', lineHeight: '1.6', marginBottom: '1.5rem'}}>
                        {product.description || 'Fresh and organic product directly from verified Gaushalas. Supporting local farmers and sustainable practices.'}
                    </p>

                    <div style={{background: '#f7fafc', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem'}}>
                        <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem'}}>
                            <span style={{color: '#718096'}}>Availability:</span>
                            <span style={{fontWeight: 600, color: product.available_quantity > 0 ? '#38a169' : '#e53e3e'}}>
                                {product.available_quantity > 0 ? `${product.available_quantity} in stock` : 'Out of stock'}
                            </span>
                        </div>
                        <div style={{display: 'flex', justifyContent: 'space-between'}}>
                            <span style={{color: '#718096'}}>Unit Type:</span>
                            <span style={{fontWeight: 600}}>{product.unit_type}</span>
                        </div>
                    </div>

                    {/* Quantity Selector */}
                    <div style={{marginBottom: '1.5rem'}}>
                        <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 500}}>Quantity:</label>
                        <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
                            <button
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                style={{
                                    width: '40px',
                                    height: '40px',
                                    border: '1px solid #e2e8f0',
                                    borderRadius: '6px',
                                    background: 'white',
                                    cursor: 'pointer',
                                    fontSize: '1.2rem'
                                }}
                            >-</button>
                            <span style={{fontSize: '1.2rem', fontWeight: 600, minWidth: '40px', textAlign: 'center'}}>{quantity}</span>
                            <button
                                onClick={() => setQuantity(Math.min(product.available_quantity, quantity + 1))}
                                style={{
                                    width: '40px',
                                    height: '40px',
                                    border: '1px solid #e2e8f0',
                                    borderRadius: '6px',
                                    background: 'white',
                                    cursor: 'pointer',
                                    fontSize: '1.2rem'
                                }}
                            >+</button>
                        </div>
                    </div>

                    {/* Add to Cart Button */}
                    <button
                        onClick={handleAddToCart}
                        disabled={product.available_quantity === 0}
                        style={{
                            width: '100%',
                            padding: '1rem',
                            background: product.available_quantity > 0 ? '#3182ce' : '#cbd5e0',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '1.1rem',
                            fontWeight: 600,
                            cursor: product.available_quantity > 0 ? 'pointer' : 'not-allowed',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.75rem'
                        }}
                    >
                        <ShoppingCart size={22} />
                        {product.available_quantity > 0 ? 'Add to Cart' : 'Out of Stock'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailPage;
