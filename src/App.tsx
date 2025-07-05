import { BrowserRouter } from 'react-router-dom';
import Logo from './components/logo'
import './App.css';
import { PromotionsPage } from './pages';

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
