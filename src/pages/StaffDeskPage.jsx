import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdminAuth, ROLES } from '../context/AdminAuthContext';
import { useAdminStore } from '../context/AdminStoreContext';
import { useBooking } from '../context/BookingContext';
import { useTheme } from '../context/ThemeContext';
import { branchesData as defaultBranches, getBranchById as defaultGetBranchById } from '../data/branchesData';
import { formatCurrency, getTodayDateString, getFutureDateString } from '../utils/formatters';
import { 
  UserCheck, 
  Search, 
  QrCode, 
  CheckCircle2, 
  AlertCircle, 
  Plus, 
  Clock, 
  Calendar, 
  CreditCard, 
  DollarSign, 
  ShieldCheck, 
  LogOut, 
  ExternalLink,
  ChevronRight,
  Phone,
  Mail,
  Zap,
  Ticket,
  Printer,
  X,
  Layers,
  Sun,
  Moon
} from 'lucide-react';

export const StaffDeskPage = () => {
  const { currentAdmin, logout, isOwner } = useAdminAuth();
  const { theme, toggleTheme, isDark } = useTheme();
  const { branches: storeBranches, getBranchById: storeGetBranchById, games, packages } = useAdminStore();
  const branches = storeBranches?.length ? storeBranches : defaultBranches;
  const { 
    allBookings, 
    checkSlotAvailability, 
    createStaffWalkinBooking, 
    markBookingCheckedIn, 
    collectBalancePayment 
  } = useBooking();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('lookup'); // 'lookup' | 'walkin' | 'matrix' | 'recent'
  const [selectedBranchId, setSelectedBranchId] = useState(branches[0]?.id || 'hyd-hitech');
  const [toastMsg, setToastMsg] = useState(null);

  // Ticket Lookup State
  const [searchQuery, setSearchQuery] = useState('');
  const [matchedBooking, setMatchedBooking] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  // Walk-in POS Form State
  const [walkinGameType, setWalkinGameType] = useState('game'); // 'game' | 'package'
  const [walkinItemId, setWalkinItemId] = useState(games[0]?.id || 'bumper-cars');
  const [walkinDate, setWalkinDate] = useState(getTodayDateString());
  const [walkinTimeSlot, setWalkinTimeSlot] = useState('1800');
  const [walkinTimeText, setWalkinTimeText] = useState('06:00 PM');
  const [walkinPlayers, setWalkinPlayers] = useState(4);
  const [walkinCustomerName, setWalkinCustomerName] = useState('');
  const [walkinCustomerPhone, setWalkinCustomerPhone] = useState('');
  const [walkinPaymentMode, setWalkinPaymentMode] = useState('COUNTER_UPI');
  const [createdWalkinReceipt, setCreatedWalkinReceipt] = useState(null);

  // Helper toast
  const showToast = (msg, type = 'success') => {
    setToastMsg({ text: msg, type });
    setTimeout(() => setToastMsg(null), 3500);
  };

  // Redirect if not logged in
  if (!currentAdmin) {
    return (
      <div className="admin-access-denied-container">
        <div className="denied-box">
          <UserCheck size={48} className="text-cyan" />
          <h2>Staff Terminal Authentication Required</h2>
          <p>Please log in with your staff credentials to access the POS and check-in desk.</p>
          <div className="btn-row">
            <Link to="/admin/login" className="btn-primary">Go to Staff Login</Link>
          </div>
        </div>
      </div>
    );
  }

  // Active branch
  const currentBranch = getBranchById(selectedBranchId);

  // Time Slots Definition
  const timeSlots = [
    { id: '1100', text: '11:00 AM' },
    { id: '1200', text: '12:00 PM' },
    { id: '1300', text: '01:00 PM' },
    { id: '1400', text: '02:00 PM' },
    { id: '1500', text: '03:00 PM' },
    { id: '1600', text: '04:00 PM' },
    { id: '1700', text: '05:00 PM' },
    { id: '1800', text: '06:00 PM' },
    { id: '1900', text: '07:00 PM' },
    { id: '2000', text: '08:00 PM' },
    { id: '2100', text: '09:00 PM' }
  ];

  // Lookup Booking Handler
  const handleSearchBooking = (e) => {
    e?.preventDefault();
    if (!searchQuery.trim()) return;

    const query = searchQuery.trim().toLowerCase();
    const cleanPhoneQuery = query.replace(/\D/g, '');

    const found = allBookings.find(b => {
      const idMatch = b.id?.toLowerCase().includes(query);
      const phoneMatch = cleanPhoneQuery.length >= 4 && b.customer?.phone?.replace(/\D/g, '').includes(cleanPhoneQuery);
      const nameMatch = b.customer?.name?.toLowerCase().includes(query);
      const qrMatch = b.qrToken?.toLowerCase().includes(query);
      return idMatch || phoneMatch || nameMatch || qrMatch;
    });

    setMatchedBooking(found || null);
    setHasSearched(true);
  };

  // Perform Check-in
  const handleCheckIn = (bookingId) => {
    const res = markBookingCheckedIn(bookingId, `Checked in by ${currentAdmin.name} at counter`);
    if (res.success) {
      setMatchedBooking(res.booking);
      showToast(res.message);
    } else {
      showToast(res.message, 'error');
    }
  };

  // Settle Balance Payment
  const handleSettleBalance = (bookingId) => {
    const res = collectBalancePayment(bookingId, 'COUNTER_POS_COLLECTED');
    if (res.success) {
      setMatchedBooking(res.booking);
      showToast(res.message);
    } else {
      showToast(res.message, 'error');
    }
  };

  // Submit Offline Walk-in Booking
  const handleCreateWalkin = (e) => {
    e.preventDefault();

    if (!walkinCustomerName.trim()) {
      showToast('Please enter customer name', 'error');
      return;
    }

    // Check slot availability
    const avail = checkSlotAvailability(selectedBranchId, walkinItemId, walkinDate, walkinTimeSlot);
    if (avail.availableSeats < walkinPlayers) {
      showToast(`Only ${avail.availableSeats} spot(s) remaining for this slot. Cannot book ${walkinPlayers} players.`, 'error');
      return;
    }

    const res = createStaffWalkinBooking({
      branchId: selectedBranchId,
      itemId: walkinItemId,
      itemType: walkinGameType,
      date: walkinDate,
      timeSlotId: walkinTimeSlot,
      timeSlotText: walkinTimeText,
      playersCount: Number(walkinPlayers),
      customerName: walkinCustomerName.trim(),
      customerPhone: walkinCustomerPhone.trim() || '9999999999'
    });

    if (res.success) {
      setCreatedWalkinReceipt(res.booking);
      showToast(`Walk-in Booking #${res.booking.id} created and slot locked in real-time!`);
      // Reset fields
      setWalkinCustomerName('');
      setWalkinCustomerPhone('');
    }
  };

  // Selected item details
  const selectedWalkinItem = walkinGameType === 'package'
    ? packages.find(p => p.id === walkinItemId) || packages[0]
    : games.find(g => g.id === walkinItemId || g.slug === walkinItemId) || games[0];

  const calculatedWalkinTotal = (selectedWalkinItem?.pricePerPerson || 299) * walkinPlayers;

  return (
    <div className="staff-desk-root">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div 
            className={`admin-floating-toast ${toastMsg.type}`}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <CheckCircle2 size={18} />
            <span>{toastMsg.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Staff Header Bar */}
      <header className="staff-top-nav">
        <div className="container staff-nav-container">
          <div className="staff-brand-info">
            <div className="staff-brand-logo">
              <UserCheck size={20} />
            </div>
            <div>
              <div className="staff-portal-badge">
                <span className="staff-live-dot" />
                <span>STAFF POS & CHECK-IN DESK</span>
              </div>
              <h1 className="staff-brand-heading">Floor Operations Terminal</h1>
            </div>
          </div>

          <div className="staff-nav-actions">
            {/* Branch Selector */}
            <div className="branch-selector-pill">
              <span className="branch-lbl">VENUE:</span>
              <select 
                value={selectedBranchId} 
                onChange={(e) => setSelectedBranchId(e.target.value)}
                className="branch-select-input"
              >
                {branches.map(b => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            </div>

            {isOwner && (
              <Link to="/admin/owner" className="nav-owner-link">
                <ShieldCheck size={16} />
                <span>Owner Suite</span>
              </Link>
            )}

            <div className="staff-user-pill">
              <img src={currentAdmin.avatar} alt={currentAdmin.name} className="staff-avatar" />
              <div className="staff-meta-text">
                <span className="staff-user-name">{currentAdmin.name}</span>
                <span className="staff-role-tag">{currentAdmin.role}</span>
              </div>
            </div>

            {/* Dark / Light Mode Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              className="admin-header-theme-btn"
              title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
            >
              <AnimatePresence mode="wait" initial={false}>
                {isDark ? (
                  <motion.div
                    key="moon"
                    initial={{ rotate: -90, scale: 0.5, opacity: 0 }}
                    animate={{ rotate: 0, scale: 1, opacity: 1 }}
                    exit={{ rotate: 90, scale: 0.5, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Moon size={15} className="text-cyan" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="sun"
                    initial={{ rotate: 90, scale: 0.5, opacity: 0 }}
                    animate={{ rotate: 0, scale: 1, opacity: 1 }}
                    exit={{ rotate: -90, scale: 0.5, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Sun size={15} className="text-amber" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>

            <button 
              onClick={() => { logout(); navigate('/admin/login'); }} 
              className="staff-logout-btn"
              title="Logout session"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </header>

      {/* Staff Subnav Bar */}
      <div className="staff-subnav-bar">
        <div className="container staff-tabs-container">
          <button 
            className={`staff-tab-link ${activeTab === 'lookup' ? 'active' : ''}`}
            onClick={() => setActiveTab('lookup')}
          >
            <Search size={17} />
            <span>Ticket Cross-Check & Verification</span>
          </button>
          <button 
            className={`staff-tab-link ${activeTab === 'walkin' ? 'active' : ''}`}
            onClick={() => setActiveTab('walkin')}
          >
            <Plus size={17} />
            <span>Counter Walk-In POS</span>
          </button>
          <button 
            className={`staff-tab-link ${activeTab === 'matrix' ? 'active' : ''}`}
            onClick={() => setActiveTab('matrix')}
          >
            <Clock size={17} />
            <span>Live Slot Capacity Matrix</span>
          </button>
          <button 
            className={`staff-tab-link ${activeTab === 'recent' ? 'active' : ''}`}
            onClick={() => setActiveTab('recent')}
          >
            <Layers size={17} />
            <span>Today's Counter Ledger ({allBookings.length})</span>
          </button>
        </div>
      </div>

      {/* Main Staff Container */}
      <main className="staff-main-body container">

        {/* -------------------------------------------------------------------------
            TAB 1: TICKET CROSS-CHECK & CHECK-IN DESK
            ------------------------------------------------------------------------- */}
        {activeTab === 'lookup' && (
          <div className="staff-lookup-view">
            <div className="staff-lookup-hero-box">
              <div className="lookup-header-text">
                <h2>Guest Verification & Check-In Desk</h2>
                <p>Cross-check customer tickets by Booking ID, Mobile Number, or QR token to verify payment and mark check-in.</p>
              </div>

              <form onSubmit={handleSearchBooking} className="staff-search-form">
                <div className="search-input-field">
                  <Search size={22} className="search-lead-icon" />
                  <input 
                    type="text" 
                    placeholder="Enter Booking ID (e.g. 948102), Phone (e.g. 9876543210), or Name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                    className="staff-ticket-input"
                  />
                  {searchQuery && (
                    <button type="button" onClick={() => { setSearchQuery(''); setMatchedBooking(null); setHasSearched(false); }} className="clear-btn">
                      <X size={16} />
                    </button>
                  )}
                </div>
                <button type="submit" className="staff-verify-btn">
                  <QrCode size={18} />
                  <span>Verify Ticket</span>
                </button>
              </form>

              {/* Fast Demo Lookup Chips */}
              <div className="demo-lookup-row">
                <span className="demo-lbl">QUICK TEST:</span>
                {allBookings.slice(0, 3).map(b => (
                  <button 
                    key={b.id} 
                    type="button" 
                    className="demo-lookup-chip"
                    onClick={() => {
                      setSearchQuery(b.id);
                      setMatchedBooking(b);
                      setHasSearched(true);
                    }}
                  >
                    #{b.id} ({b.customer?.name?.split(' ')[0]} - {b.source === 'ONLINE_PORTAL' ? 'Web' : 'POS'})
                  </button>
                ))}
              </div>
            </div>

            {/* Search Result Card */}
            {hasSearched && (
              <div className="search-results-section">
                {matchedBooking ? (
                  <motion.div 
                    className="ticket-verification-card"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="ticket-card-top">
                      <div className="ticket-id-badge">
                        <span className="lbl">BOOKING PASS:</span>
                        <strong className="id-val">#{matchedBooking.id}</strong>
                      </div>
                      <div className="ticket-source-badge">
                        <span className={`source-tag ${matchedBooking.source === 'ONLINE_PORTAL' ? 'online' : 'walkin'}`}>
                          {matchedBooking.source === 'ONLINE_PORTAL' ? '🌐 ONLINE PORTAL BOOKING' : '🏢 OFFLINE WALK-IN COUNTER'}
                        </span>
                        <span className={`status-pill ${matchedBooking.status?.toLowerCase()}`}>
                          {matchedBooking.status}
                        </span>
                      </div>
                    </div>

                    <div className="ticket-card-grid">
                      {/* Left: Customer & Game Details */}
                      <div className="ticket-col">
                        <div className="ticket-section-label">ATTRACTION / GAME</div>
                        <h3 className="ticket-game-name">{matchedBooking.itemName}</h3>
                        <p className="ticket-venue-text">{matchedBooking.branchName || currentBranch.name}</p>

                        <div className="ticket-time-box">
                          <div className="time-item">
                            <Calendar size={16} />
                            <span>{matchedBooking.date}</span>
                          </div>
                          <div className="time-item highlight">
                            <Clock size={16} />
                            <span>{matchedBooking.timeSlotText}</span>
                          </div>
                          <div className="time-item">
                            <Ticket size={16} />
                            <span>{matchedBooking.playersCount} Players Squad</span>
                          </div>
                        </div>

                        <div className="customer-info-box">
                          <span className="customer-name-heading">{matchedBooking.customer?.name}</span>
                          <div className="customer-contact-line">
                            <span><Phone size={13} /> {matchedBooking.customer?.phone}</span>
                            {matchedBooking.customer?.email && <span><Mail size={13} /> {matchedBooking.customer?.email}</span>}
                          </div>
                        </div>
                      </div>

                      {/* Right: Payment & Check-In Action Desk */}
                      <div className="ticket-col payment-col">
                        <div className="ticket-section-label">PAYMENT BREAKDOWN</div>
                        <div className="payment-receipt-box">
                          <div className="receipt-line">
                            <span>Total Ticket Price:</span>
                            <strong>{formatCurrency(matchedBooking.totalAmount)}</strong>
                          </div>
                          <div className="receipt-line text-success">
                            <span>Advance Paid:</span>
                            <strong>{formatCurrency(matchedBooking.advancePaid)}</strong>
                          </div>
                          <div className={`receipt-line total-due ${matchedBooking.balanceDue > 0 ? 'text-warning' : 'text-success'}`}>
                            <span>Balance Due at Counter:</span>
                            <strong>{formatCurrency(matchedBooking.balanceDue)}</strong>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="ticket-actions-row">
                          {matchedBooking.balanceDue > 0 && (
                            <button
                              type="button"
                              className="btn-settle-balance"
                              onClick={() => handleSettleBalance(matchedBooking.id)}
                            >
                              <CreditCard size={18} />
                              <span>Collect ₹{matchedBooking.balanceDue} & Settle</span>
                            </button>
                          )}

                          {matchedBooking.status !== 'CHECKED_IN' && matchedBooking.status !== 'CANCELLED' && (
                            <button
                              type="button"
                              className="btn-mark-checkin"
                              onClick={() => handleCheckIn(matchedBooking.id)}
                            >
                              <CheckCircle2 size={18} />
                              <span>Confirm Guest Check-In</span>
                            </button>
                          )}

                          {matchedBooking.status === 'CHECKED_IN' && (
                            <div className="checked-in-banner">
                              <CheckCircle2 size={20} className="text-success" />
                              <div>
                                <strong>Guest Checked In & Ready</strong>
                                <span>Marshal verified at desk</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <div className="no-booking-found-box">
                    <AlertCircle size={40} className="text-warning" />
                    <h3>No matching booking found</h3>
                    <p>We could not find any active booking matching "{searchQuery}". Please verify the Booking ID or mobile number.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* -------------------------------------------------------------------------
            TAB 2: COUNTER WALK-IN POS (OFFLINE BOOKING)
            ------------------------------------------------------------------------- */}
        {activeTab === 'walkin' && (
          <div className="staff-walkin-view">
            <div className="walkin-grid-layout">
              {/* Left Column: POS Form */}
              <div className="walkin-form-card">
                <div className="pos-card-header">
                  <div className="pos-badge">
                    <span className="live-dot" />
                    <span>INSTANT WALK-IN POS</span>
                  </div>
                  <h2>New Counter Booking</h2>
                  <p>Book walk-in players directly at the venue. Inventory synchronizes live with the online customer booking portal.</p>
                </div>

                <form onSubmit={handleCreateWalkin} className="pos-form">
                  {/* Category Type Switcher */}
                  <div className="pos-type-toggle">
                    <button
                      type="button"
                      className={`type-toggle-btn ${walkinGameType === 'game' ? 'active' : ''}`}
                      onClick={() => { setWalkinGameType('game'); setWalkinItemId(games[0]?.id); }}
                    >
                      Single Attraction / Game
                    </button>
                    <button
                      type="button"
                      className={`type-toggle-btn ${walkinGameType === 'package' ? 'active' : ''}`}
                      onClick={() => { setWalkinGameType('package'); setWalkinItemId(packages[0]?.id); }}
                    >
                      Squad Combo Package
                    </button>
                  </div>

                  {/* Item Selector */}
                  <div className="form-group">
                    <label>Select Attraction / Package</label>
                    <select 
                      value={walkinItemId} 
                      onChange={(e) => setWalkinItemId(e.target.value)}
                      className="pos-select-input"
                    >
                      {walkinGameType === 'game' 
                        ? games.map(g => (
                            <option key={g.id} value={g.id}>{g.name} — ₹{g.pricePerPerson}/person</option>
                          ))
                        : packages.map(p => (
                            <option key={p.id} value={p.id}>{p.name} — ₹{p.pricePerPerson}/person</option>
                          ))
                      }
                    </select>
                  </div>

                  {/* Date & Time Slot */}
                  <div className="form-row-2">
                    <div className="form-group">
                      <label>Date</label>
                      <input 
                        type="date" 
                        required 
                        value={walkinDate} 
                        onChange={(e) => setWalkinDate(e.target.value)} 
                        className="pos-text-input"
                      />
                    </div>

                    <div className="form-group">
                      <label>Time Slot</label>
                      <select 
                        value={walkinTimeSlot} 
                        onChange={(e) => {
                          setWalkinTimeSlot(e.target.value);
                          const matched = timeSlots.find(t => t.id === e.target.value);
                          if (matched) setWalkinTimeText(matched.text);
                        }}
                        className="pos-select-input"
                      >
                        {timeSlots.map(t => {
                          const avail = checkSlotAvailability(selectedBranchId, walkinItemId, walkinDate, t.id);
                          return (
                            <option key={t.id} value={t.id} disabled={avail.isSoldOut}>
                              {t.text} {avail.isSoldOut ? '(SOLD OUT)' : `(${avail.availableSeats} spots left)`}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  </div>

                  {/* Squad Players Count */}
                  <div className="form-group">
                    <label>Number of Players ({walkinPlayers} Guests)</label>
                    <div className="player-stepper-row">
                      {[1, 2, 3, 4, 5, 6, 8, 10, 12].map(num => (
                        <button
                          key={num}
                          type="button"
                          className={`stepper-btn ${walkinPlayers === num ? 'active' : ''}`}
                          onClick={() => setWalkinPlayers(num)}
                        >
                          {num}P
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Guest Information */}
                  <div className="form-row-2">
                    <div className="form-group">
                      <label>Guest Name</label>
                      <input 
                        type="text" 
                        required 
                        placeholder="Guest Name (e.g. Rahul)"
                        value={walkinCustomerName} 
                        onChange={(e) => setWalkinCustomerName(e.target.value)} 
                        className="pos-text-input"
                      />
                    </div>
                    <div className="form-group">
                      <label>Guest Phone</label>
                      <input 
                        type="tel" 
                        placeholder="10-digit mobile"
                        value={walkinCustomerPhone} 
                        onChange={(e) => setWalkinCustomerPhone(e.target.value)} 
                        className="pos-text-input"
                      />
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div className="form-group">
                    <label>Counter Payment Mode</label>
                    <div className="payment-modes-grid">
                      <button
                        type="button"
                        className={`payment-mode-pill ${walkinPaymentMode === 'COUNTER_UPI' ? 'active' : ''}`}
                        onClick={() => setWalkinPaymentMode('COUNTER_UPI')}
                      >
                        <Zap size={16} />
                        <span>Counter UPI / QR</span>
                      </button>
                      <button
                        type="button"
                        className={`payment-mode-pill ${walkinPaymentMode === 'COUNTER_CASH' ? 'active' : ''}`}
                        onClick={() => setWalkinPaymentMode('COUNTER_CASH')}
                      >
                        <DollarSign size={16} />
                        <span>Cash</span>
                      </button>
                      <button
                        type="button"
                        className={`payment-mode-pill ${walkinPaymentMode === 'COUNTER_CARD' ? 'active' : ''}`}
                        onClick={() => setWalkinPaymentMode('COUNTER_CARD')}
                      >
                        <CreditCard size={16} />
                        <span>Card Swipe POS</span>
                      </button>
                    </div>
                  </div>

                  {/* Bill Summary & Submit Button */}
                  <div className="pos-checkout-bar">
                    <div className="pos-price-summary">
                      <span className="lbl">Total Collected:</span>
                      <strong className="amt">{formatCurrency(calculatedWalkinTotal)}</strong>
                      <span className="sub">₹{selectedWalkinItem?.pricePerPerson || 299} × {walkinPlayers} Players</span>
                    </div>

                    <button type="submit" className="pos-submit-btn">
                      <CheckCircle2 size={18} />
                      <span>Confirm & Lock Slot</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Right Column: Live Receipt / Token Print */}
              <div className="walkin-receipt-preview-col">
                <div className="receipt-card-container">
                  <div className="receipt-header">
                    <Ticket size={24} className="text-cyan" />
                    <h3>Live Counter Token</h3>
                    <p>Printed or digital scannable token issued at front desk</p>
                  </div>

                  {createdWalkinReceipt ? (
                    <motion.div 
                      className="issued-token-box"
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                    >
                      <div className="token-top-bar">
                        <span className="token-title">BATTLESHIP ARENA PASS</span>
                        <span className="token-id">#{createdWalkinReceipt.id}</span>
                      </div>

                      <div className="token-body">
                        <div className="token-row">
                          <span>Attraction:</span>
                          <strong>{createdWalkinReceipt.itemName}</strong>
                        </div>
                        <div className="token-row">
                          <span>Venue:</span>
                          <strong>{createdWalkinReceipt.branchName}</strong>
                        </div>
                        <div className="token-row">
                          <span>Date & Time:</span>
                          <strong>{createdWalkinReceipt.date} @ {createdWalkinReceipt.timeSlotText}</strong>
                        </div>
                        <div className="token-row">
                          <span>Guest Name:</span>
                          <strong>{createdWalkinReceipt.customer?.name} ({createdWalkinReceipt.playersCount} Players)</strong>
                        </div>
                        <div className="token-row total-row">
                          <span>Paid Total:</span>
                          <strong className="text-cyan">{formatCurrency(createdWalkinReceipt.totalAmount)}</strong>
                        </div>

                        {/* Simulated Token Barcode */}
                        <div className="token-barcode-wrap">
                          <div className="token-barcode-lines" />
                          <span className="token-barcode-text">{createdWalkinReceipt.qrToken}</span>
                        </div>
                      </div>

                      <button 
                        type="button" 
                        onClick={() => window.print()}
                        className="print-token-btn"
                      >
                        <Printer size={16} />
                        <span>Print Physical Token</span>
                      </button>
                    </motion.div>
                  ) : (
                    <div className="token-placeholder-box">
                      <Ticket size={40} className="text-dim" />
                      <p>Complete the form on the left to issue an instant counter walk-in token.</p>
                      <span className="helper-note">✓ Auto-syncs live inventory with online portal</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* -------------------------------------------------------------------------
            TAB 3: LIVE SLOT CAPACITY MATRIX
            ------------------------------------------------------------------------- */}
        {activeTab === 'matrix' && (
          <div className="staff-matrix-view">
            <div className="matrix-header-row">
              <div>
                <h2>Live Slot Capacity Grid ({selectedBranchId === 'hyd-hitech' ? 'Inorbit Mall' : 'Sarath City'})</h2>
                <p>Real-time slot occupancy showing confirmed online + counter walk-in players.</p>
              </div>
              <div className="matrix-date-badge">
                <Calendar size={16} />
                <span>TODAY: {getTodayDateString()}</span>
              </div>
            </div>

            <div className="matrix-games-list">
              {games.map(game => (
                <div key={game.id} className="matrix-game-card">
                  <div className="matrix-game-head">
                    <Gamepad2 size={18} className="text-cyan" />
                    <h3>{game.name}</h3>
                    <span className="game-rate-badge">₹{game.pricePerPerson}/person</span>
                  </div>

                  <div className="matrix-slots-row">
                    {timeSlots.map(slot => {
                      const avail = checkSlotAvailability(selectedBranchId, game.id, getTodayDateString(), slot.id);
                      const isFull = avail.isSoldOut;
                      const occupancyPercent = Math.round((avail.confirmedPlayers / avail.maxCapacity) * 100);

                      return (
                        <div 
                          key={slot.id} 
                          className={`slot-matrix-cell ${isFull ? 'sold-out' : avail.confirmedPlayers > 0 ? 'filling' : 'free'}`}
                        >
                          <span className="slot-matrix-time">{slot.text}</span>
                          <div className="slot-bar-track">
                            <div className="slot-bar-fill" style={{ width: `${occupancyPercent}%` }} />
                          </div>
                          <div className="slot-matrix-stats">
                            <span className="seats-avail">{avail.availableSeats} open</span>
                            <span className="seats-occ">{avail.confirmedPlayers}/{avail.maxCapacity}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* -------------------------------------------------------------------------
            TAB 4: TODAY'S COUNTER LEDGER
            ------------------------------------------------------------------------- */}
        {activeTab === 'recent' && (
          <div className="staff-ledger-view">
            <div className="matrix-header-row">
              <div>
                <h2>Master Bookings Roster</h2>
                <p>All online and offline counter bookings currently active in central inventory.</p>
              </div>
            </div>

            <div className="ledger-table-wrap">
              <table className="staff-ledger-table">
                <thead>
                  <tr>
                    <th>Booking ID</th>
                    <th>Source</th>
                    <th>Guest</th>
                    <th>Attraction</th>
                    <th>Date & Slot</th>
                    <th>Squad</th>
                    <th>Paid / Due</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {allBookings.map(b => (
                    <tr key={b.id}>
                      <td>
                        <span className="booking-id-tag">#{b.id}</span>
                      </td>
                      <td>
                        <span className={`source-badge ${b.source === 'ONLINE_PORTAL' ? 'source-web' : 'source-pos'}`}>
                          {b.source === 'ONLINE_PORTAL' ? 'ONLINE WEB' : 'OFFLINE POS'}
                        </span>
                      </td>
                      <td>
                        <div className="table-customer-cell">
                          <span className="customer-name">{b.customer?.name || 'Walk-in Guest'}</span>
                          <span className="customer-contact">{b.customer?.phone || 'No phone'}</span>
                        </div>
                      </td>
                      <td>
                        <span className="item-title">{b.itemName}</span>
                      </td>
                      <td>
                        <div className="table-slot-cell">
                          <span className="slot-date-text">{b.date}</span>
                          <span className="slot-time-pill">{b.timeSlotText}</span>
                        </div>
                      </td>
                      <td>
                        <span className="squad-count-text">{b.playersCount} Guests</span>
                      </td>
                      <td>
                        <div className="table-payment-cell">
                          <span className="paid-tag">Paid: {formatCurrency(b.advancePaid)}</span>
                          {b.balanceDue > 0 && (
                            <span className="due-tag">Due: {formatCurrency(b.balanceDue)}</span>
                          )}
                        </div>
                      </td>
                      <td>
                        <span className={`table-status-pill status-${b.status?.toLowerCase()}`}>
                          {b.status}
                        </span>
                      </td>
                      <td>
                        {b.status !== 'CHECKED_IN' && b.status !== 'CANCELLED' ? (
                          <button
                            type="button"
                            className="btn-quick-checkin"
                            onClick={() => handleCheckIn(b.id)}
                          >
                            Check In
                          </button>
                        ) : (
                          <span className="settled-tag">Verified ✓</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
