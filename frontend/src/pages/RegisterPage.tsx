import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import { useAuth } from '../context/auth.context';
import styles from '../styles/Auth.module.css';
import { Link, useNavigate } from 'react-router-dom';

const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      phone: '',
      user_type: 'ENTREPRENEUR', // Default
      password: '',
      confirmPassword: ''
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Required'),
      email: Yup.string().email('Invalid email').required('Required'),
      phone: Yup.string().required('Required'),
      user_type: Yup.string().required('Required'),
      password: Yup.string().min(6, 'Must be 6 chars or more').required('Required'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password')], 'Passwords must match')
        .required('Required'),
    }),
    onSubmit: async (values) => {
      try {
        await register(values.email, values.password, values.name, values.phone, values.user_type);
        toast.success('Registration successful!');
        navigate('/');
      } catch (err: any) {
        toast.error(err.response?.data?.message || 'Registration failed');
      }
    },
  });

  return (
    <div className={styles.container}>
      <div className={styles.card} style={{maxWidth: '500px'}}>
        <h1 className={styles.title}>Create Account</h1>
        <p className={styles.subtitle}>Join the GoSEWA community</p>

        <form onSubmit={formik.handleSubmit}>
            <div className={styles.formGroup}>
            <label className={styles.label}>Full Name</label>
            <input type="text" className={styles.input} {...formik.getFieldProps('name')} />
            {formik.touched.name && formik.errors.name && <div className={styles.error}>{formik.errors.name}</div>}
          </div>

          <div style={{display: 'flex', gap: '1rem'}}>
            <div className={styles.formGroup} style={{flex: 1}}>
                <label className={styles.label}>Email Address</label>
                <input type="email" className={styles.input} {...formik.getFieldProps('email')} />
                {formik.touched.email && formik.errors.email && <div className={styles.error}>{formik.errors.email}</div>}
            </div>
            <div className={styles.formGroup} style={{flex: 1}}>
                <label className={styles.label}>Phone Number</label>
                <input type="text" className={styles.input} {...formik.getFieldProps('phone')} />
                {formik.touched.phone && formik.errors.phone && <div className={styles.error}>{formik.errors.phone}</div>}
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>I am a:</label>
            <select className={styles.input} {...formik.getFieldProps('user_type')}>
                <option value="ENTREPRENEUR">Entrepreneur</option>
                <option value="GAUSHALA">Gaushala</option>
                <option value="TRANSPORTER">Transporter</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Password</label>
            <input type="password" className={styles.input} {...formik.getFieldProps('password')} />
            {formik.touched.password && formik.errors.password && <div className={styles.error}>{formik.errors.password}</div>}
          </div>
          
          <div className={styles.formGroup}>
            <label className={styles.label}>Confirm Password</label>
            <input type="password" className={styles.input} {...formik.getFieldProps('confirmPassword')} />
            {formik.touched.confirmPassword && formik.errors.confirmPassword && <div className={styles.error}>{formik.errors.confirmPassword}</div>}
          </div>

          <button type="submit" className={styles.button}>Sign Up</button>
        </form>

        <div className={styles.link}>
            Already have an account? <Link to="/login">Sign In</Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
