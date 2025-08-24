import React from 'react';
import { ThemeProvider, CssBaseline, Box, Fab } from '@mui/material';
import { Refresh } from '@mui/icons-material';
import { AuctionProvider, useAuction } from './contexts';
import { MainLayout, AuctionInfo, BidForm } from './components';
import { theme } from './config/theme';

function AuctionApp() {
  const { 
    auctionState, 
    joinAuction, 
    submitBid, 
    revealBid, 
    refreshAuctionData,
    loading, 
    error 
  } = useAuction();

  // Ya no necesitamos función de unión separada - se hace con la oferta

  const handleSubmitBid = async (amount: number) => {
    try {
      await submitBid(amount);
    } catch (err) {
      console.error('Error submitting bid:', err);
      throw err; // Re-throw to handle in component
    }
  };

  // Ya no necesitamos función de revelación - el martillero las revela automáticamente

  const handleRefresh = async () => {
    try {
      await refreshAuctionData();
    } catch (err) {
      console.error('Error refreshing data:', err);
    }
  };

  return (
    <MainLayout
      isParticipant={auctionState.isParticipant}
      currentRound={auctionState.auction.currentRound}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Información de la Subasta */}
        <AuctionInfo auction={auctionState.auction} />
        
        {/* Formulario de Participación - Siempre visible */}
        <BidForm
          currentRound={auctionState.auction.currentRound}
          minimumBidValue={auctionState.auction.minimumBidValue}
          canSubmitBid={auctionState.canSubmitBid}
          canRevealBid={auctionState.canRevealBid}
          hasSubmittedBid={!!auctionState.currentUserBid}
          isParticipant={auctionState.isParticipant}
          onSubmitBid={handleSubmitBid}
          onRevealBid={() => Promise.resolve()} // Función vacía ya que no se usa
          loading={loading}
          error={error}
        />
      </Box>

      {/* Botón de Actualizar */}
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

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuctionProvider>
        <AuctionApp />
      </AuctionProvider>
    </ThemeProvider>
  );
}

export default App;
