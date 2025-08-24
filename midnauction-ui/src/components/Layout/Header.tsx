import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Gavel } from '@mui/icons-material';

interface HeaderProps {
  isParticipant: boolean;
  currentRound: string;
  userRole?: 'participant' | 'auctioneer';
}

export function Header({ isParticipant, currentRound, userRole }: HeaderProps) {
  return (
    <AppBar position="static" elevation={0}>
      <Toolbar>
        <Box display="flex" alignItems="center" flexGrow={1}>
          <Gavel sx={{ mr: 2 }} />
          <Typography variant="h6" component="div">
            Midnauction
          </Typography>
          <Typography variant="subtitle2" sx={{ ml: 2, opacity: 0.8 }}>
            Private Auction System Tuki
          </Typography>
        </Box>
        
        {userRole === 'auctioneer' ? (
          <Typography variant="body2" color="warning.main">
            🔨 Auctioneer Panel
          </Typography>
        ) : isParticipant ? (
          <Typography variant="body2" color="success.main">
            ✓ Participating in auction
          </Typography>
        ) : (
          <Typography variant="body2" color="info.main">
            Submit a bid to join
          </Typography>
        )}
      </Toolbar>
    </AppBar>
  );
}
