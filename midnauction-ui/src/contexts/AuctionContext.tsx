import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuctionState, AuctionData, AuctionRound, PrivateBid, RevealedBid } from '../types';

interface AuctionContextType {
  auctionState: AuctionState;
  submitBid: (bidAmount: number) => Promise<void>;
  revealBid: () => Promise<void>;
  joinAuction: () => Promise<void>;
  refreshAuctionData: () => Promise<void>;
  // Funciones de control del martillero
  startBiddingPhase: () => Promise<void>;
  closeBidding: () => Promise<void>;
  startRevealingPhase: () => Promise<void>;
  finishAuction: () => Promise<void>;
  revealSpecificBid: (participantId: string, bidAmount: number) => Promise<void>;
  loading: boolean;
  error: string | null;
}

const AuctionContext = createContext<AuctionContextType | undefined>(undefined);

  // Mock data for the auction
const createMockAuctionData = (): AuctionData => ({
  productName: "MacBook Pro M3 16\"",
  productDescription: "Laptop MacBook Pro de 16 pulgadas con chip M3, 32GB RAM, 1TB SSD. Estado: Nuevo, sin abrir.",
  minimumBidValue: 1500,
  auctioneerPublicKey: "0x1234567890abcdef...",
  currentRound: AuctionRound.BIDDING,
  totalBids: 2,
  revealedBids: [
    { participantId: "user1", bidAmount: 1800, timestamp: Date.now() - 120000 },
    { participantId: "user2", bidAmount: 1650, timestamp: Date.now() - 90000 },
  ]
});

interface AuctionProviderProps {
  children: ReactNode;
}

export function AuctionProvider({ children }: AuctionProviderProps) {
  const [auctionState, setAuctionState] = useState<AuctionState>({
    auction: createMockAuctionData(),
    isParticipant: false,
    canSubmitBid: true,
    canRevealBid: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const joinAuction = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setAuctionState(prev => ({
        ...prev,
        isParticipant: true,
        canSubmitBid: prev.auction.currentRound === AuctionRound.BIDDING,
        auction: {
          ...prev.auction,
          participantCount: prev.auction.participantCount + 1,
        }
      }));
    } catch (err) {
      setError('Error joining the auction');
    } finally {
      setLoading(false);
    }
  };

  const submitBid = async (bidAmount: number): Promise<void> => {
    if (bidAmount < auctionState.auction.minimumBidValue) {
      throw new Error(`The bid must be greater than $${auctionState.auction.minimumBidValue}`);
    }

    if (auctionState.auction.currentRound !== AuctionRound.BIDDING) {
      throw new Error('Bids can only be submitted during the bidding phase');
    }

    setLoading(true);
    setError(null);
    try {
      // Simulate commitment creation
      const nonce = Math.random().toString(36).substring(7);
      const commitment = `hash_${bidAmount}_${nonce}`;
      
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const privateBid: PrivateBid = {
        bidAmount,
        nonce,
        commitment,
      };

      setAuctionState(prev => {
        const isFirstBid = !prev.isParticipant;
        return {
          ...prev,
          currentUserBid: privateBid,
                  isParticipant: true, // Automatically joins when submitting the first bid
        canSubmitBid: false, // Can no longer submit more bids
          auction: {
            ...prev.auction,
            totalBids: isFirstBid ? prev.auction.totalBids + 1 : prev.auction.totalBids,
          }
        };
      });
    } catch (err) {
      setError('Error submitting the bid');
    } finally {
      setLoading(false);
    }
  };

  const revealBid = async (): Promise<void> => {
    // This function is no longer used - the auctioneer reveals bids automatically
    throw new Error('Users cannot reveal their own bids. The auctioneer reveals them automatically.');
  };

  const refreshAuctionData = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real implementation, this would fetch from the API
      setAuctionState(prev => ({
        ...prev,
        auction: {
          ...prev.auction,
          // Simulate some random changes
          totalBids: Math.min(prev.auction.totalBids + Math.floor(Math.random() * 2), 10),
        }
      }));
    } catch (err) {
      setError('Error updating data');
    } finally {
      setLoading(false);
    }
  };

  // Auctioneer control functions
  const startBiddingPhase = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setAuctionState(prev => ({
        ...prev,
        auction: {
          ...prev.auction,
          currentRound: AuctionRound.BIDDING,
        },
        canSubmitBid: true, // Enable bids
      }));
    } catch (err) {
      setError('Error starting the bidding phase');
    } finally {
      setLoading(false);
    }
  };

  const closeBidding = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setAuctionState(prev => ({
        ...prev,
        canSubmitBid: false, // Close bids
      }));
    } catch (err) {
      setError('Error closing the bids');
    } finally {
      setLoading(false);
    }
  };

  const startRevealingPhase = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setAuctionState(prev => ({
        ...prev,
        auction: {
          ...prev.auction,
          currentRound: AuctionRound.REVEALING,
        },
        canSubmitBid: false, // Ensure no bids can be submitted
      }));
    } catch (err) {
      setError('Error starting the revelation phase');
    } finally {
      setLoading(false);
    }
  };

  const finishAuction = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setAuctionState(prev => ({
        ...prev,
        auction: {
          ...prev.auction,
          currentRound: AuctionRound.FINISHED,
        },
        canSubmitBid: false,
        canRevealBid: false,
      }));
    } catch (err) {
      setError('Error finishing the auction');
    } finally {
      setLoading(false);
    }
  };

  const revealSpecificBid = async (participantId: string, bidAmount: number): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newRevealedBid: RevealedBid = {
        participantId,
        bidAmount,
        timestamp: Date.now(),
      };

      setAuctionState(prev => ({
        ...prev,
        auction: {
          ...prev.auction,
          revealedBids: [...prev.auction.revealedBids, newRevealedBid],
        }
      }));
    } catch (err) {
      setError('Error revealing the bid');
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
    loading,
    error,
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
