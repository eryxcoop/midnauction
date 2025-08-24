
/**
 * Provides types and utilities for working with rps contracts.
 */

import contractModule from '../../contract/src/managed/rock_paper_scissors/contract/index.cjs';
import {type ContractAddress} from '@midnight-ntwrk/compact-runtime';
import {type Logger} from 'pino';
import {
  type DeployedRPSContract,
  type RPSContract,
  type RPSDerivedState,
  rpsPrivateStateKey,
  type RPSProviders,
} from './common-types.js';
import {createRockPaperScissorsPrivateState, RockPaperScissorsPrivateState, witnesses} from '../../contract/src/index';
import * as utils from './utils/index.js';
import {deployContract, findDeployedContract} from '@midnight-ntwrk/midnight-js-contracts';
import {combineLatest, from, map, type Observable, tap} from 'rxjs';

const { Contract, ledger } = contractModule;

const rpsContractInstance: RPSContract = new Contract(witnesses);

export interface DeployedRPSAPI {
  readonly deployedContractAddress: ContractAddress;
  readonly state$: Observable<RPSDerivedState>;

  choose_encrypted_a: (play: contractModule.PLAY, name: Uint8Array) => Promise<void>;
  choose_encrypted_b: (play: contractModule.PLAY, name: Uint8Array) => Promise<void>;
  move_to_reveal: () => Promise<void>;
  reveal_a: (play: contractModule.PLAY, name: Uint8Array) => Promise<void>;
  reveal_b: (play: contractModule.PLAY, name: Uint8Array) => Promise<void>;
  compare_and_resolve: () => Promise<void>;
  restart_game: () => Promise<void>;
}

export class RPSAPI implements DeployedRPSAPI {
  /** @internal */
  private constructor(
    public readonly deployedContract: DeployedRPSContract,
    providers: RPSProviders,
    private readonly logger?: Logger,
  ) {
    this.deployedContractAddress = deployedContract.deployTxData.public.contractAddress;
    this.state$ = combineLatest(
      [
        // Combine public (ledger) state with...
        providers.publicDataProvider.contractStateObservable(this.deployedContractAddress, { type: 'latest' }).pipe(
          map((contractState) => ledger(contractState.data)),
          tap((ledgerState) =>
            logger?.trace({
              ledgerStateChanged: {
                ledgerState
              },
            }),
          ),
        ),
        // ...private state...
        //    since the private state of the bulletin board application never changes, we can query the
        //    private state once and always use the same value with `combineLatest`. In applications
        //    where the private state is expected to change, we would need to make this an `Observable`.
        from(providers.privateStateProvider.get(rpsPrivateStateKey) as Promise<RockPaperScissorsPrivateState>),
      ],
      // ...and combine them to produce the required derived state.
      (ledgerState, privateState) => {

        return {
          game_state: ledgerState.game_state,
          encrypted_play_a: ledgerState.encrypted_play_a,
          encrypted_play_b: ledgerState.encrypted_play_b,
          clear_play_a: ledgerState.clear_play_a,
          clear_play_b: ledgerState.clear_play_b,
          winner: ledgerState.winner,
          secret_key: privateState.localGameSecretKey,
        }
      },
    );
  }

  /**
   * Gets the address of the current deployed contract.
   */
  readonly deployedContractAddress: ContractAddress;

  /**
   * Gets an observable stream of state changes based on the current public (ledger),
   * and private state data.
   */
  readonly state$: Observable<RPSDerivedState>;

  /**
   * Attempts to post a given message to the bulletin board.
   *
   *
   * @remarks
   * This method can fail during local circuit execution if the bulletin board is currently occupied.
   * @param play
   * @param name
   */

  async choose_encrypted_a(play: contractModule.PLAY, name: Uint8Array): Promise<void> {
    this.logger?.info(`choose_encrypted_a: ${play} - ${name}`);
    const txData = await this.deployedContract.callTx.choose_encrypted_a(play, name);
    this.logger?.trace({
      transactionAdded: {
        circuit: 'choose_encrypted_a',
        txHash: txData.public.txHash,
        blockHeight: txData.public.blockHeight,
      },
    });
  }

  async choose_encrypted_b(play: contractModule.PLAY, name: Uint8Array): Promise<void> {
    this.logger?.info(`choose_encrypted_b: ${play} - ${name}`);
    const txData = await this.deployedContract.callTx.choose_encrypted_b(play, name);
    this.logger?.trace({
      transactionAdded: {
        circuit: 'choose_encrypted_b',
        txHash: txData.public.txHash,
        blockHeight: txData.public.blockHeight,
      },
    });
  }

