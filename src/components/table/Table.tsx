import { ArrowDownIcon, ArrowUpDownIcon, ArrowUpIcon, NoDataIcon } from "../icons";
import styles from './Table.module.scss';

interface TableProps {
    headers: any[];
    currentSort: any;
    isLoading: boolean;
    items: any[];
    renderItem: (item: any, index: number) => React.ReactNode;
    virtualizer: any;
    isFetchingNextPage: boolean;
    scrollRef: React.RefObject<HTMLDivElement>;
    containerMaxWidth: string;
    containerHeight: string;
    handleHeaderClick: (header: any) => void;
    virtualItems: any[];
    NoDataView?: React.ComponentType;
}
export default function Table({
    headers,
    currentSort,
    isLoading,
    items,
    renderItem,
    virtualizer,
    isFetchingNextPage,
    scrollRef,
    containerMaxWidth,
    containerHeight,
    handleHeaderClick,
    virtualItems,
    NoDataView,
}: TableProps) {

    const getSortIndicator = (headerKey: string) => {
        if (!currentSort || currentSort.sortBy !== headerKey) {
          return <ArrowUpDownIcon width="10" height="10" fill="white" />;
        }
        return currentSort.sortOrder !== 'asc' ? 
          <ArrowUpIcon width="10" height="10" fill="white" /> : 
          <ArrowDownIcon width="10" height="10" fill="white" />;
      };
     

  return <div
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
          {NoDataView ? <NoDataView /> : (
            <>
              <div className={styles.noDataIcon}>
                <NoDataIcon width="64" height="64" fill="currentColor" />
              </div>
              <div className={styles.noDataTitle}>
                No data found
              </div>
              <div className={styles.noDataMessage}>
                Try adjusting your search criteria or filters to find what you're looking for.
              </div>
            </>
          )}    
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
}