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
    setFilters(newFilters);
    updateURL(newFilters);
  }, [updateURL]);

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
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
          headers={['Promotion Name', 'Type', 'Start Date', 'End Date', 'User Group Name']}
          renderItem={(promotion, _) => (
            <>
              <td>{promotion.promotionName}</td>
              <td>
                  {promotion.type}
              </td>
              <td>{formatDate(promotion.startDate)}</td>
              <td>{formatDate(promotion.endDate)}</td>
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