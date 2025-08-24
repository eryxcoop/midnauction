// Data types for the Midnauction auction system

export interface AuctionData {
  // Public auction data
  productName: string;
  productDescription: string;
  rounds: number; // Total number of rounds in the auction
  currentRound: number; // Current round number (1-based)
  auctioneerPK: string; // Auctioneer's public key
  phase: AuctionPhase; // Current phase of the auction
  registeredParticipants: number; // Number of registered participants
  secretBids: number; // Number of secret bids in current round
  revealedBids: RevealedBid[]; // Revealed bid values from current round
  winnerEncryptedPublicKey?: string; // Winner's encrypted public key (if auction finished)
}

export enum AuctionPhase {
  COMMITMENT = 'commitment', // Private bidding phase - users submit commitments
  REVEALING = 'revealing', // Revelation phase - users reveal their bids
  FINISHED = 'finished' // Auction finished
}

export interface RevealedBid {
  value: bigint; // Bid amount in smallest units
  timestamp?: number; // Optional timestamp
}

export interface PrivateBid {
  value: bigint; // Bid amount in smallest units
  bidNonce: Uint8Array; // Nonce used for bid commitment
  commitment?: string; // Hash of the bid + nonce (computed by contract)
}

export interface UserAuctionData {
  secretKey: Uint8Array; // User's secret key for identity commitment
  idNonce: Uint8Array; // Nonce used for identity commitment
  isRegistered: boolean; // Whether user is registered as participant
  bidsPerRound: Map<number, PrivateBid>; // Bids submitted per round
  hasRevealedInCurrentRound: boolean; // Whether user has revealed in current round
}

export interface AuctionState {
  auction: AuctionData;
  userData?: UserAuctionData;
  isParticipant: boolean;
  isAuctioneer: boolean;
  canSubmitBid: boolean;
  canRevealBid: boolean;
  canClaimWin: boolean;
  isConnected: boolean;
}

// Helper types for local storage
export interface StoredNonces {
  secretKey: Uint8Array;
  idNonce: Uint8Array;
  bidNonces: Map<number, Uint8Array>; // Round number -> bidNonce
}

export interface StoredAuctionData {
  contractAddress: string;
  nonces: StoredNonces;
  isRegistered: boolean;
  bidsPerRound: Map<number, { value: bigint; bidNonce: Uint8Array }>;
}
