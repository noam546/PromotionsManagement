import { useInfiniteQuery } from "@tanstack/react-query"
import { useEffect, useRef } from "react"
import { useVirtualizer } from "@tanstack/react-virtual"

interface VirtualizedTableProps<TData, TResponse> {
  queryOptions: any
  dataExtractor: (response: TResponse) => TData[]
  renderItem: (item: TData, index: number) => React.ReactNode
  headers: string[]
  itemHeight?: number
  containerHeight?: string
  containerMaxWidth?: string
}

export default function VirtualizedTable<TData, TResponse>({
  queryOptions,
  dataExtractor,
  renderItem,
  headers,
  itemHeight = 45,
  containerHeight = '50vh',
  containerMaxWidth = '100%'
}: VirtualizedTableProps<TData, TResponse>) {
  const { data, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useInfiniteQuery(queryOptions)
  const scrollRef = useRef<HTMLDivElement>(null)

  const items = data?.pages.flatMap((page: unknown) => dataExtractor(page as TResponse)) ?? []

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

  return (
    <div
      style={{
        margin: '2rem auto',
        maxWidth: containerMaxWidth,
        width: '100%',
      }}
    >
      <h1 style={{ textAlign: 'center' }}>Promotions</h1>
      <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
        <colgroup>
          {headers.map((_, index) => (
            <col key={index} style={{ width: `${100 / headers.length}%` }} />
          ))}
        </colgroup>
        <thead>
          <tr>
            {headers.map((header, index) => (
              <th key={index}>{header}</th>
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
          position: 'relative',
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