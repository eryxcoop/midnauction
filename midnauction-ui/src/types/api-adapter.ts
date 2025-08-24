// Adapter types to bridge between the auction API and UI types

import { type MidnauctionDerivedState } from '../../../api/src/index';
import { 
  AuctionState, 
  AuctionData, 
  AuctionPhase, 
  RevealedBid,
  PrivateBid,
  UserAuctionData 
} from './auction';
import { getAuctionData } from '../utils/localStorage';

/**
 * Converts API auction phase to UI auction phase
 */
export function apiPhaseToUIPhase(apiPhase: any): AuctionPhase {
  // Handle both enum values and string values
  if (typeof apiPhase === 'number') {
    switch (apiPhase) {
      case 0: return AuctionPhase.COMMITMENT;
      case 1: return AuctionPhase.REVEALING;
      case 2: return AuctionPhase.FINISHED;
      default: return AuctionPhase.COMMITMENT;
    }
  }
  
  const phaseStr = String(apiPhase);
  switch (phaseStr) {
    case 'commitment':
      return AuctionPhase.COMMITMENT;
    case 'revealing':
      return AuctionPhase.REVEALING;
    case 'finished':
      return AuctionPhase.FINISHED;
    default:
      return AuctionPhase.COMMITMENT;
  }
}

/**
 * Converts API revealed bid to UI revealed bid
 */
export function apiRevealedBidToUI(apiBid: any): RevealedBid {
  return {
    value: BigInt(apiBid), // API reveals just the bid values as bigints
    timestamp: Date.now(), // Add current timestamp since API doesn't provide it
  };
}

/**
 * Converts API derived state to UI auction data
 */
export function apiStateToUIData(apiState: MidnauctionDerivedState): AuctionData {
  return {
    productName: apiState.productName || '',
    productDescription: apiState.productDescription || '',
    rounds: Number(apiState.rounds || 1),
    currentRound: Number(apiState.currentRound || 1),
    auctioneerPK: apiState.auctioneerPK ? Array.from(apiState.auctioneerPK).map((b: any) => b.toString(16).padStart(2, '0')).join('') : '',
    phase: apiPhaseToUIPhase(apiState.phase ?? 'commitment'),
    registeredParticipants: apiState.registeredParticipants 
      ? Number((apiState.registeredParticipants as any).size()) : 0,
    secretBids: apiState.secretBids 
      ? Number((apiState.secretBids as any).size()) : 0,
    revealedBids: apiState.revealedBids ? Array.from(apiState.revealedBids).map(apiRevealedBidToUI) : [],
    winnerEncryptedPublicKey: apiState.winnerEncryptedPublicKey ? Array.from(apiState.winnerEncryptedPublicKey).map((b: any) => b.toString(16).padStart(2, '0')).join('') : undefined,
  };
}

/**
 * Converts API derived state to UI auction state
 */
export function apiStateToUIState(
  apiState: MidnauctionDerivedState, 
  contractAddress: string,
  isAuctioneer: boolean = false
): AuctionState {
  const auctionData = apiStateToUIData(apiState);
  
  // Get stored user data for this auction
  const storedData = getAuctionData(contractAddress);
  let userData: UserAuctionData | undefined;
  
  if (storedData) {
    // Convert stored bids to PrivateBid format
    const bidsPerRound = new Map<number, PrivateBid>();
    for (const [round, bidData] of storedData.bidsPerRound) {
      bidsPerRound.set(round, {
        value: bidData.value,
        bidNonce: bidData.bidNonce,
      });
    }

    userData = {
      secretKey: storedData.nonces.secretKey,
      idNonce: storedData.nonces.idNonce,
      isRegistered: storedData.isRegistered,
      bidsPerRound,
      hasRevealedInCurrentRound: false, // This would need to be tracked separately
    };
  }

  const isParticipant = userData?.isRegistered || false;
  const canSubmitBid = auctionData.phase === AuctionPhase.COMMITMENT && (!isParticipant || !userData?.bidsPerRound.has(auctionData.currentRound));
  const canRevealBid = auctionData.phase === AuctionPhase.REVEALING && isParticipant && (userData?.bidsPerRound.has(auctionData.currentRound) || false);
  const canClaimWin = auctionData.phase === AuctionPhase.REVEALING && 
                     auctionData.currentRound === auctionData.rounds && 
                     isParticipant;

  return {
    auction: auctionData,
    userData,
    isParticipant,
    isAuctioneer,
    canSubmitBid,
    canRevealBid,
    canClaimWin,
    isConnected: true,
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