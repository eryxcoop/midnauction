import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuction } from '../contexts/AuctionContext';
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  Alert
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';

export function CreateAuctionPage() {
  const navigate = useNavigate();
  const { deployNewAuction, loading, error } = useAuction();
  const [localError, setLocalError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    productName: '',
    productDescription: '',
    minimumBidValue: '',
  });

  const handleInputChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleCreateAuction = async () => {
    if (!formData.productName || !formData.productDescription || !formData.minimumBidValue) {
      setLocalError('Please complete all fields');
      return;
    }

    const minBid = parseFloat(formData.minimumBidValue);
    if (isNaN(minBid) || minBid <= 0) {
      setLocalError('The minimum value must be a number greater than 0');
      return;
    }

    setLocalError(null);

    try {
      // Deploy new auction using the hybrid context (which uses real providers)
      await deployNewAuction(
        formData.productName,
        formData.productDescription,
        minBid
      );
      
      //TODO UNMOCK
      const contractAddress = `0x${Math.random().toString(16).substring(2, 42)}`;
      
      // Navigate to auction page as auctioneer
      navigate(`/auction/${contractAddress}?role=auctioneer`);
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : 'Error creating auction');
    }
  };

  const handleBack = () => {
    navigate('/');
  };

  const isFormValid = formData.productName && formData.productDescription && formData.minimumBidValue;

  return (
    <Box sx={{ mt: 4, mb: 4 }}>
      <Box mb={4}>
        <Button
          startIcon={<ArrowBack />}
          onClick={handleBack}
          sx={{ mb: 2 }}
        >
          Back to Home
        </Button>
        
        <Typography variant="h4" component="h1" gutterBottom>
          Create New Auction
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Complete the information of the product you want to auction
        </Typography>
      </Box>

      {/* Stepper removed as per edit hint */}

      <Card>
        <CardContent sx={{ p: 4 }}>
          {(error || localError) && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error || localError}
            </Alert>
          )}

          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 3 }}>
            <Box>
              <Typography variant="h6" gutterBottom>
                Product Information
              </Typography>
              <TextField
                fullWidth
                label="Product Name"
                value={formData.productName}
                onChange={handleInputChange('productName')}
                required
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Product Description"
                value={formData.productDescription}
                onChange={handleInputChange('productDescription')}
                multiline
                rows={3}
                required
              />
            </Box>

            <Box>
              <Typography variant="h6" gutterBottom>
                Auction Settings
              </Typography>
              <TextField
                fullWidth
                label="Minimum Bid (USD)"
                type="number"
                value={formData.minimumBidValue}
                onChange={handleInputChange('minimumBidValue')}
                required
                inputProps={{ min: 0, step: 0.01 }}
              />
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
              <Button
                variant="outlined"
                onClick={handleBack}
                fullWidth
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleCreateAuction}
                disabled={!isFormValid || loading}
                fullWidth
              >
                {loading ? 'Creating Auction...' : 'Create Auction'}
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Box mt={4}>
        <Alert severity="info">
          <Typography variant="body2">
            <strong>How does it work?</strong><br />
            1. Complete the product information<br />
            2. A smart contract will be deployed on the blockchain<br />
            3. Participants can join using the contract address<br />
            4. As an auctioneer, you'll have total control over the auction phases
          </Typography>
        </Alert>
      </Box>
    </Box>
  );
}
