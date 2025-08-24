/**
 * Provides types and utilities for working with Midnauction auction contracts.
 */


import { type ContractAddress } from '@midnight-ntwrk/compact-runtime';
import { type Logger } from 'pino';
import {
  type DeployedAuctionContract,
  type AuctionDerivedState,
  type AuctionProviders,
  type AuctionPrivateState,
  auctionPrivateStateKey
} from './common-types.js';
import * as utils from './utils/index.js';

import { deployContract, findDeployedContract } from '@midnight-ntwrk/midnight-js-contracts';
import { combineLatest, from, type Observable, tap } from 'rxjs';
import { createMidauctionPrivateState, witnesses } from '../../contract/src/index';

import contractModule from '../../contract/dist/managed/midnauction/contract/index.cjs';
const { Contract } = contractModule;

const auctionContractInstance = new Contract(witnesses);

// Interface for the ledger state returned by the contract
interface LedgerState {
  productName: string;
  productDescription: string;
  minimumBidValue: bigint;
  auctioneerPublicKey: Uint8Array;
  currentPhase: string;
  totalBids: bigint;
  revealedBids: any[];
  auctionStartTime: bigint;
  biddingEndTime?: bigint;
  revealingEndTime?: bigint;
  isAuctioneer: boolean;
  canSubmitBid: boolean;
  canRevealBid: boolean;
}

export interface DeployedAuctionAPI {
  readonly deployedContractAddress: ContractAddress;
  readonly state$: Observable<AuctionDerivedState>;

  // Auctioneer functions
  createAuction: (productName: string, productDescription: string, minimumBid: bigint) => Promise<void>;
  closeBidding: () => Promise<void>;
  startRevealing: () => Promise<void>;
  finishAuction: () => Promise<void>;
  
  // Participant functions
  submitBid: (bidAmount: bigint) => Promise<void>;
  revealBid: (bidAmount: bigint, nonce: Uint8Array) => Promise<void>;
  
  // Utility functions
  refreshState: () => Promise<void>;
}

