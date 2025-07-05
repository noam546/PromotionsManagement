import { BrowserRouter } from 'react-router-dom';
import Logo from './components/Logo'
import './App.css';
import PromotionsPage from './components/table/PromotionsPage';

const App = () => {
  return (
    <BrowserRouter>
      <div className="App">
          <Logo />
          <PromotionsPage />
      </div>
    </BrowserRouter>
  );
}

export default App;
