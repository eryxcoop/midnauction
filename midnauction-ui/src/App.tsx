import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { theme } from './config/theme';
import { AuctionProvider } from './contexts/AuctionContext';
import { MainLayout } from './components/Layout';
import { HomePage } from './components/HomePage';
import { CreateAuctionPage } from './components/CreateAuctionPage';
import { AuctionPage } from './components/AuctionPage';
import { JoinAuctioneerPage } from './components/JoinAuctioneerPage';
import { JoinParticipantPage } from './components/JoinParticipantPage';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuctionProvider>
        <Router>
          <MainLayout isParticipant={false} userRole="participant">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/create-auction" element={<CreateAuctionPage />} />
              <Route path="/join-participant" element={<JoinParticipantPage />} />
              <Route path="/join-auctioneer" element={<JoinAuctioneerPage />} />
              <Route path="/auction/:contractAddress" element={<AuctionPage />} />
            </Routes>
          </MainLayout>
        </Router>
      </AuctionProvider>
    </ThemeProvider>
  );
}

export default App;