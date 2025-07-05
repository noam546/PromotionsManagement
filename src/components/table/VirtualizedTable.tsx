import { useEffect, useMemo, useRef } from "react"
import { useInfiniteQuery } from "@tanstack/react-query"
import { useVirtualizer } from "@tanstack/react-virtual"
import { ArrowUpIcon, ArrowDownIcon, ArrowUpDownIcon, NoDataIcon } from "../Icons";
import styles from './VirtualizedTable.module.scss';

interface SortableHeader {
  key: string;
  label: string;
  sortable?: boolean;
}

interface VirtualizedTableProps<TData, TResponse> {
  queryOptions: any
  dataExtractor: (response: TResponse) => TData[]
  renderItem: (item: TData, index: number) => React.ReactNode
  headers: SortableHeader[]
  itemHeight?: number
  containerHeight?: string
  containerMaxWidth?: string
  onSortChange?: (sortBy: string, sortOrder: 'asc' | 'desc') => void
  currentSort?: {
    sortBy: string;
    sortOrder: 'asc' | 'desc';
  }
  onLoadingChange?: (isLoading: boolean) => void
}

export default function VirtualizedTable<TData, TResponse>({
  queryOptions,
  dataExtractor,
  renderItem,
  headers,
  itemHeight = 45,
  containerHeight = '50vh',
  containerMaxWidth = '100%',
  onSortChange,
  currentSort,
  onLoadingChange
}: VirtualizedTableProps<TData, TResponse>) {
  const { data, hasNextPage, isFetchingNextPage, fetchNextPage, isLoading, isFetching } =
    useInfiniteQuery(queryOptions)
  const scrollRef = useRef<HTMLDivElement>(null)

  const items = useMemo(() => data?.pages.flatMap((page: unknown) => dataExtractor(page as TResponse)) ?? [], [data, dataExtractor])

  // Notify parent component of loading state changes
  useEffect(() => {
    if (onLoadingChange) {
      onLoadingChange(isLoading || isFetching);
    }
  }, [isLoading, isFetching, onLoadingChange]);

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
    if (!header.sortable || !onSortChange) return;
    
    const newSortOrder = currentSort?.sortBy === header.key && currentSort?.sortOrder === 'asc' ? 'desc' : 'asc';
    onSortChange(header.key, newSortOrder);
  };

  const getSortIndicator = (headerKey: string) => {
    if (!currentSort || currentSort.sortBy !== headerKey) {
      return <ArrowUpDownIcon width="10" height="10" fill="white" />;
    }
    return currentSort.sortOrder !== 'asc' ? 
      <ArrowUpIcon width="10" height="10" fill="white" /> : 
      <ArrowDownIcon width="10" height="10" fill="white" />;
  };

  return (
    <div
      className={styles.container}
      style={{ maxWidth: containerMaxWidth }}
    >
      <table className={styles.table}>
        <colgroup>
          {headers.map((_, index) => (
            <col key={index} style={{ width: `${100 / headers.length}%` }} />
          ))}
        </colgroup>
        <thead>
          <tr>
            {headers.map((header, index) => (
              <th 
                key={index}
                onClick={() => handleHeaderClick(header)}
                className={`${styles.header} ${!header.sortable ? styles.nonSortable : ''}`}
              >
                <div className={styles.headerContent}>
                  <span>{header.label}</span>
                  {header.sortable && (
                    <span className={`${styles.sortIndicator} ${currentSort?.sortBy === header.key ? styles.active : ''}`}>
                      {getSortIndicator(header.key)}
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
      </table>
      <div
        ref={scrollRef}
        className={styles.scrollContainer}
        style={{ height: containerHeight }}
      >
        {!isLoading && items.length === 0 && (
          <div className={styles.noDataContainer}>
            <div className={styles.noDataContent}>
              <div className={styles.noDataIcon}>
                <NoDataIcon width="64" height="64" fill="currentColor" />
              </div>
              <div className={styles.noDataTitle}>
                No promotions found
              </div>
              <div className={styles.noDataMessage}>
                Try adjusting your search criteria or filters to find what you're looking for.
              </div>
            </div>
          </div>
        )}
        {isLoading && (
          <div className={styles.loadingOverlay}>
            <div className={styles.loadingContent}>
              <div className={styles.spinner} />
              Loading promotions...
            </div>
          </div>
        )}
        {items.length > 0 && (
          <table className={styles.virtualTable}>
            <tbody className={styles.virtualTbody} style={{ height: virtualizer.getTotalSize() }}>
              {virtualItems.map((vItem) => {
                const item = items?.[vItem.index]
                if (!item) return null
                return (
                  <tr
                    key={vItem.key}
                    className={styles.virtualRow}
                    style={{
                      transform: `translateY(${vItem.start}px)`,
                      height: `${vItem.size}px`,
                    }}
                    data-index={vItem.index}
                  >
                    {renderItem(item, vItem.index)}
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
        {isFetchingNextPage && (
          <div className={styles.loadMoreContainer}>
            Loading More data...
          </div>
        )}
      </div>
    </div>
  )
}