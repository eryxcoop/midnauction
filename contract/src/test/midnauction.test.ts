import {MidnauctionSimulator, CoinInfo, QualifiedCoinInfo} from "./midnauction-simulator.js";
import {NetworkId, setNetworkId,} from "@midnight-ntwrk/midnight-js-network-id";
import {beforeAll, describe, expect, it} from "vitest";
import {randomBytes, stringToBytes32} from "./utils.js";
import { sampleCoinPublicKey } from '@midnight-ntwrk/zswap';
import { getTestEnvironment, createDefaultTestLogger, LocalTestEnvironment, QanetTestEnvironment, DevnetTestEnvironment, TestnetTestEnvironment, Testnet2TestEnvironment, EnvVarRemoteTestEnvironment } from '@midnight-ntwrk/midnight-js-testing';
import { PHASE } from "../managed/midnauction/contract/index.cjs";


setNetworkId(NetworkId.Undeployed);

describe("TokenManaging smart contract", () => {

    it("generates initial ledger state deterministically", () => {
        const sk = randomBytes(32);

        const newLocal = sampleCoinPublicKey();
        console.log(newLocal);
        const pk = stringToBytes32(newLocal);
        const simulator = new MidnauctionSimulator(
            sk,
            "nombre",
            "no se",
            BigInt(1),
            pk,
        );

        let ledger = simulator.getLedger()

        // expect(ledger.auctioneerPK).toEqual(pk);
        // expect(ledger.phase).toEqual(PHASE.commitment);
        // expect(ledger.productDescription).toEqual("no se");
        // expect(ledger.productName).toEqual("nombre");
    });
   
    
});
