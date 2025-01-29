import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { LoadingProvider } from './context/LoadingContext.jsx';
import { WalletApi } from './context/WalletContext.jsx';
import { Provider } from 'react-redux';
import store from './app/store.jsx';
import PusherProvider from './context/PusherContext.jsx';
import { Web3ModalProvider } from './web3/Web3Provider.jsx';
import { NotificationProvider } from './context/NotificationContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <LoadingProvider>
        <PusherProvider>
          <Web3ModalProvider>
            <WalletApi>
              <NotificationProvider>
                
                <App />
              
              </NotificationProvider>
            </WalletApi>
          </Web3ModalProvider>
        </PusherProvider>
      </LoadingProvider>
    </Provider>
  </StrictMode >
);
