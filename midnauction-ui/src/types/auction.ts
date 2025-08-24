// Tipos de datos para el sistema de subastas Midnauction

export interface AuctionData {
  // Datos públicos de la subasta
  productName: string;
  productDescription: string;
  minimumBidValue: number;
  auctioneerPublicKey: string;
  currentRound: AuctionRound;
  totalBids: number; // Número total de ofertas realizadas (= participantes)
  revealedBids: RevealedBid[]; // Valores revelados de la gente que ya reveló
}

export enum AuctionRound {
  BIDDING = 'bidding', // Ronda de ofertas privadas - los usuarios se unen ofertando
  REVEALING = 'revealing', // Ronda de revelación
  FINISHED = 'finished' // Subasta terminada
}

export interface RevealedBid {
  participantId: string;
  bidAmount: number;
  timestamp: number;
}

export interface PrivateBid {
  bidAmount: number;
  nonce: string; // Para commitment scheme
  commitment: string; // Hash del bid + nonce
}

export interface AuctionParticipant {
  id: string;
  publicKey: string;
  hasSubmittedBid: boolean;
  hasRevealedBid: boolean;
  revealedBid?: RevealedBid;
}

export interface AuctionState {
  auction: AuctionData;
  currentUserBid?: PrivateBid;
  isParticipant: boolean;
  canSubmitBid: boolean;
  canRevealBid: boolean;
}
