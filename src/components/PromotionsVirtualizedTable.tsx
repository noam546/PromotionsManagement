import React from 'react';
import VirtualizedTable from './VirtualizedTable';
import createUsersInfiniteQueryOptions from '../createUsersInfiniteQueryOptions';
import { GetPromotionsResponse, Promotion } from '../api/types/promotionType';

export default function PromotionsVirtualizedTable() {
  return (
    <VirtualizedTable<Promotion, GetPromotionsResponse>
      queryOptions={createUsersInfiniteQueryOptions()}
      dataExtractor={(response) => response.promotions}
      headers={['Promotion name', 'Type', 'Start Date', 'End Date', 'User Group Name']}
      renderItem={(promotion, index) => (
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