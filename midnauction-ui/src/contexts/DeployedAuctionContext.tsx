// Context provider for deployed auction management
import React, { type PropsWithChildren, createContext } from 'react';
import { type DeployedAuctionAPIProvider, BrowserDeployedAuctionManager } from './BrowserDeployedAuctionManager';
import { type Logger } from 'pino';

/**
 * Encapsulates a deployed auction provider as a context object.
 */
export const DeployedAuctionContext = createContext<DeployedAuctionAPIProvider | undefined>(undefined);

/**
 * The props required by the {@link DeployedAuctionProvider} component.
 */
export type DeployedAuctionProviderProps = PropsWithChildren<{
  /** The `pino` logger to use. */
  logger: Logger;
}>;

/**
 * A React component that sets a new {@link BrowserDeployedAuctionManager} object as the currently
 * in-scope deployed auction provider.
 */
export const DeployedAuctionProvider: React.FC<Readonly<DeployedAuctionProviderProps>> = ({ logger, children }) => (
  <DeployedAuctionContext.Provider value={new BrowserDeployedAuctionManager(logger)}>
    {children}
  </DeployedAuctionContext.Provider>
);