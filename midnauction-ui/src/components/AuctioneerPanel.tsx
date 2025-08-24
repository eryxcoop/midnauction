import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Grid,
  Alert,
  Divider,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  Chip,
} from '@mui/material';
import {
  PlayArrow,
  Stop,
  Visibility,
  CheckCircle,
  Add,
} from '@mui/icons-material';
import { AuctionRound } from '../types';
import { useAuction } from '../contexts';

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
    startBiddingPhase,
    closeBidding,
    startRevealingPhase,
    finishAuction,
    revealSpecificBid,
    loading,
    error
  } = useAuction();

  const [revealDialogOpen, setRevealDialogOpen] = useState(false);
  const [participantId, setParticipantId] = useState('');
  const [bidAmount, setBidAmount] = useState('');

  const handleStartBidding = async () => {
    try {
      await startBiddingPhase();
    } catch (err) {
      console.error('Error starting bidding phase:', err);
    }
  };

  const handleCloseBidding = async () => {
    try {
      await closeBidding();
    } catch (err) {
      console.error('Error closing bidding:', err);
    }
  };

  const handleStartRevealing = async () => {
    try {
      await startRevealingPhase();
    } catch (err) {
      console.error('Error starting revealing phase:', err);
    }
  };

  const handleFinishAuction = async () => {
    try {
      await finishAuction();
    } catch (err) {
      console.error('Error finishing auction:', err);
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

          <Grid container spacing={2}>
            {/* Bidding Round */}
            <Grid item xs={12} md={6}>
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Bidding Phase
                </Typography>
                
                {currentRound === AuctionRound.BIDDING ? (
                  <Box>
                    {canSubmitBid ? (
                      <Button
                        variant="contained"
                        color="error"
                        onClick={handleCloseBidding}
                        disabled={loading}
                        startIcon={<Stop />}
                        fullWidth
                      >
                        Close Bidding
                      </Button>
                    ) : (
                      <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                        Bidding is closed
                      </Typography>
                    )}
                  </Box>
                ) : currentRound === AuctionRound.REVEALING || currentRound === AuctionRound.FINISHED ? (
                  <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                                          Bidding phase completed
                  </Typography>
                ) : (
                  <Button
                    variant="outlined"
                    onClick={handleStartBidding}
                    disabled={loading}
                    startIcon={<PlayArrow />}
                    fullWidth
                  >
                                            Start Bidding
                  </Button>
                )}
              </Box>
            </Grid>

            {/* Revelation Phase */}
            <Grid item xs={12} md={6}>
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Revelation Phase
                </Typography>
                
                {currentRound === AuctionRound.BIDDING && !canSubmitBid ? (
                  <Button
                    variant="outlined"
                    color="warning"
                    onClick={handleStartRevealing}
                    disabled={loading}
                    startIcon={<Visibility />}
                    fullWidth
                  >
                                            Start Revelation
                  </Button>
                ) : currentRound === AuctionRound.REVEALING ? (
                  <Typography variant="body2" color="warning.main" sx={{ textAlign: 'center', py: 2 }}>
                                          🔍 Revelation Phase Active
                  </Typography>
                ) : currentRound === AuctionRound.FINISHED ? (
                  <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                                          Revelation phase completed
                  </Typography>
                ) : (
                  <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                                          You must close bidding first
                  </Typography>
                )}
              </Box>
            </Grid>

            {/* Finish Auction */}
            <Grid item xs={12}>
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Finish Auction
                </Typography>
                
                {currentRound === AuctionRound.REVEALING ? (
                  <Button
                    variant="outlined"
                    color="success"
                    onClick={handleFinishAuction}
                    disabled={loading}
                    startIcon={<CheckCircle />}
                    fullWidth
                  >
                                            Finish Auction
                  </Button>
                ) : currentRound === AuctionRound.FINISHED ? (
                  <Typography variant="body2" color="success.main" sx={{ textAlign: 'center', py: 2 }}>
                                          🎉 Auction Finished
                  </Typography>
                ) : (
                  <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                                          You must complete revelation first
                  </Typography>
                )}
              </Box>
            </Grid>
          </Grid>

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
                startIcon={<Add />}
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
