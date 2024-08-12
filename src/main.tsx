import ReactDOM from 'react-dom/client';
import App from './components/App.tsx';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store.ts';
import './index.scss';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter basename='/react-auth'>
    <Provider store={store}>
      <App />
    </Provider>
  </BrowserRouter>,
);
