import React, { useEffect, useState } from 'react';
import { getOrders } from '../services/order.service';
import { Package, Clock, CheckCircle, XCircle, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const OrdersPage: React.FC = () => {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('ALL');
    const navigate = useNavigate();

    useEffect(() => {
        fetchOrders();
    }, [filter]);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const params = filter !== 'ALL' ? { status: filter } : {};
            const res = await getOrders(params);
            if (res.success) setOrders(res.data.data || []);
        } catch (error) {
            console.error('Failed to load orders', error);
            toast.error('Failed to load orders');
        } finally {
            setLoading(false);
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'PENDING': return <Clock size={20} color="#f59e0b" />;
            case 'CONFIRMED': return <CheckCircle size={20} color="#3b82f6" />;
            case 'DELIVERED': return <CheckCircle size={20} color="#10b981" />;
            case 'CANCELLED': return <XCircle size={20} color="#ef4444" />;
            default: return <Package size={20} color="#6b7280" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PENDING': return '#fef3c7';
            case 'CONFIRMED': return '#dbeafe';
            case 'DELIVERED': return '#d1fae5';
            case 'CANCELLED': return '#fee2e2';
            default: return '#f3f4f6';
        }
    };

    if (loading) return <div>Loading orders...</div>;

    return (
        <div>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem'}}>
                <h1 style={{margin: 0}}>My Orders</h1>
                
                {/* Filter Tabs */}
                <div style={{display: 'flex', gap: '0.5rem'}}>
                    {['ALL', 'PENDING', 'CONFIRMED', 'DELIVERED', 'CANCELLED'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilter(status)}
                            style={{
                                padding: '0.5rem 1rem',
                                border: filter === status ? '2px solid #3182ce' : '1px solid #e2e8f0',
                                background: filter === status ? '#ebf8ff' : 'white',
                                color: filter === status ? '#2b6cb0' : '#4a5568',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontWeight: filter === status ? 600 : 400,
                                fontSize: '0.9rem'
                            }}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            {orders.length === 0 ? (
                <div style={{textAlign: 'center', padding: '4rem', background: 'white', borderRadius: '12px'}}>
                    <Package size={64} style={{color: '#cbd5e0', margin: '0 auto 1rem'}} />
                    <h2 style={{color: '#4a5568', marginBottom: '0.5rem'}}>No orders found</h2>
                    <p style={{color: '#a0aec0', marginBottom: '2rem'}}>Start shopping to see your orders here!</p>
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
            ) : (
                <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                    {orders.map((order) => (
                        <div
                            key={order.id}
                            style={{
                                background: 'white',
                                padding: '1.5rem',
                                borderRadius: '12px',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                                cursor: 'pointer',
                                transition: 'transform 0.2s'
                            }}
                            onClick={() => navigate(`/orders/${order.id}`)}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                        >
                            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem'}}>
                                <div>
                                    <div style={{display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem'}}>
                                        <h3 style={{margin: 0}}>Order #{order.id.substring(0, 8)}</h3>
                                        <span style={{
                                            padding: '0.25rem 0.75rem',
                                            background: getStatusColor(order.status),
                                            borderRadius: '12px',
                                            fontSize: '0.85rem',
                                            fontWeight: 600,
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem'
                                        }}>
                                            {getStatusIcon(order.status)}
                                            {order.status}
                                        </span>
                                    </div>
                                    <p style={{color: '#718096', fontSize: '0.9rem', margin: 0}}>
                                        Placed on {new Date(order.created_at).toLocaleDateString('en-IN', {
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric'
                                        })}
                                    </p>
                                </div>

                                <div style={{textAlign: 'right'}}>
                                    <div style={{fontSize: '1.5rem', fontWeight: 'bold', color: '#2b6cb0'}}>
                                        ₹{parseFloat(order.total_amount).toFixed(2)}
                                    </div>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            navigate(`/orders/${order.id}`);
                                        }}
                                        style={{
                                            marginTop: '0.5rem',
                                            padding: '0.5rem 1rem',
                                            background: '#ebf8ff',
                                            color: '#2b6cb0',
                                            border: 'none',
                                            borderRadius: '6px',
                                            cursor: 'pointer',
                                            fontWeight: 600,
                                            fontSize: '0.9rem',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem'
                                        }}
                                    >
                                        <Eye size={16} /> View Details
                                    </button>
                                </div>
                            </div>

                            <div style={{borderTop: '1px solid #f7fafc', paddingTop: '1rem'}}>
                                <div style={{display: 'flex', gap: '0.5rem', color: '#718096', fontSize: '0.9rem'}}>
                                    <span>📍 {order.delivery_address?.substring(0, 50)}...</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default OrdersPage;
