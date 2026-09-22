import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { LocationProvider } from './context/LocationContext';
import { BookingProvider } from './context/BookingContext';
import { ThemeProvider } from './context/ThemeContext';

// Layout Components
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { LocationModal } from './components/layout/LocationModal';
import { MobileStickyBar } from './components/layout/MobileStickyBar';

// Page Components
import { HomePage } from './pages/HomePage';
import { GamesPage } from './pages/GamesPage';
import { GameDetailPage } from './pages/GameDetailPage';
import { LocationsPage } from './pages/LocationsPage';
import { BranchDetailPage } from './pages/BranchDetailPage';
import { BookingPage } from './pages/BookingPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { ConfirmationPage } from './pages/ConfirmationPage';
import { PackagesPage } from './pages/PackagesPage';
import { OffersPage } from './pages/OffersPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { FaqPage } from './pages/FaqPage';
import { GalleryPage } from './pages/GalleryPage';
import { MyBookingPage } from './pages/MyBookingPage';
import { StaffPosPage } from './pages/StaffPosPage';
import { CancellationPolicyPage, TermsPage, PrivacyPolicyPage } from './pages/PolicyPages';
import { BattleshipBumperCarsPage } from './pages/BattleshipBumperCarsPage';
import { ScrollytellingCarPage } from './pages/ScrollytellingCarPage';

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

// Main App Layout Wrapper
const AppContent = () => {
  const { pathname } = useLocation();
  const isStandaloneExperience = pathname === '/bumper-cars' || pathname === '/battleship' || pathname === '/story' || pathname === '/scrollytelling';
  const isPosPage = pathname.startsWith('/admin') || pathname.startsWith('/staff');

  return (
    <div className="app-root">
      <ScrollToTop />
      <LocationModal />

      {/* Show main luxury navigation bar for standard website pages */}
      {!isStandaloneExperience && <Navbar />}

      <main className={!isStandaloneExperience && !isPosPage ? "main-content-wrapper" : ""}>
        <Routes>
          {/* Main Website Pages */}
          <Route path="/" element={<HomePage />} />
          <Route path="/games" element={<GamesPage />} />
          <Route path="/games/:slug" element={<GameDetailPage />} />
          
          {/* Apple/Porsche-style Scrollytelling Story Showcase */}
          <Route path="/story" element={<BattleshipBumperCarsPage />} />
          <Route path="/scrollytelling" element={<BattleshipBumperCarsPage />} />

          {/* Battleship Bumper Cars Experience */}
          <Route path="/bumper-cars" element={<BattleshipBumperCarsPage />} />
          <Route path="/battleship" element={<BattleshipBumperCarsPage />} />
          
          {/* Locations */}
          <Route path="/locations" element={<LocationsPage />} />
          <Route path="/locations/:branchId" element={<BranchDetailPage />} />
          
          {/* Passes & Packages */}
          <Route path="/packages" element={<PackagesPage />} />
          <Route path="/offers" element={<OffersPage />} />
          
          {/* Booking & Checkout Flow */}
          <Route path="/booking" element={<BookingPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/confirmation" element={<ConfirmationPage />} />
          <Route path="/my-booking" element={<MyBookingPage />} />
          
          {/* Exploration & Support */}
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/faq" element={<FaqPage />} />
          
          {/* Policies & Legal */}
          <Route path="/cancellation-policy" element={<CancellationPolicyPage />} />
          <Route path="/refund-policy" element={<CancellationPolicyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPolicyPage />} />
          
          {/* Staff POS & Operations Desk */}
          <Route path="/admin/pos" element={<StaffPosPage />} />
          <Route path="/staff/pos" element={<StaffPosPage />} />
          
          {/* Fallback */}
          <Route path="*" element={<HomePage />} />
        </Routes>
      </main>

      {/* Show main footer & mobile sticky action bar for standard website pages */}
      {!isStandaloneExperience && !isPosPage && (
        <>
          <Footer />
          <MobileStickyBar />
        </>
      )}
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <LocationProvider>
        <BookingProvider>
          <Router>
            <AppContent />
          </Router>
        </BookingProvider>
      </LocationProvider>
    </ThemeProvider>
  );
}

export default App;
