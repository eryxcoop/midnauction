import { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  Alert,
  CircularProgress
} from '@mui/material';
import { AttachMoney, Lock } from '@mui/icons-material';

interface BidFormProps {
  minimumBidValue: number;
  canSubmitBid: boolean;
  hasSubmittedBid: boolean;
  isParticipant: boolean;
  onSubmitBid: (bidAmount: number) => Promise<void>;
  loading?: boolean;
  error?: string | null;
}

export function BidForm({
  minimumBidValue,
  canSubmitBid,
  hasSubmittedBid,
  isParticipant,
  onSubmitBid,
  loading = false,
  error = null
}: BidFormProps) {
  const [bidAmount, setBidAmount] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (!bidAmount || isNaN(Number(bidAmount))) {
      setLocalError('Please enter a valid bid amount');
      return;
    }

    const amount = Number(bidAmount);
    if (amount < minimumBidValue) {
      setLocalError(`Bid must be at least ${minimumBidValue}`);
      return;
    }

    try {
      await onSubmitBid(amount);
      setBidAmount('');
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : 'Failed to submit bid');
    }
  };

  if (!isParticipant) {
    return null;
  }

  if (hasSubmittedBid) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Bid Submitted
          </Typography>
          <Typography variant="body2" color="text.secondary">
            You have already submitted a bid for this auction.
          </Typography>
        </CardContent>
      </Card>
    );
  }

  if (!canSubmitBid) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Bidding Closed
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Bidding is not currently open for this auction.
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Submit Your Bid
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          Enter your bid amount. Your bid will be kept private until the revealing phase.
        </Typography>

        {(error || localError) && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error || localError}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'grid', gap: 2 }}>
          <TextField
            fullWidth
            label="Bid Amount (USD)"
            type="number"
            value={bidAmount}
            onChange={(e) => setBidAmount(e.target.value)}
            required
            inputProps={{ 
              min: minimumBidValue,
              step: 0.01 
            }}
            InputProps={{
              startAdornment: <AttachMoney sx={{ mr: 1 }} />,
            }}
            helperText={`Minimum bid: $${minimumBidValue}`}
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading || !bidAmount}
            startIcon={loading ? <CircularProgress size={20} /> : <Lock />}
            fullWidth
          >
            {loading ? 'Submitting...' : 'Submit Private Bid'}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}
