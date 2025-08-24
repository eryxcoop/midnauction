import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuctionState, AuctionData, AuctionRound, PrivateBid, RevealedBid } from '../types';

interface AuctionContextType {
  auctionState: AuctionState;
  submitBid: (bidAmount: number) => Promise<void>;
  revealBid: () => Promise<void>;
  joinAuction: () => Promise<void>;
  refreshAuctionData: () => Promise<void>;
  loading: boolean;
  error: string | null;
}

const AuctionContext = createContext<AuctionContextType | undefined>(undefined);

// Mock data para la subasta
const createMockAuctionData = (): AuctionData => ({
  productName: "MacBook Pro M3 16\"",
  productDescription: "Laptop MacBook Pro de 16 pulgadas con chip M3, 32GB RAM, 1TB SSD. Estado: Nuevo, sin abrir.",
  minimumBidValue: 1500,
  auctioneerPublicKey: "0x1234567890abcdef...",
  currentRound: AuctionRound.BIDDING, // Comenzar directamente en fase de ofertas
  totalBids: 2, // Ofertas ya realizadas
  revealedBids: [
    // Simular algunas ofertas que el martillero ya reveló
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
    // Inicialmente cualquiera puede enviar ofertas para unirse
    canSubmitBid: true, // Comienza habilitado para que puedan unirse
    canRevealBid: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Simular cambio de rondas después de un tiempo
  useEffect(() => {
    // Cerrar las ofertas después de 20 segundos
    const closeBiddingTimer = setTimeout(() => {
      setAuctionState(prev => ({
        ...prev,
        canSubmitBid: false, // Ya no se pueden enviar más ofertas
      }));
    }, 20000); // Cerrar ofertas después de 20 segundos

    // Cambiar a revelación después de 30 segundos
    const biddingToRevealingTimer = setTimeout(() => {
      setAuctionState(prev => ({
        ...prev,
        auction: {
          ...prev.auction,
          currentRound: AuctionRound.REVEALING,
        },
        canRevealBid: false, // Los usuarios no revelan sus propias ofertas
        canSubmitBid: false, // Asegurar que no se puedan enviar ofertas
      }));
    }, 30000); // Cambiar a revelación después de 30 segundos

    // Simular revelaciones automáticas del martillero durante la fase de revelación
    const revealTimer1 = setTimeout(() => {
      setAuctionState(prev => ({
        ...prev,
        auction: {
          ...prev.auction,
          revealedBids: [
            ...prev.auction.revealedBids,
            { participantId: "user3", bidAmount: 2100, timestamp: Date.now() }
          ]
        }
      }));
    }, 35000); // Primera revelación a los 35s

    const revealTimer2 = setTimeout(() => {
      setAuctionState(prev => ({
        ...prev,
        auction: {
          ...prev.auction,
          revealedBids: [
            ...prev.auction.revealedBids,
            { participantId: "user4", bidAmount: 1950, timestamp: Date.now() }
          ]
        }
      }));
    }, 45000); // Segunda revelación a los 45s

    // Cambiar a finalizada después de 60 segundos
    const revealingToFinishedTimer = setTimeout(() => {
      setAuctionState(prev => ({
        ...prev,
        auction: {
          ...prev.auction,
          currentRound: AuctionRound.FINISHED,
        },
        canRevealBid: false,
        canSubmitBid: false,
      }));
    }, 60000); // Cambiar a finalizada después de 60 segundos

    return () => {
      clearTimeout(closeBiddingTimer);
      clearTimeout(biddingToRevealingTimer);
      clearTimeout(revealTimer1);
      clearTimeout(revealTimer2);
      clearTimeout(revealingToFinishedTimer);
    };
  }, []);

  const joinAuction = async (): Promise<void> => {
    // Esta función ya no se usa - la unión se hace automáticamente al enviar la primera oferta
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
      setError('Error al unirse a la subasta');
    } finally {
      setLoading(false);
    }
  };

  const submitBid = async (bidAmount: number): Promise<void> => {
    if (bidAmount < auctionState.auction.minimumBidValue) {
      throw new Error(`La oferta debe ser mayor a $${auctionState.auction.minimumBidValue}`);
    }

    if (auctionState.auction.currentRound !== AuctionRound.BIDDING) {
      throw new Error('Solo se pueden enviar ofertas durante la fase de ofertas');
    }

    setLoading(true);
    setError(null);
    try {
      // Simular creación de commitment
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
          isParticipant: true, // Se une automáticamente al enviar la primera oferta
          canSubmitBid: false, // Ya no puede enviar más ofertas
          auction: {
            ...prev.auction,
            totalBids: isFirstBid ? prev.auction.totalBids + 1 : prev.auction.totalBids,
          }
        };
      });
    } catch (err) {
      setError('Error al enviar la oferta');
    } finally {
      setLoading(false);
    }
  };

  const revealBid = async (): Promise<void> => {
    // Esta función ya no se usa - el martillero revela las ofertas automáticamente
    throw new Error('Los usuarios no pueden revelar sus propias ofertas. El martillero las revela automáticamente.');
  };

  const refreshAuctionData = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // En una implementación real, aquí se haría fetch a la API
      setAuctionState(prev => ({
        ...prev,
        auction: {
          ...prev.auction,
          // Simular algunos cambios aleatorios
          privateBidsCount: Math.min(prev.auction.participantCount, prev.auction.privateBidsCount + Math.floor(Math.random() * 2)),
        }
      }));
    } catch (err) {
      setError('Error al actualizar los datos');
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
