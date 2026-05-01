'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import { USER_ROLES } from '../../../utils/constants';
import { validateSignup } from '../../../utils/validators';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import styles from '../auth.module.css';

const SignupPage = () => {
  const { signup } = useAuth();
  const router = useRouter();
  const [role, setRole] = useState(USER_ROLES.STUDENT);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    // Lecturer only fields
    specialty: '',
    phone: '',
    institution: ''
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
    
    const userData = role === USER_ROLES.LECTURER
      ? {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          profilePicture: '', // Empty - will use default avatar
          specialty: formData.specialty,
          phone: formData.phone,
          institution: formData.institution
        }
      : {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          profilePicture: ''
        };

    const validation = validateSignup(userData, role);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setLoading(true);
    const result = await signup(userData, role);
    setLoading(false);

    if (!result.success) {
      setServerError(result.error);
    } else {
      // Redirect to profile setup page instead of dashboard
      router.push('/profile-setup');
    }
  };

  const isLecturer = role === USER_ROLES.LECTURER;

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Create Account</h1>
        <p className={styles.subtitle}>Join Bookring today</p>

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
            label="Full Name"
            name="name"
            placeholder="Your full name"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
            required
          />

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
            placeholder="•••••• (min 6 characters)"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            required
          />

          {isLecturer && (
            <>
              <Input
                label="Specialty"
                name="specialty"
                placeholder="e.g., Computer Science"
                value={formData.specialty}
                onChange={handleChange}
                error={errors.specialty}
                required
              />

              <Input
                label="Phone Number"
                name="phone"
                type="tel"
                placeholder="+1234567890"
                value={formData.phone}
                onChange={handleChange}
                error={errors.phone}
              />

              <Input
                label="Institution"
                name="institution"
                placeholder="University Name"
                value={formData.institution}
                onChange={handleChange}
                error={errors.institution}
                required
              />
            </>
          )}

          <Button type="submit" variant="primary" fullWidth disabled={loading}>
            {loading ? 'Creating account...' : 'Sign Up'}
          </Button>
        </form>

        <p className={styles.footer}>
          Already have an account?{' '}
          <Link href="/login" className={styles.link}>
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;