# Midnauction API

This package provides TypeScript types and utilities for working with Midnauction auction contracts on the Midnight blockchain.

## Overview

The Midnauction API enables developers to:
- Deploy new auction contracts
- Join existing auctions as participants or auctioneers
- Submit private bids using cryptographic commitments
- Manage auction phases (bidding, revealing, finished)
- Reveal bids during the revelation phase
- Determine auction winners

## Key Features

### Private Bidding System
- **Commitment-based bidding**: Bids are submitted as cryptographic commitments to ensure privacy
- **Two-phase process**: Bidding phase followed by revealing phase
- **Secure nonces**: Each bid uses a cryptographically secure random nonce

### Role-based Access Control
- **Auctioneer**: Can create auctions, manage phases, and control the auction lifecycle
- **Participant**: Can submit bids and reveal them during the appropriate phases

### Auction Phases
1. **Bidding Phase**: Participants submit encrypted bid commitments
2. **Revealing Phase**: Participants reveal their actual bid amounts with nonces
3. **Finished Phase**: Auction is complete, winner is determined

## Installation

```bash
npm install @midnight-ntwrk/midnauction-api
```

## Usage

### Deploying a New Auction

```typescript
import { AuctionAPI, AuctionProviders } from '@midnight-ntwrk/midnauction-api';

// Deploy a new auction contract
const auctionAPI = await AuctionAPI.deploy(providers, logger);

// Create the auction
await auctionAPI.createAuction(
  'MacBook Pro M3 16"',
  'Brand new MacBook Pro with M3 chip, 32GB RAM, 1TB SSD',
  150000n // $1,500.00 in cents
);
```

### Joining an Existing Auction

```typescript
import { AuctionAPI } from '@midnight-ntwrk/midnauction-api';

// Join an existing auction
const auctionAPI = await AuctionAPI.join(providers, contractAddress, logger);

// Submit a bid
await auctionAPI.submitBid(180000n); // $1,800.00 in cents
```

### Managing Auction Phases (Auctioneer)

```typescript
// Close bidding phase
await auctionAPI.closeBidding();

// Start revealing phase
await auctionAPI.startRevealing();

// Finish the auction
await auctionAPI.finishAuction();
```

### Observing Auction State

```typescript
// Subscribe to auction state changes
auctionAPI.state$.subscribe(state => {
  console.log('Current phase:', state.publicState.currentPhase);
  console.log('Total bids:', state.publicState.totalBids);
  console.log('Can submit bid:', state.canSubmitBid);
  console.log('Revealed bids:', state.publicState.revealedBids);
});
```

## API Reference

### AuctionAPI Class

#### Static Methods
- `deploy(providers, logger?)`: Deploy a new auction contract
- `join(providers, contractAddress, logger?)`: Join an existing auction

#### Instance Methods
- `createAuction(name, description, minimumBid)`: Create a new auction (auctioneer only)
- `submitBid(bidAmount)`: Submit a private bid
- `closeBidding()`: Close the bidding phase (auctioneer only)
- `startRevealing()`: Start the revealing phase (auctioneer only)
- `revealBid(bidAmount, nonce)`: Reveal a previously submitted bid
- `finishAuction()`: Finish the auction (auctioneer only)
- `refreshState()`: Refresh the current auction state

#### Properties
- `deployedContractAddress`: The contract address
- `state$`: Observable stream of auction state changes

### Types

#### AuctionPhase
```typescript
enum AuctionPhase {
  BIDDING = 'bidding',
  REVEALING = 'revealing',
  FINISHED = 'finished'
}
```

#### AuctionDerivedState
```typescript
interface AuctionDerivedState {
  publicState: PublicAuctionState;
  privateState: AuctionPrivateState;
  isAuctioneer: boolean;
  canSubmitBid: boolean;
  canRevealBid: boolean;
  hasSubmittedBid: boolean;
  myCurrentBid?: AuctionBid;
}
```

### Utility Functions

The `utils` namespace provides helpful utility functions:

- `randomBytes(length)`: Generate cryptographically secure random bytes
- `createBidCommitment(bidAmount, nonce)`: Create a bid commitment hash
- `verifyBidCommitment(bidAmount, nonce, commitment)`: Verify a bid commitment
- `formatCurrency(amount, currency?)`: Format amounts as currency strings
- `validateBidAmount(bidAmount, minimumBid)`: Validate bid amounts
- `determineWinner(revealedBids)`: Determine the auction winner

## Security Considerations

1. **Private Key Management**: Ensure private keys are stored securely
2. **Nonce Generation**: Always use cryptographically secure random nonces
3. **Bid Commitments**: Never reveal bid amounts before the revealing phase
4. **Network Security**: Use secure connections when communicating with the blockchain

## Development Status

⚠️ **Note**: This API is currently in development and uses mock contract implementations. The actual contract integration will be completed once the Midnauction smart contract is implemented.

## License

MIT License - see LICENSE file for details.
