

import { Ledger } from "./managed/midnauction/contract/index.cjs";
import { WitnessContext } from "@midnight-ntwrk/compact-runtime";

/* **********************************************************************
 * The only hidden state needed by the bulletin board contract is
 * the user's secret key.  Some of the library code and
 * compiler-generated code is parameterized by the type of our
 * private state, so we define a type for it and a function to
 * make an object of that type.
 */

export type MidauctionPrivateState = {
  readonly secretKey: Uint8Array;
};

export const createMidauctionPrivateState = (secretKey: Uint8Array) => ({
  secretKey,
});

export const witnesses = {
  localSecretKey: ({ privateState }: WitnessContext<Ledger, MidauctionPrivateState>)
  : 
  [ MidauctionPrivateState, Uint8Array, ] => [privateState, privateState.secretKey],
};
