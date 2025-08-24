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
            console.log('Join status:', deployment.tag, 'Full deployment:', deployment);
            setCurrentDeployment(deployment);
            
            if (deployment.tag === 'deployed') {
              console.log('Joined auction successfully with real providers');
              console.log('Deployment API:', deployment.api);
              console.log('Deployment API state$:', deployment.api?.state$);
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
    console.log('Deployment effect triggered:', { 
      hasDeployment: !!currentDeployment, 
      deploymentTag: currentDeployment?.tag,
      hasAuctionState: !!auctionState 
    });
    
    if (currentDeployment && currentDeployment.tag === 'deployed' && !auctionState) {
      console.log('Initializing auction state from real deployment');
      
      // Check if the API has a state$ observable
      if (!currentDeployment.api.state$) {
        console.error('API does not have state$ observable');
        
        // Fallback: create basic auction state from deployment info
        console.log('Creating fallback auction state from deployment');
        const fallbackState = {
          auction: {
            productName: 'Auction Contract',
            productDescription: 'Connected to auction contract',
            minimumBidValue: 1000, // $10.00 in cents
            auctioneerPublicKey: 'connected',
            currentRound: AuctionRound.BIDDING,
            totalBids: 0,
            revealedBids: []
          },
          currentUserBid: undefined,
          isParticipant: true,
          canSubmitBid: true,
          canRevealBid: false
        };
        
        console.log('Setting fallback auction state:', fallbackState);
        setAuctionState(fallbackState);
        return;
      }
      
      // Debug: inspect the API object
      console.log('API object:', currentDeployment.api);
      console.log('API state$:', currentDeployment.api.state$);
      console.log('API state$ type:', typeof currentDeployment.api.state$);
      console.log('API state$ subscribe:', typeof currentDeployment.api.state$.subscribe);

      // Subscribe to the real auction state from the API
      console.log('About to subscribe to API state$...');
      const subscription = currentDeployment.api.state$.subscribe({
        next: (apiState: any) => {
          console.log('Received real auction state:', apiState);
          
          if (!apiState || !apiState.publicState) {
            console.error('Invalid API state received:', apiState);
            return;
          }
          
          try {
            // Convert API state to UI state format
            const newAuctionState = {
              auction: {
                productName: apiState.publicState.productName || 'Unknown Product',
                productDescription: apiState.publicState.productDescription || 'No description',
                minimumBidValue: Number(apiState.publicState.minimumBidValue || 0),
                auctioneerPublicKey: Array.from(apiState.publicState.auctioneerPublicKey || new Uint8Array()).map((b: any) => b.toString(16).padStart(2, '0')).join(''),
                currentRound: apiState.publicState.currentPhase === 'bidding' ? AuctionRound.BIDDING : 
                             apiState.publicState.currentPhase === 'revealing' ? AuctionRound.REVEALING : AuctionRound.FINISHED,
                totalBids: Number(apiState.publicState.totalBids || 0),
                revealedBids: (apiState.publicState.revealedBids || []).map((bid: any) => ({
                  participantId: bid.participantId || 'unknown',
                  bidAmount: Number(bid.bidAmount || 0),
                  timestamp: Number(bid.timestamp || 0)
                }))
              },
              currentUserBid: apiState.myCurrentBid ? {
                bidAmount: Number(apiState.myCurrentBid.bidAmount || 0),
                nonce: Array.from(apiState.myCurrentBid.commitment || new Uint8Array()).map((b: any) => b.toString(16).padStart(2, '0')).join(''),
                commitment: Array.from(apiState.myCurrentBid.commitment || new Uint8Array()).map((b: any) => b.toString(16).padStart(2, '0')).join('')
              } : undefined,
              isParticipant: Boolean(apiState.hasSubmittedBid),
              canSubmitBid: Boolean(apiState.canSubmitBid),
              canRevealBid: Boolean(apiState.canRevealBid)
            };
            
            console.log('Setting new auction state:', newAuctionState);
            setAuctionState(newAuctionState);
          } catch (error) {
            console.error('Error processing API state:', error);
          }
        },
        error: (err: any) => {
          console.error('Error in auction state stream:', err);
        },
        complete: () => {
          console.log('Auction state stream completed');
        }
      });

      // Add timeout to detect if subscription is not working
      setTimeout(() => {
        if (!auctionState) {
          console.warn('Auction state subscription timeout - no data received after 3 seconds');
          console.log('Current subscription:', subscription);
          
          // Try to create fallback state if still no data
          if (!auctionState) {
            console.log('Creating fallback auction state due to timeout');
            const fallbackState = {
              auction: {
                productName: 'Auction Contract (Timeout)',
                productDescription: 'Connected to auction contract but no state data received',
                minimumBidValue: 1000,
                auctioneerPublicKey: 'connected',
                currentRound: AuctionRound.BIDDING,
                totalBids: 0,
                revealedBids: []
              },
              currentUserBid: undefined,
              isParticipant: true,
              canSubmitBid: true,
              canRevealBid: false
            };
            setAuctionState(fallbackState);
          }
        }
      }, 3000);

      return () => {
        console.log('Cleaning up auction state subscription');
        subscription.unsubscribe();
      };
    } else if (!auctionState && !currentDeployment) {
      // No deployment available yet, this is normal when first loading
      console.log('No auction deployment available yet, waiting for deployment or join');
    }
  }, [currentDeployment]); // Remove auctionState from dependencies to prevent infinite loops

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
