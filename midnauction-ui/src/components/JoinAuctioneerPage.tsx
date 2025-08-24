import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHybridAuction } from '../contexts/HybridAuctionContext';
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Alert,
  InputAdornment,
} from '@mui/material';
import {
  ArrowBack,
  Search,
  Gavel,
} from '@mui/icons-material';

export function JoinAuctioneerPage() {
  const navigate = useNavigate();
  const { joinExistingAuction, loading, error } = useHybridAuction();
  const [contractAddress, setContractAddress] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  const handleAccessAuction = async () => {
    if (!contractAddress.trim()) {
      setLocalError('Please enter the contract address');
      return;
    }

    // Basic address format validation
    if (!contractAddress.startsWith('0x')) {
      setLocalError('The contract address must have the correct format (0x...)');
      return;
    }

    setLocalError(null);

    try {
      // Join existing auction using the hybrid context (which uses real providers)
      await joinExistingAuction(contractAddress, 'auctioneer');
      
      // Navigate to auction page as auctioneer
      navigate(`/auction/${contractAddress}?role=auctioneer`);
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : 'Error accessing auction');
    }
  };

  const handleBack = () => {
    navigate('/');
  };

  const handleAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setContractAddress(event.target.value);
    if (localError) setLocalError(null); // Clear error when typing
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Box mb={4}>
        <Button
          startIcon={<ArrowBack />}
          onClick={handleBack}
          sx={{ mb: 2 }}
        >
          Back to Home
        </Button>
        
        <Typography variant="h4" component="h1" gutterBottom>
          Access as Auctioneer
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Enter your auction contract address to manage it
        </Typography>
      </Box>

      <Card>
        <CardContent sx={{ p: 4 }}>
          {(error || localError) && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error || localError}
            </Alert>
          )}

          <Box mb={3}>
            <TextField
              fullWidth
              label="Contract Address"
              value={contractAddress}
              onChange={handleAddressChange}
              placeholder="0x1234567890abcdef1234567890abcdef12345678"
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
              helperText="Enter the contract address of the auction you created"
            />
          </Box>

          <Box display="flex" justifyContent="space-between">
            <Button
              variant="outlined"
              onClick={handleBack}
              size="large"
            >
              Cancel
            </Button>
            
            <Button
              variant="contained"
              color="success"
              onClick={handleAccessAuction}
              disabled={!contractAddress.trim() || loading}
              startIcon={<Gavel />}
              size="large"
            >
              {loading ? 'Verifying...' : 'Access as Auctioneer'}
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Box mt={4}>
        <Alert severity="info">
          <Typography variant="body2">
            <strong>Auctioneer Panel</strong><br />
            As an auctioneer you will have access to:<br />
            • View all private bids received<br />
            • Control auction phases<br />
            • Reveal bids when you decide<br />
            • Manage the complete auction process
          </Typography>
        </Alert>
      </Box>

      <Box mt={3}>
        <Alert severity="warning">
          <Typography variant="body2">
            <strong>Security:</strong> Only the original creator of the auction can access
            as an auctioneer. The system will verify your permissions automatically.
          </Typography>
        </Alert>
      </Box>
    </Container>
  );
}
