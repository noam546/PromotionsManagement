import { infiniteQueryOptions } from "@tanstack/react-query"
import { getPromotions } from "./api/promotion"

export default function createUsersInfiniteQueryOptions() {
  return infiniteQueryOptions({
    queryKey: ["promotions"],
    queryFn: ({ pageParam = 1 }) => getPromotions({ page: pageParam, limit: 200 }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.pagination.hasMore
        ? lastPage.pagination.currentPage + 1
        : undefined
    },
  })
}
