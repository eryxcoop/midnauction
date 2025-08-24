import React, { useEffect, useState, useCallback } from 'react';
import { type Observable } from 'rxjs';
import { type ContractAddress } from '@midnight-ntwrk/compact-runtime';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  TextField,
  Alert,
  CircularProgress
} from '@mui/material';
import { useDeployedAuctionContext } from '../hooks';
import { type AuctionDeployment } from '../contexts/BrowserDeployedAuctionManager';
import { type AuctionAPI, type AuctionDerivedState } from '@midnight-ntwrk/midnauction-api';

export interface AuctionGameProps {
  auctionDeployment$?: Observable<AuctionDeployment>;
}

export const AuctionGame: React.FC<Readonly<AuctionGameProps>> = ({ auctionDeployment$ }) => {
  const auctionApiProvider = useDeployedAuctionContext();
  const [auctionDeployment, setAuctionDeployment] = useState<AuctionDeployment>();
  const [deployedAuctionAPI, setDeployedAuctionAPI] = useState<AuctionAPI>();
  const [errorMessage, setErrorMessage] = useState<string>();
  const [auctionState, setAuctionState] = useState<AuctionDerivedState>();
  const [bidAmount, setBidAmount] = useState<string>('');
  const [contractAddress, setContractAddress] = useState<string>('');
  const [isWorking, setIsWorking] = useState(!!auctionDeployment$);

  // Callbacks to create or join auction
  const onCreateAuction = useCallback(() => auctionApiProvider.resolve(), [auctionApiProvider]);
  const onJoinAuction = useCallback(
    (contractAddress: ContractAddress) => auctionApiProvider.resolve(contractAddress),
    [auctionApiProvider],
  );

  // Callback to submit bid
  const onSubmitBid = useCallback(async () => {
    if (!bidAmount || !deployedAuctionAPI) {
      return;
    }

    try {
      setIsWorking(true);
      await deployedAuctionAPI.submitBid(BigInt(Math.round(parseFloat(bidAmount) * 100))); // Convert to cents
      setBidAmount('');
    } catch (error: unknown) {
      setErrorMessage(error instanceof Error ? error.message : String(error));
    } finally {
      setIsWorking(false);
    }
  }, [deployedAuctionAPI, bidAmount]);

  // Effect to handle auction deployment changes
  useEffect(() => {
    if (!auctionDeployment$) {
      return;
    }

    const subscription = auctionDeployment$.subscribe({
      next: setAuctionDeployment,
      error: (error) => setErrorMessage(error instanceof Error ? error.message : String(error)),
    });

    return () => subscription.unsubscribe();
  }, [auctionDeployment$]);

  // Effect to handle deployed API changes
  useEffect(() => {
    if (auctionDeployment?.tag !== 'deployed') {
      setDeployedAuctionAPI(undefined);
      setAuctionState(undefined);
      return;
    }

    const api = auctionDeployment.api;
    setDeployedAuctionAPI(api);

    const subscription = api.state$.subscribe({
      next: setAuctionState,
      error: (error) => setErrorMessage(error instanceof Error ? error.message : String(error)),
    });

    return () => subscription.unsubscribe();
  }, [auctionDeployment]);

  // Render deployment state
  if (!auctionDeployment || auctionDeployment.tag === 'undeployed') {
    return (
      <Card sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Midnauction - Private Auction System
          </Typography>
          
          <Box sx={{ mt: 3 }}>
            <Button 
              variant="contained" 
              onClick={onCreateAuction}
              sx={{ mr: 2, mb: 2 }}
              disabled={isWorking}
            >
              Create New Auction
            </Button>
          </Box>

          <Box sx={{ mt: 2 }}>
            <TextField
              label="Contract Address"
              value={contractAddress}
              onChange={(e) => setContractAddress(e.target.value)}
              fullWidth
              sx={{ mb: 2 }}
              placeholder="0x..."
            />
            <Button 
              variant="outlined" 
              onClick={() => onJoinAuction(contractAddress as ContractAddress)}
              disabled={!contractAddress || isWorking}
              fullWidth
            >
              Join Existing Auction
            </Button>
          </Box>
        </CardContent>
      </Card>
    );
  }

  if (auctionDeployment.tag === 'deploying') {
    return (
      <Card sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
        <CardContent sx={{ textAlign: 'center' }}>
          <CircularProgress sx={{ mb: 2 }} />
          <Typography>Deploying auction contract...</Typography>
        </CardContent>
      </Card>
    );
  }

  if (auctionDeployment.tag === 'joining') {
    return (
      <Card sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
        <CardContent sx={{ textAlign: 'center' }}>
          <CircularProgress sx={{ mb: 2 }} />
          <Typography>Joining auction...</Typography>
          <Typography variant="body2" color="text.secondary">
            Contract: {auctionDeployment.contractAddress}
          </Typography>
        </CardContent>
      </Card>
    );
  }

  if (auctionDeployment.tag === 'error') {
    return (
      <Card sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
        <CardContent>
          <Alert severity="error" sx={{ mb: 2 }}>
            {auctionDeployment.error.message}
          </Alert>
          <Button variant="outlined" onClick={onCreateAuction}>
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Deployed state - show auction interface
  return (
    <Card sx={{ maxWidth: 800, mx: 'auto', mt: 4 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Auction: {auctionState?.publicState.productName || 'Loading...'}
        </Typography>

        {errorMessage && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setErrorMessage(undefined)}>
            {errorMessage}
          </Alert>
        )}

        {auctionState && (
          <Box>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {auctionState.publicState.productDescription}
            </Typography>
            
            <Typography variant="h6" sx={{ mb: 1 }}>
              Minimum Bid: ${(Number(auctionState.publicState.minimumBidValue) / 100).toFixed(2)}
            </Typography>
            
            <Typography variant="body2" sx={{ mb: 2 }}>
              Phase: {auctionState.publicState.currentPhase} | 
              Total Bids: {Number(auctionState.publicState.totalBids)}
            </Typography>

            {auctionState.canSubmitBid && (
              <Box sx={{ mt: 3 }}>
                <TextField
                  label="Bid Amount ($)"
                  type="number"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  sx={{ mr: 2, minWidth: 150 }}
                  inputProps={{ min: Number(auctionState.publicState.minimumBidValue) / 100, step: 0.01 }}
                />
                <Button 
                  variant="contained" 
                  onClick={onSubmitBid}
                  disabled={!bidAmount || isWorking}
                >
                  {isWorking ? <CircularProgress size={20} /> : 'Submit Bid'}
                </Button>
              </Box>
            )}

            {auctionState.publicState.revealedBids.length > 0 && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="h6">Revealed Bids:</Typography>
                {auctionState.publicState.revealedBids.map((bid, index) => (
                  <Typography key={index} variant="body2">
                    {bid.participantId}: ${(Number(bid.bidAmount) / 100).toFixed(2)}
                  </Typography>
                ))}
              </Box>
            )}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};
