import React, { useEffect, useState } from 'react';
import api from '../services/auth.service';
import { useAuth } from '../context/auth.context';

// Minimal dashboard stats interface
interface DashboardData {
    stats: {
        active_orders: number;
        unread_notifications: number;
        cart_items?: number;
    };
    featured_products: any[];
}

const DashboardPage: React.FC = () => {
    const { user } = useAuth();
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                // Using the Mobile/Home endpoint as it aggregates data perfectly for dashboard
                const response = await api.get('/mobile/home');
                if (response.data.success) {
                    setData(response.data.data);
                }
            } catch (error) {
                console.error('Error fetching dashboard:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboard();
    }, []);

    if (loading) return <div>Loading dashboard...</div>;

    return (
        <div>
            <h1>Hello, {user?.full_name}</h1>
            <p style={{color: '#718096', marginBottom: '2rem'}}>Here is what is happening today.</p>

            {/* Stats Grid */}
            <div style={{
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
                gap: '1.5rem',
                marginBottom: '2rem'
            }}>
                <StatCard title="Active Orders" value={data?.stats.active_orders || 0} color="blue" />
                <StatCard title="Unread Notifications" value={data?.stats.unread_notifications || 0} color="orange" />
                {user?.user_type === 'ENTREPRENEUR' && (
                    <StatCard title="Cart Items" value={data?.stats.cart_items || 0} color="green" />
                )}
            </div>

            {/* Recent/Featured Section */}
            <div style={{background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)'}}>
                <h3 style={{marginBottom: '1rem', borderBottom: '1px solid #eee', paddingBottom: '0.5rem'}}>Featured Products</h3>
                {data?.featured_products && data.featured_products.length > 0 ? (
                    <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem'}}>
                        {data.featured_products.map((p: any) => (
                            <div key={p.id} style={{border: '1px solid #eee', padding: '1rem', borderRadius: '8px'}}>
                                <h4 style={{margin: '0 0 0.5rem 0'}}>{p.name}</h4>
                                <p style={{color: '#2b6cb0', fontWeight: 'bold'}}>{p.price_per_unit} / {p.unit_type}</p>
                                <p style={{fontSize: '0.8rem', color: '#718096'}}>{p.available_quantity} available</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p style={{color: '#a0aec0'}}>No featured products available.</p>
                )}
            </div>
        </div>
    );
};

const StatCard = ({ title, value, color }: { title: string, value: number, color: string }) => {
    const textMap: any = {
        blue: '#3182ce',
        orange: '#dd6b20',
        green: '#38a169',
    };

    return (
        <div style={{
            background: 'white', 
            padding: '1.5rem', 
            borderRadius: '12px', 
            boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
            display: 'flex',
            flexDirection: 'column'
        }}>
            <span style={{color: '#718096', fontSize: '0.875rem', fontWeight: 500}}>{title}</span>
            <span style={{
                fontSize: '2rem', 
                fontWeight: 700, 
                color: textMap[color] || '#1a202c', 
                marginTop: '0.5rem'
            }}>{value}</span>
        </div>
    );
};

export default DashboardPage;
