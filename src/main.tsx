import React from 'react'
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './App'
import './index.css'
import { store } from './store/store';

const container = document.getElementById('root') as HTMLElement;

const RootComp = () => (
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);

const root = createRoot(container)

root.render(<RootComp />);