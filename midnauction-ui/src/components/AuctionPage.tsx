import React from 'react';
import { useParams, useSearchParams, useLocation } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Box, Fab, Chip } from '@mui/material';
import { Refresh, ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { HybridAuctionProvider, useHybridAuction } from '../contexts/HybridAuctionContext';
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
    refreshAuctionData,
    joinExistingAuction,
    loading, 
    error 
  } = useHybridAuction();

      // If there are auction data in the state (from creation), use them
  const auctionData = location.state?.auctionData;

  // Auto-join the auction when component mounts
  React.useEffect(() => {
    if (contractAddress && !auctionState && !loading) {
      console.log('Auto-joining auction:', contractAddress, 'with role:', role);
      joinExistingAuction(contractAddress, role as 'participant' | 'auctioneer')
        .catch(err => {
          console.error('Failed to auto-join auction:', err);
        });
    }
  }, [contractAddress, role, auctionState, loading, joinExistingAuction]);

  const handleSubmitBid = async (amount: number) => {
    try {
      await submitBid(amount);
    } catch (err) {
      console.error('Error submitting bid:', err);
      throw err;
    }
  };

  const handleRefresh = async () => {
    try {
      await refreshAuctionData();
    } catch (err) {
      console.error('Error refreshing data:', err);
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
  if (!auctionState) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <div>Loading auction...</div>
        </Box>
      </ThemeProvider>
    );
  }

  console.log('auctionState', auctionState);

  return (
            <MainLayout
          isParticipant={auctionState.isParticipant}
          currentRound={auctionState.auction.currentRound}
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
            currentRound={auctionState.auction.currentRound}
            minimumBidValue={auctionState.auction.minimumBidValue}
            canSubmitBid={auctionState.canSubmitBid}
            canRevealBid={auctionState.canRevealBid}
            hasSubmittedBid={!!auctionState.currentUserBid}
            isParticipant={auctionState.isParticipant}
            onSubmitBid={handleSubmitBid}
            onRevealBid={() => Promise.resolve()}
            loading={loading}
            error={error}
          />
        )}

        {/* Auctioneer Panel */}
        {role === 'auctioneer' && (
          <AuctioneerPanel
            currentRound={auctionState.auction.currentRound}
            canSubmitBid={auctionState.canSubmitBid}
            totalBids={auctionState.auction.totalBids}
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
      <HybridAuctionProvider>
        <AuctionApp />
      </HybridAuctionProvider>
    </ThemeProvider>
  );
}
