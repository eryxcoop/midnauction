import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  InputAdornment,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import { AttachMoney, Lock, Send } from '@mui/icons-material';
import { AuctionRound } from '../types';

interface BidFormProps {
  currentRound: AuctionRound;
  minimumBidValue: number;
  canSubmitBid: boolean;
  canRevealBid: boolean;
  hasSubmittedBid: boolean;
  isParticipant: boolean;
  onSubmitBid: (amount: number) => Promise<void>;
  onRevealBid: () => Promise<void>;
  loading: boolean;
  error: string | null;
}

export function BidForm({
  currentRound,
  minimumBidValue,
  canSubmitBid,
  canRevealBid,
  hasSubmittedBid,
  isParticipant,
  onSubmitBid,
  onRevealBid,
  loading,
  error,
}: BidFormProps) {
  const [bidAmount, setBidAmount] = useState<string>('');
  const [bidError, setBidError] = useState<string>('');

  const handleBidChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setBidAmount(value);
    
    const numValue = parseFloat(value);
    if (value && numValue < minimumBidValue) {
      setBidError(`La oferta debe ser mayor a $${minimumBidValue}`);
    } else {
      setBidError('');
    }
  };

  const handleSubmitBid = async () => {
    const amount = parseFloat(bidAmount);
    if (isNaN(amount) || amount < minimumBidValue) {
      setBidError(`Por favor ingrese una cantidad válida mayor a $${minimumBidValue}`);
      return;
    }

    try {
      await onSubmitBid(amount);
      setBidAmount('');
      setBidError('');
    } catch (err) {
      setBidError(err instanceof Error ? err.message : 'Error al enviar la oferta');
    }
  };

  const handleRevealBid = async () => {
    try {
      await onRevealBid();
    } catch (err) {
      // Error handling is done in the context
    }
  };

  const getActiveStep = () => {
    if (currentRound === AuctionRound.BIDDING) return 0;
    if (currentRound === AuctionRound.REVEALING) return 1;
    return 2;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" mb={3}>
          Auction Participation
        </Typography>

        <Stepper activeStep={getActiveStep()} sx={{ mb: 3 }}>
          <Step>
            <StepLabel>Submit Private Bid</StepLabel>
          </Step>
          <Step>
            <StepLabel>Reveal Bid</StepLabel>
          </Step>
          <Step>
            <StepLabel>Results</StepLabel>
          </Step>
        </Stepper>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Private Bidding Phase */}
        {currentRound === AuctionRound.BIDDING && (
          <Box>
            {canSubmitBid && !hasSubmittedBid && (
              <Box>
                <Typography variant="body1" mb={2}>
                  {!isParticipant 
                    ? "Enter your bid to join the auction. Only you will know the amount until the revelation phase."
                    : "Enter your private bid. Only you will know the amount until the revelation phase."
                  }
                </Typography>
                
                <TextField
                  fullWidth
                  label="Bid Amount"
                  type="number"
                  value={bidAmount}
                  onChange={handleBidChange}
                  error={!!bidError}
                  helperText={bidError || `Minimum: ${formatCurrency(minimumBidValue)}`}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AttachMoney />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 2 }}
                />
                
                <Button
                  fullWidth
                  variant="contained"
                  onClick={handleSubmitBid}
                  disabled={loading || !!bidError || !bidAmount}
                  startIcon={<Lock />}
                  size="large"
                >
                  {loading 
                    ? 'Submitting Bid...' 
                    : (!isParticipant ? 'Join with Bid' : 'Submit Private Bid')
                  }
                </Button>
              </Box>
            )}

            {hasSubmittedBid && (
              <Alert severity="success" icon={<Lock />}>
                ✓ Your private bid has been submitted successfully. 
                Wait for the revelation phase to begin.
              </Alert>
            )}

            {!canSubmitBid && !hasSubmittedBid && (
              <Alert severity="warning">
                The bidding period has ended. No new bids can be submitted.
              </Alert>
            )}
          </Box>
        )}

        {/* Revelation Phase */}
        {currentRound === AuctionRound.REVEALING && (
          <Box>
            {hasSubmittedBid ? (
              <Alert severity="info">
                <Typography variant="body1" mb={1}>
                  <strong>Revelation Phase in Progress</strong>
                </Typography>
                <Typography variant="body2">
                                  The auctioneer is revealing bids automatically.
                Your bid will be revealed when the auctioneer decides.
                </Typography>
              </Alert>
            ) : (
              <Alert severity="warning">
                You did not participate in this auction. The bidding phase has already ended.
              </Alert>
            )}
          </Box>
        )}

        {/* Auction Finished */}
        {currentRound === AuctionRound.FINISHED && (
          <Alert severity="success">
                          🎉 The auction has finished. You can see the final results above.
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
