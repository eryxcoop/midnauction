// @ts-nocheck

import contractModule from '../../contract/src/managed/midnauction/contract/index.cjs';
import {type ContractAddress} from '@midnight-ntwrk/compact-runtime';
import {type Logger} from 'pino';
import {
  type DeployedMidnauctionContract,
  type MidnauctionContract,
  type MidnauctionDerivedState,
  midnauctionPrivateStateKey,
  type MidnauctionProviders,
} from './common-types.js';
import {createMidnauctionPrivateState, MidnauctionPrivateState, witnesses} from '../../contract/src/index';
import * as utils from './utils/index.js';
import {deployContract, findDeployedContract} from '@midnight-ntwrk/midnight-js-contracts';
import {combineLatest, from, map, type Observable, tap} from 'rxjs';

const { Contract, ledger } = contractModule;

const midnauctionContractInstance: MidnauctionContract = new Contract(witnesses);

export interface DeployedMidnauctionAPI {
  readonly deployedContractAddress: ContractAddress;
  readonly state$: Observable<MidnauctionDerivedState>;

  commitSecretBid: (value: bigint, bidNonce: Uint8Array<any>, idNonce: Uint8Array<any>) => Promise<void>;
  moveToRevealPhase: () => Promise<void>;
  revealBid: (value: bigint, bidNonce: Uint8Array<any>, idNonce: Uint8Array<any>) => Promise<void>;
  moveToNextPhase: () => Promise<void>;
  claimWin: (value: bigint, bidNonce: Uint8Array<any>, idNonce: Uint8Array<any>, encryptedPublicKey: Uint8Array<any>) => Promise<void>;
  finishAuction: () => Promise<void>;
}

