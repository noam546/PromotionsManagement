import Logo from './components/Logo'
import './App.css';
import { PromotionsVirtualizedTable, WebSocketStatus, WebSocketNotifications } from './components';

const App = () => {
  return (
      <div className="App">
          <Logo />
          <div className="flex justify-between items-center p-4 bg-white shadow-sm">
            <h1 className="text-2xl font-bold text-gray-800">Promotions Management</h1>
            <WebSocketStatus showControls={true} />
          </div>
          {/* <PromotionsTable /> */}
          <PromotionsVirtualizedTable />
          {/* <SimpleWebSocketTable /> */}
          {/* <PromotionsTableWithHighlights /> */}
          <WebSocketNotifications maxNotifications={5} autoHide={true} hideDelay={5000} />
      </div>
  );
}

export default App;
