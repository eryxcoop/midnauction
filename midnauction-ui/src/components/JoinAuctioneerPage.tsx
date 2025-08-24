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
  Gavel,
} from '@mui/icons-material';

export function JoinAuctioneerPage() {
  const navigate = useNavigate();
  const [contractAddress, setContractAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAccessAuction = async () => {
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
      // Simulate contract verification and auctioneer permissions
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Redirect to auction screen as auctioneer
      navigate(`/auction/${contractAddress}?role=auctioneer`);
    } catch (err) {
      setError('Could not access the auction. Please verify that you are the authorized auctioneer.');
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
          Access as Auctioneer
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Enter your auction contract address to manage it
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
