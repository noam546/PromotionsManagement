import React, { useEffect } from 'react';
import { QueryClient, QueryClientProvider, useQueryClient } from '@tanstack/react-query';
import VirtualizedTable from './VirtualizedTable';
import { GetPromotionsResponse, Promotion } from '../api/types/promotionType';
import createPromotionsInfiniteQueryOptions from '../createPromotionsInfiniteQueryOptions';
import { useWebSocket } from '../hooks/useWebSocket';

const queryClient = new QueryClient();

// Simple component that just invalidates queries on WebSocket events
function WebSocketTableUpdater() {
  const queryClient = useQueryClient();
  const { onPromotionCreated, onPromotionUpdated, onPromotionDeleted } = useWebSocket();

  useEffect(() => {
    // Simple approach: just invalidate and refetch when WebSocket events occur
    const handlePromotionCreated = () => {
      console.log('🟢 Promotion created - refreshing table');
      queryClient.invalidateQueries({ queryKey: ['promotions'] });
    };

    const handlePromotionUpdated = () => {
      console.log('🔵 Promotion updated - refreshing table');
      queryClient.invalidateQueries({ queryKey: ['promotions'] });
    };

    const handlePromotionDeleted = () => {
      console.log('🔴 Promotion deleted - refreshing table');
      queryClient.invalidateQueries({ queryKey: ['promotions'] });
    };

    onPromotionCreated(handlePromotionCreated);
    onPromotionUpdated(handlePromotionUpdated);
    onPromotionDeleted(handlePromotionDeleted);
  }, [onPromotionCreated, onPromotionUpdated, onPromotionDeleted, queryClient]);

  return null; // This component doesn't render anything
}

// Your existing table component with WebSocket integration
function PromotionsTableWithWebSocket() {
  return (
    <div>
      {/* This component handles WebSocket updates */}
      <WebSocketTableUpdater />
      
      {/* Your existing table */}
      <VirtualizedTable<Promotion, GetPromotionsResponse>
        queryOptions={createPromotionsInfiniteQueryOptions()}
        dataExtractor={(response) => response.promotions}
        headers={['Promotion name', 'Type', 'Start Date', 'End Date', 'User Group Name']}
        renderItem={(promotion, _) => (
          <tr>
            <td>{promotion.promotionName}</td>
            <td>{promotion.type}</td>
            <td>{promotion.startDate}</td>
            <td>{promotion.endDate}</td>
            <td>{promotion.userGroupName}</td>
          </tr>
        )}
      />
    </div>
  );
}

export default function PromotionsVirtualizedTable() {
  return (
    <QueryClientProvider client={queryClient}>
      <PromotionsTableWithWebSocket />
    </QueryClientProvider>
  );
} 