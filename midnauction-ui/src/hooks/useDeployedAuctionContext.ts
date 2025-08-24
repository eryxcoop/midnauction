// Hook for using the deployed auction context
import { useContext } from 'react';
import { DeployedAuctionContext } from '../contexts/DeployedAuctionContext';

/**
 * A React hook that gets the currently in-scope deployed auction API provider.
 *
 * @returns The currently in-scope deployed auction API provider.
 */
export const useDeployedAuctionContext = () => {
  const context = useContext(DeployedAuctionContext);

  if (!context) {
    throw new Error('useDeployedAuctionContext must be used within a DeployedAuctionProvider');
  }

  return context;
};