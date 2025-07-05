import { useState, useCallback, useEffect} from 'react';
import { useSearchParams } from 'react-router-dom';
import { GetPromotionsOptions } from '../../api/promotion';
import styles from './PromotionsFilters.module.scss';

interface PromotionsFiltersProps {
  onFiltersChange: (filters: Omit<GetPromotionsOptions, 'page' | 'limit'>) => void;
}

const promotionTypes = [
  { value: 'common', label: 'Common' },
  { value: 'epic', label: 'Epic' },
  { value: 'basic', label: 'Basic' },
];

export default function PromotionsFilters({ onFiltersChange }: PromotionsFiltersProps) {
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
      userGroupName: undefined,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      sortBy: undefined,
      sortOrder: undefined,
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

  useEffect(() => {
    setSearch(searchParams.get('search') || '');
    setType(searchParams.get('type') || '');
    setStartDate(searchParams.get('startDate') || '');
    setEndDate(searchParams.get('endDate') || '');
  }, [searchParams]);

  return (
        <div className={styles.container}>
          <div className={styles.searchInput}>
            <input
              type="text"
              placeholder="Search by promotion name or user group..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={styles.input}
            />
          </div>

          {/* Type Filter */}
          <div className={styles.typeFilter}>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className={styles.input}
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
          <div className={styles.startDate}>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className={styles.input}
            />
          </div>

          {/* End Date */}
          <div className={styles.endDate}>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className={styles.input}
            />
          </div>

        {/* Action Buttons */}
        <div className={styles.actions}>
        <button
            onClick={applyFilters}
            className={styles.primaryButton}
          >
            Apply
          </button>
          <button
            onClick={clearFilters}
            className={styles.button}
          >
            Clear
          </button>
          
        </div>
      </div>
  );
} 