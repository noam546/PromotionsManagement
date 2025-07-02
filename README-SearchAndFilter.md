# Search and Filter Functionality

This document describes the enhanced search, filtering, and sorting capabilities added to the Promotions Management system.

## Features Added

### 1. Search Functionality
- **Combined Search**: Search across promotion names AND user group names in a single field
- **Real-time Search**: Results update as you type
- **Debounced Search**: 1000ms delay to prevent excessive API calls while typing
- **Case-insensitive**: Search is not case-sensitive
- **Single Query Parameter**: Uses the `search` query parameter for promotion names and user groups
- **Visual Feedback**: Shows "Typing..." indicator while user is typing

### 2. Filtering Options
- **Type Filter**: Filter by promotion type (discount, bonus, free_spin, cashback)
- **Date Range Filter**: Filter by start date and end date ranges
- **Combined Filters**: Use multiple filters simultaneously

### 3. Clickable Header Sorting
- **Interactive Headers**: All table headers are clickable for sorting
- **Visual Indicators**: Sort direction arrows (↑↓) show current sort state
- **Toggle Sorting**: Click once for ascending, click again for descending
- **Sortable Fields**:
  - Promotion Name
  - Type
  - Start Date
  - End Date
  - User Group Name
- **Hover Effects**: Headers highlight on hover to indicate they're clickable
- **URL Persistence**: Sort state is saved in URL parameters

### 4. URL State Management
- **Persistent State**: All filters, search, and sorting are saved in the URL
- **Bookmarkable URLs**: Users can bookmark specific filter combinations
- **Browser Navigation**: Back/forward buttons work with filter changes
- **Page Refresh**: State is maintained when refreshing the page
- **Shareable Links**: Users can share URLs with specific filter states

## URL Parameters

The application now supports the following URL query parameters:

```
?search=promotion&type=discount&startDate=2024-01-01&endDate=2024-12-31&sortBy=promotionName&sortOrder=desc
```

### Available Parameters:
- `search` - Combined search for promotion names and user groups
- `type` - Filter by promotion type
- `startDate` - Filter by start date (YYYY-MM-DD format)
- `endDate` - Filter by end date (YYYY-MM-DD format)
- `sortBy` - Field to sort by (set by clicking table headers)
- `sortOrder` - Sort direction (asc/desc, toggled by clicking headers)

## API Endpoint Support

The backend endpoint `/api/promotions` now supports the following query parameters:

```typescript
// Search and filtering
search?: string           // Combined search across promotion names AND user groups
type?: string            // Filter by promotion type
startDate?: string       // Filter by start date (ISO format)
endDate?: string         // Filter by end date (ISO format)

// Sorting
sortBy?: string          // Field to sort by
sortOrder?: 'asc' | 'desc' // Sort order

// Pagination (existing)
page?: number            // Page number
limit?: number           // Items per page
```

## Frontend Implementation

### Components Added

1. **PromotionsFilters Component** (`src/components/table/PromotionsFilters.tsx`)
   - Modern, responsive filter interface
   - Matches existing design theme
   - Real-time filter updates
   - Combined search for promotions and user groups
   - Type dropdown filter
   - Clear filters functionality
   - URL state synchronization
   - **Debounced search with 1000ms delay**
   - Visual feedback during typing
   - **No sorting controls (moved to table headers)**

2. **Enhanced VirtualizedTable Component** (`src/components/table/VirtualizedTable.tsx`)
   - **Clickable headers with sorting functionality**
   - **Visual sort indicators (↑↓)**
   - **Hover effects for sortable headers**
   - **Toggle sorting (asc/desc)**
   - **Sort state management**

3. **Enhanced API Client** (`src/api/promotion.ts`)
   - Updated to support all filter parameters
   - Proper TypeScript typing
   - Query parameter handling

4. **Updated Query Options** (`src/utils/createPromotionsInfiniteQueryOptions.ts`)
   - Support for filter-based query keys
   - Proper caching with filters
   - Infinite scroll with filters

5. **URL State Management** (`src/components/table/PromotionsVirtualizedTable.tsx`)
   - React Router integration with `useSearchParams`
   - URL synchronization with filter state
   - Browser navigation support
   - **Sort state management through headers**

### Usage Example

```tsx
import PromotionsVirtualizedTable from './components/table/PromotionsVirtualizedTable';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Logo />
        <PromotionsVirtualizedTable />
      </div>
    </BrowserRouter>
  );
}
```

The `PromotionsVirtualizedTable` component now automatically includes:
- Combined search input (promotion names and user groups) with debouncing
- Type dropdown filter
- Date range filters
- **Clickable table headers with sorting**
- Clear filters button
- URL state persistence

## Filter Behavior

