import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import VirtualizedTable from './VirtualizedTable';
import { GetPromotionsResponse, Promotion } from '../api/types/promotionType';
import createPromotionsInfiniteQueryOptions from '../createPromotionsInfiniteQueryOptions';
import { useWebSocketTableUpdates } from '../hooks/useWebSocketTableUpdates';

const queryClient = new QueryClient()

function PromotionsTableWithWebSocket() {
  useWebSocketTableUpdates();

  return (
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
  );
}

export default function PromotionsVirtualizedTable() {
  return (
    <QueryClientProvider client={queryClient}>
      <PromotionsTableWithWebSocket />
    </QueryClientProvider>
  );
} 