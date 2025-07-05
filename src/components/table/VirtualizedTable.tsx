import { useEffect, useMemo, useRef } from "react"
import { useInfiniteQuery } from "@tanstack/react-query"
import { useVirtualizer } from "@tanstack/react-virtual"
import Table from "./Table";

export interface SortableHeader {
  key: string;
  label: string;
  sortable?: boolean;
  onSortChange?: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
}

interface VirtualizedTableProps<TData, TResponse> {
  queryOptions: any
  dataExtractor: (response: TResponse) => TData[]
  renderItem: (item: TData, index: number) => React.ReactNode
  headers: SortableHeader[]
  itemHeight?: number
  containerHeight?: string
  containerMaxWidth?: string
  currentSort?: {
    sortBy: string;
    sortOrder: 'asc' | 'desc';
  }
  noDataView?: React.ComponentType
}

export default function VirtualizedTable<TData, TResponse>({
  queryOptions,
  dataExtractor,
  renderItem,
  headers,
  itemHeight = 45,
  containerHeight = '50vh',
  containerMaxWidth = '100%',
  currentSort,
  noDataView
}: VirtualizedTableProps<TData, TResponse>) {
  const { data, hasNextPage, isFetchingNextPage, fetchNextPage, isLoading } =
    useInfiniteQuery(queryOptions)
  const scrollRef = useRef<HTMLDivElement>(null)

  const items = useMemo(() => data?.pages.flatMap((page: unknown) => dataExtractor(page as TResponse)) ?? [], [data, dataExtractor])

  const virtualizer = useVirtualizer({
    count: items?.length ?? 0,
    estimateSize: () => itemHeight,
    getScrollElement: () => scrollRef.current,
  })

  const virtualItems = virtualizer.getVirtualItems()

  useEffect(() => {
    const lastItem = virtualItems[virtualItems.length - 1]
    if (
      !hasNextPage ||
      isFetchingNextPage ||
      !lastItem ||
      lastItem.index < items.length - 6
    )
      return
    fetchNextPage()
  }, [virtualItems, hasNextPage, isFetchingNextPage, items, fetchNextPage])

  const handleHeaderClick = (header: SortableHeader) => {
    if (!header.sortable || !header.onSortChange) return;
    
    const newSortOrder = currentSort?.sortBy === header.key && currentSort?.sortOrder === 'asc' ? 'desc' : 'asc';
    header.onSortChange(header.key, newSortOrder);
  };

  return (
    <Table
      headers={headers}
      currentSort={currentSort}
      isLoading={isLoading}
      items={items}
      renderItem={renderItem}
      virtualizer={virtualizer}
      isFetchingNextPage={isFetchingNextPage}
      scrollRef={scrollRef}
      containerMaxWidth={containerMaxWidth}
      containerHeight={containerHeight}
      handleHeaderClick={handleHeaderClick}
      virtualItems={virtualItems}
      NoDataView={noDataView}
    />
  )
}