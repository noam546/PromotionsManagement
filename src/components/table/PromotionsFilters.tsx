import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { GetPromotionsOptions } from '../../api/promotion';

interface PromotionsFiltersProps {
  onFiltersChange: (filters: Omit<GetPromotionsOptions, 'page' | 'limit'>) => void;
  isLoading?: boolean;
}

const promotionTypes = [
  { value: 'common', label: 'Common' },
  { value: 'epic', label: 'Epic' },
  { value: 'basic', label: 'Basic' },
];

// Debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default function PromotionsFilters({ onFiltersChange, isLoading = false }: PromotionsFiltersProps) {
  const [searchParams] = useSearchParams();
  
  // Initialize state from URL params
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [type, setType] = useState(searchParams.get('type') || '');
  const [startDate, setStartDate] = useState(searchParams.get('startDate') || '');
  const [endDate, setEndDate] = useState(searchParams.get('endDate') || '');

  // Debounce search input with 1000ms delay
  const debouncedSearch = useDebounce(search, 1000);

  const updateFilters = useCallback(() => {
    const filters = {
      search: debouncedSearch || undefined,
      type: type || undefined,
      userGroupName: undefined, // Removed separate user group filter
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      sortBy: undefined, // Will be handled by table headers
      sortOrder: undefined, // Will be handled by table headers
    };
    onFiltersChange(filters);
  }, [debouncedSearch, type, startDate, endDate, onFiltersChange]);

  const clearFilters = useCallback(() => {
    setSearch('');
    setType('');
    setStartDate('');
    setEndDate('');
    onFiltersChange({
      search: undefined,
      type: undefined,
      startDate: undefined,
      endDate: undefined,
      sortBy: undefined,
      sortOrder: undefined,
    });
  }, [onFiltersChange]);

  // Update filters whenever any value changes (except search - uses debounced value)
  useEffect(() => {
    updateFilters();
  }, [updateFilters]);

  // Sync with URL params when they change (e.g., browser back/forward)
  useEffect(() => {
    setSearch(searchParams.get('search') || '');
    setType(searchParams.get('type') || '');
    setStartDate(searchParams.get('startDate') || '');
    setEndDate(searchParams.get('endDate') || '');
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
        display: 'flex',
        flexDirection: 'row',
        gap: '15px',
        marginBottom: '20px',
        flexWrap: 'wrap',
        alignItems: 'flex-end'
      }}>
        {/* Combined Search Input */}
        <div style={{ flex: '1', minWidth: '200px' }}>
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
          {search !== debouncedSearch && (
            <div style={{
              fontSize: '11px',
              color: 'rgba(255, 255, 255, 0.7)',
              marginTop: '4px',
              fontStyle: 'italic'
            }}>
              Typing... (search will update in a moment)
            </div>
          )}
        </div>

        {/* Type Filter */}
        <div style={{ flex: '0 0 150px' }}>
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
        <div style={{ flex: '0 0 150px' }}>
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
        <div style={{ flex: '0 0 150px' }}>
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