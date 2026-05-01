'use client';

import React, { useState, useRef, useEffect } from 'react';
import styles from './Dropdown.module.css';

const Dropdown = ({ trigger, options, onSelect, placeholder = 'Select an option' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (option) => {
    setSelected(option);
    setIsOpen(false);
    if (onSelect) {
      onSelect(option);
    }
  };

  return (
    <div className={styles.dropdown} ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)} className={styles.trigger}>
        {trigger ? trigger : (selected ? selected.label : placeholder)}
        <span className={`${styles.arrow} ${isOpen ? styles.open : ''}`}>▼</span>
      </div>
      {isOpen && (
        <div className={styles.menu}>
          {options.map((option, index) => (
            <div
              key={index}
              className={`${styles.option} ${
                selected?.value === option.value ? styles.selected : ''
              }`}
              onClick={() => handleSelect(option)}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;