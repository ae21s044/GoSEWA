import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/auth.context';
import { 
    LayoutDashboard, 
    User, 
    Package, 
    ShoppingCart, 
    LogOut,
    Menu,
    X,
    BarChart2
} from 'lucide-react';
import styles from './DashboardLayout.module.css';

const DashboardLayout: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isMobileOpen, setIsMobileOpen] = React.useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const userType = user?.user_type || 'ENTREPRENEUR';

    const navItems = [
        { label: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
        { label: 'Marketplace', path: '/marketplace', icon: <ShoppingCart size={20} /> },
        { label: 'Profile', path: '/profile', icon: <User size={20} /> },
        // Entrepreneur Specific
        ...(userType === 'ENTREPRENEUR' ? [
            { label: 'Inventory', path: '/inventory', icon: <Package size={20} /> },
            { label: 'Orders', path: '/orders', icon: <ShoppingCart size={20} /> },
            { label: 'Analytics', path: '/analytics', icon: <BarChart2 size={20} /> },
        ] : []),
        // Gaushala Specific
        ...(userType === 'GAUSHALA' ? [
            { label: 'Livestock', path: '/livestock', icon: <Package size={20} /> }, // Placeholder icon
            { label: 'Waste Log', path: '/waste', icon: <Package size={20} /> }, 
            { label: 'Production', path: '/production', icon: <Package size={20} /> },
        ] : []),
        // Admin Specific
        ...(userType === 'ADMIN' ? [
            { label: 'Users', path: '/admin/users', icon: <User size={20} /> },
            { label: 'System', path: '/admin/system', icon: <BarChart2 size={20} /> },
        ] : [])
    ];

    return (
        <div className={styles.container}>
            {/* Sidebar */}
            <aside className={`${styles.sidebar} ${isMobileOpen ? styles.mobileOpen : ''}`}>
                <div className={styles.logoContainer}>
                    <span className={styles.logoText}>GoSEWA</span>
                    <button className={styles.closeBtn} onClick={() => setIsMobileOpen(false)}>
                        <X size={24} />
                    </button>
                </div>
                
                <nav className={styles.nav}>
                    {navItems.map((item) => (
                        <Link 
                            key={item.path} 
                            to={item.path} 
                            className={`${styles.navItem} ${location.pathname === item.path ? styles.active : ''}`}
                            onClick={() => setIsMobileOpen(false)}
                        >
                            {item.icon}
                            <span>{item.label}</span>
                        </Link>
                    ))}
                </nav>

                <div className={styles.footer}>
                    <div className={styles.userInfo}>
                        <div className={styles.avatar}>{user?.email?.charAt(0).toUpperCase()}</div>
                        <div className={styles.userDetails}>
                            <span className={styles.userName}>{user?.full_name || 'User'}</span>
                            <span className={styles.userRole}>{userType}</span>
                        </div>
                    </div>
                    <button onClick={handleLogout} className={styles.logoutBtn}>
                        <LogOut size={20} />
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className={styles.main}>
                <header className={styles.header}>
                    <button className={styles.menuBtn} onClick={() => setIsMobileOpen(true)}>
                        <Menu size={24} />
                    </button>
                    <h2 className={styles.pageTitle}>
                        {navItems.find(i => i.path === location.pathname)?.label || 'Dashboard'}
                    </h2>
                </header>
                
                <div className={styles.content}>
                    <Outlet />
                </div>
            </main>

            {isMobileOpen && <div className={styles.overlay} onClick={() => setIsMobileOpen(false)} />}
        </div>
    );
};

export default DashboardLayout;
