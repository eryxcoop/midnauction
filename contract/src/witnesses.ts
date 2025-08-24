

import { Ledger } from "./managed/midnauction/contract/index.cjs";
import { WitnessContext } from "@midnight-ntwrk/compact-runtime";
import type { AuctionBid } from "../../auction-api/src/common-types";

/* **********************************************************************
 * The only hidden state needed by the bulletin board contract is
 * the user's secret key.  Some of the library code and
 * compiler-generated code is parameterized by the type of our
 * private state, so we define a type for it and a function to
 * make an object of that type.
 */
export type MidnauctionPrivateState = {
  readonly participantSecretKey: Uint8Array;
  readonly myBids: AuctionBid[];
  nonces: Map<string, Uint8Array>;
};

export const createMidauctionPrivateState = (secretKey: Uint8Array) => ({
  participantSecretKey: secretKey,
  myBids: [],
  nonces: new Map(),
});

export const witnesses = {
  secretKey: ({ privateState }: WitnessContext<Ledger, MidnauctionPrivateState>)
  : 
  [ MidnauctionPrivateState, Uint8Array, ] => [privateState, privateState.participantSecretKey],
};
