import React from 'react';
import ReactDOM from 'react-dom/client';
import { AlchemyAccountProvider } from '@account-kit/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { config } from './config';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import App from './App';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <CartProvider>
            <AlchemyAccountProvider config={config} queryClient={queryClient}>
              <App />
            </AlchemyAccountProvider>
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
