import { AppBar, Toolbar, Typography, Box } from '@mui/material';

interface HeaderProps {
  isParticipant: boolean;
  userRole?: 'participant' | 'auctioneer';
}

export function Header({ isParticipant, userRole }: HeaderProps) {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Midnauction
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="subtitle2" sx={{ opacity: 0.8 }}>
            {isParticipant ? 'Participant' : 'Auctioneer'}
          </Typography>
          {userRole && (
            <Typography variant="subtitle2" sx={{ opacity: 0.6 }}>
              ({userRole})
            </Typography>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
