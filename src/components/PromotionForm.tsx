import React, { useState, useEffect } from 'react';
import { Promotion } from '../api/types/promotionType';

interface PromotionFormProps {
  promotion?: Promotion;
  onSubmit: (promotion: Omit<Promotion, 'id'>) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const PromotionForm: React.FC<PromotionFormProps> = ({
  promotion,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState({
    promotionName: '',
    type: '',
    startDate: '',
    endDate: '',
    userGroupName: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isEditMode = !!promotion;

  useEffect(() => {
    if (promotion) {
      setFormData({
        promotionName: promotion.promotionName,
        type: promotion.type,
        startDate: promotion.startDate.split('T')[0], // Convert ISO string to date input format
        endDate: promotion.endDate.split('T')[0],
        userGroupName: promotion.userGroupName,
      });
    }
  }, [promotion]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.promotionName.trim()) {
      newErrors.promotionName = 'Promotion name is required';
    }

    if (!formData.type.trim()) {
      newErrors.type = 'Type is required';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }

    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    }

    if (formData.startDate && formData.endDate && formData.startDate >= formData.endDate) {
      newErrors.endDate = 'End date must be after start date';
    }

    if (!formData.userGroupName.trim()) {
      newErrors.userGroupName = 'User group name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit({
        promotionName: formData.promotionName.trim(),
        type: formData.type.trim(),
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
        userGroupName: formData.userGroupName.trim(),
      });
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="promotion-form">
      <h2>{isEditMode ? 'Edit Promotion' : 'Create New Promotion'}</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="promotionName">Promotion Name *</label>
          <input
            type="text"
            id="promotionName"
            value={formData.promotionName}
            onChange={(e) => handleInputChange('promotionName', e.target.value)}
            className={errors.promotionName ? 'error' : ''}
            disabled={isLoading}
          />
          {errors.promotionName && <span className="error-message">{errors.promotionName}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="type">Type *</label>
          <select
            id="type"
            value={formData.type}
            onChange={(e) => handleInputChange('type', e.target.value)}
            className={errors.type ? 'error' : ''}
            disabled={isLoading}
          >
            <option value="">Select a type</option>
            <option value="discount">Discount</option>
            <option value="bonus">Bonus</option>
            <option value="freebie">Freebie</option>
            <option value="cashback">Cashback</option>
          </select>
          {errors.type && <span className="error-message">{errors.type}</span>}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="startDate">Start Date *</label>
            <input
              type="date"
              id="startDate"
              value={formData.startDate}
              onChange={(e) => handleInputChange('startDate', e.target.value)}
              className={errors.startDate ? 'error' : ''}
              disabled={isLoading}
            />
            {errors.startDate && <span className="error-message">{errors.startDate}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="endDate">End Date *</label>
            <input
              type="date"
              id="endDate"
              value={formData.endDate}
              onChange={(e) => handleInputChange('endDate', e.target.value)}
              className={errors.endDate ? 'error' : ''}
              disabled={isLoading}
            />
            {errors.endDate && <span className="error-message">{errors.endDate}</span>}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="userGroupName">User Group Name *</label>
          <input
            type="text"
            id="userGroupName"
            value={formData.userGroupName}
            onChange={(e) => handleInputChange('userGroupName', e.target.value)}
            className={errors.userGroupName ? 'error' : ''}
            disabled={isLoading}
          />
          {errors.userGroupName && <span className="error-message">{errors.userGroupName}</span>}
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary"
          >
            {isLoading ? 'Saving...' : (isEditMode ? 'Update' : 'Create')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PromotionForm; 