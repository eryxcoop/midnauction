import {
  AuctionAPI,
  type AuctionProviders,
  type AuctionCircuitKeys,
} from '@midnight-ntwrk/midnauction-api';
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
    debugger
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
      debugger
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

// /** @internal */
// const connectToWallet = (logger: Logger): Promise<{ wallet: DAppConnectorWalletAPI; uris: ServiceUriConfig }> => {
//   debugger
//   return fnPipe(
//     interval(1000),
//     map(() => window.midnight?.mnLace),
//     // concatMap(() => {
//     //   const dappConnectorAPI: DAppConnectorAPI | undefined = window.midnight?.dappConnectorAPI;
//     //
//     //   if (!dappConnectorAPI) {
//     //     return throwError(() => new Error('DApp connector API not found'));
//     //   }
//     //
//     //   return of(dappConnectorAPI);
//     // }),
//     concatMap((dappConnectorAPI) => dappConnectorAPI.walletAPI()),
//     concatMap((walletAPI) => {
//       if (!walletAPI) {
//         return throwError(() => new Error('Wallet API not available'));
//       }
//
//       return walletAPI.serviceUriConfig().then((uris) => ({ wallet: walletAPI, uris }));
//     }),
//     timeout(30000),
//     take(1),
//     tap(({ wallet, uris }) => {
//       logger.info({ uris }, 'Connected to wallet');
//     }),
//     catchError((error) => {
//       logger.error({ error }, 'Failed to connect to wallet');
//       return throwError(() => error);
//     }),
//     firstValueFrom,
//   );
// };
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
