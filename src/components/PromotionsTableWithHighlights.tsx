import React, { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import VirtualizedTable from './VirtualizedTable';
import { GetPromotionsResponse, Promotion } from '../api/types/promotionType';
import createPromotionsInfiniteQueryOptions from '../createPromotionsInfiniteQueryOptions';
import { useWebSocketTableUpdates } from '../hooks/useWebSocketTableUpdates';

const queryClient = new QueryClient();

// Enhanced table row component with highlight effects
interface TableRowProps {
  promotion: Promotion;
  isHighlighted: boolean;
  highlightType: 'created' | 'updated' | 'deleted' | null;
}

const TableRow: React.FC<TableRowProps> = ({ promotion, isHighlighted, highlightType }) => {
  const getHighlightClass = () => {
    if (!isHighlighted) return '';
    
    switch (highlightType) {
      case 'created':
        return 'bg-green-50 border-l-4 border-green-400';
      case 'updated':
        return 'bg-blue-50 border-l-4 border-blue-400';
      case 'deleted':
        return 'bg-red-50 border-l-4 border-red-400';
      default:
        return '';
    }
  };

  return (
    <tr className={`transition-all duration-500 ${getHighlightClass()}`}>
      <td className="px-4 py-2">{promotion.promotionName}</td>
      <td className="px-4 py-2">{promotion.type}</td>
      <td className="px-4 py-2">{promotion.startDate}</td>
      <td className="px-4 py-2">{promotion.endDate}</td>
      <td className="px-4 py-2">{promotion.userGroupName}</td>
    </tr>
  );
};

// Component that uses the WebSocket updates with visual feedback
function PromotionsTableWithHighlights() {
  const [highlightedRows, setHighlightedRows] = useState<Map<string, { type: 'created' | 'updated' | 'deleted', timestamp: number }>>(new Map());
  
  // This hook will automatically handle WebSocket updates
  useWebSocketTableUpdates();

  // Clean up highlights after 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setHighlightedRows(prev => {
        const newMap = new Map(prev);
        Array.from(newMap.entries()).forEach(([id, data]) => {
          if (now - data.timestamp > 3000) {
            newMap.delete(id);
          }
        });
        return newMap;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const renderItem = (promotion: Promotion, index: number) => {
    const highlight = highlightedRows.get(promotion.id);
    const isHighlighted = !!highlight;
    
    return (
      <TableRow
        key={promotion.id}
        promotion={promotion}
        isHighlighted={isHighlighted}
        highlightType={highlight?.type || null}
      />
    );
  };

  return (
    <div className="relative">
      {/* Status indicator */}
      <div className="mb-4 p-2 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
          <span>Real-time updates enabled</span>
          {highlightedRows.size > 0 && (
            <span className="ml-4 text-blue-600">
              {highlightedRows.size} recent update{highlightedRows.size > 1 ? 's' : ''}
            </span>
          )}
        </div>
      </div>

      <VirtualizedTable<Promotion, GetPromotionsResponse>
        queryOptions={createPromotionsInfiniteQueryOptions()}
        dataExtractor={(response) => response.promotions}
        headers={['Promotion name', 'Type', 'Start Date', 'End Date', 'User Group Name']}
        renderItem={renderItem}
      />
    </div>
  );
}

export default function PromotionsVirtualizedTable() {
  return (
    <QueryClientProvider client={queryClient}>
      <PromotionsTableWithHighlights />
    </QueryClientProvider>
  );
} 