// node_modules/@midnight-ntwrk/midnight-js-types/dist/index.mjs
var createProverKey = (uint8Array) => {
  return uint8Array;
};
var createVerifierKey = (uint8Array) => {
  return uint8Array;
};
var createZKIR = (uint8Array) => {
  return uint8Array;
};
var createUnbalancedTx = (tx) => {
  return tx;
};
var createBalancedTx = (tx) => {
  return tx;
};
var FailEntirely = "FailEntirely";
var FailFallible = "FailFallible";
var SucceedEntirely = "SucceedEntirely";
var ZKConfigProvider = class {
  /**
   * Retrieves the verifier keys produced by `compactc` for the given circuits.
   * @param circuitIds The circuit IDs of the verifier keys to retrieve.
   */
  async getVerifierKeys(circuitIds) {
    return Promise.all(circuitIds.map(async (id) => {
      const key = await this.getVerifierKey(id);
      return [id, key];
    }));
  }
  /**
   * Retrieves all zero-knowledge artifacts produced by `compactc` for the given circuit.
   * @param circuitId The circuit ID of the artifacts to retrieve.
   */
  async get(circuitId) {
    return {
      circuitId,
      proverKey: await this.getProverKey(circuitId),
      verifierKey: await this.getVerifierKey(circuitId),
      zkir: await this.getZKIR(circuitId)
    };
  }
};
var InvalidProtocolSchemeError = class extends Error {
  invalidScheme;
  allowableSchemes;
  /**
   * @param invalidScheme The invalid scheme.
   * @param allowableSchemes The valid schemes that are allowed.
   */
  constructor(invalidScheme, allowableSchemes) {
    super(`Invalid protocol scheme: '${invalidScheme}'. Allowable schemes are one of: ${allowableSchemes.join(",")}`);
    this.invalidScheme = invalidScheme;
    this.allowableSchemes = allowableSchemes;
  }
};
var LogLevel;
(function(LogLevel2) {
  LogLevel2["INFO"] = "info";
  LogLevel2["WARN"] = "warn";
  LogLevel2["ERROR"] = "error";
  LogLevel2["FATAL"] = "fatal";
  LogLevel2["DEBUG"] = "debug";
  LogLevel2["TRACE"] = "trace";
})(LogLevel || (LogLevel = {}));
var getImpureCircuitIds = (contract) => Object.keys(contract.impureCircuits);

export {
  createProverKey,
  createVerifierKey,
  createZKIR,
  createUnbalancedTx,
  createBalancedTx,
  FailEntirely,
  FailFallible,
  SucceedEntirely,
  ZKConfigProvider,
  InvalidProtocolSchemeError,
  LogLevel,
  getImpureCircuitIds
};
//# sourceMappingURL=chunk-EDDV2GWR.js.map
