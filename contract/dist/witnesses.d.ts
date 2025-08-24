import { Ledger } from "./managed/midnauction/contract/index.cjs";
import { WitnessContext } from "@midnight-ntwrk/compact-runtime";
export type MidnauctionPrivateState = {
    readonly participantSecretKey: Uint8Array;
    readonly myBids: any[];
    nonces: Map<string, Uint8Array>;
};
export declare const createMidauctionPrivateState: (secretKey: Uint8Array) => {
    participantSecretKey: Uint8Array<ArrayBufferLike>;
    myBids: never[];
    nonces: Map<any, any>;
};
export declare const witnesses: {
    secretKey: ({ privateState }: WitnessContext<Ledger, MidnauctionPrivateState>) => [MidnauctionPrivateState, Uint8Array];
};
