// Browser-based auction manager for wallet integration and providers
import {
  type DeployedMidnauctionAPI,
  MidnauctionAPI,
  type MidnauctionProviders,
  type MidnauctionCircuitKeys,
} from '../../../api/src/index';
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
import semver from 'semver';
import { getLedgerNetworkId, getZswapNetworkId } from '@midnight-ntwrk/midnight-js-network-id';

/**
 * An in-progress auction deployment.
 */
export interface InProgressAuctionDeployment {
  readonly status: 'in-progress';
}

/**
 * A deployed auction deployment.
 */
export interface DeployedAuctionDeployment {
  readonly status: 'deployed';

  /**
   * The {@link DeployedMidnauctionAPI} instance when connected to an on network auction contract.
   */
  readonly api: DeployedMidnauctionAPI;
}

/**
 * A failed auction deployment.
 */
export interface FailedAuctionDeployment {
  readonly status: 'failed';

  /**
   * The error that caused the deployment to fail.
   */
  readonly error: Error;
}

/**
 * Configuration for creating a new auction.
 */
export interface AuctionConfig {
  productName: string;
  productDescription: string;
  rounds: bigint;
}

/**
 * An auction deployment.
 */
export type AuctionDeployment = InProgressAuctionDeployment | DeployedAuctionDeployment | FailedAuctionDeployment;

/**
 * Provides access to auction deployments.
 */
export interface DeployedAuctionAPIProvider {
  /**
   * Gets the observable set of auction deployments.
   */
  readonly auctionDeployments$: Observable<Array<Observable<AuctionDeployment>>>;

  /**
   * Joins or deploys an auction contract.
   *
   * @param contractAddress An optional contract address to use when resolving.
   * @param auctionConfig Configuration for new auction deployment (if not joining existing).
   * @returns An observable auction deployment.
   */
  readonly resolve: (contractAddress?: ContractAddress, auctionConfig?: AuctionConfig) => Observable<AuctionDeployment>;
}



/**
 * A {@link DeployedAuctionAPIProvider} that manages auction deployments in a browser setting.
 */
export class BrowserDeployedAuctionManager implements DeployedAuctionAPIProvider {
  readonly #auctionDeploymentsSubject: BehaviorSubject<Array<BehaviorSubject<AuctionDeployment>>>;
  #initializedProviders: Promise<MidnauctionProviders> | undefined;

  /**
   * Initializes a new {@link BrowserDeployedAuctionManager} instance.
   *
   * @param logger The `pino` logger for logging.
   */
  constructor(private readonly logger: Logger) {
    this.#auctionDeploymentsSubject = new BehaviorSubject<Array<BehaviorSubject<AuctionDeployment>>>([]);
    this.auctionDeployments$ = this.#auctionDeploymentsSubject;
  }

  /** @inheritdoc */
  readonly auctionDeployments$: Observable<Array<Observable<AuctionDeployment>>>;

  /** @inheritdoc */
  resolve(contractAddress?: ContractAddress, auctionConfig?: AuctionConfig): Observable<AuctionDeployment> {
    const deployments = this.#auctionDeploymentsSubject.value;
    
    // Only try to find existing deployment if we have a specific contract address
    let deployment;
    if (contractAddress) {
      deployment = deployments.find(
        (deployment) =>
          deployment.value.status === 'deployed' && deployment.value.api.deployedContractAddress === contractAddress,
      );

      if (deployment) {
        return deployment;
      }
    }

    deployment = new BehaviorSubject<AuctionDeployment>({
      status: 'in-progress',
    });

    if (contractAddress) {
      void this.joinDeployment(deployment, contractAddress);
    } else {
      void this.deployDeployment(deployment, auctionConfig);
    }

    this.#auctionDeploymentsSubject.next([...deployments, deployment]);

    return deployment;
  }

  private getProviders(): Promise<MidnauctionProviders> {
    return this.#initializedProviders ?? (this.#initializedProviders = initializeProviders(this.logger));
  }

  private async deployDeployment(deployment: BehaviorSubject<AuctionDeployment>, auctionConfig?: AuctionConfig): Promise<void> {
    try {
      const providers = await this.getProviders();
      
      if (!auctionConfig) {
        throw new Error('Auction configuration is required for deployment');
      }
      
      const api = await MidnauctionAPI.deploy(
        providers, 
        auctionConfig.productName,
        auctionConfig.productDescription,
        auctionConfig.rounds,
        this.logger
      );

      deployment.next({
        status: 'deployed',
        api,
      });
    } catch (error: unknown) {
      deployment.next({
        status: 'failed',
        error: error instanceof Error ? error : new Error(String(error)),
      });
    }
  }

  private async joinDeployment(
    deployment: BehaviorSubject<AuctionDeployment>,
    contractAddress: ContractAddress,
  ): Promise<void> {
    try {
      const providers = await this.getProviders();
      const api = await MidnauctionAPI.join(providers, contractAddress, this.logger);

      deployment.next({
        status: 'deployed',
        api,
      });
    } catch (error: unknown) {
      deployment.next({
        status: 'failed',
        error: error instanceof Error ? error : new Error(String(error)),
      });
    }
  }
}

/** @internal */
const initializeProviders = async (logger: Logger): Promise<MidnauctionProviders> => {
  const { wallet, uris } = await connectToWallet(logger);
  const walletState = await wallet.state();
  const zkConfigPath = window.location.origin;

  console.log(`Connecting to wallet with network ID: ${getLedgerNetworkId()}`);

  return {
    privateStateProvider: levelPrivateStateProvider({
      privateStateStoreName: 'midnauction-private-state',
    }),
    zkConfigProvider: new FetchZkConfigProvider<MidnauctionCircuitKeys>(zkConfigPath, fetch.bind(window)),
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

  return firstValueFrom(
    fnPipe(
      interval(100),
      map(() => window.midnight?.mnLace),
      tap((connectorAPI) => {
        logger.info(connectorAPI, 'Check for wallet connector API');
      }),
      filter((connectorAPI): connectorAPI is DAppConnectorAPI => !!connectorAPI),
      concatMap((connectorAPI) =>
        semver.satisfies(connectorAPI.apiVersion, COMPATIBLE_CONNECTOR_API_VERSION)
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
            }),
      ),
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