import Logo from './components/Logo'
import './App.css';
import PromotionsVirtualizedTable from './components/table/PromotionsVirtualizedTable';

const App = () => {
  return (
      <div className="App">
          <Logo />
          <PromotionsVirtualizedTable />
      </div>
  );
}

export default App;
