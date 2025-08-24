import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  Paper,
} from '@mui/material';
import {
  Add,
  PersonAdd,
  Gavel,
} from '@mui/icons-material';

export function HomePage() {
  const navigate = useNavigate();

  const handleCreateAuction = () => {
    navigate('/create-auction');
  };

  const handleJoinAsParticipant = () => {
    navigate('/join-participant');
  };

  const handleJoinAsAuctioneer = () => {
    navigate('/join-auctioneer');
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 8, mb: 4 }}>
      <Box textAlign="center" mb={6}>
        <Typography variant="h2" component="h1" gutterBottom>
          Midnauction
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          Private Auction System
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
          Participate in secure and transparent auctions using blockchain technology.
          Create new auctions or join existing ones as a participant or auctioneer.
        </Typography>
      </Box>

      <Grid container spacing={4} justifyContent="center" sx={{ maxWidth: '100%' }}>
        {/* Create New Auction */}
        <Grid item xs={12} md={4} sx={{ minWidth: 320, maxWidth: 400 }}>
          <Card 
            sx={{ 
              height: 420,
              minHeight: 420,
              width: '100%',
              maxWidth: 360,
              display: 'flex', 
              flexDirection: 'column',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: 6,
              }
            }}
          >
            <CardContent sx={{ 
              flexGrow: 1, 
              textAlign: 'center', 
              p: 4,
              display: 'flex',
              flexDirection: 'column'
            }}>
              <Paper
                sx={{
                  width: 80,
                  height: 80,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 3,
                  backgroundColor: 'primary.main',
                  color: 'primary.contrastText',
                  borderRadius: 2,
                }}
              >
                <Add sx={{ fontSize: 40 }} />
              </Paper>
              
              <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 2 }}>
                Create New Auction
              </Typography>
              
              <Typography 
                variant="body2"
                color="text.secondary" 
                sx={{ 
                  mb: 4,
                  minHeight: 48,
                  lineHeight: 1.5
                }}
              >
                Set up a new auction with your products. Define the minimum price and manage the entire process.
              </Typography>
              
              <Button
                variant="contained"
                size="large"
                onClick={handleCreateAuction}
                fullWidth
                sx={{ mt: 'auto' }}
              >
                Create Auction
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Join as Participant */}
        <Grid item xs={12} md={4} sx={{ minWidth: 320, maxWidth: 400 }}>
          <Card 
            sx={{ 
              height: 420,
              minHeight: 420,
              width: '100%',
              maxWidth: 360,
              display: 'flex', 
              flexDirection: 'column',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: 6,
              }
            }}
          >
            <CardContent sx={{ 
              flexGrow: 1, 
              textAlign: 'center', 
              p: 4,
              display: 'flex',
              flexDirection: 'column'
            }}>
              <Paper
                sx={{
                  width: 80,
                  height: 80,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 3,
                  backgroundColor: 'secondary.main',
                  color: 'secondary.contrastText',
                  borderRadius: 2,
                }}
              >
                <PersonAdd sx={{ fontSize: 40 }} />
              </Paper>
              
              <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 2 }}>
                Join as Participant
              </Typography>
              
              <Typography 
                variant="body2" 
                color="text.secondary" 
                sx={{ 
                  mb: 4,
                  minHeight: 48,
                  lineHeight: 1.5
                }}
              >
                Participate in an existing auction. Enter the contract address to submit private bids.
              </Typography>
              
              <Button
                variant="contained"
                color="secondary"
                size="large"
                onClick={handleJoinAsParticipant}
                fullWidth
                sx={{ mt: 'auto' }}
              >
                Join as Participant
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Join as Auctioneer */}
        <Grid item xs={12} md={4} sx={{ minWidth: 320, maxWidth: 400 }}>
          <Card 
            sx={{ 
              height: 420,
              minHeight: 420,
              width: '100%',
              maxWidth: 360,
              display: 'flex', 
              flexDirection: 'column',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: 6,
              }
            }}
          >
            <CardContent sx={{ 
              flexGrow: 1, 
              textAlign: 'center', 
              p: 4,
              display: 'flex',
              flexDirection: 'column'
            }}>
              <Paper
                sx={{
                  width: 80,
                  height: 80,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 3,
                  backgroundColor: 'success.main',
                  color: 'success.contrastText',
                  borderRadius: 2,
                }}
              >
                <Gavel sx={{ fontSize: 40 }} />
              </Paper>
              
              <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 2 }}>
                Access as Auctioneer
              </Typography>
              
              <Typography 
                variant="body2" 
                color="text.secondary" 
                sx={{ 
                  mb: 4,
                  minHeight: 48,
                  lineHeight: 1.5
                }}
              >
                Access an auction you created. Manage auction phases, reveal bids and control the process.
              </Typography>
              
              <Button
                variant="contained"
                color="success"
                size="large"
                onClick={handleJoinAsAuctioneer}
                fullWidth
                sx={{ mt: 'auto' }}
              >
                Access as Auctioneer
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box textAlign="center" mt={8}>
        <Typography variant="body2" color="text.secondary">
          Midnauction v1.0 - Decentralized Auction System
        </Typography>
      </Box>
    </Container>
  );
}
