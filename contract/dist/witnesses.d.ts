import { Ledger } from "./managed/midnauction/contract/index.cjs";
import { WitnessContext } from "@midnight-ntwrk/compact-runtime";
export type MidnauctionPrivateState = {
    readonly secretKey: Uint8Array;
};
export declare const createMidauctionPrivateState: (secretKey: Uint8Array) => {
    secretKey: Uint8Array<ArrayBufferLike>;
};
export declare const witnesses: {
    secretKey: ({ privateState }: WitnessContext<Ledger, MidnauctionPrivateState>) => [MidnauctionPrivateState, Uint8Array];
};
