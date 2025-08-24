import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { NetworkId, setNetworkId } from '@midnight-ntwrk/midnight-js-network-id';
import { DeployedAuctionProvider } from './contexts/DeployedAuctionContext';
import { Buffer } from 'buffer';
window.Buffer = Buffer;

// Mock logger that matches pino Logger interface
const logger = {
  trace: (message: string, ...args: any[]) => console.log(message, ...args),
  info: (message: string, ...args: any[]) => console.log(message, ...args),
  error: (message: string, ...args: any[]) => console.error(message, ...args),
  warn: (message: string, ...args: any[]) => console.warn(message, ...args),
  debug: (message: string, ...args: any[]) => console.log(message, ...args),
  fatal: (message: string, ...args: any[]) => console.error(message, ...args),
  level: 'info' as const
};

const networkId = (import.meta.env.VITE_NETWORK_ID as NetworkId) || 'TestNet';

logger.trace('networkId = ', String(networkId));

setNetworkId(NetworkId.Undeployed);

createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <DeployedAuctionProvider logger={logger as any}>
      <App />
    </DeployedAuctionProvider>
  </StrictMode>,
);
