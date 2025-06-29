import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Logo from './components/Logo'
import PromotionsTable from "./components/PromotionsTable";
import './App.css';
import PromotionsVirtualizedTable from './components/PromotionsVirtualizedTable';
import VirtualizedTable from './components/VirtualizedTable';
import createUsersInfiniteQueryOptions from './createUsersInfiniteQueryOptions';
import { GetPromotionsResponse, Promotion } from './api/types/promotionType';

// Create a client
const queryClient = new QueryClient()

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="App">
          <Logo />
          {/* <PromotionsTable /> */}
          <PromotionsVirtualizedTable />
      </div>
    </QueryClientProvider>
  );
}

export default App;
