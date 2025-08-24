// Midnauction auction common types and abstractions.
// TODO: These types will need to be imported from the actual contract once it's created
// For now, we'll define placeholder types based on the auction system requirements
export const auctionPrivateStateKey = 'auctionPrivateState';
/**
 * Auction phases enum
 */
export var AuctionPhase;
(function (AuctionPhase) {
    AuctionPhase["BIDDING"] = "bidding";
    AuctionPhase["REVEALING"] = "revealing";
    AuctionPhase["FINISHED"] = "finished";
})(AuctionPhase || (AuctionPhase = {}));
//# sourceMappingURL=common-types.js.map