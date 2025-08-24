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
        return 'Bidding Round';
      case AuctionRound.REVEALING:
        return 'Revelation Round';
      case AuctionRound.FINISHED:
        return 'Auction Finished';
              default:
          return 'Unknown';
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
                    Auctioneer: {auction.auctioneerPublicKey.substring(0, 10)}...
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>

              {/* Auction Status */}
      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
              <Typography variant="h6">Auction Status</Typography>
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
                  Total Bids: {auction.totalBids}
                </Typography>
              </Box>
              
              <Box display="flex" alignItems="center">
                <Visibility sx={{ mr: 1, color: 'success.main' }} />
                <Typography variant="body1">
                  Revealed Bids: {auction.revealedBids.length}
                </Typography>
              </Box>
            </Box>

            {auction.currentRound === AuctionRound.BIDDING && (
              <Typography variant="body2" color="primary.main">
                Participants can join by submitting private bids.
              </Typography>
            )}

            {auction.currentRound === AuctionRound.REVEALING && (
              <Typography variant="body2" color="warning.main">
                The auctioneer is revealing bids automatically.
              </Typography>
            )}

            {auction.currentRound === AuctionRound.FINISHED && (
              <Typography variant="body2" color="success.main">
                The auction has finished. You can see the final results.
              </Typography>
            )}
          </CardContent>
        </Card>
      </Grid>

      {/* Revealed Bids */}
      {auction.revealedBids.length > 0 && (
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" mb={2}>
                Revealed Bids ({auction.revealedBids.length})
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
                                label="Winning" 
                                size="small" 
                                color="success" 
                                sx={{ ml: 1 }}
                              />
                            )}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Participant: {bid.participantId}
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
