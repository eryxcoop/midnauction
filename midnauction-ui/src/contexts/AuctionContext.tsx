import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuctionState, AuctionData, AuctionRound, PrivateBid, RevealedBid } from '../types';
import { apiStateToUIState, dollarsToCents } from '../types/api-adapter';
import {AuctionAPI, AuctionProviders} from "@midnight-ntwrk/midnauction-api/src";

interface AuctionContextType {
  auctionState: AuctionState;
  submitBid: (bidAmount: number) => Promise<void>;
  revealBid: () => Promise<void>;
  joinAuction: () => Promise<void>;
  refreshAuctionData: () => Promise<void>;
  // Auctioneer control functions
  startBiddingPhase: () => Promise<void>;
  closeBidding: () => Promise<void>;
  startRevealingPhase: () => Promise<void>;
  finishAuction: () => Promise<void>;
  revealSpecificBid: (participantId: string, bidAmount: number) => Promise<void>;
  // API management
  deployNewAuction: (productName: string, productDescription: string, minimumBid: number) => Promise<void>;
  joinExistingAuction: (contractAddress: string) => Promise<void>;
  loading: boolean;
  error: string | null;
  isConnected: boolean;
}

const AuctionContext = createContext<AuctionContextType | undefined>(undefined);

interface AuctionProviderProps {
  children: ReactNode;
  providers?: AuctionProviders; // Optional providers for the API
}

export function AuctionProvider({ children, providers }: AuctionProviderProps) {
  // API instance state
  const [auctionAPI, setAuctionAPI] = useState<AuctionAPI | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  
  // UI state
  const [auctionState, setAuctionState] = useState<AuctionState>(
    apiStateToUIState(auctionAPI?.state$ || {} as any)
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Subscribe to API state changes when API is available
  useEffect(() => {
    if (!auctionAPI) return;

    const subscription = auctionAPI.state$.subscribe({
      next: (apiState) => {
        const uiState = apiStateToUIState(apiState);
        setAuctionState(uiState);
      },
      error: (err) => {
        console.error('API state subscription error:', err);
        setError('Error receiving auction updates');
      }
    });

    return () => subscription.unsubscribe();
  }, [auctionAPI]);
  
  // API management functions
  const deployNewAuction = async (productName: string, productDescription: string, minimumBid: number): Promise<void> => {
    setLoading(true);
    setError(null);
    try {

      const api = await AuctionAPI.deploy(providers || {} as any);
      await api.createAuction(productName, productDescription, dollarsToCents(minimumBid));
      setAuctionAPI(api);
      setIsConnected(true);
    } catch (err) {
      setError(`Error deploying auction: ${err instanceof Error ? err.message : 'Unknown error'}`);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const joinExistingAuction = async (contractAddress: string): Promise<void> => {
    setLoading(true);
    setError(null);
    try {

      const api = await AuctionAPI.join(providers || {} as any, contractAddress as any);
      setAuctionAPI(api);
      setIsConnected(true);
    } catch (err) {
      setError(`Error joining auction: ${err instanceof Error ? err.message : 'Unknown error'}`);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const joinAuction = async (): Promise<void> => {
    // This function is now deprecated in favor of joinExistingAuction
    // Keep for backward compatibility
    setError('Please use the join buttons on the home page to connect to an auction');
  };

  const submitBid = async (bidAmount: number): Promise<void> => {
    if (!auctionAPI) {
      throw new Error('Not connected to an auction. Please join an auction first.');
    }

    if (bidAmount < auctionState.auction.minimumBidValue) {
      throw new Error(`The bid must be greater than $${auctionState.auction.minimumBidValue}`);
    }

    if (auctionState.auction.currentRound !== AuctionRound.BIDDING) {
      throw new Error('Bids can only be submitted during the bidding phase');
    }

    setLoading(true);
    setError(null);
    try {
      await auctionAPI.submitBid(dollarsToCents(bidAmount));
      // State will be updated automatically via the subscription
    } catch (err) {
      setError(`Error submitting bid: ${err instanceof Error ? err.message : 'Unknown error'}`);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const revealBid = async (): Promise<void> => {
    // This function is no longer used - the auctioneer reveals bids automatically
    throw new Error('Users cannot reveal their own bids. The auctioneer reveals them automatically.');
  };

  const refreshAuctionData = async (): Promise<void> => {
    if (!auctionAPI) {
      setError('Not connected to an auction');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await auctionAPI.refreshState();
      // State will be updated automatically via the subscription
    } catch (err) {
      setError(`Error refreshing auction data: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  // Auctioneer control functions
  const startBiddingPhase = async (): Promise<void> => {
    if (!auctionAPI) {
      throw new Error('Not connected to an auction');
    }

    setLoading(true);
    setError(null);
    try {
      // Note: This function might not be needed as auctions start in bidding phase
      // Keeping for compatibility, but it's essentially a no-op
      await auctionAPI.refreshState();
    } catch (err) {
      setError(`Error starting bidding phase: ${err instanceof Error ? err.message : 'Unknown error'}`);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const closeBidding = async (): Promise<void> => {
    if (!auctionAPI) {
      throw new Error('Not connected to an auction');
    }

    setLoading(true);
    setError(null);
    try {
      await auctionAPI.closeBidding();
    } catch (err) {
      setError(`Error closing bidding: ${err instanceof Error ? err.message : 'Unknown error'}`);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const startRevealingPhase = async (): Promise<void> => {
    if (!auctionAPI) {
      throw new Error('Not connected to an auction');
    }

    setLoading(true);
    setError(null);
    try {
      await auctionAPI.startRevealing();
    } catch (err) {
      setError(`Error starting revealing phase: ${err instanceof Error ? err.message : 'Unknown error'}`);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const finishAuction = async (): Promise<void> => {
    if (!auctionAPI) {
      throw new Error('Not connected to an auction');
    }

    setLoading(true);
    setError(null);
    try {
      await auctionAPI.finishAuction();
    } catch (err) {
      setError(`Error finishing auction: ${err instanceof Error ? err.message : 'Unknown error'}`);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value: AuctionContextType = {
    auctionState,
    submitBid,
    revealBid,
    joinAuction,
    refreshAuctionData,
    // Auctioneer control functions
    startBiddingPhase,
    closeBidding,
    startRevealingPhase,
    finishAuction,
    revealSpecificBid,
    // API management
    deployNewAuction,
    joinExistingAuction,
    loading,
    error,
    isConnected,
  };

  return (
    <AuctionContext.Provider value={value}>
      {children}
    </AuctionContext.Provider>
  );
}

export function useAuction(): AuctionContextType {
  const context = useContext(AuctionContext);
  if (context === undefined) {
    throw new Error('useAuction debe ser usado dentro de un AuctionProvider');
  }
  return context;
}
