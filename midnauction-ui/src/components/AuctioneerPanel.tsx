import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Alert,
  Chip,
  Divider
} from '@mui/material';
import { AuctionPhase } from '../types';
import { useAuction } from '../contexts/AuctionContext';

interface AuctioneerPanelProps {
  currentRound: number;
  totalRounds: number;
  currentPhase: AuctionPhase;
  secretBids: number;
  revealedBidsCount: number;
}

export function AuctioneerPanel({ 
  currentRound, 
  totalRounds,
  currentPhase, 
  secretBids, 
  revealedBidsCount 
}: AuctioneerPanelProps) {
  const {
    moveToRevealPhase,
    moveToNextPhase,
    finishAuction,
    loading,
    error
  } = useAuction();



  const handleMoveToReveal = async () => {
    try {
      await moveToRevealPhase();
    } catch (error) {
      console.error('Failed to move to reveal phase:', error);
    }
  };

  const handleMoveToNext = async () => {
    try {
      await moveToNextPhase();
    } catch (error) {
      console.error('Failed to move to next phase:', error);
    }
  };

  const handleFinishAuction = async () => {
    try {
      await finishAuction();
    } catch (error) {
      console.error('Failed to finish auction:', error);
    }
  };

  const getPhaseStatus = () => {
    switch (currentPhase) {
      case AuctionPhase.COMMITMENT:
        return { 
          label: `Round ${currentRound}/${totalRounds} - Commitment`, 
          color: 'primary' as const,
          description: 'Participants can submit private bids'
        };
      case AuctionPhase.REVEALING:
        return { 
          label: `Round ${currentRound}/${totalRounds} - Revealing`, 
          color: 'warning' as const,
          description: 'Participants reveal their bids'
        };
      case AuctionPhase.FINISHED:
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

  const status = getPhaseStatus();

  return (
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
            Secret bids: {secretBids} | Revealed bids: {revealedBidsCount}
          </Typography>
        </Box>

        {/* Auction Progress */}
        <Box mb={3}>
          <Typography variant="subtitle2" gutterBottom>
            Round Progress: {currentRound} / {totalRounds}
          </Typography>
          <Box display="flex" alignItems="center" gap={1}>
            {/* Current Phase Indicator */}
            <Box
              sx={{
                width: 24,
                height: 24,
                borderRadius: '50%',
                backgroundColor: currentPhase === AuctionPhase.COMMITMENT ? 'primary.main' : 
                                 currentPhase === AuctionPhase.REVEALING ? 'warning.main' : 'success.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '12px',
                fontWeight: 'bold'
              }}
            >
              {currentRound}
            </Box>
            
            {/* Progress Bar */}
            <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', gap: 0.5 }}>
              {Array.from({ length: totalRounds }, (_, i) => {
                const roundNum = i + 1;
                const isPast = roundNum < currentRound;
                const isCurrent = roundNum === currentRound;
                
                return (
                  <Box
                    key={roundNum}
                    sx={{
                      flex: 1,
                      height: 4,
                      borderRadius: 2,
                      backgroundColor: isPast ? 'success.main' : 
                                      isCurrent ? (currentPhase === AuctionPhase.COMMITMENT ? 'primary.main' : 'warning.main') : 
                                      'grey.300'
                    }}
                  />
                );
              })}
            </Box>
            
            {/* Phase Indicator */}
            <Typography variant="caption" color="text.secondary" sx={{ minWidth: 80 }}>
              {currentPhase === AuctionPhase.COMMITMENT ? 'Commitment' :
               currentPhase === AuctionPhase.REVEALING ? 'Revealing' : 'Finished'}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* Controles de Fase */}
        <Typography variant="h6" gutterBottom>
          Phase Control
        </Typography>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
          {/* Move to Reveal Phase */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Move to Reveal Phase
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Close commitment phase and allow bid revealing
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={handleMoveToReveal}
                disabled={currentPhase !== AuctionPhase.COMMITMENT || loading}
                fullWidth
              >
                {loading ? 'Moving...' : 'Move to Reveal'}
              </Button>
            </CardContent>
          </Card>

          {/* Move to Next Round or Finish */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {currentRound < totalRounds ? 'Next Round' : 'Finish Auction'}
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                {currentRound < totalRounds 
                  ? `Move to round ${currentRound + 1} commitment phase`
                  : 'End the auction and determine the winner'
                }
              </Typography>
              <Button
                variant="contained"
                color={currentRound < totalRounds ? "secondary" : "success"}
                onClick={currentRound < totalRounds ? handleMoveToNext : handleFinishAuction}
                disabled={currentPhase !== AuctionPhase.REVEALING || loading}
                fullWidth
              >
                {loading ? 'Processing...' : 
                 currentRound < totalRounds ? 'Next Round' : 'Finish Auction'}
              </Button>
            </CardContent>
          </Card>
        </Box>

      </CardContent>
    </Card>
  );
}
