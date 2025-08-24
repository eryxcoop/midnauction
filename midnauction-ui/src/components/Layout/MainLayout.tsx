import React, { ReactNode } from 'react';
import { Container, Box } from '@mui/material';
import { Header } from './Header';

interface MainLayoutProps {
  children: ReactNode;
  isParticipant: boolean;
  currentRound: string;
  userRole?: 'participant' | 'auctioneer';
}

export function MainLayout({ children, isParticipant, currentRound, userRole }: MainLayoutProps) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header 
        isParticipant={isParticipant}
        currentRound={currentRound}
        userRole={userRole}
      />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
        {children}
      </Container>
    </Box>
  );
}
