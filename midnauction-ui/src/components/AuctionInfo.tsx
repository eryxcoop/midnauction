import { Box, Typography, Chip, Divider } from '@mui/material';
import { AttachMoney, Timer } from '@mui/icons-material';
import { AuctionData } from '../types';

interface AuctionInfoProps {
  auction: AuctionData;
  canSubmitBid?: boolean;
  canRevealBid?: boolean;
  onSubmitBid?: () => void;
  onRevealBid?: () => void;
}

export function AuctionInfo({ 
  auction, 
  canSubmitBid = false, 
  canRevealBid = false,
  onSubmitBid,
  onRevealBid
}: AuctionInfoProps) {
  // Simple time remaining display - you can enhance this
  const timeRemaining = "Active";

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' }, gap: 2 }}>
      {/* Información del Producto */}
      <Box>
        <Typography variant="h6" gutterBottom>
          Auction Details
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
          <Box>
            <Typography variant="body2" color="text.secondary">
              Product Name
            </Typography>
            <Typography variant="body1">{auction.productName}</Typography>
          </Box>
          <Box>
            <Typography variant="body2" color="text.secondary">
              Description
            </Typography>
            <Typography variant="body1">{auction.productDescription}</Typography>
          </Box>
        </Box>
      </Box>

      <Box>
        <Typography variant="h6" gutterBottom>
          Current Status
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
          <Box>
            <Typography variant="body2" color="text.secondary">
              Phase
            </Typography>
            <Chip 
              label={auction.currentRound} 
              color={auction.currentRound === 'bidding' ? 'primary' : auction.currentRound === 'revealing' ? 'warning' : 'success'}
              size="small"
            />
          </Box>
          <Box>
            <Typography variant="body2" color="text.secondary">
              Total Bids
            </Typography>
            <Typography variant="body1">{auction.totalBids}</Typography>
          </Box>
        </Box>
      </Box>

      <Divider sx={{ my: 2 }} />

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' }, gap: 2 }}>
        <Box>
          <Typography variant="h6" gutterBottom>
            Bidding Information
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 1 }}>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Minimum Bid
              </Typography>
              <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <AttachMoney />
                {auction.minimumBidValue}
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Time Remaining
              </Typography>
              <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Timer />
                {timeRemaining}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box>
          <Typography variant="h6" gutterBottom>
            Auctioneer
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 1 }}>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Public Key
              </Typography>
              <Typography variant="body1" sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
                {auction.auctioneerPublicKey}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box>
          <Typography variant="h6" gutterBottom>
            Actions
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 1 }}>
            {canSubmitBid && onSubmitBid && (
              <Typography variant="body2" color="primary">
                ✓ Can submit bid
              </Typography>
            )}
            {canRevealBid && onRevealBid && (
              <Typography variant="body2" color="secondary">
                ✓ Can reveal bid
              </Typography>
            )}
          </Box>
        </Box>
      </Box>

      {auction.revealedBids && auction.revealedBids.length > 0 && (
        <>
          <Divider sx={{ my: 2 }} />
          <Box>
            <Typography variant="h6" gutterBottom>
              Revealed Bids
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 1 }}>
              {auction.revealedBids.map((bid, index) => (
                <Box key={index} sx={{ p: 1, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                  <Typography variant="body2">
                    Bid #{index + 1}: ${bid.bidAmount}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </>
      )}
    </Box>
  );
}
