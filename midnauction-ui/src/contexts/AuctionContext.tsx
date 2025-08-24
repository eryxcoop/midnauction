import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { AuctionState, AuctionPhase } from '../types';
import { apiStateToUIState, dollarsToCents } from '../types/api-adapter';
import { type DeployedMidnauctionAPI } from '../../../api/src/index';
import { type ContractAddress } from '@midnight-ntwrk/compact-runtime';
import { useDeployedAuctionContext } from '../hooks/useDeployedAuctionContext';
import { 
  initializeAuctionData,
  getAuctionData,
  generateBidNonce,
  storeBid,
  markAsRegistered,
  getBid 
} from '../utils/localStorage';

interface AuctionContextType {
  auctionState: AuctionState;
  currentContractAddress?: ContractAddress;
  
  // Participant functions
  submitBid: (bidAmount: number) => Promise<void>;
  revealBid: () => Promise<void>;
  claimWin: (encryptedPublicKey?: Uint8Array) => Promise<void>;
  
  // Auctioneer control functions
  moveToRevealPhase: () => Promise<void>;
  moveToNextPhase: () => Promise<void>;
  finishAuction: () => Promise<void>;
  
  // API management
  deployNewAuction: (productName: string, productDescription: string, rounds: number) => Promise<ContractAddress>;
  joinExistingAuction: (contractAddress: ContractAddress, role?: 'participant' | 'auctioneer') => Promise<void>;
  
  // UI state
  loading: boolean;
  error: string | null;
  clearError: () => void;
}

const AuctionContext = createContext<AuctionContextType | undefined>(undefined);

interface AuctionProviderProps {
  children: ReactNode;
}

// Default auction state
const defaultAuctionState: AuctionState = {
  auction: {
    productName: '',
    productDescription: '',
    rounds: 1,
    currentRound: 1,
    auctioneerPK: '',
    phase: AuctionPhase.COMMITMENT,
    registeredParticipants: 0,
    secretBids: 0,
    revealedBids: [],
  },
  userData: undefined,
  isParticipant: false,
  isAuctioneer: false,
  canSubmitBid: false,
  canRevealBid: false,
  canClaimWin: false,
  isConnected: false,
};

