# Midnauction - Team Eryx raccoons

## Installation
```bash
cd contracts
```

```bash
npm run compact
```

```bash
npm run build
```

```bash
cd ../midnauction-ui
```

```bash
npm run build:start
```

You must use a browser with Lace wallet and have the Midnight's Proving Server on 

## Summary

After analyzing the possibilities offered by Midnight and the machinery already built, we concluded that it is an ideal environment for the development of private auctions.

We built a **sealed-bid round-based auction** in Compact, leveraging the **commitments** mechanism and ZKPs to keep participants’ real identities private while being able to bid freely.

Our tool allows a seller to list a product, run `N` rounds of sealed bids, where both the bid amounts and the bidders’ identities remain private. The amounts are revealed all together at the end of each round, and in the final round, the winner can publish an encrypted contact detail to coordinate a settlement off-chain or via another dApp with the seller.

This auction model allows the asset price to be adjusted over the rounds, since bidders use the set of bids from one round as input for the next, converging towards an optimal price. The winner of the auction will be the one who places the highest bid in the final round.

It is worth noting that, although this was the chosen model, the framework can be used to implement any other type of auction with added privacy.

## Use Cases

Our proposal adds enormous value because it replicates a mechanism already used in the real world: many governments, both at national and regional levels, tender public works, concessions, and strategic services through this type of auction. This scheme guarantees transparency, fair competition, and efficient price discovery, while protecting the confidentiality of participants until the right moment. Bringing this model to the blockchain not only digitizes a process widely known to the public and private sectors, but also provides cryptographic security, immutability, and open verifiability—enhancing trust in tenders and generating more transparent and competitive business opportunities.

Additionally, this type of auction has huge potential in the B2B world: when a large company outsources logistics services, hires raw material suppliers, or seeks strategic alliances, confidentiality of bids and non-collusion between competitors are absolutely key. For example, an automaker wanting to select its battery supplier can open a private multi-round auction, making a fair choice, avoiding secret agreements, and maintaining the full traceability of the process on-chain.


## Roles and Components

### Roles

* **Auctioneer (owner):** creates the contract, defines the number of rounds, and controls the bidding and reveal timings.
* **Participants:** place sealed bids and reveal them depending on the phase.
* **Contract:** stores minimal state and verifies proofs or commitments.

**Contract parameters (ledger):**

* `productName`, `productDescription`: metadata of the item on sale.
* `rounds` / `currentRound`: total number of rounds and round counter (starts at 1).
* `phase`: `commitment`, `revealing`, or `finished` depending on the auction stage. In `commitment`, bidders submit private bids. In `revealing`, bids are revealed without showing bidders’ addresses. In `finished`, the auction ends.
* `auctioneerPK`: public key of the auctioneer.
* `registeredParticipants`: bidders’ identities in the form of commitments.
* `secretBids`: **encrypted** bids of the round.
* `revealedBids`: **decrypted** amounts of the last round's bids.
* `winnerEncryptedPublicKey`: contact information of the winner, encrypted with the auctioneer’s public key. This ensures that only the contract owner can know the winner’s identity.


## Workflow

```
Round 1..N:
  [Phase: commitment]
    - Participant computes:
        bidCommit = commit(value, bidNonce)
        idCommit  = commit(secretKey(), idNonce)
    - Sends their bid through these 2 commitments.
      * In round 1, idCommit gets “registered”.
      * In later rounds, they must reuse the same idNonce so idCommit matches.
  [Owner] Switches to reveal phase.

  [Phase: revealing]
    - Participant reveals they bid `value` by providing bidNonce and value.
      * Contract verifies that (bidCommit, idCommit) exist in commitments from commitment phase.
      * Stores `value` in revealedBids (public).
  [If not last round] moveToNextPhase() → clears sets and advances currentRound

Final round:
  [Phase: revealing]
    - Winner calls claimWin(value, bidNonce, idNonce, encryptedPublicKey)
      * Verifies that the committed pair exists.
      * Publishes `winnerEncryptedPublicKey` for secure contact.
  
  [Phase: finished]
    - Once the winner sends their public key, the Owner can close the auction.
```


