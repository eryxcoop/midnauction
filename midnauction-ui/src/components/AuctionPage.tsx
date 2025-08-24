import React from 'react';
import { useParams, useSearchParams, useLocation } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Box, Fab, Chip, CircularProgress } from '@mui/material';
import { Refresh, ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuction } from '../contexts/AuctionContext';
import { MainLayout, AuctionInfo, BidForm } from './';
import { AuctioneerPanel } from './AuctioneerPanel';
import { theme } from '../config/theme';


function AuctionApp() {
  const { contractAddress } = useParams<{ contractAddress: string }>();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const role = searchParams.get('role') || 'participant';
  
  const { 
    auctionState, 
    submitBid, 
    joinExistingAuction,
    loading, 
    error,
    clearError 
  } = useAuction();

      // If there are auction data in the state (from creation), use them
  const auctionData = location.state?.auctionData;

  // Auto-join the auction when component mounts
  React.useEffect(() => {
    if (contractAddress && !auctionState.isConnected && !loading) {
      console.log('Auto-joining auction:', contractAddress, 'with role:', role);
      joinExistingAuction(contractAddress as any, role as 'participant' | 'auctioneer')
        .catch(err => {
          console.error('Failed to auto-join auction:', err);
        });
    }
  }, [contractAddress, role, auctionState.isConnected, loading, joinExistingAuction]);

  const handleSubmitBid = async (amount: number) => {
    try {
      await submitBid(amount);
    } catch (err) {
      console.error('Error submitting bid:', err);
      throw err;
    }
  };

  const handleRefresh = async () => {
    // Clear any existing errors and refresh by rejoining
    clearError();
    if (contractAddress) {
      try {
        await joinExistingAuction(contractAddress as any, role as 'participant' | 'auctioneer');
      } catch (err) {
        console.error('Error refreshing data:', err);
      }
    }
  };

  const handleBack = () => {
    navigate('/');
  };

  const getRoleLabel = () => {
    switch (role) {
      case 'auctioneer':
        return { label: 'Auctioneer', color: 'success' as const };
      case 'participant':
        return { label: 'Participant', color: 'secondary' as const };
      default:
        return { label: 'Observer', color: 'default' as const };
    }
  };

  const roleInfo = getRoleLabel();

  // Show loading state while auction state is being initialized
  if (!auctionState.isConnected) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', gap: 2 }}>
          <CircularProgress />
          <div>Loading auction...</div>
          {error && <div style={{ color: 'red' }}>Error: {error}</div>}
        </Box>
      </ThemeProvider>
    );
  }

  console.log('********* auctionState', auctionState);

  return (
            <MainLayout
          isParticipant={auctionState.isParticipant}
          userRole={role as 'participant' | 'auctioneer'}
        >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Header con información del contrato y rol */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Box>
            <Chip 
              label={`Role: ${roleInfo.label}`} 
              color={roleInfo.color} 
              sx={{ mr: 2 }} 
            />
            <Chip 
              label={`Contract: ${contractAddress?.substring(0, 10)}...`} 
              variant="outlined" 
            />
          </Box>
          <Fab
            size="small"
            onClick={handleBack}
            sx={{ backgroundColor: 'grey.700' }}
          >
            <ArrowBack />
          </Fab>
        </Box>

        {/* Auction Information */}
        <AuctionInfo 
          auction={auctionData ? {
            ...auctionState.auction,
            ...auctionData
          } : auctionState.auction} 
        />
        
        {/* Formulario de Participación - Solo visible para participantes */}
        {role === 'participant' && (
          <BidForm
            canSubmitBid={auctionState.canSubmitBid}
            hasSubmittedBid={auctionState.userData?.bidsPerRound.has(auctionState.auction.currentRound) || false}
            isParticipant={auctionState.isParticipant}
            onSubmitBid={handleSubmitBid}
            loading={loading}
            error={error}
          />
        )}

        {/* Auctioneer Panel */}
        {role === 'auctioneer' && (
          <AuctioneerPanel
            currentRound={auctionState.auction.currentRound}
            totalRounds={auctionState.auction.rounds}
            currentPhase={auctionState.auction.phase}
            secretBids={auctionState.auction.secretBids}
            revealedBidsCount={auctionState.auction.revealedBids.length}
          />
        )}
      </Box>

              {/* Refresh Button */}
      <Fab
        color="primary"
        aria-label="refresh"
        onClick={handleRefresh}
        disabled={loading}
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
        }}
      >
        <Refresh />
      </Fab>
    </MainLayout>
  );
}

export function AuctionPage() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuctionApp />
    </ThemeProvider>
  );
}
