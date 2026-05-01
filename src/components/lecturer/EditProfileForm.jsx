'use client';

import React, { useState } from 'react';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import styles from './EditProfileForm.module.css';

const EditProfileForm = ({ user, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    specialty: user?.specialty || '',
    phone: user?.phone || '',
    institution: user?.institution || '',
    profilePicture: user?.profilePicture || ''
  });
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.specialty.trim()) newErrors.specialty = 'Specialty is required';
    if (!formData.institution.trim()) newErrors.institution = 'Institution is required';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setLoading(true);
    await onSubmit(formData);
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <Input
        label="Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        error={errors.name}
        required
      />
      
      <Input
        label="Email"
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        error={errors.email}
        required
      />
      
      <Input
        label="Specialty"
        name="specialty"
        value={formData.specialty}
        onChange={handleChange}
        error={errors.specialty}
        required
      />
      
      <Input
        label="Phone"
        name="phone"
        value={formData.phone}
        onChange={handleChange}
        error={errors.phone}
      />
      
      <Input
        label="Institution"
        name="institution"
        value={formData.institution}
        onChange={handleChange}
        error={errors.institution}
        required
      />
      
      <div className={styles.actions}>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" disabled={loading}>
          {loading ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </form>
  );
};

export default EditProfileForm;