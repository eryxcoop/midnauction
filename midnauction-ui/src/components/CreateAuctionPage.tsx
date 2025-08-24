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
  Grid,
  InputAdornment,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import {
  ArrowBack,
  AttachMoney,
  Create,
} from '@mui/icons-material';

export function CreateAuctionPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
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
      setError('Please complete all fields');
      return;
    }

    const minBid = parseFloat(formData.minimumBidValue);
    if (isNaN(minBid) || minBid <= 0) {
      setError('The minimum value must be a number greater than 0');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Simular creación de contrato
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simular dirección de contrato generada
      const contractAddress = `0x${Math.random().toString(16).substring(2, 42)}`;
      
      // Redirect to auction screen as auctioneer
      navigate(`/auction/${contractAddress}?role=auctioneer`, {
        state: {
          auctionData: {
            productName: formData.productName,
            productDescription: formData.productDescription,
            minimumBidValue: minBid,
            contractAddress,
          }
        }
      });
    } catch (err) {
      setError('Error creating the auction. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/');
  };

  const isFormValid = formData.productName && formData.productDescription && formData.minimumBidValue;

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
          Create New Auction
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Complete the information of the product you want to auction
        </Typography>
      </Box>

      <Stepper activeStep={0} sx={{ mb: 4 }}>
        <Step>
          <StepLabel>Configure Product</StepLabel>
        </Step>
        <Step>
          <StepLabel>Deploy Contract</StepLabel>
        </Step>
        <Step>
          <StepLabel>Active Auction</StepLabel>
        </Step>
      </Stepper>

      <Card>
        <CardContent sx={{ p: 4 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Product Name"
                value={formData.productName}
                onChange={handleInputChange('productName')}
                placeholder="Ex: MacBook Pro M3 16&quot;"
                variant="outlined"
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Product Description"
                value={formData.productDescription}
                onChange={handleInputChange('productDescription')}
                placeholder="Describe the product, its condition, features, etc."
                variant="outlined"
                multiline
                rows={4}
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Minimum Auction Value"
                type="number"
                value={formData.minimumBidValue}
                onChange={handleInputChange('minimumBidValue')}
                placeholder="1500"
                variant="outlined"
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AttachMoney />
                    </InputAdornment>
                  ),
                }}
                helperText="Minimum price to participate in the auction"
              />
            </Grid>
          </Grid>

          <Box mt={4} display="flex" justifyContent="space-between">
            <Button
              variant="outlined"
              onClick={handleBack}
              size="large"
            >
              Cancel
            </Button>
            
            <Button
              variant="contained"
              onClick={handleCreateAuction}
              disabled={!isFormValid || loading}
              startIcon={<Create />}
              size="large"
            >
              {loading ? 'Creating Auction...' : 'Create Auction'}
            </Button>
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
    </Container>
  );
}
