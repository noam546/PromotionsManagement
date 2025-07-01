import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useWebSocket } from './useWebSocket';
import { Promotion } from '../api/types/promotionType';

export const useWebSocketTableUpdates = () => {
  const queryClient = useQueryClient();
  const { 
    onPromotionCreated, 
    onPromotionUpdated, 
    onPromotionDeleted 
  } = useWebSocket();

  useEffect(() => {
    // Handle new promotion created
    onPromotionCreated((data) => {
      console.log('WebSocket: Promotion created', data.data.promotion);
      
      // Invalidate and refetch the promotions query
      queryClient.invalidateQueries({ queryKey: ['promotions'] });
      
      // Optionally, you can also optimistically add the new promotion to the cache
      // This provides instant UI updates without waiting for refetch
      queryClient.setQueryData(['promotions'], (oldData: any) => {
        if (!oldData) return oldData;
        
        // Add the new promotion to the first page
        const newData = { ...oldData };
        if (newData.pages && newData.pages[0] && newData.pages[0].promotions) {
          newData.pages[0].promotions = [
            data.data.promotion,
            ...newData.pages[0].promotions
          ];
        }
        return newData;
      });
    });

    // Handle promotion updated
    onPromotionUpdated((data) => {
      console.log('WebSocket: Promotion updated', data.data.promotion);
      
      // Invalidate and refetch the promotions query
      queryClient.invalidateQueries({ queryKey: ['promotions'] });
      
      // Optionally, you can also optimistically update the promotion in the cache
      queryClient.setQueryData(['promotions'], (oldData: any) => {
        if (!oldData) return oldData;
        const newData = { ...oldData };
        if (newData.pages) {
          newData.pages = newData.pages.map((page: any) => {
            if (page.promotions) {
              page.promotions = page.promotions.map((promotion: Promotion) => 
                promotion.id === data.data.promotion.id? 
                {...data.data.promotion, ...promotion} : promotion
              );
            }
            return page;
          });
        }
        return newData;
      });
    });

    // Handle promotion deleted
    onPromotionDeleted((data) => {
      console.log('WebSocket: Promotion deleted', data.data.promotionId);
      
      // Invalidate and refetch the promotions query
      queryClient.invalidateQueries({ queryKey: ['promotions'] });
      
      // Optionally, you can also optimistically remove the promotion from the cache
      queryClient.setQueryData(['promotions'], (oldData: any) => {
        if (!oldData) return oldData;
        
        const newData = { ...oldData };
        if (newData.pages) {
          newData.pages = newData.pages.map((page: any) => {
            if (page.promotions) {
              page.promotions = page.promotions.filter(
                (promotion: Promotion) => promotion.id !== data.data.promotionId
              );
            }
            return page;
          });
        }
        return newData;
      });
    });
  }, [onPromotionCreated, onPromotionUpdated, onPromotionDeleted, queryClient]);
}; 