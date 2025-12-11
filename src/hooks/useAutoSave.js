import { useEffect, useRef } from 'react';

/**
 * Auto-save hook for forms
 * Saves form data to localStorage automatically
 * 
 * @param {Object} formData - Form data to save
 * @param {string} key - localStorage key
 * @param {number} debounceMs - Debounce delay in milliseconds
 */
export const useAutoSave = (formData, key, debounceMs = 1000) => {
  const timeoutRef = useRef(null);
  const isInitialMount = useRef(true);

  useEffect(() => {
    // Skip auto-save on initial mount
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout
    timeoutRef.current = setTimeout(() => {
      try {
        localStorage.setItem(key, JSON.stringify(formData));
      } catch (error) {
        console.error('Failed to save draft:', error);
      }
    }, debounceMs);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [formData, key, debounceMs]);
};

/**
 * Load draft from localStorage
 * 
 * @param {string} key - localStorage key
 * @returns {Object|null} - Draft data or null
 */
export const loadDraft = (key) => {
  try {
    const draft = localStorage.getItem(key);
    return draft ? JSON.parse(draft) : null;
  } catch (error) {
    console.error('Failed to load draft:', error);
    return null;
  }
};

/**
 * Clear draft from localStorage
 * 
 * @param {string} key - localStorage key
 */
export const clearDraft = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Failed to clear draft:', error);
  }
};

