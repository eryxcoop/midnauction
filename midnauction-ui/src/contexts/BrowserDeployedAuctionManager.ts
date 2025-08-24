// Mock types for now since we don't have the actual auction-api package
type AuctionProviders = any;
type AuctionCircuitKeys = any;

// Mock AuctionAPI class
class AuctionAPI {
  static async deploy(providers: any, logger?: any): Promise<AuctionAPI> {
    console.log('Mock AuctionAPI.deploy called with providers:', providers);
    return new AuctionAPI();
  }

  static async join(providers: any, contractAddress: any, logger?: any): Promise<AuctionAPI> {
    console.log('Mock AuctionAPI.join called with contractAddress:', contractAddress);
    return new AuctionAPI();
  }

  // Create a proper state$ observable that emits auction state
  private stateSubject = new BehaviorSubject<any>({
    publicState: {
      productName: 'Connected Auction',
      productDescription: 'Successfully connected to auction contract',
      minimumBidValue: BigInt(1000), // $10.00 in cents
      auctioneerPublicKey: new Uint8Array([1, 2, 3, 4, 5]),
      currentPhase: 'bidding',
      totalBids: BigInt(0),
      revealedBids: [],
      auctionStartTime: BigInt(Date.now()),
      biddingEndTime: undefined,
      revealingEndTime: undefined
    },
    privateState: {},
    isAuctioneer: false,
    canSubmitBid: true,
    canRevealBid: false,
    hasSubmittedBid: false,
    myCurrentBid: undefined
  });

  get state$() {
    return this.stateSubject.asObservable();
  }

  // Add missing methods
  deployedContractAddress = 'mock-address';

  async submitBid(bidAmount: bigint): Promise<void> {
    console.log('Mock: Submitting bid:', bidAmount);
    
    // Update the state to reflect the new bid
    const currentState = this.stateSubject.value;
    const newState = {
      ...currentState,
      hasSubmittedBid: true,
      myCurrentBid: {
        bidAmount: bidAmount,
        nonce: new Uint8Array(32),
        commitment: new Uint8Array(32)
      }
    };
    this.stateSubject.next(newState);
  }

  async revealBid(bidAmount: bigint, nonce: Uint8Array): Promise<void> {
    console.log('Mock: Revealing bid:', { bidAmount, nonce });
  }

  async refreshState(): Promise<void> {
    console.log('Mock: Refreshing state');
    
    // Simulate state refresh by emitting current state
    const currentState = this.stateSubject.value;
    this.stateSubject.next({...currentState});
  }

  async createAuction(productName: string, productDescription: string, minimumBid: bigint): Promise<void> {
    console.log('Mock: Creating auction:', { productName, productDescription, minimumBid });
    
    // Update state to reflect auction creation
    const currentState = this.stateSubject.value;
    const newState = {
      ...currentState,
      publicState: {
        ...currentState.publicState,
        productName: productName,
        productDescription: productDescription,
        minimumBidValue: minimumBid,
        currentPhase: 'bidding'
      }
    };
    this.stateSubject.next(newState);
  }

  async closeBidding(): Promise<void> {
    console.log('Mock: Closing bidding');
    
    // Update state to reflect bidding closed
    const currentState = this.stateSubject.value;
    const newState = {
      ...currentState,
      publicState: {
        ...currentState.publicState,
        currentPhase: 'revealing'
      },
      canSubmitBid: false
    };
    this.stateSubject.next(newState);
  }

  async startRevealing(): Promise<void> {
    console.log('Mock: Starting revealing');
    
    // Update state to reflect revealing phase
    const currentState = this.stateSubject.value;
    const newState = {
      ...currentState,
      publicState: {
        ...currentState.publicState,
        currentPhase: 'revealing'
      },
      canRevealBid: true
    };
    this.stateSubject.next(newState);
  }

  async finishAuction(): Promise<void> {
    console.log('Mock: Finishing auction');
    
    // Update state to reflect auction finished
    const currentState = this.stateSubject.value;
    const newState = {
      ...currentState,
      publicState: {
        ...currentState.publicState,
        currentPhase: 'finished'
      },
      canSubmitBid: false,
      canRevealBid: false
    };
    this.stateSubject.next(newState);
  }
}

