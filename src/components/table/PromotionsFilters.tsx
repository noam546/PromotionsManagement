import React, { useState, useCallback, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { GetPromotionsOptions } from '../../api/promotion';

interface PromotionsFiltersProps {
  onFiltersChange: (filters: Omit<GetPromotionsOptions, 'page' | 'limit'>) => void;
  isLoading?: boolean;
}

const sortableFields = [
  { value: 'promotionName', label: 'Promotion Name' },
  { value: 'type', label: 'Type' },
  { value: 'startDate', label: 'Start Date' },
  { value: 'endDate', label: 'End Date' },
  { value: 'userGroupName', label: 'User Group' },
];

const promotionTypes = [
  { value: 'discount', label: 'Discount' },
  { value: 'bonus', label: 'Bonus' },
  { value: 'free_spin', label: 'Free Spin' },
  { value: 'cashback', label: 'Cashback' },
];

export default function PromotionsFilters({ onFiltersChange, isLoading = false }: PromotionsFiltersProps) {
  const [searchParams] = useSearchParams();
  
  // Initialize state from URL params
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [type, setType] = useState(searchParams.get('type') || '');
  const [startDate, setStartDate] = useState(searchParams.get('startDate') || '');
  const [endDate, setEndDate] = useState(searchParams.get('endDate') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>(
    (searchParams.get('sortOrder') as 'asc' | 'desc') || 'desc'
  );

  const updateFilters = useCallback(() => {
    const filters = {
      search: search || undefined,
      type: type || undefined,
      userGroupName: undefined, // Removed separate user group filter
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      sortBy: sortBy || undefined,
      sortOrder: sortOrder,
    };
    onFiltersChange(filters);
  }, [search, type, startDate, endDate, sortBy, sortOrder, onFiltersChange]);

  const clearFilters = useCallback(() => {
    setSearch('');
    setType('');
    setStartDate('');
    setEndDate('');
    setSortBy('createdAt');
    setSortOrder('desc');
    onFiltersChange({
      search: undefined,
      type: undefined,
      startDate: undefined,
      endDate: undefined,
      sortBy: 'createdAt',
      sortOrder: 'desc',
    });
  }, [onFiltersChange]);

  // Update filters whenever any value changes
  useEffect(() => {
    updateFilters();
  }, [updateFilters]);

  // Sync with URL params when they change (e.g., browser back/forward)
  useEffect(() => {
    setSearch(searchParams.get('search') || '');
    setType(searchParams.get('type') || '');
    setStartDate(searchParams.get('startDate') || '');
    setEndDate(searchParams.get('endDate') || '');
    setSortBy(searchParams.get('sortBy') || 'createdAt');
    setSortOrder((searchParams.get('sortOrder') as 'asc' | 'desc') || 'desc');
  }, [searchParams]);

  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.1)',
      borderRadius: '8px',
      padding: '20px',
      marginBottom: '20px',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
    }}>
      <h3 style={{ 
        margin: '0 0 20px 0', 
        color: '#fff', 
        fontSize: '18px',
        fontWeight: '500'
      }}>
        Search & Filters
      </h3>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '15px',
        marginBottom: '20px'
      }}>
        {/* Combined Search Input */}
        <div>
          <label style={{ 
            display: 'block', 
            marginBottom: '5px', 
            color: '#fff', 
            fontSize: '12px',
            fontWeight: '500'
          }}>
            Search Promotions & User Groups
          </label>
          <input
            type="text"
            placeholder="Search by promotion name or user group..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '4px',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              background: 'rgba(255, 255, 255, 0.1)',
              color: '#fff',
              fontSize: '14px',
            }}
            disabled={isLoading}
          />
        </div>

        {/* Type Filter */}
        <div>
          <label style={{ 
            display: 'block', 
            marginBottom: '5px', 
            color: '#fff', 
            fontSize: '12px',
            fontWeight: '500'
          }}>
            Type
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '4px',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              background: 'rgba(255, 255, 255, 0.1)',
              color: '#fff',
              fontSize: '14px',
            }}
            disabled={isLoading}
          >
            <option value="">All Types</option>
            {promotionTypes.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* Start Date */}
        <div>
          <label style={{ 
            display: 'block', 
            marginBottom: '5px', 
            color: '#fff', 
            fontSize: '12px',
            fontWeight: '500'
          }}>
            Start Date
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '4px',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              background: 'rgba(255, 255, 255, 0.1)',
              color: '#fff',
              fontSize: '14px',
            }}
            disabled={isLoading}
          />
        </div>

        {/* End Date */}
        <div>
          <label style={{ 
            display: 'block', 
            marginBottom: '5px', 
            color: '#fff', 
            fontSize: '12px',
            fontWeight: '500'
          }}>
            End Date
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '4px',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              background: 'rgba(255, 255, 255, 0.1)',
              color: '#fff',
              fontSize: '14px',
            }}
            disabled={isLoading}
          />
        </div>

        {/* Sort By */}
        <div>
          <label style={{ 
            display: 'block', 
            marginBottom: '5px', 
            color: '#fff', 
            fontSize: '12px',
            fontWeight: '500'
          }}>
            Sort By
          </label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '4px',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              background: 'rgba(255, 255, 255, 0.1)',
              color: '#fff',
              fontSize: '14px',
            }}
            disabled={isLoading}
          >
            {sortableFields.map(field => (
              <option key={field.value} value={field.value}>
                {field.label}
              </option>
            ))}
          </select>
        </div>

        {/* Sort Order */}
        <div>
          <label style={{ 
            display: 'block', 
            marginBottom: '5px', 
            color: '#fff', 
            fontSize: '12px',
            fontWeight: '500'
          }}>
            Sort Order
          </label>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '4px',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              background: 'rgba(255, 255, 255, 0.1)',
              color: '#fff',
              fontSize: '14px',
            }}
            disabled={isLoading}
          >
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{
        display: 'flex',
        gap: '10px',
        justifyContent: 'flex-end'
      }}>
        <button
          onClick={clearFilters}
          disabled={isLoading}
          style={{
            padding: '10px 20px',
            borderRadius: '4px',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            background: 'rgba(255, 255, 255, 0.1)',
            color: '#fff',
            fontSize: '14px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
          }}
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
} 