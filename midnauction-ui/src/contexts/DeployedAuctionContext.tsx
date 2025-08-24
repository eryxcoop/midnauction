import React, { createContext, useContext, type PropsWithChildren } from 'react';
import { type Logger } from 'pino';
import { BrowserDeployedAuctionManager } from './BrowserDeployedAuctionManager';

/**
 * The React context for the deployed auction provider.
 */
const DeployedAuctionContext = createContext<BrowserDeployedAuctionManager | undefined>(undefined);

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

/**
 * A React hook that returns the currently in-scope deployed auction provider.
 *
 * @throws An error if called outside of a {@link DeployedAuctionProvider}.
 */
export const useDeployedAuctionContext = (): BrowserDeployedAuctionManager => {
  const context = useContext(DeployedAuctionContext);
  if (!context) {
    throw new Error('useDeployedAuctionContext must be used within a DeployedAuctionProvider');
  }
  return context;
};