export class AuctionAPI implements DeployedAuctionAPI {
  /** @internal */
  private constructor(
    public readonly deployedContract: DeployedAuctionContract,
    _providers: AuctionProviders,
    private readonly logger?: Logger,
  ) {
    this.deployedContractAddress = (deployedContract as any).deployTxData?.public?.contractAddress;
    this.state$ = combineLatest(
      [
        // Combine public (ledger) state with...
        // TODO: Replace with actual provider call when ready
        from(this.deployedContract.queryState()).pipe(
          tap((ledgerState) =>
            logger?.trace({
              ledgerStateChanged: {
                ledgerState
              },
            }),
          ),
        ),
        // ...private state...
        from(Promise.resolve({
          participantSecretKey: utils.randomBytes(32),
          myBids: [],
          nonces: new Map(),
        } as AuctionPrivateState)),
      ],
      // ...and combine them to produce the required derived state.
      (ledgerState, privateState) => {
        // TODO: This will need to be updated based on the actual contract state structure
        const typedLedgerState = ledgerState as LedgerState;
        return {
          publicState: {
            productName: typedLedgerState.productName,
            productDescription: typedLedgerState.productDescription,
            minimumBidValue: typedLedgerState.minimumBidValue,
            auctioneerPublicKey: typedLedgerState.auctioneerPublicKey,
            currentPhase: typedLedgerState.currentPhase,
            totalBids: typedLedgerState.totalBids,
            revealedBids: typedLedgerState.revealedBids,
            auctionStartTime: typedLedgerState.auctionStartTime,
            biddingEndTime: typedLedgerState.biddingEndTime,
            revealingEndTime: typedLedgerState.revealingEndTime,
          },
          privateState,
          isAuctioneer: typedLedgerState.isAuctioneer,
          canSubmitBid: typedLedgerState.canSubmitBid,
          canRevealBid: typedLedgerState.canRevealBid,
          hasSubmittedBid: (privateState as AuctionPrivateState).myBids.length > 0,
          myCurrentBid: (privateState as AuctionPrivateState).myBids[(privateState as AuctionPrivateState).myBids.length - 1],
        } as AuctionDerivedState;
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
  readonly state$: Observable<AuctionDerivedState>;

  /**
   * Creates a new auction (auctioneer only).
   * 
   * @param productName Name of the product being auctioned
   * @param productDescription Description of the product
   * @param minimumBid Minimum bid amount in the smallest currency unit
   */
  async createAuction(productName: string, productDescription: string, minimumBid: bigint): Promise<void> {
    this.logger?.info(`Creating auction: ${productName}, minimum bid: ${minimumBid}`);
    const txData = await (this.deployedContract as any).callTx?.createAuction?.(productName, productDescription, minimumBid);
    this.logger?.trace({
      transactionAdded: {
        circuit: 'createAuction',
        txHash: txData.public.txHash,
        blockHeight: txData.public.blockHeight,
      },
    });
  }

  /**
   * Submits a private bid to the auction.
   * 
   * @param bidAmount The bid amount in the smallest currency unit
   */
  async submitBid(bidAmount: bigint): Promise<void> {
    this.logger?.info(`Submitting bid: ${bidAmount}`);
    
    // Generate nonce and create commitment
    const nonce = utils.randomBytes(32);
    const commitment = await utils.createBidCommitment(bidAmount, nonce);
    
    const txData = await (this.deployedContract as any).callTx?.submitBid?.(bidAmount, commitment)
    this.logger?.trace({
      transactionAdded: {
        circuit: 'submitBid',
        txHash: txData.public.txHash,
        blockHeight: txData.public.blockHeight,
      },
    });
  }

  /**
   * Closes the bidding phase (auctioneer only).
   */
  async closeBidding(): Promise<void> {
    this.logger?.info('Closing bidding phase');
    const txData = await (this.deployedContract as any).callTx?.closeBidding?.()
    this.logger?.trace({
      transactionAdded: {
        circuit: 'closeBidding',
        txHash: txData.public.txHash,
        blockHeight: txData.public.blockHeight,
      },
    });
  }

  /**
   * Starts the revealing phase (auctioneer only).
   */
  async startRevealing(): Promise<void> {
    this.logger?.info('Starting revealing phase');
    const txData = await (this.deployedContract as any).callTx?.startRevealing?.() || {
      //TODO UNMOCK
      public: { txHash: 'mock-hash', blockHeight: 0 }
    };
    this.logger?.trace({
      transactionAdded: {
        circuit: 'startRevealing',
        txHash: txData.public.txHash,
        blockHeight: txData.public.blockHeight,
      },
    });
  }

  /**
   * Reveals a previously submitted bid.
   * 
   * @param bidAmount The original bid amount
   * @param nonce The nonce used in the original commitment
   */
  async revealBid(bidAmount: bigint, nonce: Uint8Array): Promise<void> {
    this.logger?.info(`Revealing bid: ${bidAmount}`);
    const txData = await (this.deployedContract as any).callTx?.revealBid?.(bidAmount, nonce)
    this.logger?.trace({
      transactionAdded: {
        circuit: 'revealBid',
        txHash: txData.public.txHash,
        blockHeight: txData.public.blockHeight,
      },
    });
  }

  /**
   * Finishes the auction and determines the winner (auctioneer only).
   */
  async finishAuction(): Promise<void> {
    this.logger?.info('Finishing auction');
    const txData = await (this.deployedContract as any).callTx?.finishAuction?.()
    this.logger?.trace({
      transactionAdded: {
        circuit: 'finishAuction',
        txHash: txData.public.txHash,
        blockHeight: txData.public.blockHeight,
      },
    });
  }

  /**
   * Refreshes the current state (utility function).
   */
  async refreshState(): Promise<void> {
    this.logger?.info('Refreshing auction state');
    // This would trigger a state refresh in a real implementation
    // For now, it's just a placeholder
  }

  /**
   * Deploys a new auction contract to the network.
   *
   * @param providers The auction providers.
   * @param logger An optional 'pino' logger to use for logging.
   * @returns A `Promise` that resolves with a {@link AuctionAPI} instance that manages the newly deployed
   * {@link DeployedAuctionContract}; or rejects with a deployment error.
   */
  static async deploy(providers: AuctionProviders, logger?: Logger): Promise<AuctionAPI> {
    logger?.info('Deploying auction contract');

    const initialPrivateState = await AuctionAPI.getPrivateState(providers)
    const deployedAuctionContract: DeployedAuctionContract = await (deployContract as any)(
      providers, auctionPrivateStateKey, initialPrivateState, auctionContractInstance
    );

    return new AuctionAPI(deployedAuctionContract, providers, logger);
  }

  /**
   * Finds an already deployed auction contract on the network, and joins it.
   *
   * @param providers The auction providers.
   * @param contractAddress The contract address of the deployed auction contract to search for and join.
   * @param logger An optional 'pino' logger to use for logging.
   * @returns A `Promise` that resolves with a {@link AuctionAPI} instance that manages the joined
   * {@link DeployedAuctionContract}; or rejects with an error.
   */
  static async join(providers: AuctionProviders, contractAddress: ContractAddress, logger?: Logger): Promise<AuctionAPI> {
    logger?.info({
      joinContract: {
        contractAddress,
      },
    });

    const initialPrivateState = await AuctionAPI.getPrivateState(providers)
    const deployedAuctionContract: DeployedAuctionContract = await (findDeployedContract as any)(
      providers, contractAddress, auctionContractInstance, {privateStateKey: auctionPrivateStateKey, initialPrivateState}, 
    );

    logger?.trace({
      contractJoined: {
        finalizedDeployTxData: deployedAuctionContract.deployTxData.public,
      },
    });

    return new AuctionAPI(deployedAuctionContract, providers, logger);
  }

  private static async getPrivateState(providers: AuctionProviders): Promise<AuctionPrivateState> {
    const existingPrivateState = await providers.privateStateProvider.get(auctionPrivateStateKey);
    return existingPrivateState ?? createMidauctionPrivateState(utils.randomBytes(32));
  }
}

/**
 * A namespace that represents the exports from the `'utils'` sub-package.
 *
 * @public
 */
export * as utils from './utils/index.js';

export * from './common-types.js';
