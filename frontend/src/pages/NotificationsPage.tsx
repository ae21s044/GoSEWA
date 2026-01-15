import React, { useEffect, useState } from 'react';
import { getNotifications, markAsRead, markAllAsRead, deleteNotification } from '../services/notification.service';
import { Bell, Check, Trash2, CheckCheck } from 'lucide-react';
import toast from 'react-hot-toast';

const NotificationsPage: React.FC = () => {
    const [notifications, setNotifications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'unread'>('all');

    useEffect(() => {
        fetchNotifications();
    }, [filter]);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const res = await getNotifications({ unread_only: filter === 'unread' });
            if (res.success) setNotifications(res.data.data || []);
        } catch (error) {
            console.error('Failed to load notifications', error);
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAsRead = async (id: string) => {
        try {
            await markAsRead(id);
            fetchNotifications();
        } catch (error) {
            toast.error('Failed to mark as read');
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await markAllAsRead();
            toast.success('All notifications marked as read');
            fetchNotifications();
        } catch (error) {
            toast.error('Failed to mark all as read');
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteNotification(id);
            toast.success('Notification deleted');
            fetchNotifications();
        } catch (error) {
            toast.error('Failed to delete notification');
        }
    };

    const getNotificationIcon = (type: string) => {
        const icons: any = {
            'ORDER': '📦',
            'PAYMENT': '💳',
            'PRODUCT': '🛍️',
            'SYSTEM': '⚙️',
            'ALERT': '⚠️'
        };
        return icons[type] || '🔔';
    };

    if (loading) return <div>Loading notifications...</div>;

    return (
        <div>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem'}}>
                <h1 style={{margin: 0}}>Notifications</h1>
                
                <div style={{display: 'flex', gap: '0.5rem'}}>
                    <button
                        onClick={() => setFilter('all')}
                        style={{
                            padding: '0.5rem 1rem',
                            border: filter === 'all' ? '2px solid #3182ce' : '1px solid #e2e8f0',
                            background: filter === 'all' ? '#ebf8ff' : 'white',
                            color: filter === 'all' ? '#2b6cb0' : '#4a5568',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontWeight: filter === 'all' ? 600 : 400
                        }}
                    >
                        All
                    </button>
                    <button
                        onClick={() => setFilter('unread')}
                        style={{
                            padding: '0.5rem 1rem',
                            border: filter === 'unread' ? '2px solid #3182ce' : '1px solid #e2e8f0',
                            background: filter === 'unread' ? '#ebf8ff' : 'white',
                            color: filter === 'unread' ? '#2b6cb0' : '#4a5568',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontWeight: filter === 'unread' ? 600 : 400
                        }}
                    >
                        Unread
                    </button>
                    {notifications.some(n => !n.is_read) && (
                        <button
                            onClick={handleMarkAllAsRead}
                            style={{
                                padding: '0.5rem 1rem',
                                background: '#f0fff4',
                                color: '#22543d',
                                border: '1px solid #c6f6d5',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontWeight: 600,
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                            }}
                        >
                            <CheckCheck size={16} /> Mark All Read
                        </button>
                    )}
                </div>
            </div>

            {notifications.length === 0 ? (
                <div style={{textAlign: 'center', padding: '4rem', background: 'white', borderRadius: '12px'}}>
                    <Bell size={64} style={{color: '#cbd5e0', margin: '0 auto 1rem'}} />
                    <h2 style={{color: '#4a5568', marginBottom: '0.5rem'}}>No notifications</h2>
                    <p style={{color: '#a0aec0'}}>You're all caught up!</p>
                </div>
            ) : (
                <div style={{display: 'flex', flexDirection: 'column', gap: '0.75rem'}}>
                    {notifications.map((notification) => (
                        <div
                            key={notification.id}
                            style={{
                                background: notification.is_read ? 'white' : '#f0f9ff',
                                padding: '1.25rem',
                                borderRadius: '12px',
                                border: notification.is_read ? '1px solid #e2e8f0' : '2px solid #bae6fd',
                                display: 'flex',
                                gap: '1rem',
                                alignItems: 'start'
                            }}
                        >
                            <div style={{
                                fontSize: '2rem',
                                width: '48px',
                                height: '48px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                background: '#f7fafc',
                                borderRadius: '8px'
                            }}>
                                {getNotificationIcon(notification.type)}
                            </div>

                            <div style={{flex: 1}}>
                                <h3 style={{margin: '0 0 0.5rem 0', fontSize: '1rem'}}>
                                    {notification.title}
                                </h3>
                                <p style={{color: '#718096', margin: '0 0 0.5rem 0', fontSize: '0.9rem'}}>
                                    {notification.message}
                                </p>
                                <p style={{color: '#a0aec0', fontSize: '0.85rem', margin: 0}}>
                                    {new Date(notification.created_at).toLocaleString()}
                                </p>
                            </div>

                            <div style={{display: 'flex', gap: '0.5rem'}}>
                                {!notification.is_read && (
                                    <button
                                        onClick={() => handleMarkAsRead(notification.id)}
                                        style={{
                                            padding: '0.5rem',
                                            background: '#f0fff4',
                                            color: '#22543d',
                                            border: 'none',
                                            borderRadius: '6px',
                                            cursor: 'pointer'
                                        }}
                                        title="Mark as read"
                                    >
                                        <Check size={18} />
                                    </button>
                                )}
                                <button
                                    onClick={() => handleDelete(notification.id)}
                                    style={{
                                        padding: '0.5rem',
                                        background: '#fff5f5',
                                        color: '#e53e3e',
                                        border: 'none',
                                        borderRadius: '6px',
                                        cursor: 'pointer'
                                    }}
                                    title="Delete"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default NotificationsPage;
