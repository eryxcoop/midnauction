import {
  type CircuitContext,
  QueryContext,
  sampleContractAddress,
  constructorContext,
} from "@midnight-ntwrk/compact-runtime";
import {
  Contract,
  type Ledger,
  ledger,
} from "../managed/midnauction/contract/index.cjs";
import { type MidnauctionPrivateState, witnesses } from "../witnesses.js";

export type CoinInfo = { nonce: Uint8Array, color: Uint8Array, value: bigint };
export type QualifiedCoinInfo = { nonce: Uint8Array, color: Uint8Array, value: bigint, mt_index: bigint};

export class MidnauctionSimulator {
  readonly contract: Contract<MidnauctionPrivateState>;
  circuitContext: CircuitContext<MidnauctionPrivateState>;

  constructor(
    secretKey: Uint8Array, 
    producto: string,
    descripcion: string,
    rounds: bigint,
    publicKey: Uint8Array,
  ) {
    this.contract = new Contract<MidnauctionPrivateState>(witnesses);
    const {
      currentPrivateState,
      currentContractState,
      currentZswapLocalState,
    } = this.contract.initialState(
      constructorContext({ secretKey }, "0".repeat(64)), 
      producto, descripcion, rounds, publicKey,
    );
    this.circuitContext = {
      currentPrivateState,
      currentZswapLocalState,
      originalState: currentContractState,
      transactionContext: new QueryContext(
        currentContractState.data,
        sampleContractAddress(),
      ),
    };
  }

  /***
   * Switch to a different secret key for a different user
   *
   * TODO: is there a nicer abstraction for testing multi-user dApps?
   */
  public switchUser(localGameSecretKey: Uint8Array) {
    this.circuitContext.currentPrivateState = {
      secretKey: localGameSecretKey,
    };
  }

  public getLedger(): Ledger {
    return ledger(this.circuitContext.transactionContext.state);
  }

  public getPrivateState(): MidnauctionPrivateState {
    return this.circuitContext.currentPrivateState;
  }

  public commitSecretBid(
    value: bigint,
    bidNonce: Uint8Array,
    idNonce: Uint8Array,
  ): void {
    this.contract.impureCircuits.commitSecretBid(
      this.circuitContext,
      value,
      bidNonce,
      idNonce,
    );
  }

  public moveToRevealPhase(): void {
    this.contract.impureCircuits.moveToRevealPhase(this.circuitContext)
  }

  public revealBid(
    value: bigint,
    bidNonce: Uint8Array,
    idNonce: Uint8Array,
  ): void {
    this.contract.impureCircuits.revealBid(
      this.circuitContext,
      value,
      bidNonce,
      idNonce,
    );
  }

  public claimWin(
    value: bigint,
    bidNonce: Uint8Array,
    idNonce: Uint8Array,
    publicKey: Uint8Array
  ): void {
    this.contract.impureCircuits.claimWin(
      this.circuitContext,
      value,
      bidNonce,
      idNonce,
      publicKey
    );
  }
}
