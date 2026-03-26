import ReactDOM from 'react-dom/client';
import { App } from './App.tsx';
import './index.css';
import './scss/global.scss';

ReactDOM.createRoot(document.querySelector('#root')!).render(
  // <React.StrictMode>
  <App />,
  // </React.StrictMode>,
);
