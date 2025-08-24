import React, { createContext, useContext, useState, useCallback, useEffect, type PropsWithChildren } from 'react';
import { useDeployedAuctionContext } from '../hooks';
import { type AuctionDeployment } from './BrowserDeployedAuctionManager';
import { 
  type AuctionState, 
  type AuctionData, 
  type AuctionPhase 
} from '../types';

interface HybridAuctionContextType {
  deployNewAuction: (productName: string, productDescription: string, minimumBidValue: number) => Promise<void>;
  joinExistingAuction: (contractAddress: string, role: 'participant' | 'auctioneer') => Promise<void>;
  submitBid: (amount: number) => Promise<void>;
  refreshAuctionData: () => Promise<void>;
  auctionState: AuctionState | null;
  loading: boolean;
  error: string | null;
}

const HybridAuctionContext = createContext<HybridAuctionContextType | undefined>(undefined);

export const HybridAuctionProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const auctionApiProvider = useDeployedAuctionContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [auctionState, setAuctionState] = useState<AuctionState | null>(null);
  const [currentDeployment, setCurrentDeployment] = useState<AuctionDeployment>();

  const deployNewAuction = useCallback(async (
    productName: string,
    productDescription: string,
    minimumBidValue: number
  ) => {
    setLoading(true);
    setError(null);

    try {
      // Create new auction deployment using real providers
      const deployment$ = auctionApiProvider.resolve();
      
      // For now, we'll just simulate the deployment
      // In a real implementation, this would pass the auction data to the contract
      console.log('Deploying auction with:', { productName, productDescription, minimumBidValue });
      
      // Simulate deployment time
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error creating auction');
      setLoading(false);
      throw err;
    }
  }, [auctionApiProvider]);

  const joinExistingAuction = useCallback(async (
    contractAddress: string,
    role: 'participant' | 'auctioneer'
  ) => {
    setLoading(true);
    setError(null);

    try {
      // Join existing auction using real providers
      const deployment$ = auctionApiProvider.resolve(contractAddress as any);
      
      console.log('Joining auction:', { contractAddress, role });
      
      // Simulate join time
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error joining auction');
      setLoading(false);
      throw err;
    }
  }, [auctionApiProvider]);

  const submitBid = useCallback(async (amount: number) => {
    setLoading(true);
    setError(null);

    try {
      // For now, simulate bid submission
      console.log('Submitting bid:', amount);
      
      // In a real implementation, this would call the auction API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update auction state with new bid (mock)
      if (auctionState) {
        setAuctionState({
          ...auctionState,
          myCurrentBid: {
            amount: amount * 100, // Convert to cents
            nonce: new Uint8Array(32), // Mock nonce
            commitment: new Uint8Array(32) // Mock commitment
          }
        });
      }
      
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error submitting bid');
      setLoading(false);
      throw err;
    }
  }, [auctionState]);

  const refreshAuctionData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // For now, simulate data refresh
      console.log('Refreshing auction data');
      
      // In a real implementation, this would fetch fresh data from the auction API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error refreshing data');
      setLoading(false);
      throw err;
    }
  }, []);

  // Initialize with mock auction state for development
  useEffect(() => {
    if (!auctionState) {
      setAuctionState({
        contractAddress: 'mock-address',
        auctionData: {
          productName: 'Sample Product',
          productDescription: 'A sample product for testing',
          minimumBidValue: 100000, // $1000 in cents
          auctioneerPublicKey: 'mock-auctioneer-key'
        },
        publicState: {
          currentPhase: 'BIDDING' as AuctionPhase,
          currentRound: 1,
          totalBids: 0,
          revealedBids: []
        },
        userRole: 'participant',
        myCurrentBid: null,
        canSubmitBid: true,
        canRevealBid: false,
        isAuctioneer: false
      });
    }
  }, [auctionState]);

  const value: HybridAuctionContextType = {
    deployNewAuction,
    joinExistingAuction,
    submitBid,
    refreshAuctionData,
    auctionState,
    loading,
    error,
  };

  return (
    <HybridAuctionContext.Provider value={value}>
      {children}
    </HybridAuctionContext.Provider>
  );
};

export const useHybridAuction = (): HybridAuctionContextType => {
  const context = useContext(HybridAuctionContext);
  if (!context) {
    throw new Error('useHybridAuction must be used within a HybridAuctionProvider');
  }
  return context;
};
