// Data types for the Midnauction auction system

export interface AuctionData {
  // Public auction data
  productName: string;
  productDescription: string;
  minimumBidValue: number;
  auctioneerPublicKey: string;
  currentRound: AuctionRound;
  totalBids: number; // Total number of bids submitted (= participants)
  revealedBids: RevealedBid[]; // Revealed bid values from people who already revealed
}

export enum AuctionRound {
  BIDDING = 'bidding', // Private bidding round - users join by bidding
  REVEALING = 'revealing', // Revelation round
  FINISHED = 'finished' // Auction finished
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
