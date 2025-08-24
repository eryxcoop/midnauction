import { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  TextField,
  Alert,
  Chip,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { Flag } from '@mui/icons-material';
import { AuctionRound } from '../types';
import { useHybridAuction } from '../contexts/HybridAuctionContext';

interface AuctioneerPanelProps {
  currentRound: AuctionRound;
  canSubmitBid: boolean;
  totalBids: number;
  revealedBidsCount: number;
}

export function AuctioneerPanel({ 
  currentRound, 
  canSubmitBid, 
  totalBids, 
  revealedBidsCount 
}: AuctioneerPanelProps) {
  const {
    closeBidding,
    startRevealingPhase,
    finishAuction,
    revealSpecificBid,
    loading,
    error
  } = useHybridAuction();

  const [revealDialogOpen, setRevealDialogOpen] = useState(false);
  const [participantId, setParticipantId] = useState('');
  const [bidAmount, setBidAmount] = useState('');

  const handleCloseBidding = async () => {
    try {
      await closeBidding();
    } catch (error) {
      console.error('Failed to close bidding:', error);
    }
  };

  const handleStartRevealing = async () => {
    try {
      await startRevealingPhase();
    } catch (error) {
      console.error('Failed to start revealing:', error);
    }
  };

  const handleFinishAuction = async () => {
    try {
      await finishAuction();
    } catch (error) {
      console.error('Failed to finish auction:', error);
    }
  };

  const handleRevealBid = async () => {
    if (!participantId || !bidAmount) {
      return;
    }

    const amount = parseFloat(bidAmount);
    if (isNaN(amount)) {
      return;
    }

    try {
      await revealSpecificBid(participantId, amount);
      setRevealDialogOpen(false);
      setParticipantId('');
      setBidAmount('');
    } catch (err) {
      console.error('Error revealing bid:', err);
    }
  };

  const getRoundStatus = () => {
    switch (currentRound) {
      case AuctionRound.BIDDING:
        return { 
          label: 'Bidding Round', 
          color: 'primary' as const,
          description: canSubmitBid ? 'Bids are open' : 'Bids are closed'
        };
              case AuctionRound.REVEALING:
          return { 
            label: 'Revelation Phase', 
            color: 'warning' as const,
            description: 'You can reveal bids manually'
          };
        case AuctionRound.FINISHED:
          return { 
            label: 'Auction Finished', 
            color: 'success' as const,
            description: 'The auction has ended'
          };
              default:
          return { 
            label: 'Unknown Status', 
            color: 'default' as const,
            description: ''
          };
    }
  };

  const status = getRoundStatus();

  return (
    <>
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            🔨 Auctioneer Control Panel
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {/* Estado Actual */}
          <Box mb={3}>
            <Box display="flex" alignItems="center" mb={1}>
              <Chip 
                label={status.label} 
                color={status.color} 
                sx={{ mr: 2 }} 
              />
              <Typography variant="body2" color="text.secondary">
                {status.description}
              </Typography>
            </Box>
            
            <Typography variant="body2" color="text.secondary">
              Bids received: {totalBids} | Bids revealed: {revealedBidsCount}
            </Typography>
          </Box>

          {/* Auction Progress */}
          <Box mb={3}>
            <Typography variant="subtitle2" gutterBottom>
              Auction Progress
            </Typography>
            <Box display="flex" alignItems="center" gap={1}>
              <Box
                sx={{
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  backgroundColor: currentRound === AuctionRound.BIDDING ? 'primary.main' : 'success.main',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '12px',
                  fontWeight: 'bold'
                }}
              >
                1
              </Box>
              <Box
                sx={{
                  flex: 1,
                  height: 2,
                  backgroundColor: currentRound === AuctionRound.BIDDING ? 'grey.300' : 'success.main'
                }}
              />
              <Box
                sx={{
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  backgroundColor: currentRound === AuctionRound.REVEALING ? 'warning.main' : 
                                currentRound === AuctionRound.FINISHED ? 'success.main' : 'grey.300',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '12px',
                  fontWeight: 'bold'
                }}
              >
                2
              </Box>
              <Box
                sx={{
                  flex: 1,
                  height: 2,
                  backgroundColor: currentRound === AuctionRound.FINISHED ? 'success.main' : 'grey.300'
                }}
              />
              <Box
                sx={{
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  backgroundColor: currentRound === AuctionRound.FINISHED ? 'success.main' : 'grey.300',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '12px',
                  fontWeight: 'bold'
                }}
              >
                3
              </Box>
            </Box>
            <Box display="flex" justifyContent="space-between" mt={1}>
              <Typography variant="caption" color="text.secondary">
                Bidding
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Revelation
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Finished
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ mb: 3 }} />

          {/* Controles de Fase */}
          <Typography variant="h6" gutterBottom>
            Phase Control
          </Typography>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
            {/* Bidding Round */}
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Bidding Phase
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Current phase: {currentRound}
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleCloseBidding}
                  disabled={currentRound !== AuctionRound.BIDDING}
                  fullWidth
                >
                  Close Bidding
                </Button>
              </CardContent>
            </Card>

            {/* Revelation Phase */}
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Revealing Phase
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Reveal all submitted bids
                </Typography>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleStartRevealing}
                  disabled={currentRound !== AuctionRound.BIDDING}
                  fullWidth
                >
                  Start Revealing
                </Button>
              </CardContent>
            </Card>

            {/* Finish Auction */}
            <Card sx={{ gridColumn: { xs: '1', md: '1 / -1' } }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Auction Results
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  View final results and determine winner
                </Typography>
                <Button
                  variant="contained"
                  color="success"
                  onClick={handleFinishAuction}
                  disabled={currentRound !== AuctionRound.REVEALING}
                  fullWidth
                >
                  Finish Auction
                </Button>
              </CardContent>
            </Card>
          </Box>

          <Divider sx={{ mt: 3, mb: 3 }} />

          {/* Manually Reveal Bids */}
          {currentRound === AuctionRound.REVEALING && (
            <Box>
                        <Typography variant="h6" gutterBottom>
            Reveal Bids
          </Typography>
              
              <Button
                variant="contained"
                color="warning"
                onClick={() => setRevealDialogOpen(true)}
                disabled={loading}
                startIcon={<Flag />}
                fullWidth
              >
                                  Reveal Specific Bid
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Dialog para revelar oferta */}
      <Dialog open={revealDialogOpen} onClose={() => setRevealDialogOpen(false)}>
        <DialogTitle>Reveal Bid</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
                          <TextField
                fullWidth
                label="Participant ID"
                value={participantId}
                onChange={(e) => setParticipantId(e.target.value)}
                placeholder="user123"
                sx={{ mb: 2 }}
              />
              
              <TextField
                fullWidth
                label="Bid Amount"
                type="number"
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                placeholder="2500"
              />
          </Box>
        </DialogContent>
        <DialogActions>
                      <Button onClick={() => setRevealDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleRevealBid}
              disabled={!participantId || !bidAmount || loading}
              variant="contained"
            >
              Reveal Bid
            </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
