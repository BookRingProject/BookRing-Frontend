'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../../context/AuthContext';
import { USER_ROLES } from '../../../utils/constants';
import { validateLogin } from '../../../utils/validators';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import styles from '../auth.module.css';

const LoginPage = () => {
  const { login } = useAuth();
  const [role, setRole] = useState(USER_ROLES.STUDENT);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const handleRoleToggle = (selectedRole) => {
    setRole(selectedRole);
    setErrors({});
    setServerError('');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    setServerError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validation = validateLogin(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setLoading(true);
    const result = await login(formData.email, formData.password, role);
    setLoading(false);

    if (!result.success) {
      setServerError(result.error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Welcome Back</h1>
        <p className={styles.subtitle}>Login to your Bookring account</p>

        <div className={styles.roleToggle}>
          <button
            type="button"
            className={`${styles.roleBtn} ${role === USER_ROLES.STUDENT ? styles.active : ''}`}
            onClick={() => handleRoleToggle(USER_ROLES.STUDENT)}
          >
            Student
          </button>
          <button
            type="button"
            className={`${styles.roleBtn} ${role === USER_ROLES.LECTURER ? styles.active : ''}`}
            onClick={() => handleRoleToggle(USER_ROLES.LECTURER)}
          >
            Lecturer
          </button>
        </div>

        {serverError && (
          <div className={styles.serverError}>{serverError}</div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          <Input
            label="Email"
            name="email"
            type="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            required
          />

          <Input
            label="Password"
            name="password"
            type="password"
            placeholder="••••••"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            required
          />

          <Button type="submit" variant="primary" fullWidth disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </form>

        <p className={styles.footer}>
          Don't have an account?{' '}
          <Link href="/signup" className={styles.link}>
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;