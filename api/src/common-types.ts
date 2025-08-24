// Bulletin board common types and abstractions.

import { type MidnightProviders } from '@midnight-ntwrk/midnight-js-types';
import { type FoundContract } from '@midnight-ntwrk/midnight-js-contracts';
import {GAME_STATE, RockPaperScissorsPrivateState, Contract, Witnesses, PLAY} from '../../contract/src/index';

export const rpsPrivateStateKey = 'rpsPrivateState';
export type PrivateStateId = typeof rpsPrivateStateKey;

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
   * Key used to provide the private state for {@link RPSContract} deployments.
   */
  readonly rpsPrivateState: RockPaperScissorsPrivateState;
};

/**
 * Represents a bulletin board contract and its private state.
 *
 * @public
 */
export type RPSContract = Contract<RockPaperScissorsPrivateState, Witnesses<RockPaperScissorsPrivateState>>;

/**
 * The keys of the circuits exported from {@link RPSContract}.
 *
 * @public
 */
export type RPSCircuitKeys = Exclude<keyof RPSContract['impureCircuits'], number | symbol>;

/**
 * The providers required by {@link RPSContract}.
 *
 * @public
 */
export type RPSProviders = MidnightProviders<RPSCircuitKeys, PrivateStateId, RockPaperScissorsPrivateState>;

/**
 * A {@link RPSContract} that has been deployed to the network.
 *
 * @public
 */
export type DeployedRPSContract = FoundContract<RPSContract>;

/**
 * A type that represents the derived combination of public (or ledger), and private state.
 */
export type RPSDerivedState = {
  readonly game_state: GAME_STATE;
  readonly encrypted_play_a: { is_some: boolean, value: Uint8Array };
  readonly encrypted_play_b: { is_some: boolean, value: Uint8Array };
  readonly clear_play_a: { is_some: boolean, value: [PLAY, Uint8Array] };
  readonly clear_play_b: { is_some: boolean, value: [PLAY, Uint8Array] };
  readonly winner: Uint8Array;
  readonly secret_key: Uint8Array;
};

// TODO: for some reason I needed to include "@midnight-ntwrk/wallet-sdk-address-format": "1.0.0-rc.1", should we bump in to rc-2 ?
