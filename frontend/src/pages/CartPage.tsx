import React, { useEffect, useState } from 'react';
import { getCart, updateCartItem, removeFromCart } from '../services/cart.service';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const CartPage: React.FC = () => {
    const [cartItems, setCartItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCart();
    }, []);

    const fetchCart = async () => {
        try {
            const res = await getCart();
            if (res.success) setCartItems(res.data.data || []);
        } catch (error) {
            console.error('Failed to load cart', error);
        } finally {
            setLoading(false);
        }
    };

    const handleQuantityChange = async (itemId: string, newQuantity: number) => {
        if (newQuantity < 1) return;
        try {
            await updateCartItem(itemId, newQuantity);
            fetchCart();
            toast.success('Cart updated');
        } catch (error) {
            toast.error('Failed to update cart');
        }
    };

    const handleRemove = async (itemId: string) => {
        try {
            await removeFromCart(itemId);
            fetchCart();
            toast.success('Item removed from cart');
        } catch (error) {
            toast.error('Failed to remove item');
        }
    };

    const calculateTotal = () => {
        return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    };

    if (loading) return <div>Loading cart...</div>;

    if (cartItems.length === 0) {
        return (
            <div style={{textAlign: 'center', padding: '4rem'}}>
                <ShoppingBag size={64} style={{color: '#cbd5e0', margin: '0 auto 1rem'}} />
                <h2 style={{color: '#4a5568', marginBottom: '0.5rem'}}>Your cart is empty</h2>
                <p style={{color: '#a0aec0', marginBottom: '2rem'}}>Add some products to get started!</p>
                <button
                    onClick={() => navigate('/marketplace')}
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
                    Browse Marketplace
                </button>
            </div>
        );
    }

    return (
        <div>
            <h1 style={{marginBottom: '2rem'}}>Shopping Cart</h1>

            <div style={{display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem'}}>
                {/* Cart Items */}
                <div>
                    {cartItems.map((item) => (
                        <div key={item.id} style={{
                            background: 'white',
                            padding: '1.5rem',
                            borderRadius: '12px',
                            marginBottom: '1rem',
                            display: 'flex',
                            gap: '1.5rem',
                            alignItems: 'center'
                        }}>
                            <div style={{
                                width: '100px',
                                height: '100px',
                                background: '#f7fafc',
                                borderRadius: '8px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '2rem'
                            }}>
                                📦
                            </div>

                            <div style={{flex: 1}}>
                                <h3 style={{margin: '0 0 0.5rem 0'}}>{item.product_name || item.name}</h3>
                                <p style={{color: '#718096', fontSize: '0.9rem', margin: 0}}>
                                    ₹{item.price} per {item.unit_type}
                                </p>
                            </div>

                            <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
                                <button
                                    onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                    style={{
                                        width: '32px',
                                        height: '32px',
                                        border: '1px solid #e2e8f0',
                                        borderRadius: '6px',
                                        background: 'white',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <Minus size={16} />
                                </button>
                                <span style={{fontWeight: 600, minWidth: '30px', textAlign: 'center'}}>{item.quantity}</span>
                                <button
                                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                    style={{
                                        width: '32px',
                                        height: '32px',
                                        border: '1px solid #e2e8f0',
                                        borderRadius: '6px',
                                        background: 'white',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <Plus size={16} />
                                </button>
                            </div>

                            <div style={{fontWeight: 'bold', fontSize: '1.1rem', color: '#2b6cb0', minWidth: '80px', textAlign: 'right'}}>
                                ₹{(item.price * item.quantity).toFixed(2)}
                            </div>

                            <button
                                onClick={() => handleRemove(item.id)}
                                style={{
                                    padding: '0.5rem',
                                    background: '#fff5f5',
                                    color: '#e53e3e',
                                    border: 'none',
                                    borderRadius: '6px',
                                    cursor: 'pointer'
                                }}
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    ))}
                </div>

                {/* Order Summary */}
                <div>
                    <div style={{background: 'white', padding: '1.5rem', borderRadius: '12px', position: 'sticky', top: '2rem'}}>
                        <h3 style={{margin: '0 0 1.5rem 0'}}>Order Summary</h3>

                        <div style={{borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem', marginBottom: '1rem'}}>
                            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem'}}>
                                <span style={{color: '#718096'}}>Subtotal:</span>
                                <span style={{fontWeight: 600}}>₹{calculateTotal().toFixed(2)}</span>
                            </div>
                            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem'}}>
                                <span style={{color: '#718096'}}>Shipping:</span>
                                <span style={{fontWeight: 600}}>₹50.00</span>
                            </div>
                            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                <span style={{color: '#718096'}}>Tax (5%):</span>
                                <span style={{fontWeight: 600}}>₹{(calculateTotal() * 0.05).toFixed(2)}</span>
                            </div>
                        </div>

                        <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1.5rem'}}>
                            <span>Total:</span>
                            <span style={{color: '#2b6cb0'}}>₹{(calculateTotal() + 50 + calculateTotal() * 0.05).toFixed(2)}</span>
                        </div>

                        <button
                            onClick={() => navigate('/checkout')}
                            style={{
                                width: '100%',
                                padding: '1rem',
                                background: '#3182ce',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '1rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.5rem'
                            }}
                        >
                            Proceed to Checkout <ArrowRight size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPage;
