export const createMidauctionPrivateState = (secretKey) => ({
    secretKey,
});
export const witnesses = {
    secretKey: ({ privateState }) => [privateState, privateState.secretKey],
};
//# sourceMappingURL=witnesses.js.map