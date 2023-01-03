import React from 'react'
import ReactDOM from 'react-dom';
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

ReactDOM.render(
  <RootComp />,
  container,
);