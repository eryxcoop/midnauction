export const createMidauctionPrivateState = (secretKey) => ({
    participantSecretKey: secretKey,
    myBids: [],
    nonces: new Map(),
});
export const witnesses = {
    secretKey: ({ privateState }) => [privateState, privateState.participantSecretKey],
};
//# sourceMappingURL=witnesses.js.map