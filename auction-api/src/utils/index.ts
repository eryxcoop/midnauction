/**
 * Utility functions for the Midnauction auction system.
 */

// Use browser's crypto API or Node.js crypto API depending on environment
const crypto = typeof window !== 'undefined' ? window.crypto : globalThis.crypto;

/**
 * Generates cryptographically secure random bytes.
 * 
 * @param length The number of bytes to generate
 * @returns A Uint8Array containing random bytes
 */
export function randomBytes(length: number): Uint8Array {
  return new Uint8Array(crypto.getRandomValues(new Uint8Array(length)));
}

/**
 * Creates a hash commitment for a bid.
 * 
 * @param bidAmount The bid amount
 * @param nonce Random nonce for the commitment
 * @returns A hash commitment as Uint8Array
 */
export async function createBidCommitment(bidAmount: bigint, nonce: Uint8Array): Promise<Uint8Array> {
  const encoder = new globalThis.TextEncoder();
  const bidData = encoder.encode(bidAmount.toString());
  
  // Combine bid amount and nonce
  const combined = new Uint8Array(bidData.length + nonce.length);
  combined.set(bidData, 0);
  combined.set(nonce, bidData.length);
  
  // Create SHA-256 hash
  const hashBuffer = await crypto.subtle.digest('SHA-256', combined);
  return new Uint8Array(hashBuffer);
}

/**
 * Verifies a bid commitment.
 * 
 * @param bidAmount The claimed bid amount
 * @param nonce The nonce used in the commitment
 * @param commitment The original commitment to verify against
 * @returns True if the commitment is valid
 */
export async function verifyBidCommitment(
  bidAmount: bigint, 
  nonce: Uint8Array, 
  commitment: Uint8Array
): Promise<boolean> {
  const calculatedCommitment = await createBidCommitment(bidAmount, nonce);
  
  // Compare byte arrays
  if (calculatedCommitment.length !== commitment.length) {
    return false;
  }
  
  for (let i = 0; i < calculatedCommitment.length; i++) {
    if (calculatedCommitment[i] !== commitment[i]) {
      return false;
    }
  }
  
  return true;
}

/**
 * Converts a bigint to a formatted currency string.
 * 
 * @param amount The amount in the smallest unit (e.g., cents)
 * @param currency The currency symbol (default: 'USD')
 * @returns Formatted currency string
 */
export function formatCurrency(amount: bigint, currency: string = 'USD'): string {
  const dollars = Number(amount) / 100; // Assuming amounts are in cents
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(dollars);
}

/**
 * Generates a unique participant ID.
 * 
 * @returns A unique string identifier
 */
export function generateParticipantId(): string {
  const timestamp = Date.now().toString(36);
  const randomPart = randomBytes(8)
    .reduce((str, byte) => str + byte.toString(36), '');
  return `participant_${timestamp}_${randomPart}`;
}

/**
 * Validates an auction bid amount.
 * 
 * @param bidAmount The bid amount to validate
 * @param minimumBid The minimum allowed bid
 * @returns True if the bid is valid
 */
export function validateBidAmount(bidAmount: bigint, minimumBid: bigint): boolean {
  return bidAmount >= minimumBid && bidAmount > 0n;
}

/**
 * Calculates the time remaining in milliseconds.
 * 
 * @param endTime The end time as a bigint timestamp
 * @returns Time remaining in milliseconds, or 0 if expired
 */
export function getTimeRemaining(endTime: bigint): number {
  const now = BigInt(Date.now());
  const remaining = endTime - now;
  return remaining > 0n ? Number(remaining) : 0;
}

/**
 * Sorts revealed bids by amount in descending order (highest first).
 * 
 * @param bids Array of revealed bids
 * @returns Sorted array with highest bids first
 */
export function sortBidsByAmount(bids: Array<{ bidAmount: bigint }>): Array<{ bidAmount: bigint }> {
  return [...bids].sort((a, b) => {
    if (a.bidAmount > b.bidAmount) return -1;
    if (a.bidAmount < b.bidAmount) return 1;
    return 0;
  });
}

/**
 * Determines the winner of an auction based on revealed bids.
 * 
 * @param revealedBids Array of revealed bids
 * @returns The winning bid, or null if no bids
 */
export function determineWinner<T extends { bidAmount: bigint }>(revealedBids: T[]): T | null {
  if (revealedBids.length === 0) {
    return null;
  }
  
  const sortedBids = sortBidsByAmount(revealedBids);
  return sortedBids[0] as T;
}