import { type ContractAddress } from '@midnight-ntwrk/compact-runtime';
import {
  BehaviorSubject,
  type Observable,
  concatMap,
  filter,
  firstValueFrom,
  interval,
  map,
  of,
  take,
  tap,
  throwError,
  timeout,
  catchError,
} from 'rxjs';
import { pipe as fnPipe } from 'fp-ts/function';
import { type Logger } from 'pino';
import {
  type DAppConnectorAPI,
  type DAppConnectorWalletAPI,
  type ServiceUriConfig,
} from '@midnight-ntwrk/dapp-connector-api';
import { levelPrivateStateProvider } from '@midnight-ntwrk/midnight-js-level-private-state-provider';
import { FetchZkConfigProvider } from '@midnight-ntwrk/midnight-js-fetch-zk-config-provider';
import { httpClientProofProvider } from '@midnight-ntwrk/midnight-js-http-client-proof-provider';
import { indexerPublicDataProvider } from '@midnight-ntwrk/midnight-js-indexer-public-data-provider';
import {
  type BalancedTransaction,
  type UnbalancedTransaction,
  createBalancedTx,
} from '@midnight-ntwrk/midnight-js-types';
import { type CoinInfo, Transaction, type TransactionId } from '@midnight-ntwrk/ledger';
import { Transaction as ZswapTransaction } from '@midnight-ntwrk/zswap';
import { getLedgerNetworkId, getZswapNetworkId } from '@midnight-ntwrk/midnight-js-network-id';
import semver from 'semver'

/**
 * Represents the deployment state of an auction.
 */
export type AuctionDeployment =
  | { tag: 'undeployed' }
  | { tag: 'deploying' }
  | { tag: 'deployed'; api: AuctionAPI }
  | { tag: 'joining'; contractAddress: ContractAddress }
  | { tag: 'error'; error: Error };

/**
 * Interface for providing deployed auction APIs.
 */
export interface DeployedAuctionAPIProvider {
  readonly auctionDeployments$: Observable<Array<Observable<AuctionDeployment>>>;
  resolve(contractAddress?: ContractAddress): Observable<AuctionDeployment>;
}

/**
 * Browser-based implementation of the deployed auction API provider.
 */
export class BrowserDeployedAuctionManager implements DeployedAuctionAPIProvider {
  readonly auctionDeployments$: Observable<Array<Observable<AuctionDeployment>>>;

  #initializedProviders?: Promise<AuctionProviders>;
  #auctionDeployments: Array<BehaviorSubject<AuctionDeployment>> = [];

