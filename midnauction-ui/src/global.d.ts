declare module '@midnight-ntwrk/midnauction-api' {
  export interface AuctionAPI {
    deployedContractAddress: string;
    state$: any;
    createAuction: (productName: string, productDescription: string, minimumBid: bigint) => Promise<void>;
    closeBidding: () => Promise<void>;
    startRevealing: () => Promise<void>;
    finishAuction: () => Promise<void>;
    submitBid: (bidAmount: bigint) => Promise<void>;
    revealBid: (bidAmount: bigint, nonce: Uint8Array) => Promise<void>;
    refreshState: () => Promise<void>;
  }

  export interface AuctionDerivedState {
    publicState: {
      productName: string;
      productDescription: string;
      minimumBidValue: bigint;
      auctioneerPublicKey: Uint8Array;
      currentPhase: string;
      totalBids: bigint;
      revealedBids: any[];
      auctionStartTime: bigint;
      biddingEndTime?: bigint;
      revealingEndTime?: bigint;
    };
    privateState: any;
    isAuctioneer: boolean;
    canSubmitBid: boolean;
    canRevealBid: boolean;
    hasSubmittedBid: boolean;
    myCurrentBid?: any;
  }

  export interface PublicAuctionState {
    productName: string;
    productDescription: string;
    minimumBidValue: bigint;
    auctioneerPublicKey: Uint8Array;
    currentPhase: string;
    totalBids: bigint;
    revealedBids: any[];
    auctionStartTime: bigint;
    biddingEndTime?: bigint;
    revealingEndTime?: bigint;
  }

  export enum AuctionPhase {
    BIDDING = 'bidding',
    REVEALING = 'revealing',
    FINISHED = 'finished'
  }

  export interface RevealedBid {
    participantId: string;
    bidAmount: bigint;
    nonce: Uint8Array;
    timestamp: bigint;
  }

  export type AuctionProviders = any;
  export type AuctionCircuitKeys = any;

  // Mock implementations for static methods
  export class AuctionAPI {
    static async deploy(providers: any, logger?: any): Promise<AuctionAPI> {
      // Mock implementation
      return {} as AuctionAPI;
    }

    static async join(providers: any, contractAddress: any, logger?: any): Promise<AuctionAPI> {
      // Mock implementation
      return {} as AuctionAPI;
    }
  }
}
