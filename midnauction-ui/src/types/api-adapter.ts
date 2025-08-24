// Adapter types to bridge between the auction API and UI types

// Mock types for now since we don't have the actual auction-api package
type APIAuctionState = any;
type APIPublicState = any;
type APIRevealedBid = any;

// Mock enum values
const APIPhase = {
  BIDDING: 'bidding',
  REVEALING: 'revealing',
  FINISHED: 'finished'
} as const;

import { 
  AuctionState, 
  AuctionData, 
  AuctionRound, 
  RevealedBid,
  PrivateBid 
} from './auction';

/**
 * Converts API auction phase to UI auction round
 */
export function apiPhaseToUIRound(apiPhase: typeof APIPhase[keyof typeof APIPhase]): AuctionRound {
  switch (apiPhase) {
    case APIPhase.BIDDING:
      return AuctionRound.BIDDING;
    case APIPhase.REVEALING:
      return AuctionRound.REVEALING;
    case APIPhase.FINISHED:
      return AuctionRound.FINISHED;
    default:
      return AuctionRound.BIDDING;
  }
}

/**
 * Converts UI auction round to API auction phase
 */
export function uiRoundToAPIPhase(uiRound: AuctionRound): typeof APIPhase[keyof typeof APIPhase] {
  switch (uiRound) {
    case AuctionRound.BIDDING:
      return APIPhase.BIDDING;
    case AuctionRound.REVEALING:
      return APIPhase.REVEALING;
    case AuctionRound.FINISHED:
      return APIPhase.FINISHED;
    default:
      return APIPhase.BIDDING;
  }
}

/**
 * Converts API revealed bid to UI revealed bid
 */
export function apiRevealedBidToUI(apiBid: APIRevealedBid): RevealedBid {
  return {
    participantId: apiBid.participantId,
    bidAmount: Number(apiBid.bidAmount), // Convert bigint to number
    timestamp: Number(apiBid.timestamp), // Convert bigint to number
  };
}

/**
 * Converts API public state to UI auction data
 */
export function apiPublicStateToUIData(apiState: APIPublicState): AuctionData {
  return {
    productName: apiState.productName,
    productDescription: apiState.productDescription,
    minimumBidValue: Number(apiState.minimumBidValue), // Convert bigint to number
    auctioneerPublicKey: Array.from(apiState.auctioneerPublicKey).map((b: any) => b.toString(16).padStart(2, '0')).join(''),
    currentRound: apiPhaseToUIRound(apiState.currentPhase as any),
    totalBids: Number(apiState.totalBids), // Convert bigint to number
    revealedBids: apiState.revealedBids.map(apiRevealedBidToUI),
  };
}

/**
 * Converts API derived state to UI auction state
 */
export function apiStateToUIState(apiState: APIAuctionState): AuctionState {
  const uiAuctionData = apiPublicStateToUIData(apiState.publicState);
  
  // Convert current bid if it exists
  let currentUserBid: PrivateBid | undefined;
  if (apiState.myCurrentBid) {
    currentUserBid = {
      bidAmount: Number(apiState.myCurrentBid.bidAmount),
      nonce: Array.from(apiState.myCurrentBid.commitment || new Uint8Array()).map((b: any) => b.toString(16).padStart(2, '0')).join(''),
      commitment: Array.from(apiState.myCurrentBid.commitment || new Uint8Array()).map((b: any) => b.toString(16).padStart(2, '0')).join(''),
    };
  }

  return {
    auction: uiAuctionData,
    currentUserBid,
    isParticipant: apiState.hasSubmittedBid,
    canSubmitBid: apiState.canSubmitBid,
    canRevealBid: apiState.canRevealBid,
  };
}

/**
 * Converts number amounts (in dollars) to bigint (in cents)
 */
export function dollarsToCents(dollars: number): bigint {
  return BigInt(Math.round(dollars * 100));
}

/**
 * Converts bigint amounts (in cents) to number (in dollars)
 */
export function centsToDollars(cents: bigint): number {
  return Number(cents) / 100;
}
