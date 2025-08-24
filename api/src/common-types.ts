// Bulletin board common types and abstractions.

import { type MidnightProviders } from '@midnight-ntwrk/midnight-js-types';
import { type FoundContract } from '@midnight-ntwrk/midnight-js-contracts';
import {PHASE, MidnauctionPrivateState, Contract, Witnesses} from '../../contract/src/index';

export const midnauctionPrivateStateKey = 'midnauctionPrivateState';
export type PrivateStateId = typeof midnauctionPrivateStateKey;

/**
 * The private states consumed throughout the application.
 *
 * @remarks
 * {@link PrivateStates} can be thought of as a type that describes a schema for all
 * private states for all contracts used in the application. Each key represents
 * the type of private state consumed by a particular type of contract.
 * The key is used by the deployed contract when interacting with a private state provider,
 * and the type (i.e., `typeof PrivateStates[K]`) represents the type of private state
 * expected to be returned.
 *
 * Since there is only one contract type for the bulletin board example, we only define a
 * single key/type in the schema.
 *
 * @public
 */
export type PrivateStates = {
  /**
   * Key used to provide the private state for {@link MidnauctionContract} deployments.
   */
  readonly midnauctionPrivateState: MidnauctionPrivateState;
};

/**
 * Represents a bulletin board contract and its private state.
 *
 * @public
 */
export type MidnauctionContract = Contract<MidnauctionPrivateState, Witnesses<MidnauctionPrivateState>>;

/**
 * The keys of the circuits exported from {@link MidnauctionContract}.
 *
 * @public
 */
export type MidnauctionCircuitKeys = Exclude<keyof MidnauctionContract['impureCircuits'], number | symbol>;

/**
 * The providers required by {@link MidnauctionContract}.
 *
 * @public
 */
export type MidnauctionProviders = MidnightProviders<MidnauctionCircuitKeys, PrivateStateId, MidnauctionPrivateState>;

/**
 * A {@link MidnauctionContract} that has been deployed to the network.
 *
 * @public
 */
export type DeployedMidnauctionContract = FoundContract<MidnauctionContract>;

/**
 * A type that represents the derived combination of public (or ledger), and private state.
 */
export type MidnauctionDerivedState = {
    readonly productName: string;
    readonly productDescription: string;
    readonly rounds: bigint;
    readonly currentRound: bigint;
    readonly auctioneerPK: Uint8Array<any>;
    readonly registeredParticipants: Set<Uint8Array<any>>;
    readonly secretBids: Set<[Uint8Array<any>, Uint8Array<any>]>;
    readonly revealedBids: Set<bigint>;
    readonly phase: PHASE;
    readonly winnerEncryptedPublicKey: Uint8Array<any>;

};