  async move_to_reveal(): Promise<void> {
    this.logger?.info(`move_to_reveal`);
    const txData = await this.deployedContract.callTx.move_to_reveal();
    this.logger?.trace({
      transactionAdded: {
        circuit: 'move_to_reveal',
        txHash: txData.public.txHash,
        blockHeight: txData.public.blockHeight,
      },
    });
  }

  async reveal_a(play: contractModule.PLAY, name: Uint8Array): Promise<void> {
    this.logger?.info(`reveal_a: ${play} - ${name}`);
    const txData = await this.deployedContract.callTx.reveal_a(play, name);
    this.logger?.trace({
      transactionAdded: {
        circuit: 'reveal_a',
        txHash: txData.public.txHash,
        blockHeight: txData.public.blockHeight,
      },
    });
  }

  async reveal_b(play: contractModule.PLAY, name: Uint8Array): Promise<void> {
    this.logger?.info(`reveal_b: ${play} - ${name}`);
    const txData = await this.deployedContract.callTx.reveal_b(play, name);
    this.logger?.trace({
      transactionAdded: {
        circuit: 'reveal_b',
        txHash: txData.public.txHash,
        blockHeight: txData.public.blockHeight,
      },
    });
  }

  async compare_and_resolve(): Promise<void> {
    this.logger?.info(`compare_and_resolve`);
    const txData = await this.deployedContract.callTx.compare_and_resolve();
    this.logger?.trace({
      transactionAdded: {
        circuit: 'compare_and_resolve',
        txHash: txData.public.txHash,
        blockHeight: txData.public.blockHeight,
      },
    });
  }

  async restart_game(): Promise<void> {
    this.logger?.info(`restart_game`);
    const txData = await this.deployedContract.callTx.restart_game();
    this.logger?.trace({
      transactionAdded: {
        circuit: 'restart_game',
        txHash: txData.public.txHash,
        blockHeight: txData.public.blockHeight,
      },
    });
  }


  /**
   * Deploys a new bulletin board contract to the network.
   *
   * @param providers The bulletin board providers.
   * @param logger An optional 'pino' logger to use for logging.
   * @returns A `Promise` that resolves with a {@link RPSAPI} instance that manages the newly deployed
   * {@link DeployedRPSContract}; or rejects with a deployment error.
   */
  static async deploy(providers: RPSProviders, logger?: Logger): Promise<RPSAPI> {
    logger?.info('deployContract');

    // EXERCISE 5: FILL IN THE CORRECT ARGUMENTS TO deployContract
    const deployedRPSContract = await deployContract<typeof rpsContractInstance>(providers, {
      privateStateId: rpsPrivateStateKey,
      contract: rpsContractInstance,
      initialPrivateState: await RPSAPI.getPrivateState(providers),
    });

    logger?.trace({
      contractDeployed: {
        finalizedDeployTxData: deployedRPSContract.deployTxData.public,
      },
    });

    return new RPSAPI(deployedRPSContract, providers, logger);
  }

  /**
   * Finds an already deployed bulletin board contract on the network, and joins it.
   *
   * @param providers The bulletin board providers.
   * @param contractAddress The contract address of the deployed bulletin board contract to search for and join.
   * @param logger An optional 'pino' logger to use for logging.
   * @returns A `Promise` that resolves with a {@link RPSAPI} instance that manages the joined
   * {@link DeployedRPSContract}; or rejects with an error.
   */
  static async join(providers: RPSProviders, contractAddress: ContractAddress, logger?: Logger): Promise<RPSAPI> {
    logger?.info({
      joinContract: {
        contractAddress,
      },
    });

    const deployedRPSContract = await findDeployedContract<RPSContract>(providers, {
      contractAddress,
      contract: rpsContractInstance,
      privateStateId: rpsPrivateStateKey,
      initialPrivateState: await RPSAPI.getPrivateState(providers),
    });

    logger?.trace({
      contractJoined: {
        finalizedDeployTxData: deployedRPSContract.deployTxData.public,
      },
    });

    return new RPSAPI(deployedRPSContract, providers, logger);
  }

  private static async getPrivateState(providers: RPSProviders): Promise<RockPaperScissorsPrivateState> {
    const existingPrivateState = await providers.privateStateProvider.get(rpsPrivateStateKey);
    return existingPrivateState ?? createRockPaperScissorsPrivateState(utils.randomBytes(32));
  }
}

/**
 * A namespace that represents the exports from the `'utils'` sub-package.
 *
 * @public
 */
export * as utils from './utils/index.js';

export * from './common-types.js';
