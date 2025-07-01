import Logo from './components/Logo'
import './App.css';
import { PromotionsVirtualizedTable } from './components';

const App = () => {
  return (
      <div className="App">
          <Logo />
          <PromotionsVirtualizedTable />
          {/* <PromotionsTableWithHighlights /> */}
      </div>
  );
}

export default App;