## Contract Interface

### `commitSecretBid(value: Uint<64>, bidNonce: Bytes<32>, idNonce: Bytes<32>)`

* **When:** `commitment` phase.
* **What it does:** registers the pair `(commit(value), commit(identity))`. In round 1, adds `idCommit` to `registeredParticipants`.
* **Checks/errors:**

    * Correct phase.
    * If `currentRound == 1`, registers you; otherwise, **you must already be registered**.
    * Inserts into `secretBids`.

### `moveToRevealPhase()`

* **Role:** **owner only** (requires `Ownable_assertOnlyOwner()`).
* **What it does:** switches `phase` to `revealing`.

### `revealBid(value, bidNonce, idNonce)`

* **When:** `revealing` phase.
* **What it does:** recomputes commitments and verifies that the pair was committed. If valid, stores `value` in `revealedBids` to make it visible to all participants.

### `moveToNextPhase()`

* **When:** at the end of a reveal phase of a **non-final** round.
* **What it does:** clears `secretBids` and `revealedBids`, increments `currentRound`, returns to `commitment` phase.

### `claimWin(value, bidNonce, idNonce, encryptedPublicKey)`

* **When:** `revealing` phase of the **last round** (`currentRound == rounds`).
* **What it does:** verifies that the (bidCommit, idCommit) existed and stores `winnerEncryptedPublicKey`.
* **Usage:** publish an encrypted contact method (e.g., an ephemeral public key) for settlement coordination.

### `finishAuction()`

* **Role:** **owner only** (requires `Ownable_assertOnlyOwner()`).
* **When:** `revealing` phase of the **last round** (`currentRound == rounds`), once the winner has published their encrypted public key.
* **What it does:** closes the auction.


## Privacy

* **Persistent commitments** (`persistentCommit`): allow you to **prove** that you knew a value at the time of commitment without revealing it. In `revealBid`, you demonstrate consistency by providing `value` and `bidNonce`.
* **Pseudonymous identity:** `idCommit = commit(secretKey(), idNonce)`. The contract does not know your `secretKey()`.
* **Phase-based privacy:** in `commitment`, neither bid amounts nor real identities are visible; in `revealing`, only the bid amounts are revealed.


## Addressed ACE Freedoms

**Freedom of Commerce:** Bids are treated as private transactions, where each offer is cryptographically committed and only revealed at the right moment. This protects participants’ business strategies and prevents collusion, enabling purchase processes with maximum transparency and confidentiality.

**Freedom of Association:** The registration mechanism through pseudonymous identities (idCommit) ensures that a group of participants can compete on equal terms without publicly exposing who they are, fostering collaboration and fair competition in sensitive environments.


## Key Integrated Components

**OpenZeppelin Integration (Security & Reusability):** The contract inherits OpenZeppelin’s Ownable structure for access control, ensuring that phase management is restricted to an authorized role. This demonstrates how proven security standards can be combined with Compact to build reusable blocks in ZK environments.

**Secure Data Sharing (Privacy-Preserving Exchange):** The entire commit–reveal logic implements selective disclosure: the existence of a commitment is shared in the bidding phase, but only the bid amount is revealed later. In the end, the winner publishes an encrypted public key for off-chain coordination, showcasing a real flow of controlled confidential data exchange.

**Developer Enablement (Tooling Enhancement):** Our contract is designed as a modular and reusable building block that other developers can use as a base for their own dApps in Midnight. The commit–reveal pattern with pseudonymous identities and phase control can be applied not only to auctions but also to private voting, contests, or bidding games—making our project a facilitator for adoption.

**Zero-Knowledge Verification (Attribute Proofs):** The use of persistent commitments works as a proof of knowledge without revealing secrets. Participants prove they knew their bid and identity from the commitment phase without exposing private keys. This is a practical case of “rational privacy” applied to commerce.