  constructor(private readonly logger: Logger) {
    this.auctionDeployments$ = new BehaviorSubject(this.#auctionDeployments.map((deployment) => deployment.asObservable()));
  }

  resolve(contractAddress?: ContractAddress): Observable<AuctionDeployment> {
    const deployment = new BehaviorSubject<AuctionDeployment>({ tag: 'undeployed' });

    this.#auctionDeployments.push(deployment);
    (this.auctionDeployments$ as BehaviorSubject<Array<Observable<AuctionDeployment>>>).next(
      this.#auctionDeployments.map((d) => d.asObservable()),
    );

    if (contractAddress) {
      this.joinDeployment(deployment, contractAddress).catch((error) => {
        this.logger.error({ error }, 'Failed to join auction deployment');
      });
    } else {
      this.deployDeployment(deployment).catch((error) => {
        this.logger.error({ error }, 'Failed to deploy auction');
      });
    }

    return deployment;
  }

  private getProviders(): Promise<AuctionProviders> {
    // We use a cached `Promise` to hold the providers. This will:
    //
    // 1. Cache and re-use the providers (including the configured connector API), and
    // 2. Act as a synchronization point if multiple contract deploys or joins run concurrently.
    //    Concurrent calls to `getProviders()` will receive, and ultimately await, the same
    //    `Promise`.
    return this.#initializedProviders ?? (this.#initializedProviders = initializeProviders(this.logger));
  }

  private async deployDeployment(deployment: BehaviorSubject<AuctionDeployment>): Promise<void> {
    try {
      deployment.next({ tag: 'deploying' });
      const providers = await this.getProviders();
      const api = await AuctionAPI.deploy(providers, this.logger);
      deployment.next({ tag: 'deployed', api });
    } catch (error) {
      deployment.next({
        tag: 'error',
        error: error instanceof Error ? error : new Error(String(error)),
      });
    }
  }

  private async joinDeployment(
    deployment: BehaviorSubject<AuctionDeployment>,
    contractAddress: ContractAddress,
  ): Promise<void> {
    try {
      deployment.next({ tag: 'joining', contractAddress });
      const providers = await this.getProviders();
      const api = await AuctionAPI.join(providers, contractAddress, this.logger);
      deployment.next({ tag: 'deployed', api });
    } catch (error) {
      deployment.next({
        tag: 'error',
        error: error instanceof Error ? error : new Error(String(error)),
      });
    }
  }
}

/** @internal */
const initializeProviders = async (logger: Logger): Promise<AuctionProviders> => {
  const { wallet, uris } = await connectToWallet(logger);
  console.log('********* wallet', wallet);
  const walletState = await wallet.state();
  const zkConfigPath = window.location.origin; // Path to auction contract config

  console.log(`Connecting to wallet with network ID: ${getLedgerNetworkId()}`);

  return {
    privateStateProvider: levelPrivateStateProvider({
      privateStateStoreName: 'auction-private-state',
    }),
    zkConfigProvider: new FetchZkConfigProvider<AuctionCircuitKeys>(zkConfigPath, fetch.bind(window)),
    proofProvider: httpClientProofProvider(uris.proverServerUri),
    publicDataProvider: indexerPublicDataProvider(uris.indexerUri, uris.indexerWsUri),
    walletProvider: {
      coinPublicKey: walletState.coinPublicKey,
      encryptionPublicKey: walletState.encryptionPublicKey,
      balanceTx(tx: UnbalancedTransaction, newCoins: CoinInfo[]): Promise<BalancedTransaction> {
        return wallet
          .balanceAndProveTransaction(
            ZswapTransaction.deserialize(tx.serialize(getLedgerNetworkId()), getZswapNetworkId()),
            newCoins,
          )
          .then((zswapTx) => Transaction.deserialize(zswapTx.serialize(getZswapNetworkId()), getLedgerNetworkId()))
          .then(createBalancedTx);
      },
    },
    midnightProvider: {
      submitTx(tx: BalancedTransaction): Promise<TransactionId> {
        return wallet.submitTransaction(tx);
      },
    },
  };
};

/** @internal */
const connectToWallet = (logger: Logger): Promise<{ wallet: DAppConnectorWalletAPI; uris: ServiceUriConfig }> => {
  const COMPATIBLE_CONNECTOR_API_VERSION = '1.x';

  console.log('Attempting to connect to Midnight Network wallet...');
  console.log('window.midnight:', window.midnight);
  console.log('window.midnight?.mnLace:', window.midnight?.mnLace);

  return firstValueFrom(
      fnPipe(
          interval(100),
          map(() => {
            const connectorAPI = window.midnight?.mnLace;
            console.log('Checking for connector API:', connectorAPI);
            return connectorAPI;
          }),
          tap((connectorAPI) => {
            logger.info(connectorAPI, 'Check for wallet connector API');
          }),
          filter((connectorAPI): connectorAPI is DAppConnectorAPI => {
            const isValid = !!connectorAPI;
            console.log('Connector API valid:', isValid);
            return isValid;
          }),
          concatMap((connectorAPI) => {
            console.log('Connector API found, checking version compatibility...');
            const isCompatible = semver.satisfies(connectorAPI.apiVersion, COMPATIBLE_CONNECTOR_API_VERSION);
            console.log('Version compatible:', isCompatible, 'Expected:', COMPATIBLE_CONNECTOR_API_VERSION, 'Got:', connectorAPI.apiVersion);
            
            return isCompatible
                ? of(connectorAPI)
                : throwError(() => {
                    logger.error(
                        {
                          expected: COMPATIBLE_CONNECTOR_API_VERSION,
                          actual: connectorAPI.apiVersion,
                        },
                        'Incompatible version of wallet connector API',
                    );

                    return new Error(
                        `Incompatible version of Midnight Lace wallet found. Require '${COMPATIBLE_CONNECTOR_API_VERSION}', got '${connectorAPI.apiVersion}'.`,
                    );
                  });
          }),
          tap((connectorAPI) => {
            logger.info(connectorAPI, 'Compatible wallet connector API found. Connecting.');
          }),
          take(1),
          timeout({
            first: 1_000,
            with: () =>
                throwError(() => {
                  logger.error('Could not find wallet connector API');

                  return new Error('Could not find Midnight Lace wallet. Extension installed?');
                }),
          }),
          concatMap(async (connectorAPI) => {
            const isEnabled = await connectorAPI.isEnabled();

            logger.info(isEnabled, 'Wallet connector API enabled status');

            return connectorAPI;
          }),
          timeout({
            first: 5_000,
            with: () =>
                throwError(() => {
                  logger.error('Wallet connector API has failed to respond');

                  return new Error('Midnight Lace wallet has failed to respond. Extension enabled?');
                }),
          }),
          concatMap(async (connectorAPI) => ({ walletConnectorAPI: await connectorAPI.enable(), connectorAPI })),
          catchError((error, apis) =>
              error
                  ? throwError(() => {
                    logger.error('Unable to enable connector API');
                    return new Error('Application is not authorized');
                  })
                  : apis,
          ),
          concatMap(async ({ walletConnectorAPI, connectorAPI }) => {
            const uris = await connectorAPI.serviceUriConfig();

            logger.info('Connected to wallet connector API and retrieved service configuration');

            return { wallet: walletConnectorAPI, uris };
          }),
      ),
  );
};
