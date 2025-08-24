import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Gavel } from '@mui/icons-material';

interface HeaderProps {
  isParticipant: boolean;
  currentRound: string;
}

export function Header({ isParticipant, currentRound }: HeaderProps) {
  return (
    <AppBar position="static" elevation={0}>
      <Toolbar>
        <Box display="flex" alignItems="center" flexGrow={1}>
          <Gavel sx={{ mr: 2 }} />
          <Typography variant="h6" component="div">
            Midnauction
          </Typography>
          <Typography variant="subtitle2" sx={{ ml: 2, opacity: 0.8 }}>
            Sistema de Subastas Privadas
          </Typography>
        </Box>
        
        {isParticipant ? (
          <Typography variant="body2" color="success.main">
            ✓ Participando en la subasta
          </Typography>
        ) : (
          <Typography variant="body2" color="info.main">
            Envía una oferta para unirte
          </Typography>
        )}
      </Toolbar>
    </AppBar>
  );
}
