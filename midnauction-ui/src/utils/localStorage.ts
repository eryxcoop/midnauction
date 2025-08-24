// Local storage utilities for managing auction nonces and secrets
import { StoredAuctionData, PrivateBid } from '../types/auction';

const STORAGE_PREFIX = 'midnauction';

/**
 * Generates a random 32-byte nonce
 */
export function generateNonce(): Uint8Array {
  return crypto.getRandomValues(new Uint8Array(32));
}

/**
 * Converts Uint8Array to base64 string for storage
 */
function uint8ArrayToBase64(uint8Array: Uint8Array): string {
  return btoa(String.fromCharCode(...uint8Array));
}

/**
 * Converts base64 string back to Uint8Array
 */
function base64ToUint8Array(base64: string): Uint8Array {
  return new Uint8Array(atob(base64).split('').map(char => char.charCodeAt(0)));
}

/**
 * Converts Map to plain object for JSON serialization
 */
function mapToObject<K extends string | number, V>(map: Map<K, V>): Record<string, V> {
  const obj: Record<string, V> = {};
  for (const [key, value] of map) {
    obj[String(key)] = value;
  }
  return obj;
}



/**
 * Serializes StoredAuctionData for localStorage
 */
function serializeAuctionData(data: StoredAuctionData): string {
  const serialized = {
    contractAddress: data.contractAddress,
    nonces: {
      secretKey: uint8ArrayToBase64(data.nonces.secretKey),
      idNonce: uint8ArrayToBase64(data.nonces.idNonce),
      bidNonces: mapToObject(
        new Map(Array.from(data.nonces.bidNonces.entries()).map(([round, nonce]) => [
          round, 
          uint8ArrayToBase64(nonce)
        ]))
      ),
    },
    isRegistered: data.isRegistered,
    bidsPerRound: mapToObject(
      new Map(Array.from(data.bidsPerRound.entries()).map(([round, bid]) => [
        round,
        {
          value: bid.value.toString(),
          bidNonce: uint8ArrayToBase64(bid.bidNonce),
        }
      ]))
    ),
  };

  return JSON.stringify(serialized);
}

/**
 * Deserializes StoredAuctionData from localStorage
 */
function deserializeAuctionData(json: string): StoredAuctionData {
  const parsed = JSON.parse(json);

  const bidNoncesMap = new Map<number, Uint8Array>();
  for (const [round, base64Nonce] of Object.entries(parsed.nonces.bidNonces as Record<string, string>)) {
    bidNoncesMap.set(Number(round), base64ToUint8Array(base64Nonce));
  }

  const bidsPerRoundMap = new Map<number, { value: bigint; bidNonce: Uint8Array }>();
  for (const [round, bidData] of Object.entries(parsed.bidsPerRound as Record<string, any>)) {
    bidsPerRoundMap.set(Number(round), {
      value: BigInt(bidData.value),
      bidNonce: base64ToUint8Array(bidData.bidNonce),
    });
  }

  return {
    contractAddress: parsed.contractAddress,
    nonces: {
      secretKey: base64ToUint8Array(parsed.nonces.secretKey),
      idNonce: base64ToUint8Array(parsed.nonces.idNonce),
      bidNonces: bidNoncesMap,
    },
    isRegistered: parsed.isRegistered,
    bidsPerRound: bidsPerRoundMap,
  };
}

/**
 * Gets the storage key for a specific contract address
 */
function getStorageKey(contractAddress: string): string {
  return `${STORAGE_PREFIX}_${contractAddress}`;
}

/**
 * Stores auction data for a specific contract
 */
export function storeAuctionData(contractAddress: string, data: StoredAuctionData): void {
  try {
    const key = getStorageKey(contractAddress);
    const serialized = serializeAuctionData(data);
    localStorage.setItem(key, serialized);
  } catch (error) {
    console.error('Failed to store auction data:', error);
  }
}

/**
 * Retrieves auction data for a specific contract
 */
export function getAuctionData(contractAddress: string): StoredAuctionData | null {
  try {
    const key = getStorageKey(contractAddress);
    const stored = localStorage.getItem(key);
    
    if (!stored) {
      return null;
    }

    return deserializeAuctionData(stored);
  } catch (error) {
    console.error('Failed to retrieve auction data:', error);
    return null;
  }
}

/**
 * Creates new nonces for an auction and stores them
 */
export function initializeAuctionData(contractAddress: string): StoredAuctionData {
  const data: StoredAuctionData = {
    contractAddress,
    nonces: {
      secretKey: generateNonce(),
      idNonce: generateNonce(),
      bidNonces: new Map(),
    },
    isRegistered: false,
    bidsPerRound: new Map(),
  };

  storeAuctionData(contractAddress, data);
  return data;
}

/**
 * Generates and stores a bid nonce for a specific round
 */
export function generateBidNonce(contractAddress: string, round: number): Uint8Array {
  const data = getAuctionData(contractAddress);
  if (!data) {
    throw new Error('Auction data not found. Initialize auction data first.');
  }

  const bidNonce = generateNonce();
  data.nonces.bidNonces.set(round, bidNonce);
  storeAuctionData(contractAddress, data);

  return bidNonce;
}

/**
 * Stores a bid for a specific round
 */
export function storeBid(contractAddress: string, round: number, bid: PrivateBid): void {
  const data = getAuctionData(contractAddress);
  if (!data) {
    throw new Error('Auction data not found. Initialize auction data first.');
  }

  data.bidsPerRound.set(round, {
    value: bid.value,
    bidNonce: bid.bidNonce,
  });

  storeAuctionData(contractAddress, data);
}

/**
 * Marks the user as registered for an auction
 */
export function markAsRegistered(contractAddress: string): void {
  const data = getAuctionData(contractAddress);
  if (!data) {
    throw new Error('Auction data not found. Initialize auction data first.');
  }

  data.isRegistered = true;
  storeAuctionData(contractAddress, data);
}

/**
 * Gets a bid for a specific round
 */
export function getBid(contractAddress: string, round: number): { value: bigint; bidNonce: Uint8Array } | null {
  const data = getAuctionData(contractAddress);
  if (!data) {
    return null;
  }

  return data.bidsPerRound.get(round) || null;
}

/**
 * Clears all stored data for a specific contract
 */
export function clearAuctionData(contractAddress: string): void {
  try {
    const key = getStorageKey(contractAddress);
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Failed to clear auction data:', error);
  }
}

/**
 * Lists all stored auction contracts
 */
export function getStoredAuctions(): string[] {
  try {
    const auctions: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(STORAGE_PREFIX + '_')) {
        const contractAddress = key.substring(STORAGE_PREFIX.length + 1);
        auctions.push(contractAddress);
      }
    }
    return auctions;
  } catch (error) {
    console.error('Failed to get stored auctions:', error);
    return [];
  }
}
