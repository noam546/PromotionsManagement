import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { GetPromotionsOptions } from '../../api/promotion';

// CSS for spinning animation
const spinAnimation = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

interface PromotionsFiltersProps {
  onFiltersChange: (filters: Omit<GetPromotionsOptions, 'page' | 'limit'>) => void;
  isLoading?: boolean;
}

const promotionTypes = [
  { value: 'common', label: 'Common' },
  { value: 'epic', label: 'Epic' },
  { value: 'basic', label: 'Basic' },
];

export default function PromotionsFilters({ onFiltersChange, isLoading = false }: PromotionsFiltersProps) {
  const [searchParams] = useSearchParams();
  
  // Initialize state from URL params
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [type, setType] = useState(searchParams.get('type') || '');
  const [startDate, setStartDate] = useState(searchParams.get('startDate') || '');
  const [endDate, setEndDate] = useState(searchParams.get('endDate') || '');

  const applyFilters = useCallback(() => {
    const filters = {
      search: search || undefined,
      type: type || undefined,
      userGroupName: undefined, // Removed separate user group filter
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      sortBy: undefined, // Will be handled by table headers
      sortOrder: undefined, // Will be handled by table headers
    };
    onFiltersChange(filters);
  }, [search, type, startDate, endDate, onFiltersChange]);

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

  // Sync with URL params when they change (e.g., browser back/forward)
  useEffect(() => {
    setSearch(searchParams.get('search') || '');
    setType(searchParams.get('type') || '');
    setStartDate(searchParams.get('startDate') || '');
    setEndDate(searchParams.get('endDate') || '');
  }, [searchParams]);

  return (
    <>
      <style>{spinAnimation}</style>
      <div style={{
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '8px',
        padding: '20px',
        marginBottom: '20px',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginBottom: '20px'
        }}>
          <h3 style={{ 
            margin: '0', 
            color: '#fff', 
            fontSize: '18px',
            fontWeight: '500'
          }}>
            Search & Filters
          </h3>
          {isLoading && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '4px 12px',
              borderRadius: '20px',
              background: 'rgba(255, 255, 255, 0.2)',
              fontSize: '12px',
              color: '#fff',
              fontWeight: '500'
            }}>
              <div style={{
                width: '12px',
                height: '12px',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                borderTop: '2px solid #fff',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }} />
              Loading...
            </div>
          )}
        </div>
        
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
          <button
            onClick={applyFilters}
            disabled={isLoading}
            style={{
              padding: '10px 20px',
              borderRadius: '4px',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              background: 'rgba(255, 255, 255, 0.2)',
              color: '#fff',
              fontSize: '14px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              fontWeight: '500',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
            }}
          >
            Apply Filters
          </button>
        </div>
      </div>
    </>
  );
} 