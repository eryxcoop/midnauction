import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { 
  HomePage, 
  CreateAuctionPage, 
  JoinParticipantPage, 
  JoinAuctioneerPage, 
  AuctionPage 
} from './components';
import { theme } from './config/theme';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/create-auction" element={<CreateAuctionPage />} />
          <Route path="/join-participant" element={<JoinParticipantPage />} />
          <Route path="/join-auctioneer" element={<JoinAuctioneerPage />} />
          <Route path="/auction/:contractAddress" element={<AuctionPage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;