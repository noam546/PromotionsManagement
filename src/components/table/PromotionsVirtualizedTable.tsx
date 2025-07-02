import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useWebSocketTableUpdates } from '../../hooks';
import { GetPromotionsResponse, Promotion } from '../../api';
import VirtualizedTable from './VirtualizedTable';
import { createPromotionsInfiniteQueryOptions } from '../../utils';

const queryClient = new QueryClient()

function PromotionsTableWithWebSocket() {
  useWebSocketTableUpdates();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <>
      <h1 >Promotions</h1>
      <div >
        <VirtualizedTable<Promotion, GetPromotionsResponse>
          queryOptions={createPromotionsInfiniteQueryOptions()}
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