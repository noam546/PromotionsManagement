import Logo from './components/Logo'
import './App.css';
import { PromotionsVirtualizedTable } from './components';

const App = () => {
  return (
      <div className="App">
          <Logo />
          {/* <PromotionsTable /> */}
          <PromotionsVirtualizedTable />
      </div>
  );
}

export default App;
