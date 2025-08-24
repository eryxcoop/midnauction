import React, { createContext, useContext, useState, useCallback, useEffect, type PropsWithChildren } from 'react';
import { useDeployedAuctionContext } from '../hooks';
import { type AuctionDeployment } from './BrowserDeployedAuctionManager';
import { 
  type AuctionState, 
  AuctionRound 
} from '../types';

interface HybridAuctionContextType {
  deployNewAuction: (productName: string, productDescription: string, minimumBidValue: number) => Promise<void>;
  joinExistingAuction: (contractAddress: string, role: 'participant' | 'auctioneer') => Promise<void>;
  submitBid: (amount: number) => Promise<void>;
  refreshAuctionData: () => Promise<void>;
  // Auctioneer functions
  startBiddingPhase: () => Promise<void>;
  closeBidding: () => Promise<void>;
  startRevealingPhase: () => Promise<void>;
  finishAuction: () => Promise<void>;
  revealSpecificBid: (participantId: string, bidAmount: number) => Promise<void>;
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
      console.log('Deploying auction with real providers:', { productName, productDescription, minimumBidValue });
      
      // Create new auction deployment using real providers (RPS pattern)
      const deployment$ = auctionApiProvider.resolve();
      
      // Return a promise that resolves when deployment is complete
      return new Promise<void>((resolve, reject) => {
        const subscription = deployment$.subscribe({
          next: (deployment) => {
            console.log('Deployment status:', deployment.tag);
            setCurrentDeployment(deployment);
            
            if (deployment.tag === 'deployed') {
              console.log('Auction deployed successfully with real providers');
              setLoading(false);
              subscription.unsubscribe();
              resolve();
            } else if (deployment.tag === 'error') {
              console.error('Deployment error:', deployment.error.message);
              setError(deployment.error.message);
              setLoading(false);
              subscription.unsubscribe();
              reject(deployment.error);
            }
          },
          error: (err) => {
            console.error('Deployment subscription error:', err);
            setError(err instanceof Error ? err.message : 'Error creating auction');
            setLoading(false);
            subscription.unsubscribe();
            reject(err);
          }
        });

        // Cleanup subscription after timeout
        setTimeout(() => {
          subscription.unsubscribe();
          if (loading) {
            setLoading(false);
            reject(new Error('Deployment timeout'));
          }
        }, 30000);
      });
      
    } catch (err) {
      console.error('Deploy auction error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error creating auction';
      setError(errorMessage);
      setLoading(false);
      throw new Error(errorMessage);
    }
  }, [auctionApiProvider, loading]);

  const joinExistingAuction = useCallback(async (
    contractAddress: string,
    role: 'participant' | 'auctioneer'
  ) => {
    setLoading(true);
    setError(null);

    try {
      console.log('Joining auction with real providers:', { contractAddress, role });
      
      // Join existing auction using real providers (RPS pattern)
      const deployment$ = auctionApiProvider.resolve(contractAddress as any);
      
      // Return a promise that resolves when join is complete
      return new Promise<void>((resolve, reject) => {
        const subscription = deployment$.subscribe({
          next: (deployment) => {
            console.log('Join status:', deployment.tag);
            setCurrentDeployment(deployment);
            
            if (deployment.tag === 'deployed') {
              console.log('Joined auction successfully with real providers');
              setLoading(false);
              subscription.unsubscribe();
              resolve();
            } else if (deployment.tag === 'error') {
              console.error('Join error:', deployment.error.message);
              setError(deployment.error.message);
              setLoading(false);
              subscription.unsubscribe();
              reject(deployment.error);
            }
          },
          error: (err) => {
            console.error('Join subscription error:', err);
            setError(err instanceof Error ? err.message : 'Error joining auction');
            setLoading(false);
            subscription.unsubscribe();
            reject(err);
          }
        });

        // Cleanup subscription after timeout
        setTimeout(() => {
          subscription.unsubscribe();
          if (loading) {
            setLoading(false);
            reject(new Error('Join timeout'));
          }
        }, 30000);
      });
      
    } catch (err) {
      console.error('Join auction error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error joining auction';
      setError(errorMessage);
      setLoading(false);
      throw new Error(errorMessage);
    }
  }, [auctionApiProvider, loading]);

  const submitBid = useCallback(async (amount: number) => {
    setLoading(true);
    setError(null);

    try {
      console.log('Submitting bid with real providers:', amount);
      
      // Use the real auction API from the current deployment
      if (currentDeployment && currentDeployment.tag === 'deployed') {
        const auctionAPI = currentDeployment.api;
        await auctionAPI.submitBid(BigInt(amount * 100)); // Convert to cents
        console.log('Bid submitted successfully with real providers');
        
        // Update auction state with new bid
        if (auctionState) {
          setAuctionState({
            ...auctionState,
            currentUserBid: {
              bidAmount: amount * 100, // Convert to cents
              nonce: Array.from(new Uint8Array(32)).map(b => b.toString(16).padStart(2, '0')).join(''), // This would come from the API
              commitment: Array.from(new Uint8Array(32)).map(b => b.toString(16).padStart(2, '0')).join('') // This would come from the API
            }
          });
        }
      } else {
        throw new Error('No auction deployment available');
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Submit bid error:', err);
      setError(err instanceof Error ? err.message : 'Error submitting bid');
      setLoading(false);
      throw err;
    }
  }, [auctionState, currentDeployment]);

  const refreshAuctionData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      console.log('Refreshing auction data with real providers');
      
      // Use the real auction API from the current deployment
      if (currentDeployment && currentDeployment.tag === 'deployed') {
        const auctionAPI = currentDeployment.api;
        await auctionAPI.refreshState();
        console.log('Auction data refreshed successfully with real providers');
      } else {
        console.log('No deployment available for refresh');
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Refresh data error:', err);
      setError(err instanceof Error ? err.message : 'Error refreshing data');
      setLoading(false);
      throw err;
    }
  }, [currentDeployment]);

  // Initialize auction state from real deployment when available
  useEffect(() => {
    if (currentDeployment && currentDeployment.tag === 'deployed' && !auctionState) {
      console.log('Initializing auction state from real deployment');
      
      // Subscribe to the real auction state from the API
      const subscription = currentDeployment.api.state$.subscribe({
        next: (apiState: any) => {
          console.log('Received real auction state:', apiState);
          // Convert API state to UI state format
          setAuctionState({
            auction: {
              productName: apiState.publicState.productName,
              productDescription: apiState.publicState.productDescription,
              minimumBidValue: Number(apiState.publicState.minimumBidValue),
              auctioneerPublicKey: Array.from(apiState.publicState.auctioneerPublicKey).map((b: any) => b.toString(16).padStart(2, '0')).join(''),
              currentRound: apiState.publicState.currentPhase === 'bidding' ? AuctionRound.BIDDING : 
                           apiState.publicState.currentPhase === 'revealing' ? AuctionRound.REVEALING : AuctionRound.FINISHED,
              totalBids: Number(apiState.publicState.totalBids),
              revealedBids: apiState.publicState.revealedBids.map((bid: any) => ({
                participantId: bid.participantId,
                bidAmount: Number(bid.bidAmount),
                timestamp: Number(bid.timestamp)
              }))
            },
            currentUserBid: apiState.myCurrentBid ? {
              bidAmount: Number(apiState.myCurrentBid.bidAmount),
              nonce: Array.from(apiState.myCurrentBid.commitment || new Uint8Array()).map((b: any) => b.toString(16).padStart(2, '0')).join(''),
              commitment: Array.from(apiState.myCurrentBid.commitment || new Uint8Array()).map((b: any) => b.toString(16).padStart(2, '0')).join('')
            } : undefined,
            isParticipant: apiState.hasSubmittedBid,
            canSubmitBid: apiState.canSubmitBid,
            canRevealBid: apiState.canRevealBid
          });
        },
        error: (err: any) => {
          console.error('Error in auction state stream:', err);
        }
      });

      return () => subscription.unsubscribe();
    } else if (!auctionState && !currentDeployment) {
      // No deployment available yet, this is normal when first loading
      console.log('No auction deployment available yet, waiting for deployment or join');
    }
  }, [currentDeployment, auctionState]);

  // Auctioneer functions
  const startBiddingPhase = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      console.log('Starting bidding phase with real providers');
      
      if (currentDeployment && currentDeployment.tag === 'deployed') {
        const auctionAPI = currentDeployment.api;
        await auctionAPI.createAuction('Product', 'Description', BigInt(1000)); // This should be the actual auction creation
        console.log('Bidding phase started successfully');
      } else {
        throw new Error('No auction deployment available');
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Start bidding phase error:', err);
      setError(err instanceof Error ? err.message : 'Error starting bidding phase');
      setLoading(false);
      throw err;
    }
  }, [currentDeployment]);

  const closeBidding = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      console.log('Closing bidding phase with real providers');
      
      if (currentDeployment && currentDeployment.tag === 'deployed') {
        const auctionAPI = currentDeployment.api;
        await auctionAPI.closeBidding();
        console.log('Bidding phase closed successfully');
      } else {
        throw new Error('No auction deployment available');
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Close bidding error:', err);
      setError(err instanceof Error ? err.message : 'Error closing bidding');
      setLoading(false);
      throw err;
    }
  }, [currentDeployment]);

  const startRevealingPhase = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      console.log('Starting revealing phase with real providers');
      
      if (currentDeployment && currentDeployment.tag === 'deployed') {
        const auctionAPI = currentDeployment.api;
        await auctionAPI.startRevealing();
        console.log('Revealing phase started successfully');
      } else {
        throw new Error('No auction deployment available');
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Start revealing phase error:', err);
      setError(err instanceof Error ? err.message : 'Error starting revealing phase');
      setLoading(false);
      throw err;
    }
  }, [currentDeployment]);

  const finishAuction = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      console.log('Finishing auction with real providers');
      
      if (currentDeployment && currentDeployment.tag === 'deployed') {
        const auctionAPI = currentDeployment.api;
        await auctionAPI.finishAuction();
        console.log('Auction finished successfully');
      } else {
        throw new Error('No auction deployment available');
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Finish auction error:', err);
      setError(err instanceof Error ? err.message : 'Error finishing auction');
      setLoading(false);
      throw err;
    }
  }, [currentDeployment]);

  const revealSpecificBid = useCallback(async (participantId: string, bidAmount: number) => {
    setLoading(true);
    setError(null);

    try {
      console.log('Revealing specific bid with real providers:', { participantId, bidAmount });
      
      if (currentDeployment && currentDeployment.tag === 'deployed') {
        // This would need to be implemented in the contract API
        // For now, we'll just log it
        console.log('Bid reveal requested for participant:', participantId, 'amount:', bidAmount);
      } else {
        throw new Error('No auction deployment available');
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Reveal specific bid error:', err);
      setError(err instanceof Error ? err.message : 'Error revealing bid');
      setLoading(false);
      throw err;
    }
  }, [currentDeployment]);

  const value: HybridAuctionContextType = {
    deployNewAuction,
    joinExistingAuction,
    submitBid,
    refreshAuctionData,
    startBiddingPhase,
    closeBidding,
    startRevealingPhase,
    finishAuction,
    revealSpecificBid,
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
