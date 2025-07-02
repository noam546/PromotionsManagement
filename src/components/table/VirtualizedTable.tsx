import { useEffect, useMemo, useRef } from "react"
import { useInfiniteQuery } from "@tanstack/react-query"
import { useVirtualizer } from "@tanstack/react-virtual"
import { ArrowUpIcon, ArrowDownIcon, ArrowUpDownIcon } from "../Icons";

// CSS for spinning animation
const spinAnimation = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

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
    <>
      <style>{spinAnimation}</style>
      <div
        style={{
          margin: '2rem auto',
          maxWidth: containerMaxWidth,
          width: '100%',
        }}
      >

      
      <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
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
                style={{
                  padding: '20px 15px',
                  textAlign: 'left',
                  fontWeight: '500',
                  fontSize: '12px',
                  color: '#fff',
                  textTransform: 'uppercase',
                  cursor: header.sortable ? 'pointer' : 'default',
                  userSelect: 'none',
                  transition: 'background-color 0.2s ease',
                  position: 'relative',
                }}
                onMouseOver={(e) => {
                  if (header.sortable) {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                  }
                }}
                onMouseOut={(e) => {
                  if (header.sortable) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <span>{header.label}</span>
                  {header.sortable && (
                    <span style={{
                      fontSize: '14px',
                      opacity: currentSort?.sortBy === header.key ? 1 : 0.5,
                      transition: 'opacity 0.2s ease'
                    }}>
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
        style={{
          height: containerHeight,
          overflowY: 'auto',
          width: '100%',
          position: 'relative'
        }}
      >
        {isLoading && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            background: 'rgba(0, 0, 0, 0.1)',
            zIndex: 10,
            borderRadius: '8px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              color: '#fff',
              fontSize: '16px',
              fontWeight: '500',
              padding: '20px 30px',
              background: 'rgba(0, 0, 0, 0.7)',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
            }}>
              <div style={{
                width: '20px',
                height: '20px',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                borderTop: '2px solid #fff',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }} />
              Loading promotions...
            </div>
          </div>
        )}
        <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed', position: 'absolute', top: 0, left: 0 }}>
          <tbody style={{ position: 'relative', display: 'block', height: virtualizer.getTotalSize() }}>
            {virtualItems.map((vItem) => {
              const item = items?.[vItem.index]
              if (!item) return null
              return (
                <tr
                  key={vItem.key}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    transform: `translateY(${vItem.start}px)`,
                    height: `${vItem.size}px`,
                    display: 'table',
                    tableLayout: 'fixed',
                  }}
                  data-index={vItem.index}
                >
                  {renderItem(item, vItem.index)}
                </tr>
              )
            })}
          </tbody>
        </table>
        {isFetchingNextPage && (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: 50
          }}>
            Loading More data...
          </div>
        )}
      </div>
      </div>
    </>
  )
}