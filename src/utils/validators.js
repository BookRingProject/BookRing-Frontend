// Email, password, form validation rules

export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const validatePassword = (password) => {
  return password.length >= 6;
};

export const validateName = (name) => {
  return name.trim().length >= 2;
};

export const validatePhone = (phone) => {
  const regex = /^[0-9+\-\s()]{10,15}$/;
  return regex.test(phone);
};

export const validateSignup = (data, role) => {
  const errors = {};
  
  if (!validateName(data.name)) {
    errors.name = 'Name must be at least 2 characters';
  }
  
  if (!validateEmail(data.email)) {
    errors.email = 'Please enter a valid email address';
  }
  
  if (!validatePassword(data.password)) {
    errors.password = 'Password must be at least 6 characters';
  }
  
  if (role === 'lecturer') {
    if (!data.specialty || data.specialty.trim() === '') {
      errors.specialty = 'Specialty is required';
    }
    if (!data.institution || data.institution.trim() === '') {
      errors.institution = 'Institution is required';
    }
    if (!validatePhone(data.phone)) {
      errors.phone = 'Please enter a valid phone number';
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateLogin = (data) => {
  const errors = {};
  
  if (!validateEmail(data.email)) {
    errors.email = 'Please enter a valid email address';
  }
  
  if (!validatePassword(data.password)) {
    errors.password = 'Password must be at least 6 characters';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};