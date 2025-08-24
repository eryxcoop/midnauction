import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  PersonAdd,
} from '@mui/icons-material';

export function JoinParticipantPage() {
  const navigate = useNavigate();
  const [contractAddress, setContractAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleJoinAuction = async () => {
    if (!contractAddress.trim()) {
      setError('Please enter the contract address');
      return;
    }

    // Validación básica de formato de dirección
    if (!contractAddress.startsWith('0x')) {
      setError('The contract address must have the correct format (0x...)');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Simular verificación del contrato
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Redirect to auction screen as participant
      navigate(`/auction/${contractAddress}?role=participant`);
    } catch (err) {
      setError('Could not connect to the auction. Please verify the contract address.');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/');
  };

  const handleAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setContractAddress(event.target.value);
    if (error) setError(null); // Limpiar error al escribir
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
          Join as Participant
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Enter the auction contract address to participate
        </Typography>
      </Box>

      <Card>
        <CardContent sx={{ p: 4 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
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
              helperText="Paste here the auction contract address provided by the auctioneer"
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
              color="secondary"
              onClick={handleJoinAuction}
              disabled={!contractAddress.trim() || loading}
              startIcon={<PersonAdd />}
              size="large"
            >
              {loading ? 'Connecting...' : 'Join Auction'}
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Box mt={4}>
        <Alert severity="info">
          <Typography variant="body2">
            <strong>How to participate?</strong><br />
            1. Get the contract address from the auctioneer<br />
            2. Paste it in the field above<br />
            3. Once connected, you can submit private bids<br />
            4. The auctioneer will reveal the bids at the end of the auction
          </Typography>
        </Alert>
      </Box>

      <Box mt={3}>
        <Alert severity="warning">
          <Typography variant="body2">
            <strong>Important:</strong> You can only participate if the auction is in the bidding phase.
            Once the bids are closed, you won't be able to join.
          </Typography>
        </Alert>
      </Box>
    </Container>
  );
}
