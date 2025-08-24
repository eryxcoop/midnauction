// Midnauction auction common types and abstractions.

import { type MidnightProviders } from '@midnight-ntwrk/midnight-js-types';
import {Contract, Witnesses} from '../../contract/src/index';
import {StateWithZswap} from '@midnight-ntwrk/compact-runtime';


// TODO: These types will need to be imported from the actual contract once it's created
// For now, we'll define placeholder types based on the auction system requirements

export const auctionPrivateStateKey = 'auctionPrivateState';
export type PrivateStateId = typeof auctionPrivateStateKey;

/**
 * Auction phases enum
 */
export enum AuctionPhase {
  BIDDING = 'bidding',
  REVEALING = 'revealing', 
  FINISHED = 'finished'
}

/**
 * Auction bid structure
 */
export interface AuctionBid {
  readonly bidAmount: bigint;
  readonly bidder: Uint8Array; // Public key of bidder
  readonly commitment: Uint8Array; // Hash commitment of the bid
  readonly timestamp: bigint;
}

/**
 * Revealed bid structure
 */
export interface RevealedBid {
  readonly participantId: string;
  readonly bidAmount: bigint;
  readonly nonce: Uint8Array;
  readonly timestamp: bigint;
}

/**
 * Auction private state - contains sensitive information for each participant
 */
export interface AuctionPrivateState {
  readonly participantSecretKey: Uint8Array;
  readonly myBids: AuctionBid[];
  readonly nonces: Map<string, Uint8Array>; // Nonces for bid commitments
}

/**
 * The private states consumed throughout the application.
 */
export type PrivateStates = {
  /**
   * Key used to provide the private state for {@link AuctionContract} deployments.
   */
  readonly auctionPrivateState: AuctionPrivateState;
};

/**
 * Represents an auction contract and its private state.
 */
export type AuctionContract = Contract<StateWithZswap<AuctionPrivateState>, Witnesses<StateWithZswap<AuctionPrivateState>>>;

/**
 * The keys of the circuits exported from {@link AuctionContract}.
 */
export type AuctionCircuitKeys = Exclude<keyof AuctionContract['impureCircuits'], number | symbol>;

/**
 * The providers required by {@link AuctionContract}.
 */
export type AuctionProviders = MidnightProviders<AuctionCircuitKeys, PrivateStates>;

/**
 * A {@link AuctionContract} that has been deployed to the network.
 */
export type DeployedAuctionContract = any; // TODO: Replace with actual deployed contract type

/**
 * Public auction state - visible to all participants
 */
export interface PublicAuctionState {
  readonly productName: string;
  readonly productDescription: string;
  readonly minimumBidValue: bigint;
  readonly auctioneerPublicKey: Uint8Array;
  readonly currentPhase: AuctionPhase;
  readonly totalBids: bigint;
  readonly revealedBids: RevealedBid[];
  readonly auctionStartTime: bigint;
  readonly biddingEndTime?: bigint;
  readonly revealingEndTime?: bigint;
}

/**
 * A type that represents the derived combination of public (ledger) and private state.
 */
export type AuctionDerivedState = {
  readonly publicState: PublicAuctionState;
  readonly privateState: AuctionPrivateState;
  readonly isAuctioneer: boolean;
  readonly canSubmitBid: boolean;
  readonly canRevealBid: boolean;
  readonly hasSubmittedBid: boolean;
  readonly myCurrentBid?: AuctionBid;
};
