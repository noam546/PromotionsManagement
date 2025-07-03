import { BrowserRouter } from 'react-router-dom';
import Logo from './components/Logo'
import './App.css';
import PromotionsVirtualizedTable from './components/table/PromotionsVirtualizedTable';

const App = () => {
  return (
    <BrowserRouter>
      <div className="App">
          <Logo />
          <PromotionsVirtualizedTable />
      </div>
    </BrowserRouter>
  );
}

export default App;
