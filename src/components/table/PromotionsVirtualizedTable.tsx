import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, useCallback, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useWebSocketTableUpdates } from '../../hooks';
import { GetPromotionsResponse, Promotion, GetPromotionsOptions } from '../../api';
import VirtualizedTable, { SortableHeader } from './VirtualizedTable';
import PromotionsFilters from './PromotionsFilters';
import { createPromotionsInfiniteQueryOptions } from '../../utils';
import { NoDataIcon } from '../Icons';
import styles from './Table.module.scss';

const queryClient = new QueryClient()

function PromotionsTableWithWebSocket() {
  useWebSocketTableUpdates();
  
  const [searchParams, setSearchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  
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

  const handleFiltersChange = useCallback((newFilters: Omit<GetPromotionsOptions, 'page' | 'limit'>) => {
    const updatedFilters = {
      ...newFilters,
      sortBy: filters.sortBy,
      sortOrder: filters.sortOrder,
    };
    setFilters(updatedFilters);
    updateURL(updatedFilters);
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

  const handleLoadingChange = useCallback((loading: boolean) => {
    setIsLoading(loading);
  }, []);

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
      <h1>Promotions</h1>
      <PromotionsFilters onFiltersChange={handleFiltersChange} />
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
          onLoadingChange={handleLoadingChange}
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