import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, useCallback, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useWebSocketTableUpdates } from '../../hooks';
import { GetPromotionsResponse, Promotion, GetPromotionsOptions } from '../../api';
import VirtualizedTable, { SortableHeader } from './VirtualizedTable';
import PromotionsFilters from './PromotionsFilters';
import { createPromotionsInfiniteQueryOptions } from '../../utils';
import { NoDataIcon } from '../Icons';
import styles from './PromotionsVirtualizedTable.module.scss';

const queryClient = new QueryClient()

// Promotion types moved from PromotionsFilters
const promotionTypes = [
  { value: 'common', label: 'Common' },
  { value: 'epic', label: 'Epic' },
  { value: 'basic', label: 'Basic' },
];

function PromotionsTableWithWebSocket() {
  useWebSocketTableUpdates();
  
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Filter state moved from PromotionsFilters
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [type, setType] = useState(searchParams.get('type') || '');
  const [startDate, setStartDate] = useState(searchParams.get('startDate') || '');
  const [endDate, setEndDate] = useState(searchParams.get('endDate') || '');
  
  const [filters, setFilters] = useState<Omit<GetPromotionsOptions, 'page' | 'limit'>>(() => ({
    search: searchParams.get('search') || undefined,
    type: searchParams.get('type') || undefined,
    userGroupName: undefined,
    startDate: searchParams.get('startDate') || undefined,
    endDate: searchParams.get('endDate') || undefined,
    sortBy: searchParams.get('sortBy') || 'createdAt',
    sortOrder: (searchParams.get('sortOrder') as 'asc' | 'desc') || 'desc',
  }));

  const updateURL = useCallback((newFilters: Omit<GetPromotionsOptions, 'page' | 'limit'>) => {
    const newSearchParams = new URLSearchParams();
    
    if (newFilters.search) newSearchParams.set('search', newFilters.search);
    if (newFilters.type) newSearchParams.set('type', newFilters.type);
    if (newFilters.startDate) newSearchParams.set('startDate', newFilters.startDate);
    if (newFilters.endDate) newSearchParams.set('endDate', newFilters.endDate);
    if (newFilters.sortBy) newSearchParams.set('sortBy', newFilters.sortBy);
    if (newFilters.sortOrder) newSearchParams.set('sortOrder', newFilters.sortOrder);
    
    setSearchParams(newSearchParams, { replace: true });
  }, [setSearchParams]);

  // Filter handlers moved from PromotionsFilters
  const applyFilters = useCallback(() => {
    const newFilters = {
      search: search || undefined,
      type: type || undefined,
      userGroupName: undefined,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      sortBy: filters.sortBy,
      sortOrder: filters.sortOrder,
    };
    setFilters(newFilters);
    updateURL(newFilters);
  }, [search, type, startDate, endDate, filters.sortBy, filters.sortOrder, updateURL]);

  const clearFilters = useCallback(() => {
    setSearch('');
    setType('');
    setStartDate('');
    setEndDate('');
    const newFilters = {
      search: undefined,
      type: undefined,
      startDate: undefined,
      endDate: undefined,
      sortBy: filters.sortBy,
      sortOrder: filters.sortOrder,
    };
    setFilters(newFilters);
    updateURL(newFilters);
  }, [filters.sortBy, filters.sortOrder, updateURL]);

  const handleSortChange = useCallback((sortBy: string, sortOrder: 'asc' | 'desc') => {
    const updatedFilters = {
      ...filters,
      sortBy,
      sortOrder,
    };
    setFilters(updatedFilters);
    updateURL(updatedFilters);
  }, [filters, updateURL]);

  useEffect(() => {
    const urlFilters = {
      search: searchParams.get('search') || undefined,
      type: searchParams.get('type') || undefined,
      userGroupName: undefined,
      startDate: searchParams.get('startDate') || undefined,
      endDate: searchParams.get('endDate') || undefined,
      sortBy: searchParams.get('sortBy') || 'createdAt',
      sortOrder: (searchParams.get('sortOrder') as 'asc' | 'desc') || 'desc',
    };
    
    setFilters(urlFilters);
    // Update local filter state from URL
    setSearch(searchParams.get('search') || '');
    setType(searchParams.get('type') || '');
    setStartDate(searchParams.get('startDate') || '');
    setEndDate(searchParams.get('endDate') || '');
  }, [searchParams]);


  const headers : SortableHeader[] = [
    { key: 'promotionName', label: 'Promotion Name', sortable: true, onSortChange: handleSortChange },
    { key: 'type', label: 'Type', sortable: true, onSortChange: handleSortChange },
    { key: 'startDate', label: 'Start Date', sortable: true, onSortChange: handleSortChange },
    { key: 'endDate', label: 'End Date', sortable: true, onSortChange: handleSortChange },
    { key: 'userGroupName', label: 'User Group Name', sortable: true, onSortChange: handleSortChange },
  ];

  const NoDataView = () => {
    return (
      <>
        <div className={styles.noDataIcon}>
          <NoDataIcon width="64" height="64" fill="currentColor" />
        </div>
        <div className={styles.noDataTitle}>
          No promotions found
        </div>
        <div className={styles.noDataMessage}>
          Try adjusting your search criteria or filters to find what you're looking for.
        </div>
      </>
    );
  };

  return (
    <>
      <div className={styles.header}>Promotions</div>
      <PromotionsFilters 
        search={search}
        setSearch={setSearch}
        type={type}
        setType={setType}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        applyFilters={applyFilters}
        clearFilters={clearFilters}
        promotionTypes={promotionTypes}
      />
      <div>
        <VirtualizedTable<Promotion, GetPromotionsResponse>
          queryOptions={createPromotionsInfiniteQueryOptions(filters)}
          dataExtractor={(response) => response.promotions}
          containerMaxWidth='calc(100% - 10px)'
          headers={headers}
          currentSort={{
            sortBy: filters.sortBy || 'createdAt',
            sortOrder: filters.sortOrder || 'desc',
          }}
          noDataView={NoDataView}
          renderItem={(promotion, _) => (
            <>
              <td>{promotion.promotionName}</td>
              <td>
                  {promotion.type}
              </td>
              <td>{promotion.startDate}</td>
              <td>{promotion.endDate}</td>
              <td>{promotion.userGroupName}</td>
            </>
          )}
          />
      </div>      
    </>
  );
}

export default function PromotionsVirtualizedTable() {
  return (
    <QueryClientProvider client={queryClient}>
      <PromotionsTableWithWebSocket />
    </QueryClientProvider>
  );
} 