export class MidnauctionAPI implements DeployedMidnauctionAPI {
  /** @internal */
  private constructor(
    public readonly deployedContract: DeployedMidnauctionContract,
    providers: MidnauctionProviders,
    private readonly logger?: Logger,
  ) {
    this.deployedContractAddress = deployedContract.deployTxData.public.contractAddress;
    this.state$ = combineLatest(
      [
        // Combine public (ledger) state with...
        providers.publicDataProvider.contractStateObservable(this.deployedContractAddress, { type: 'latest' }).pipe(
          map((contractState) => ledger(contractState.data)),
        ),
        from(providers.privateStateProvider.get(midnauctionPrivateStateKey) as Promise<MidnauctionPrivateState>),
      ],
      (ledgerState, privateState) => {
        return {
            productName: ledgerState.productName,
            productDescription: ledgerState.productDescription,
            rounds: ledgerState.rounds,
            currentRound: ledgerState.currentRound,
            auctioneerPK: ledgerState.auctioneerPK,
            registeredParticipants: ledgerState.registeredParticipants,
            secretBids: ledgerState.secretBids,
            revealedBids: ledgerState.revealedBids,
            phase: ledgerState.phase,
            winnerEncryptedPublicKey: ledgerState.winnerEncryptedPublicKey,
            secretKey: privateState.secretKey,
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
  readonly state$: Observable<{
      productName: any;
      productDescription: any;
      rounds: any;
      currentRound: any;
      auctioneerPK: any;
      registeredParticipants: any;
      secretBids: any;
      revealedBids: any;
      phase: any;
      winnerEncryptedPublicKey: any;
  }>;

    async commitSecretBid(value: bigint, bidNonce: Uint8Array<any>, idNonce: Uint8Array<any>){
        this.logger?.info(`commitSecretBid: ${value} - ${bidNonce} - ${idNonce}`);
        const txData = await this.deployedContract.callTx.commitSecretBid(value, bidNonce, idNonce);
        this.logger?.trace({
          transactionAdded: {
            circuit: ' commitSecretBid',
            txHash: txData.public.txHash,
            blockHeight: txData.public.blockHeight,
          },
        });

    }

    async moveToRevealPhase(){
        this.logger?.info(`moveToRevealPhase`);
        const txData = await this.deployedContract.callTx.moveToRevealPhase();
        this.logger?.trace({
          transactionAdded: {
            circuit: ' moveToRevealPhase',
            txHash: txData.public.txHash,
            blockHeight: txData.public.blockHeight,
          },
        });
    }

    async revealBid(value: bigint, bidNonce: Uint8Array<any>, idNonce: Uint8Array<any>){
        this.logger?.info(`revealBid: ${value} - ${bidNonce} - ${idNonce}`);
        const txData = await this.deployedContract.callTx.revealBid(value, bidNonce, idNonce);
        this.logger?.trace({
          transactionAdded: {
            circuit: ' revealBid',
            txHash: txData.public.txHash,
            blockHeight: txData.public.blockHeight,
          },
        });
    }

    async moveToNextPhase(){
        this.logger?.info(`moveToNextPhase`);
        const txData = await this.deployedContract.callTx.moveToNextPhase();
        this.logger?.trace({
          transactionAdded: {
            circuit: ' moveToNextPhase',
            txHash: txData.public.txHash,
            blockHeight: txData.public.blockHeight,
          },
        });
    }

    async claimWin(value: bigint, bidNonce: Uint8Array<any>, idNonce: Uint8Array<any>, encryptedPublicKey: Uint8Array<any>){
        this.logger?.info(`claimWin: ${value} - ${bidNonce} - ${idNonce}`);
        const txData = await this.deployedContract.callTx.claimWin(value, bidNonce, idNonce);
        this.logger?.trace({
          transactionAdded: {
            circuit: ' claimWin',
            txHash: txData.public.txHash,
            blockHeight: txData.public.blockHeight,
          },
        });
    }

    async finishAuction(){
        this.logger?.info(`finishAuction`);
        const txData = await this.deployedContract.callTx.finishAuction();
        this.logger?.trace({
          transactionAdded: {
            circuit: ' finishAuction',
            txHash: txData.public.txHash,
            blockHeight: txData.public.blockHeight,
          },
        });
    }


  static async deploy(
    providers: MidnauctionProviders, 
    productName: string,
    productDescription: string,
    rounds: bigint,
    logger?: Logger
  ): Promise<MidnauctionAPI> {
    logger?.info('deployContract', { productName, productDescription, rounds });

    // Get the auctioneer public key from the wallet
    const auctioneerPK = providers.walletProvider.coinPublicKey;
    
    logger?.info('Deployment parameters', {
      productName,
      productDescription,
      rounds,
      auctioneerPK: Array.from(auctioneerPK).map(b => b.toString(16).padStart(2, '0')).join('').substring(0, 20) + '...'
    });

    // For deployment, always create a fresh private state to avoid address conflicts
    const freshPrivateState = createMidnauctionPrivateState(utils.randomBytes(32));
    
    const deployedMidnauctionContract = await deployContract<typeof midnauctionContractInstance>(providers, {
      privateStateId: midnauctionPrivateStateKey,
      contract: midnauctionContractInstance,
      initialPrivateState: freshPrivateState,
      initialState: (context) => midnauctionContractInstance.initialState(
        context,
        productName,
        productDescription,
        rounds,
        auctioneerPK
      ),
    });

    logger?.trace({
      contractDeployed: {
        finalizedDeployTxData: deployedMidnauctionContract.deployTxData.public,
      },
    });

    return new MidnauctionAPI(deployedMidnauctionContract, providers, logger);
  }

  static async join(providers: MidnauctionProviders, contractAddress: ContractAddress, logger?: Logger): Promise<MidnauctionAPI> {
    logger?.info({
      joinContract: {
        contractAddress,
      },
    });

    const deployedMidnauctionContract = await findDeployedContract<MidnauctionContract>(providers, {
      contractAddress,
      contract: midnauctionContractInstance,
      privateStateId: midnauctionPrivateStateKey,
      initialPrivateState: await MidnauctionAPI.getPrivateState(providers),
    });

    logger?.trace({
      contractJoined: {
        finalizedDeployTxData: deployedMidnauctionContract.deployTxData.public,
      },
    });

    return new MidnauctionAPI(deployedMidnauctionContract, providers, logger);
  }

  private static async getPrivateState(providers: MidnauctionProviders): Promise<MidnauctionPrivateState> {
    const existingPrivateState = await providers.privateStateProvider.get(midnauctionPrivateStateKey);
    if (existingPrivateState) {
      console.log('Using existing private state');
      return existingPrivateState;
    } else {
      console.log('Creating new private state');
      return createMidnauctionPrivateState(utils.randomBytes(32));
    }
  }
}

/**
 * A namespace that represents the exports from the `'utils'` sub-package.
 *
 * @public
 */
export * as utils from './utils/index.js';

export * from './common-types.js';
