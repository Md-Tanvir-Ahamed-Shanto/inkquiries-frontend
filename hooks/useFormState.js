'use client';

import { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { validationRules, getFormErrors, transformFormData } from '../utils/formValidation';

const useFormState = (formType, onSubmitCallback, initialData = {}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  // Initialize form with react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
    getValues,
  } = useForm({
    defaultValues: initialData,
    mode: 'onBlur',
  });

  // Watch form values for dirty state
  const formValues = watch();
  
  // Update dirty state when form values change
  const checkDirtyState = useCallback(() => {
    const currentValues = getValues();
    const hasChanges = Object.keys(currentValues).some(
      (key) => currentValues[key] !== initialData[key]
    );
    setIsDirty(hasChanges);
  }, [getValues, initialData]);

  // Handle form submission
  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      // Transform form data based on form type
      const transformedData = transformFormData(data, formType);
      
      // Call the submit callback with transformed data
      await onSubmitCallback(transformedData);
      
      // Reset form state
      setIsDirty(false);
      toast.success('Changes saved successfully');
    } catch (error) {
      console.error('Form submission error:', error);
      toast.error(error.message || 'Failed to save changes');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle file input change
  const handleFileChange = useCallback(
    async (fieldName, file) => {
      // Validate file
      const validationRule = validationRules[fieldName];
      if (validationRule) {
        const validationResult = validationRule.validate(file);
        if (validationResult !== true) {
          toast.error(validationResult);
          return;
        }
      }

      // Update form value
      setValue(fieldName, file);
      setIsDirty(true);
    },
    [setValue]
  );

  // Reset form to initial values
  const resetForm = useCallback(() => {
    reset(initialData);
    setIsDirty(false);
  }, [reset, initialData]);

  // Get field validation rules
  const getFieldValidation = (fieldName) => {
    return validationRules[fieldName] || {};
  };

  return {
    register,
    handleSubmit: handleSubmit(onSubmit),
    errors: getFormErrors(errors),
    isLoading,
    isDirty,
    watch,
    setValue,
    getValues,
    resetForm,
    handleFileChange,
    getFieldValidation,
  };
};

export default useFormState;