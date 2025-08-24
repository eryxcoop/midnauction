// This file is part of midnightntwrk/example-counter.
// Copyright (C) 2025 Midnight Foundation
// SPDX-License-Identifier: Apache-2.0
// Licensed under the Apache License, Version 2.0 (the "License");
// You may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import {
  type DeployedRPSAPI,
  RPSAPI,
  type RPSProviders,
  type RPSCircuitKeys,
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
// import { NodeZkConfigProvider } from '@midnight-ntwrk/midnight-js-node-zk-config-provider';
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
 * An in-progress RPS deployment.
 */
export interface InProgressRPSDeployment {
  readonly status: 'in-progress';
}

/**
 * A deployed RPS deployment.
 */
export interface DeployedRPSDeployment {
  readonly status: 'deployed';

  /**
   * The {@link DeployedRPSAPI} instance when connected to an on network RPS contract.
   */
  readonly api: DeployedRPSAPI;
}

/**
 * A failed RPS deployment.
 */
export interface FailedRPSDeployment {
  readonly status: 'failed';

  /**
   * The error that caused the deployment to fail.
   */
  readonly error: Error;
}

/**
 * An RPS deployment.
 */
export type RPSDeployment = InProgressRPSDeployment | DeployedRPSDeployment | FailedRPSDeployment;

/**
 * Provides access to RPS deployments.
 */
export interface DeployedRPSAPIProvider {
  /**
   * Gets the observable set of RPS deployments.
   *
   * @remarks
   * This property represents an observable array of {@link RPSDeployment}, each also an
   * observable. Changes to the array will be emitted as games are resolved (deployed or joined),
   * while changes to each underlying game can be observed via each item in the array.
   */
  readonly rpsDeployments$: Observable<Array<Observable<RPSDeployment>>>;

  /**
   * Joins or deploys an RPS contract.
   *
   * @param contractAddress An optional contract address to use when resolving.
   * @returns An observable RPS deployment.
   *
   * @remarks
   * For a given `contractAddress`, the method will attempt to find and join the identified RPS
   * contract; otherwise it will attempt to deploy a new one.
   */
  readonly resolve: (contractAddress?: ContractAddress) => Observable<RPSDeployment>;
}

/**
 * A {@link DeployedRPSAPIProvider} that manages RPS deployments in a browser setting.
 *
 * @remarks
 * {@link BrowserDeployedRPSManager} configures and manages a connection to the Midnight Lace
 * wallet, along with a collection of additional providers that work in a web-browser setting.
 */
export class BrowserDeployedRPSManager implements DeployedRPSAPIProvider {
  readonly #rpsDeploymentsSubject: BehaviorSubject<Array<BehaviorSubject<RPSDeployment>>>;
  #initializedProviders: Promise<RPSProviders> | undefined;

  /**
   * Initializes a new {@link BrowserDeployedRPSManager} instance.
   *
   * @param logger The `pino` logger to for logging.
   */
  constructor(private readonly logger: Logger) {
    this.#rpsDeploymentsSubject = new BehaviorSubject<Array<BehaviorSubject<RPSDeployment>>>([]);
    this.rpsDeployments$ = this.#rpsDeploymentsSubject;
  }

  /** @inheritdoc */
  readonly rpsDeployments$: Observable<Array<Observable<RPSDeployment>>>;

  /** @inheritdoc */
  resolve(contractAddress?: ContractAddress): Observable<RPSDeployment> {
    const deployments = this.#rpsDeploymentsSubject.value;
    let deployment = deployments.find(
      (deployment) =>
        deployment.value.status === 'deployed' && deployment.value.api.deployedContractAddress === contractAddress,
    );

    if (deployment) {
      return deployment;
    }

    deployment = new BehaviorSubject<RPSDeployment>({
      status: 'in-progress',
    });

    if (contractAddress) {
      void this.joinDeployment(deployment, contractAddress);
    } else {
      void this.deployDeployment(deployment);
    }

    this.#rpsDeploymentsSubject.next([...deployments, deployment]);

    return deployment;
  }

  private getProviders(): Promise<RPSProviders> {
    // We use a cached `Promise` to hold the providers. This will:
    //
    // 1. Cache and re-use the providers (including the configured connector API), and
    // 2. Act as a synchronization point if multiple contract deploys or joins run concurrently.
    //    Concurrent calls to `getProviders()` will receive, and ultimately await, the same
    //    `Promise`.
    return this.#initializedProviders ?? (this.#initializedProviders = initializeProviders(this.logger));
  }

  private async deployDeployment(deployment: BehaviorSubject<RPSDeployment>): Promise<void> {
    try {
      const providers = await this.getProviders();
      const api = await RPSAPI.deploy(providers, this.logger);

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
    deployment: BehaviorSubject<RPSDeployment>,
    contractAddress: ContractAddress,
  ): Promise<void> {
    try {
      const providers = await this.getProviders();
      const api = await RPSAPI.join(providers, contractAddress, this.logger);

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
const initializeProviders = async (logger: Logger): Promise<RPSProviders> => {
  const { wallet, uris } = await connectToWallet(logger);
  const walletState = await wallet.state();
  const zkConfigPath = window.location.origin; // '../../../contract/src/managed/rps';

  console.log(`Connecting to wallet with network ID: ${getLedgerNetworkId()}`);

  return {
    privateStateProvider: levelPrivateStateProvider({
      privateStateStoreName: 'rps-private-state',
    }),
    zkConfigProvider: new FetchZkConfigProvider<RPSCircuitKeys>(zkConfigPath, fetch.bind(window)),
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
