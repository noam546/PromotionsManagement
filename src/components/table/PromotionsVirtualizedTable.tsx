import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, useCallback, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useWebSocketTableUpdates } from '../../hooks';
import { GetPromotionsResponse, Promotion, GetPromotionsOptions } from '../../api';
import VirtualizedTable from './VirtualizedTable';
import PromotionsFilters from './PromotionsFilters';
import { createPromotionsInfiniteQueryOptions } from '../../utils';

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


  const headers = [
    { key: 'promotionName', label: 'Promotion Name', sortable: true },
    { key: 'type', label: 'Type', sortable: true },
    { key: 'startDate', label: 'Start Date', sortable: true },
    { key: 'endDate', label: 'End Date', sortable: true },
    { key: 'userGroupName', label: 'User Group Name', sortable: true },
  ];

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
          onSortChange={handleSortChange}
          currentSort={{
            sortBy: filters.sortBy || 'createdAt',
            sortOrder: filters.sortOrder || 'desc',
          }}
          onLoadingChange={handleLoadingChange}
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