import { useEffect, useMemo, useRef } from "react"
import { useInfiniteQuery } from "@tanstack/react-query"
import { useVirtualizer } from "@tanstack/react-virtual"

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
  currentSort
}: VirtualizedTableProps<TData, TResponse>) {
  const { data, hasNextPage, isFetchingNextPage, fetchNextPage } =
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
    if (!header.sortable || !onSortChange) return;
    
    const newSortOrder = currentSort?.sortBy === header.key && currentSort?.sortOrder === 'asc' ? 'desc' : 'asc';
    onSortChange(header.key, newSortOrder);
  };

  const getSortIndicator = (headerKey: string) => {
    if (!currentSort || currentSort.sortBy !== headerKey) {
      return '↕️'; // Neutral indicator
    }
    return currentSort.sortOrder === 'asc' ? '↑' : '↓';
  };

  return (
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
  )
}