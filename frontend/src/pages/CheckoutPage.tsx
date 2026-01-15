import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { getCart } from '../services/cart.service';
import toast from 'react-hot-toast';
import api from '../services/auth.service';

const CheckoutPage: React.FC = () => {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCart();
    }, []);

    const fetchCart = async () => {
        try {
            const res = await getCart();
            if (res.success) {
                const items = res.data.data || [];
                if (items.length === 0) {
                    toast.error('Your cart is empty');
                    navigate('/cart');
                    return;
                }
                setCartItems(items);
            }
        } catch (error) {
            toast.error('Failed to load cart');
        } finally {
            setLoading(false);
        }
    };

    const formik = useFormik({
        initialValues: {
            address_line1: '',
            address_line2: '',
            city: '',
            state: '',
            pincode: '',
            payment_method: 'COD'
        },
        validationSchema: Yup.object({
            address_line1: Yup.string().required('Required'),
            city: Yup.string().required('Required'),
            state: Yup.string().required('Required'),
            pincode: Yup.string().required('Required').matches(/^\d{6}$/, 'Must be 6 digits'),
            payment_method: Yup.string().required('Required')
        }),
        onSubmit: async (values) => {
            try {
                // Place order via backend
                const orderData = {
                    delivery_address: `${values.address_line1}, ${values.address_line2 || ''}, ${values.city}, ${values.state} - ${values.pincode}`,
                    payment_method: values.payment_method,
                    items: cartItems.map(item => ({
                        product_id: item.product_id,
                        quantity: item.quantity
                    }))
                };

                const response = await api.post('/marketplace/orders', orderData);
                
                if (response.data.success) {
                    toast.success('Order placed successfully!');
                    navigate('/orders');
                }
            } catch (error: any) {
                toast.error(error.response?.data?.message || 'Failed to place order');
            }
        },
    });

    const calculateTotal = () => {
        return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <h1 style={{marginBottom: '2rem'}}>Checkout</h1>

            <div style={{display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem'}}>
                {/* Checkout Form */}
                <div>
                    <form onSubmit={formik.handleSubmit}>
                        <div style={{background: 'white', padding: '2rem', borderRadius: '12px', marginBottom: '1.5rem'}}>
                            <h3 style={{margin: '0 0 1.5rem 0'}}>Delivery Address</h3>

                            <div style={{marginBottom: '1rem'}}>
                                <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 500}}>Address Line 1</label>
                                <input
                                    type="text"
                                    {...formik.getFieldProps('address_line1')}
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        border: '1px solid #e2e8f0',
                                        borderRadius: '8px',
                                        outline: 'none'
                                    }}
                                />
                                {formik.touched.address_line1 && formik.errors.address_line1 && (
                                    <div style={{color: '#e53e3e', fontSize: '0.85rem', marginTop: '0.25rem'}}>{formik.errors.address_line1}</div>
                                )}
                            </div>

                            <div style={{marginBottom: '1rem'}}>
                                <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 500}}>Address Line 2 (Optional)</label>
                                <input
                                    type="text"
                                    {...formik.getFieldProps('address_line2')}
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        border: '1px solid #e2e8f0',
                                        borderRadius: '8px',
                                        outline: 'none'
                                    }}
                                />
                            </div>

                            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem'}}>
                                <div>
                                    <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 500}}>City</label>
                                    <input
                                        type="text"
                                        {...formik.getFieldProps('city')}
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            border: '1px solid #e2e8f0',
                                            borderRadius: '8px',
                                            outline: 'none'
                                        }}
                                    />
                                    {formik.touched.city && formik.errors.city && (
                                        <div style={{color: '#e53e3e', fontSize: '0.85rem', marginTop: '0.25rem'}}>{formik.errors.city}</div>
                                    )}
                                </div>

                                <div>
                                    <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 500}}>State</label>
                                    <input
                                        type="text"
                                        {...formik.getFieldProps('state')}
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            border: '1px solid #e2e8f0',
                                            borderRadius: '8px',
                                            outline: 'none'
                                        }}
                                    />
                                    {formik.touched.state && formik.errors.state && (
                                        <div style={{color: '#e53e3e', fontSize: '0.85rem', marginTop: '0.25rem'}}>{formik.errors.state}</div>
                                    )}
                                </div>
                            </div>

                            <div style={{marginBottom: '1rem'}}>
                                <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 500}}>Pincode</label>
                                <input
                                    type="text"
                                    {...formik.getFieldProps('pincode')}
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        border: '1px solid #e2e8f0',
                                        borderRadius: '8px',
                                        outline: 'none'
                                    }}
                                />
                                {formik.touched.pincode && formik.errors.pincode && (
                                    <div style={{color: '#e53e3e', fontSize: '0.85rem', marginTop: '0.25rem'}}>{formik.errors.pincode}</div>
                                )}
                            </div>
                        </div>

                        <div style={{background: 'white', padding: '2rem', borderRadius: '12px', marginBottom: '1.5rem'}}>
                            <h3 style={{margin: '0 0 1.5rem 0'}}>Payment Method</h3>

                            <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                                <label style={{display: 'flex', alignItems: 'center', padding: '1rem', border: '2px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer'}}>
                                    <input
                                        type="radio"
                                        name="payment_method"
                                        value="COD"
                                        checked={formik.values.payment_method === 'COD'}
                                        onChange={formik.handleChange}
                                        style={{marginRight: '0.75rem'}}
                                    />
                                    <div>
                                        <div style={{fontWeight: 600}}>Cash on Delivery</div>
                                        <div style={{fontSize: '0.85rem', color: '#718096'}}>Pay when you receive</div>
                                    </div>
                                </label>

                                <label style={{display: 'flex', alignItems: 'center', padding: '1rem', border: '2px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer'}}>
                                    <input
                                        type="radio"
                                        name="payment_method"
                                        value="ONLINE"
                                        checked={formik.values.payment_method === 'ONLINE'}
                                        onChange={formik.handleChange}
                                        style={{marginRight: '0.75rem'}}
                                    />
                                    <div>
                                        <div style={{fontWeight: 600}}>Online Payment</div>
                                        <div style={{fontSize: '0.85rem', color: '#718096'}}>UPI, Cards, Net Banking</div>
                                    </div>
                                </label>
                            </div>
                        </div>

                        <button
                            type="submit"
                            style={{
                                width: '100%',
                                padding: '1rem',
                                background: '#3182ce',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '1rem',
                                fontWeight: 600,
                                cursor: 'pointer'
                            }}
                        >
                            Place Order
                        </button>
                    </form>
                </div>

                {/* Order Summary */}
                <div>
                    <div style={{background: 'white', padding: '1.5rem', borderRadius: '12px', position: 'sticky', top: '2rem'}}>
                        <h3 style={{margin: '0 0 1.5rem 0'}}>Order Summary</h3>

                        <div style={{maxHeight: '300px', overflowY: 'auto', marginBottom: '1rem'}}>
                            {cartItems.map((item) => (
                                <div key={item.id} style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', paddingBottom: '0.75rem', borderBottom: '1px solid #f7fafc'}}>
                                    <div>
                                        <div style={{fontWeight: 500}}>{item.product_name || item.name}</div>
                                        <div style={{fontSize: '0.85rem', color: '#718096'}}>Qty: {item.quantity}</div>
                                    </div>
                                    <div style={{fontWeight: 600}}>₹{(item.price * item.quantity).toFixed(2)}</div>
                                </div>
                            ))}
                        </div>

                        <div style={{borderTop: '1px solid #e2e8f0', paddingTop: '1rem'}}>
                            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem'}}>
                                <span style={{color: '#718096'}}>Subtotal:</span>
                                <span>₹{calculateTotal().toFixed(2)}</span>
                            </div>
                            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem'}}>
                                <span style={{color: '#718096'}}>Shipping:</span>
                                <span>₹50.00</span>
                            </div>
                            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '1rem'}}>
                                <span style={{color: '#718096'}}>Tax:</span>
                                <span>₹{(calculateTotal() * 0.05).toFixed(2)}</span>
                            </div>
                            <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '1.25rem', fontWeight: 'bold'}}>
                                <span>Total:</span>
                                <span style={{color: '#2b6cb0'}}>₹{(calculateTotal() + 50 + calculateTotal() * 0.05).toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
