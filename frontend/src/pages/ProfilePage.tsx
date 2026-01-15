import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { getProfile, updateProfile, changePassword } from '../services/profile.service';
import { useAuth } from '../context/auth.context';
import { User, Mail, Phone, Lock, Save } from 'lucide-react';
import toast from 'react-hot-toast';

const ProfilePage: React.FC = () => {
    const { user } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [showPasswordForm, setShowPasswordForm] = useState(false);

    const profileForm = useFormik({
        initialValues: {
            full_name: user?.full_name || '',
            email: user?.email || '',
            phone: user?.phone || '',
        },
        validationSchema: Yup.object({
            full_name: Yup.string().required('Required'),
            email: Yup.string().email('Invalid email').required('Required'),
            phone: Yup.string().required('Required'),
        }),
        onSubmit: async (values) => {
            try {
                await updateProfile(values);
                toast.success('Profile updated successfully!');
                setIsEditing(false);
                // Refresh user data
                window.location.reload();
            } catch (error: any) {
                toast.error(error.response?.data?.message || 'Failed to update profile');
            }
        },
    });

    const passwordForm = useFormik({
        initialValues: {
            current_password: '',
            new_password: '',
            confirm_password: '',
        },
        validationSchema: Yup.object({
            current_password: Yup.string().required('Required'),
            new_password: Yup.string().min(6, 'Must be at least 6 characters').required('Required'),
            confirm_password: Yup.string()
                .oneOf([Yup.ref('new_password')], 'Passwords must match')
                .required('Required'),
        }),
        onSubmit: async (values) => {
            try {
                await changePassword({
                    current_password: values.current_password,
                    new_password: values.new_password,
                });
                toast.success('Password changed successfully!');
                setShowPasswordForm(false);
                passwordForm.resetForm();
            } catch (error: any) {
                toast.error(error.response?.data?.message || 'Failed to change password');
            }
        },
    });

    const inputStyle = {
        width: '100%',
        padding: '0.75rem',
        border: '1px solid #e2e8f0',
        borderRadius: '8px',
        outline: 'none',
        fontSize: '1rem'
    };

    const labelStyle = {
        display: 'block',
        marginBottom: '0.5rem',
        fontWeight: 500,
        color: '#4a5568'
    };

    return (
        <div>
            <h1 style={{marginBottom: '2rem'}}>My Profile</h1>

            <div style={{display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem'}}>
                {/* Profile Card */}
                <div style={{background: 'white', padding: '2rem', borderRadius: '12px', height: 'fit-content'}}>
                    <div style={{textAlign: 'center'}}>
                        <div style={{
                            width: '120px',
                            height: '120px',
                            borderRadius: '50%',
                            background: '#4299e1',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '3rem',
                            fontWeight: 'bold',
                            margin: '0 auto 1rem'
                        }}>
                            {user?.full_name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <h2 style={{margin: '0 0 0.5rem 0'}}>{user?.full_name}</h2>
                        <p style={{color: '#718096', margin: '0 0 1rem 0'}}>{user?.email}</p>
                        <span style={{
                            padding: '0.5rem 1rem',
                            background: '#ebf8ff',
                            color: '#2b6cb0',
                            borderRadius: '12px',
                            fontSize: '0.85rem',
                            fontWeight: 600
                        }}>
                            {user?.user_type}
                        </span>
                    </div>
                </div>

                {/* Profile Details */}
                <div>
                    {/* Personal Information */}
                    <div style={{background: 'white', padding: '2rem', borderRadius: '12px', marginBottom: '1.5rem'}}>
                        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem'}}>
                            <h3 style={{margin: 0}}>Personal Information</h3>
                            {!isEditing ? (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    style={{
                                        padding: '0.5rem 1rem',
                                        background: '#ebf8ff',
                                        color: '#2b6cb0',
                                        border: 'none',
                                        borderRadius: '6px',
                                        cursor: 'pointer',
                                        fontWeight: 600
                                    }}
                                >
                                    Edit Profile
                                </button>
                            ) : (
                                <button
                                    onClick={() => {
                                        setIsEditing(false);
                                        profileForm.resetForm();
                                    }}
                                    style={{
                                        padding: '0.5rem 1rem',
                                        background: '#fff5f5',
                                        color: '#e53e3e',
                                        border: 'none',
                                        borderRadius: '6px',
                                        cursor: 'pointer',
                                        fontWeight: 600
                                    }}
                                >
                                    Cancel
                                </button>
                            )}
                        </div>

                        <form onSubmit={profileForm.handleSubmit}>
                            <div style={{marginBottom: '1.5rem'}}>
                                <label style={labelStyle}>
                                    <User size={16} style={{display: 'inline', marginRight: '0.5rem'}} />
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    {...profileForm.getFieldProps('full_name')}
                                    disabled={!isEditing}
                                    style={{...inputStyle, background: isEditing ? 'white' : '#f7fafc'}}
                                />
                                {profileForm.touched.full_name && profileForm.errors.full_name && (
                                    <div style={{color: '#e53e3e', fontSize: '0.85rem', marginTop: '0.25rem'}}>
                                        {profileForm.errors.full_name}
                                    </div>
                                )}
                            </div>

                            <div style={{marginBottom: '1.5rem'}}>
                                <label style={labelStyle}>
                                    <Mail size={16} style={{display: 'inline', marginRight: '0.5rem'}} />
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    {...profileForm.getFieldProps('email')}
                                    disabled={!isEditing}
                                    style={{...inputStyle, background: isEditing ? 'white' : '#f7fafc'}}
                                />
                                {profileForm.touched.email && profileForm.errors.email && (
                                    <div style={{color: '#e53e3e', fontSize: '0.85rem', marginTop: '0.25rem'}}>
                                        {profileForm.errors.email}
                                    </div>
                                )}
                            </div>

                            <div style={{marginBottom: '1.5rem'}}>
                                <label style={labelStyle}>
                                    <Phone size={16} style={{display: 'inline', marginRight: '0.5rem'}} />
                                    Phone Number
                                </label>
                                <input
                                    type="text"
                                    {...profileForm.getFieldProps('phone')}
                                    disabled={!isEditing}
                                    style={{...inputStyle, background: isEditing ? 'white' : '#f7fafc'}}
                                />
                                {profileForm.touched.phone && profileForm.errors.phone && (
                                    <div style={{color: '#e53e3e', fontSize: '0.85rem', marginTop: '0.25rem'}}>
                                        {profileForm.errors.phone}
                                    </div>
                                )}
                            </div>

                            {isEditing && (
                                <button
                                    type="submit"
                                    style={{
                                        width: '100%',
                                        padding: '0.875rem',
                                        background: '#3182ce',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '8px',
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '0.5rem'
                                    }}
                                >
                                    <Save size={18} /> Save Changes
                                </button>
                            )}
                        </form>
                    </div>

                    {/* Change Password */}
                    <div style={{background: 'white', padding: '2rem', borderRadius: '12px'}}>
                        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem'}}>
                            <h3 style={{margin: 0}}>Security</h3>
                            {!showPasswordForm && (
                                <button
                                    onClick={() => setShowPasswordForm(true)}
                                    style={{
                                        padding: '0.5rem 1rem',
                                        background: '#ebf8ff',
                                        color: '#2b6cb0',
                                        border: 'none',
                                        borderRadius: '6px',
                                        cursor: 'pointer',
                                        fontWeight: 600
                                    }}
                                >
                                    Change Password
                                </button>
                            )}
                        </div>

                        {showPasswordForm ? (
                            <form onSubmit={passwordForm.handleSubmit}>
                                <div style={{marginBottom: '1rem'}}>
                                    <label style={labelStyle}>Current Password</label>
                                    <input
                                        type="password"
                                        {...passwordForm.getFieldProps('current_password')}
                                        style={inputStyle}
                                    />
                                    {passwordForm.touched.current_password && passwordForm.errors.current_password && (
                                        <div style={{color: '#e53e3e', fontSize: '0.85rem', marginTop: '0.25rem'}}>
                                            {passwordForm.errors.current_password}
                                        </div>
                                    )}
                                </div>

                                <div style={{marginBottom: '1rem'}}>
                                    <label style={labelStyle}>New Password</label>
                                    <input
                                        type="password"
                                        {...passwordForm.getFieldProps('new_password')}
                                        style={inputStyle}
                                    />
                                    {passwordForm.touched.new_password && passwordForm.errors.new_password && (
                                        <div style={{color: '#e53e3e', fontSize: '0.85rem', marginTop: '0.25rem'}}>
                                            {passwordForm.errors.new_password}
                                        </div>
                                    )}
                                </div>

                                <div style={{marginBottom: '1.5rem'}}>
                                    <label style={labelStyle}>Confirm New Password</label>
                                    <input
                                        type="password"
                                        {...passwordForm.getFieldProps('confirm_password')}
                                        style={inputStyle}
                                    />
                                    {passwordForm.touched.confirm_password && passwordForm.errors.confirm_password && (
                                        <div style={{color: '#e53e3e', fontSize: '0.85rem', marginTop: '0.25rem'}}>
                                            {passwordForm.errors.confirm_password}
                                        </div>
                                    )}
                                </div>

                                <div style={{display: 'flex', gap: '1rem'}}>
                                    <button
                                        type="submit"
                                        style={{
                                            flex: 1,
                                            padding: '0.875rem',
                                            background: '#3182ce',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '8px',
                                            fontWeight: 600,
                                            cursor: 'pointer'
                                        }}
                                    >
                                        Update Password
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowPasswordForm(false);
                                            passwordForm.resetForm();
                                        }}
                                        style={{
                                            flex: 1,
                                            padding: '0.875rem',
                                            background: '#f7fafc',
                                            color: '#4a5568',
                                            border: 'none',
                                            borderRadius: '8px',
                                            fontWeight: 600,
                                            cursor: 'pointer'
                                        }}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <p style={{color: '#718096', margin: 0}}>
                                <Lock size={16} style={{display: 'inline', marginRight: '0.5rem'}} />
                                Keep your account secure by using a strong password
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