export function AuctionProvider({ children }: AuctionProviderProps) {
  const deployedAuctionProvider = useDeployedAuctionContext();
  
  // State
  const [auctionAPI, setAuctionAPI] = useState<DeployedMidnauctionAPI | null>(null);
  const [currentContractAddress, setCurrentContractAddress] = useState<ContractAddress | undefined>();
  const [auctionState, setAuctionState] = useState<AuctionState>(defaultAuctionState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuctioneer, setIsAuctioneer] = useState(false);

  // Clear error function
  const clearError = useCallback(() => setError(null), []);

  // Subscribe to API state changes
  useEffect(() => {
    if (!auctionAPI || !currentContractAddress) {
      setAuctionState(defaultAuctionState);
      return;
    }

    const subscription = auctionAPI.state$.subscribe({
      next: (apiState) => {
        try {
          const uiState = apiStateToUIState(apiState, currentContractAddress, isAuctioneer);
          setAuctionState(uiState);
        } catch (err) {
          console.error('Error converting API state to UI state:', err);
          setError(`Error updating auction state: ${err instanceof Error ? err.message : 'Unknown error'}`);
        }
      },
      error: (err) => {
        console.error('API state subscription error:', err);
        setError(`Connection error: ${err instanceof Error ? err.message : 'Unknown error'}`);
      }
    });

    return () => subscription.unsubscribe();
  }, [auctionAPI, currentContractAddress, isAuctioneer]);

  // Deploy new auction
  const deployNewAuction = async (productName: string, productDescription: string, rounds: number): Promise<ContractAddress> => {
    setLoading(true);
    setError(null);
    try {
      const deployment = deployedAuctionProvider.resolve(undefined, {
        productName,
        productDescription,
        rounds: BigInt(rounds),
      });

      const result = await new Promise<DeployedMidnauctionAPI>((resolve, reject) => {
        const subscription = deployment.subscribe({
          next: (deploymentState) => {
            if (deploymentState.status === 'deployed') {
              subscription.unsubscribe();
              resolve(deploymentState.api);
            } else if (deploymentState.status === 'failed') {
              subscription.unsubscribe();
              reject(deploymentState.error);
            }
          },
          error: reject,
        });
      });

      setAuctionAPI(result);
      setCurrentContractAddress(result.deployedContractAddress);
      setIsAuctioneer(true);
      
      // Initialize local storage for this auction
      initializeAuctionData(result.deployedContractAddress);

      return result.deployedContractAddress;
    } catch (err) {
      const errorMessage = `Error deploying auction: ${err instanceof Error ? err.message : 'Unknown error'}`;
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Join existing auction
  const joinExistingAuction = async (contractAddress: ContractAddress, role: 'participant' | 'auctioneer' = 'participant'): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const deployment = deployedAuctionProvider.resolve(contractAddress);

      const result = await new Promise<DeployedMidnauctionAPI>((resolve, reject) => {
        const subscription = deployment.subscribe({
          next: (deploymentState) => {
            if (deploymentState.status === 'deployed') {
              subscription.unsubscribe();
              resolve(deploymentState.api);
            } else if (deploymentState.status === 'failed') {
              subscription.unsubscribe();
              reject(deploymentState.error);
            }
          },
          error: reject,
        });
      });

      setAuctionAPI(result);
      setCurrentContractAddress(contractAddress);
      setIsAuctioneer(role === 'auctioneer');
      
      // Initialize local storage if not exists
      let storedData = getAuctionData(contractAddress);
      if (!storedData) {
        storedData = initializeAuctionData(contractAddress);
      }

    } catch (err) {
      const errorMessage = `Error joining auction: ${err instanceof Error ? err.message : 'Unknown error'}`;
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Submit bid
  const submitBid = async (bidAmount: number): Promise<void> => {
    if (!auctionAPI || !currentContractAddress) {
      throw new Error('Not connected to an auction. Please join an auction first.');
    }

    if (auctionState.auction.phase !== AuctionPhase.COMMITMENT) {
      throw new Error('Bids can only be submitted during the commitment phase');
    }

    setLoading(true);
    setError(null);
    try {
      const storedData = getAuctionData(currentContractAddress);
      if (!storedData) {
        throw new Error('Auction data not found. Please refresh and try again.');
      }

      const currentRound = auctionState.auction.currentRound;
      const bidNonce = generateBidNonce(currentContractAddress, currentRound);
      const bidValue = dollarsToCents(bidAmount);

      // Call the contract
      await auctionAPI.commitSecretBid(bidValue, bidNonce, storedData.nonces.idNonce);

      // Store the bid locally
      storeBid(currentContractAddress, currentRound, {
        value: bidValue,
        bidNonce,
      });

      // Mark as registered if first round
      if (currentRound === 1) {
        markAsRegistered(currentContractAddress);
      }

    } catch (err) {
      setError(`Error submitting bid: ${err instanceof Error ? err.message : 'Unknown error'}`);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Reveal bid
  const revealBid = async (): Promise<void> => {
    if (!auctionAPI || !currentContractAddress) {
      throw new Error('Not connected to an auction');
    }

    if (auctionState.auction.phase !== AuctionPhase.REVEALING) {
      throw new Error('Bids can only be revealed during the revealing phase');
    }

    setLoading(true);
    setError(null);
    try {
      const storedData = getAuctionData(currentContractAddress);
      if (!storedData) {
        throw new Error('Auction data not found');
      }

      const currentRound = auctionState.auction.currentRound;
      const bidData = getBid(currentContractAddress, currentRound);
      if (!bidData) {
        throw new Error('No bid found for current round');
      }

      await auctionAPI.revealBid(bidData.value, bidData.bidNonce, storedData.nonces.idNonce);

    } catch (err) {
      setError(`Error revealing bid: ${err instanceof Error ? err.message : 'Unknown error'}`);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Claim win
  const claimWin = async (encryptedPublicKey?: Uint8Array): Promise<void> => {
    if (!auctionAPI || !currentContractAddress) {
      throw new Error('Not connected to an auction');
    }

    setLoading(true);
    setError(null);
    try {
      const storedData = getAuctionData(currentContractAddress);
      if (!storedData) {
        throw new Error('Auction data not found');
      }

      const currentRound = auctionState.auction.currentRound;
      const bidData = getBid(currentContractAddress, currentRound);
      if (!bidData) {
        throw new Error('No bid found for current round');
      }

      const publicKey = encryptedPublicKey || new Uint8Array(32); // Default empty key if not provided

      await auctionAPI.claimWin(bidData.value, bidData.bidNonce, storedData.nonces.idNonce, publicKey);

    } catch (err) {
      setError(`Error claiming win: ${err instanceof Error ? err.message : 'Unknown error'}`);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Auctioneer functions
  const moveToRevealPhase = async (): Promise<void> => {
    if (!auctionAPI) {
      throw new Error('Not connected to an auction');
    }

    if (!isAuctioneer) {
      throw new Error('Only the auctioneer can control auction phases');
    }

    setLoading(true);
    setError(null);
    try {
      await auctionAPI.moveToRevealPhase();
    } catch (err) {
      setError(`Error moving to reveal phase: ${err instanceof Error ? err.message : 'Unknown error'}`);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const moveToNextPhase = async (): Promise<void> => {
    if (!auctionAPI) {
      throw new Error('Not connected to an auction');
    }

    if (!isAuctioneer) {
      throw new Error('Only the auctioneer can control auction phases');
    }

    setLoading(true);
    setError(null);
    try {
      await auctionAPI.moveToNextPhase();
    } catch (err) {
      setError(`Error moving to next phase: ${err instanceof Error ? err.message : 'Unknown error'}`);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const finishAuction = async (): Promise<void> => {
    if (!auctionAPI) {
      throw new Error('Not connected to an auction');
    }

    if (!isAuctioneer) {
      throw new Error('Only the auctioneer can finish the auction');
    }

    setLoading(true);
    setError(null);
    try {
      await auctionAPI.finishAuction();
    } catch (err) {
      setError(`Error finishing auction: ${err instanceof Error ? err.message : 'Unknown error'}`);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value: AuctionContextType = {
    auctionState,
    currentContractAddress,
    submitBid,
    revealBid,
    claimWin,
    moveToRevealPhase,
    moveToNextPhase,
    finishAuction,
    deployNewAuction,
    joinExistingAuction,
    loading,
    error,
    clearError,
  };

  return (
    <AuctionContext.Provider value={value}>
      {children}
    </AuctionContext.Provider>
  );
}

export function useAuction(): AuctionContextType {
  const context = useContext(AuctionContext);
  if (context === undefined) {
    throw new Error('useAuction must be used within an AuctionProvider');
  }
  return context;
}