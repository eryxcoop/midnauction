import { Box, Card, CardContent, Typography, Button } from '@mui/material';
import { PersonAdd, Gavel, Add } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

export function HomePage() {
  const navigate = useNavigate();

  return (
    <Box sx={{ p: 3 }}>
      <Box textAlign="center" mb={6}>
        <Typography variant="h3" component="h1" gutterBottom>
          Welcome to Midnauction
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph>
          A private, secure auction system built on Midnight Network
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Participate in auctions with private bids or create your own auction
        </Typography>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 3 }}>
        <Box sx={{ minWidth: 320, maxWidth: 400 }}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="h2" gutterBottom>
                Join as Participant
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Participate in existing auctions by submitting private bids and revealing them afterwards.
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate('/join-participant')}
                fullWidth
                startIcon={<PersonAdd />}
              >
                Join Auction
              </Button>
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ minWidth: 320, maxWidth: 400 }}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="h2" gutterBottom>
                Join as Auctioneer
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Manage existing auctions, control phases, and determine winners.
              </Typography>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => navigate('/join-auctioneer')}
                fullWidth
                startIcon={<Gavel />}
              >
                Join as Auctioneer
              </Button>
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ minWidth: 320, maxWidth: 400 }}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="h2" gutterBottom>
                Create New Auction
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Start a new auction by setting up product details and minimum bid requirements.
              </Typography>
              <Button
                variant="contained"
                color="success"
                onClick={() => navigate('/create-auction')}
                fullWidth
                startIcon={<Add />}
              >
                Create Auction
              </Button>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
}
