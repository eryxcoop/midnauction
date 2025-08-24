import './globals';

import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider } from '@mui/material';
import { setNetworkId, NetworkId } from '@midnight-ntwrk/midnight-js-network-id';
import App from './App';
import CssBaseline from '@mui/material/CssBaseline';
import { theme } from './config/theme';
import '@midnight-ntwrk/dapp-connector-api';
import * as pino from 'pino';
import { DeployedAuctionProvider } from './contexts/DeployedAuctionContext';

const networkId = (import.meta.env.VITE_NETWORK_ID as NetworkId) || 'TestNet';

// Ensure that the network IDs are set within the Midnight libraries.
setNetworkId(networkId);

// Create a default `pino` logger and configure it with the configured logging level.
export const logger = pino.pino({
  level: (import.meta.env.VITE_LOGGING_LEVEL as string) || 'info',
});

logger.trace('networkId = ', networkId);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <DeployedAuctionProvider logger={logger}>
      <App />
    </DeployedAuctionProvider>
  </React.StrictMode>,
);
