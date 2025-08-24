import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  Paper,
} from '@mui/material';
import {
  Gavel,
  People,
  Visibility,
  VisibilityOff,
  AttachMoney,
  Schedule,
  Person,
} from '@mui/icons-material';
import { AuctionData, AuctionRound } from '../types';

interface AuctionInfoProps {
  auction: AuctionData;
}

export function AuctionInfo({ auction }: AuctionInfoProps) {
  const getRoundColor = (round: AuctionRound) => {
    switch (round) {
      case AuctionRound.BIDDING:
        return 'primary';
      case AuctionRound.REVEALING:
        return 'warning';
      case AuctionRound.FINISHED:
        return 'success';
      default:
        return 'default';
    }
  };

  const getRoundLabel = (round: AuctionRound) => {
    switch (round) {
      case AuctionRound.BIDDING:
        return 'Ronda de Ofertas';
      case AuctionRound.REVEALING:
        return 'Ronda de Revelación';
      case AuctionRound.FINISHED:
        return 'Subasta Finalizada';
      default:
        return 'Desconocido';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const sortedBids = [...auction.revealedBids].sort((a, b) => b.bidAmount - a.bidAmount);

  return (
    <Grid container spacing={3}>
      {/* Información del Producto */}
      <Grid item xs={12} md={8}>
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" mb={2}>
              <Gavel sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="h4" component="h1">
                {auction.productName}
              </Typography>
            </Box>
            
            <Typography variant="body1" color="text.secondary" paragraph>
              {auction.productDescription}
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Box display="flex" alignItems="center" mb={1}>
                  <AttachMoney sx={{ mr: 1, color: 'success.main' }} />
                  <Typography variant="h6">
                    Valor Mínimo: {formatCurrency(auction.minimumBidValue)}
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Box display="flex" alignItems="center" mb={1}>
                  <Person sx={{ mr: 1, color: 'info.main' }} />
                  <Typography variant="body2" color="text.secondary">
                    Martillero: {auction.auctioneerPublicKey.substring(0, 10)}...
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      {/* Estado de la Subasta */}
      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
              <Typography variant="h6">Estado de la Subasta</Typography>
              <Chip 
                label={getRoundLabel(auction.currentRound)}
                color={getRoundColor(auction.currentRound)}
                icon={<Schedule />}
              />
            </Box>

            <Box mb={2}>
              <Box display="flex" alignItems="center" mb={1}>
                <Gavel sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="body1">
                  Total de Ofertas: {auction.totalBids}
                </Typography>
              </Box>
              
              <Box display="flex" alignItems="center">
                <Visibility sx={{ mr: 1, color: 'success.main' }} />
                <Typography variant="body1">
                  Ofertas Reveladas: {auction.revealedBids.length}
                </Typography>
              </Box>
            </Box>

            {auction.currentRound === AuctionRound.BIDDING && (
              <Typography variant="body2" color="primary.main">
                Los participantes pueden unirse enviando ofertas privadas.
              </Typography>
            )}

            {auction.currentRound === AuctionRound.REVEALING && (
              <Typography variant="body2" color="warning.main">
                El martillero está revelando las ofertas automáticamente.
              </Typography>
            )}

            {auction.currentRound === AuctionRound.FINISHED && (
              <Typography variant="body2" color="success.main">
                La subasta ha finalizado. Puedes ver los resultados finales.
              </Typography>
            )}
          </CardContent>
        </Card>
      </Grid>

      {/* Ofertas Reveladas */}
      {auction.revealedBids.length > 0 && (
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" mb={2}>
                Ofertas Reveladas ({auction.revealedBids.length})
              </Typography>
              
              <List>
                {sortedBids.map((bid, index) => (
                  <ListItem key={bid.participantId} divider={index < sortedBids.length - 1}>
                    <Paper 
                      elevation={1} 
                      sx={{ 
                        p: 2, 
                        width: '100%',
                        backgroundColor: index === 0 ? 'success.dark' : 'background.paper',
                        border: index === 0 ? '2px solid' : '1px solid',
                        borderColor: index === 0 ? 'success.main' : 'divider',
                      }}
                    >
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Box>
                          <Typography variant="h6" color={index === 0 ? 'success.light' : 'text.primary'}>
                            {formatCurrency(bid.bidAmount)}
                            {index === 0 && (
                              <Chip 
                                label="Ganando" 
                                size="small" 
                                color="success" 
                                sx={{ ml: 1 }}
                              />
                            )}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Participante: {bid.participantId}
                          </Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          {new Date(bid.timestamp).toLocaleTimeString()}
                        </Typography>
                      </Box>
                    </Paper>
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      )}
    </Grid>
  );
}