### Debounced Search
- **Single Search Field**: One input field searches promotion names and user group names
- **Debounced Input**: 1000ms delay before sending search request to prevent excessive API calls
- **Visual Feedback**: Shows "Typing... (search will update in a moment)" while user is typing
- **Query Parameter**: Sends a single `search` parameter to the backend
- **Backend Logic**: Your backend should search across `promotionName` and `userGroupName` fields
- **Real-time Updates**: Results update after the debounce delay
- **Empty Search**: Shows all promotions when search is empty
- **URL Persistence**: Search term is saved in URL

### Type Filter
- Dropdown with predefined promotion types
- "All Types" option to clear the filter
- Can be combined with other filters
- URL persistence
- Immediate updates (no debouncing needed)

### Date Filters
- Start date and end date inputs
- ISO date format support
- Can be used independently or together
- Filters promotions within the specified date range
- URL persistence
- Immediate updates (no debouncing needed)

### Clickable Header Sorting
- **Interactive Headers**: All table headers are clickable
- **Visual Indicators**: 
  - `↕️` - Neutral state (not currently sorted)
  - `↑` - Ascending sort
  - `↓` - Descending sort
- **Toggle Behavior**: Click to sort ascending, click again to sort descending
- **Hover Effects**: Headers highlight on hover to indicate clickability
- **URL Persistence**: Sort state is saved in URL
- **Immediate Updates**: Results update immediately when sorting changes

### Combined Filters
- All filters work together
- Results are filtered by all active filters
- Clear filters button resets all filters to defaults
- All filter states are preserved in URL

### URL State Management
- **Initialization**: Filters are initialized from URL parameters on page load
- **Updates**: URL is updated whenever filters change
- **Navigation**: Browser back/forward buttons work correctly
- **Refresh**: Page refresh maintains all filter states
- **Sharing**: URLs can be shared with specific filter combinations

## Performance Optimizations

### Debounced Search
- **1000ms Delay**: Prevents API calls on every keystroke
- **Reduced Server Load**: Significantly fewer API requests during typing
- **Better UX**: Users can type without interruption
- **Visual Feedback**: Clear indication when search is pending
- **Memory Efficient**: Proper cleanup of timeouts

### Header Sorting
- **Immediate Response**: No debouncing needed for sorting
- **Efficient Updates**: Only sort parameters change, not search/filter
- **Visual Feedback**: Clear indicators show current sort state
- **URL Integration**: Sort state persists across page refreshes

### Other Optimizations
- **Query Caching**: React Query caches results based on filter combinations
- **Infinite Scroll**: Efficient pagination with filters
- **URL Updates**: Uses `replace: true` to avoid cluttering browser history
- **WebSocket Integration**: Real-time updates maintain filter state

## Backend Implementation Notes

Your backend should handle the `search` parameter to search across promotion names and user groups. Here's a suggested approach:

```typescript
// In your backend service
const filters = {
  type: req.query.type as string,
  search: req.query.search as string, // This should search promotionName and userGroupName
  startDate: req.query.startDate ? new Date(req.query.startDate as string) : undefined,
  endDate: req.query.endDate ? new Date(req.query.endDate as string) : undefined,
}

// Example MongoDB query
const searchQuery = filters.search ? {
  $or: [
    { promotionName: { $regex: filters.search, $options: 'i' } },
    { userGroupName: { $regex: filters.search, $options: 'i' } }
  ]
} : {};

// Example SQL query
const searchQuery = filters.search ? 
  `(promotion_name ILIKE '%${filters.search}%' OR user_group_name ILIKE '%${filters.search}%')` : 
  '1=1';
```

## WebSocket Integration

The search and filter functionality works seamlessly with the existing WebSocket real-time updates:

- New promotions appear in filtered results if they match the current filters
- Updated promotions are reflected in filtered results
- Deleted promotions are removed from filtered results
- All query keys are properly invalidated when WebSocket events occur
- URL state is maintained during real-time updates

## Performance Considerations

- **Debounced Search**: 1000ms delay prevents excessive API calls during typing
- **Header Sorting**: Immediate response for better user experience
- **Query Keys**: Include filter parameters for proper caching
- **Infinite Scroll**: Works with all filter combinations
- **WebSocket Updates**: Maintain filter state
- **URL Updates**: Use `replace: true` to avoid cluttering browser history
- **Memory Management**: Proper cleanup of debounce timeouts

## Styling

The filter component uses the same design language as the existing application:
- Glassmorphism design with backdrop blur
- Consistent color scheme and typography
- Responsive grid layout
- Hover effects and transitions
- Disabled states during loading
- Subtle visual feedback for debounced search
- **Interactive header styling with hover effects**

## TypeScript Support

Full TypeScript support with:
- Proper type definitions for all filter parameters
- Type-safe filter change handlers
- IntelliSense support for all filter options
- Compile-time error checking
- React Router type safety
- Custom debounce hook with proper typing
- **Sortable header interfaces**

## Dependencies Added

- `react-router-dom` - For URL state management and routing 