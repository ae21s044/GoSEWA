import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import { useAuth } from '../context/auth.context';
import styles from '../styles/Auth.module.css';
import { Link, useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email address').required('Required'),
      password: Yup.string().required('Required'),
    }),
    onSubmit: async (values) => {
      try {
        await login(values.email, values.password);
        toast.success('Login successful!');
        navigate('/'); // Redirect to Dashboard
      } catch (err: any) {
        toast.error(err.response?.data?.message || 'Login failed');
      }
    },
  });

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Welcome Back</h1>
        <p className={styles.subtitle}>Log in to access your GoSEWA dashboard</p>

        <form onSubmit={formik.handleSubmit}>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              className={styles.input}
              {...formik.getFieldProps('email')}
            />
            {formik.touched.email && formik.errors.email ? (
              <div className={styles.error}>{formik.errors.email}</div>
            ) : null}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              className={styles.input}
              {...formik.getFieldProps('password')}
            />
            {formik.touched.password && formik.errors.password ? (
              <div className={styles.error}>{formik.errors.password}</div>
            ) : null}
          </div>

          <button type="submit" className={styles.button}>Sign In</button>
        </form>

        <div className={styles.link}>
            Don't have an account? <Link to="/register">Sign Up</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
