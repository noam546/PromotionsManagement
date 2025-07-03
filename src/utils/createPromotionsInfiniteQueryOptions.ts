import { infiniteQueryOptions } from "@tanstack/react-query"
import { getPromotions, GetPromotionsOptions } from "../api/promotion"

export default function createPromotionsInfiniteQueryOptions(options?: Omit<GetPromotionsOptions, 'page' | 'limit'>) {
  return infiniteQueryOptions({
    queryKey: ["promotions", options],
    queryFn: ({ pageParam = 1 }) => getPromotions({ 
      page: pageParam, 
      limit: 50,
      ...options 
    }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.pagination.hasMore
        ? lastPage.pagination.currentPage + 1
        : undefined
    },
  })
}
