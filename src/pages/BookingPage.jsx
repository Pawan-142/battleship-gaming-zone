import React, { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from '../context/LocationContext';
import { useBooking } from '../context/BookingContext';
import { gamesData } from '../data/gamesData';
import { packagesData } from '../data/packagesData';
import { 
  generateDailyTimeSlots, 
  getTodayDateString, 
  getFutureDateString, 
  formatCurrency, 
  formatDateDisplay 
} from '../utils/formatters';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  AlertCircle, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export const BookingPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { currentBranch, branches, selectBranch } = useLocation();
  const { checkSlotAvailability, acquireSlotHold } = useBooking();

  const preBranch = searchParams.get('branch');
  const preGame = searchParams.get('game');
  const prePackage = searchParams.get('package');

  const [selectedBranchId, setSelectedBranchId] = useState(preBranch || currentBranch.id);
  const [bookingType, setBookingType] = useState(prePackage ? 'package' : 'game');
  const [selectedItemId, setSelectedItemId] = useState(() => {
    if (prePackage) return prePackage;
    if (preGame) return preGame;
    return gamesData[0].id;
  });

  const [selectedDate, setSelectedDate] = useState(getTodayDateString());
  const [selectedSlotId, setSelectedSlotId] = useState('1800');
  const [playersCount, setPlayersCount] = useState(2);

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customNotes, setCustomNotes] = useState('');

  const [errorMessage, setErrorMessage] = useState('');

  const timeSlots = generateDailyTimeSlots();

  const selectedItem = bookingType === 'package' 
    ? packagesData.find(p => p.id === selectedItemId || p.slug === selectedItemId) || packagesData[0]
    : gamesData.find(g => g.id === selectedItemId || g.slug === selectedItemId) || gamesData[0];

  const subtotal = (selectedItem?.pricePerPerson || 299) * playersCount;
  const branchObj = branches.find(b => b.id === selectedBranchId) || currentBranch;
  const advancePayable = Math.max(branchObj.minAdvance * playersCount, Math.round((subtotal * branchObj.advancePercent) / 100));
  const payAtVenue = subtotal - advancePayable;

  const currentSlotAvailability = checkSlotAvailability(selectedBranchId, selectedItem.id, selectedDate, selectedSlotId);
  const chosenSlotObj = timeSlots.find(s => s.id === selectedSlotId) || timeSlots[0];

  const handleProceedToCheckout = (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!customerName.trim() || !customerPhone.trim() || !customerEmail.trim()) {
      setErrorMessage('Please complete your full name, mobile number, and email to lock your slot.');
      return;
    }

    if (customerPhone.replace(/\D/g, '').length < 10) {
      setErrorMessage('Please enter a valid 10-digit Indian mobile number.');
      return;
    }

    const holdResult = acquireSlotHold({
      branchId: selectedBranchId,
      itemType: bookingType,
      itemId: selectedItem.id,
      date: selectedDate,
      timeSlotId: selectedSlotId,
      timeSlotText: chosenSlotObj.time,
      playersCount: Number(playersCount),
      customerInfo: {
        name: customerName,
        phone: customerPhone,
        email: customerEmail,
        notes: customNotes
      }
    });

    if (!holdResult.success) {
      setErrorMessage(holdResult.message);
      return;
    }

    navigate('/checkout');
  };

  return (
    <div className="booking-page-root">
      {/* Unified Page Header */}
      <section className="page-header-unified">
        <div className="container">
          <div className="unified-breadcrumbs">
            <Link to="/">HOME</Link> <span>/</span> <span className="curr">LIVE BOOKING PORTAL</span>
          </div>
          <span className="section-tag">CENTRAL INVENTORY ENGINE</span>
          <h1 className="page-hero-title">
            RESERVE YOUR <span className="gradient-text-cyan">SLOT</span>
          </h1>
          <p className="page-hero-desc">
            Live synchronized availability. Select your arena, attraction, date, and 30-minute play slot to lock your physical station.
          </p>
        </div>
      </section>

      {/* Main Wizard */}
      <section className="section-padding">
        <div className="container">
          <div className="booking-wizard-grid">
            {/* Steps Column */}
            <div className="wizard-flow-col">
              {errorMessage && (
                <div className="alert-error-box animate-fade">
                  <AlertCircle size={20} />
                  <span>{errorMessage}</span>
                </div>
              )}

              <form onSubmit={handleProceedToCheckout} className="steps-form-wrapper">
                {/* Step 1: Branch */}
                <div className="glass-card step-card-unified">
                  <div className="step-tag-row">
                    <span className="step-num">STEP 01</span>
                    <h3>Select Arena Branch</h3>
                  </div>
                  <div className="branch-chips-grid">
                    {branches.map(b => (
                      <div
                        key={b.id}
                        className={`branch-chip-item ${selectedBranchId === b.id ? 'active' : ''}`}
                        onClick={() => {
                          setSelectedBranchId(b.id);
                          selectBranch(b.id);
                        }}
                      >
                        <MapPin size={18} className="icon-cyan" />
                        <div>
                          <strong>{b.shortName}</strong>
                          <span className="tiny-addr">{b.address.slice(0, 42)}...</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Step 2: Experience / Package */}
                <div className="glass-card step-card-unified">
                  <div className="step-tag-row">
                    <span className="step-num">STEP 02</span>
                    <h3>Select Attraction or Combo Pass</h3>
                  </div>

                  <div className="type-toggle-unified">
                    <button
                      type="button"
                      className={`type-btn-u ${bookingType === 'game' ? 'active' : ''}`}
                      onClick={() => {
                        setBookingType('game');
                        setSelectedItemId(gamesData[0].id);
                      }}
                    >
                      Single Experiences ({gamesData.length})
                    </button>
                    <button
                      type="button"
                      className={`type-btn-u ${bookingType === 'package' ? 'active' : ''}`}
                      onClick={() => {
                        setBookingType('package');
                        setSelectedItemId(packagesData[0].id);
                      }}
                    >
                      Combo Packages ({packagesData.length})
                    </button>
                  </div>

                  <motion.div layout className="items-selector-grid">
                    <AnimatePresence mode="popLayout">
                      {(bookingType === 'game' ? gamesData : packagesData).map(item => (
                        <motion.div
                          key={item.id}
                          layout
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={`item-choice-card ${selectedItemId === item.id ? 'active' : ''}`}
                          onClick={() => setSelectedItemId(item.id)}
                        >
                          <img src={item.heroImage || item.image} alt={item.name} className="item-thumb-u" />
                          <div className="item-txt">
                            <span className="cat-tiny">{item.category}</span>
                            <strong>{item.name}</strong>
                            <span className="item-rate">{formatCurrency(item.pricePerPerson)} / player</span>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </motion.div>
                </div>

                {/* Step 3: Date */}
                <div className="glass-card step-card-unified">
                  <div className="step-tag-row">
                    <span className="step-num">STEP 03</span>
                    <h3>Select Date of Visit</h3>
                  </div>

                  <div className="date-chips-grid">
                    {[0, 1, 2, 3, 4, 5, 6].map(days => {
                      const dateStr = getFutureDateString(days);
                      const isSelected = selectedDate === dateStr;
                      return (
                        <motion.button
                          key={days}
                          type="button"
                          whileHover={{ scale: 1.04 }}
                          whileTap={{ scale: 0.96 }}
                          className={`date-chip-btn ${isSelected ? 'active' : ''}`}
                          onClick={() => setSelectedDate(dateStr)}
                        >
                          <span className="d-label">{days === 0 ? 'Today' : days === 1 ? 'Tomorrow' : new Date(dateStr).toLocaleDateString('en-IN', { weekday: 'short' })}</span>
                          <span className="d-val">{new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                {/* Step 4: Slot Matrix */}
                <div className="glass-card step-card-unified">
                  <div className="step-tag-row">
                    <span className="step-num">STEP 04</span>
                    <div>
                      <h3>Choose Time Slot</h3>
                      <p className="step-sub-p">Live synchronized availability with physical counter bookings.</p>
                    </div>
                  </div>

                  <div className="slots-unified-grid">
                    {timeSlots.map(slot => {
                      const avail = checkSlotAvailability(selectedBranchId, selectedItem.id, selectedDate, slot.id);
                      const isSelected = selectedSlotId === slot.id;
                      const isSoldOut = avail.isSoldOut || avail.availableSeats < playersCount;

                      return (
                        <motion.button
                          key={slot.id}
                          type="button"
                          disabled={isSoldOut}
                          whileHover={!isSoldOut ? { scale: 1.05 } : {}}
                          whileTap={!isSoldOut ? { scale: 0.95 } : {}}
                          className={`slot-cell ${isSelected ? 'selected' : ''}`}
                          onClick={() => setSelectedSlotId(slot.id)}
                        >
                          <span className="slot-t">{slot.time}</span>
                          <span className="slot-c">
                            {isSoldOut ? 'Sold Out' : `${avail.availableSeats} spots`}
                          </span>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                {/* Step 5: Player Count */}
                <div className="glass-card step-card-unified">
                  <div className="step-tag-row">
                    <span className="step-num">STEP 05</span>
                    <h3>Number of Players</h3>
                  </div>

                  <div className="players-counter-block">
                    <div className="counter-btn-wrap">
                      <button
                        type="button"
                        className="btn-counter"
                        onClick={() => setPlayersCount(Math.max(1, playersCount - 1))}
                        disabled={playersCount <= 1}
                      >
                        -
                      </button>
                      <span className="val-counter">{playersCount}</span>
                      <button
                        type="button"
                        className="btn-counter"
                        onClick={() => setPlayersCount(Math.min(16, playersCount + 1))}
                        disabled={playersCount >= (currentSlotAvailability.availableSeats || 10)}
                      >
                        +
                      </button>
                    </div>
                    <span className="counter-helper">
                      Max {currentSlotAvailability.availableSeats} spots available in this 30-min window
                    </span>
                  </div>
                </div>

                {/* Step 6: Guest Details */}
                <div className="glass-card step-card-unified">
                  <div className="step-tag-row">
                    <span className="step-num">STEP 06</span>
                    <h3>Lead Player Details</h3>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Full Name *</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Arjun Reddy"
                      value={customerName}
                      onChange={e => setCustomerName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="grid-2">
                    <div className="form-group">
                      <label className="form-label">Mobile (for instant QR Pass) *</label>
                      <input
                        type="tel"
                        className="form-input"
                        placeholder="e.g. 9848011223"
                        value={customerPhone}
                        onChange={e => setCustomerPhone(e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Email Address *</label>
                      <input
                        type="email"
                        className="form-input"
                        placeholder="e.g. arjun@example.com"
                        value={customerEmail}
                        onChange={e => setCustomerEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Special Request / Notes (Optional)</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Birthday celebration, left-handed bowling ramp, etc."
                      value={customNotes}
                      onChange={e => setCustomNotes(e.target.value)}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-lg btn-full"
                >
                  <span>LOCK SLOT & PROCEED TO ADVANCE PAYMENT</span>
                  <ArrowRight size={18} />
                </button>
              </form>
            </div>

            {/* Right Summary Column */}
            <div className="wizard-summary-col">
              <div className="glass-card sticky-sidebar summary-box-unified">
                <span className="section-tag">LIVE RESERVATION</span>
                <h3 className="summary-title-u">{selectedItem.name}</h3>

                <div className="summary-media-frame">
                  <img src={selectedItem.heroImage || selectedItem.image} alt={selectedItem.name} className="summary-img-u" />
                  <span className="badge badge-magenta summary-badge-pos">{selectedItem.category}</span>
                </div>

                <div className="summary-specs-list">
                  <div className="s-line">
                    <MapPin size={15} className="icon-cyan" />
                    <span>{branchObj.name}</span>
                  </div>
                  <div className="s-line">
                    <Calendar size={15} className="icon-amber" />
                    <span>{formatDateDisplay(selectedDate)}</span>
                  </div>
                  <div className="s-line">
                    <Clock size={15} className="icon-magenta" />
                    <span>Slot: <strong>{chosenSlotObj.time}</strong></span>
                  </div>
                  <div className="s-line">
                    <Users size={15} className="icon-emerald" />
                    <span>{playersCount} Players</span>
                  </div>
                </div>

                <div className="fare-breakdown-box">
                  <div className="fare-row">
                    <span>Base Fare ({playersCount} × {formatCurrency(selectedItem.pricePerPerson)})</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="fare-row advance-row">
                    <span>Pay Online (Advance Hold):</span>
                    <strong className="text-cyan">{formatCurrency(advancePayable)}</strong>
                  </div>
                  <div className="fare-row">
                    <span>Balance at Venue Counter:</span>
                    <span>{formatCurrency(payAtVenue)}</span>
                  </div>
                </div>

                <div className="hold-guarantee-note">
                  <ShieldCheck size={18} className="icon-cyan flex-shrink-0" />
                  <div>
                    <strong>5-Minute Slot Hold Guarantee</strong>
                    <p>Once you click proceed, the physical station is locked exclusively for you for 5 minutes during checkout.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .booking-wizard-grid {
          display: grid;
          grid-template-columns: 1.35fr 0.65fr;
          gap: 3rem;
          align-items: flex-start;
        }

        .steps-form-wrapper {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .step-card-unified {
          padding: 2rem;
        }

        .step-tag-row {
          display: flex;
          align-items: center;
          gap: 0.85rem;
          margin-bottom: 1.5rem;
        }

        .step-num {
          font-family: var(--font-mono);
          font-size: 0.72rem;
          font-weight: 800;
          color: var(--cyan-primary);
          background: var(--cyan-dim);
          border: 1px solid var(--border-cyan);
          padding: 0.25rem 0.65rem;
          border-radius: var(--radius-xs);
        }

        .step-sub-p {
          font-size: 0.8rem;
          color: var(--text-muted);
        }

        .branch-chips-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .branch-chip-item {
          background: var(--bg-card);
          border: 1px solid var(--border-strong);
          border-radius: var(--radius-xs);
          padding: 1rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          cursor: pointer;
          color: var(--text-pure);
          transition: all 0.2s ease;
        }

        .branch-chip-item:hover {
          border-color: var(--cyan-primary);
        }

        .branch-chip-item.active {
          border-color: var(--cyan-primary);
          background: rgba(0, 240, 255, 0.1);
          box-shadow: 0 0 15px rgba(0, 240, 255, 0.25);
        }

        .tiny-addr {
          display: block;
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .type-toggle-unified {
          display: flex;
          background: var(--bg-card);
          padding: 0.35rem;
          border-radius: var(--radius-xs);
          border: 1px solid var(--border-strong);
          margin-bottom: 1.25rem;
          gap: 0.5rem;
        }

        .type-btn-u {
          flex: 1;
          padding: 0.65rem;
          background: transparent;
          border: none;
          color: var(--text-secondary);
          font-family: var(--font-display);
          font-weight: 700;
          font-size: 0.85rem;
          text-transform: uppercase;
          border-radius: var(--radius-xs);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .type-btn-u.active {
          background: var(--text-pure);
          color: var(--bg-deep);
        }

        .items-selector-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
          max-height: 320px;
          overflow-y: auto;
        }

        .item-choice-card {
          background: var(--bg-card);
          border: 1px solid var(--border-strong);
          border-radius: var(--radius-xs);
          padding: 0.75rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          cursor: pointer;
        }

        .item-choice-card.active {
          border-color: var(--cyan-primary);
          background: var(--cyan-dim);
        }

        .item-thumb-u {
          width: 54px;
          height: 54px;
          border-radius: var(--radius-xs);
          object-fit: cover;
        }

        .item-txt {
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .cat-tiny {
          font-family: var(--font-mono);
          font-size: 0.6rem;
          color: var(--amber-primary);
          text-transform: uppercase;
        }

        .item-txt strong {
          font-size: 0.88rem;
          color: var(--text-pure);
          line-height: 1.2;
          margin: 0.15rem 0;
        }

        .item-rate {
          font-size: 0.78rem;
          color: var(--cyan-primary);
          font-weight: 700;
        }

        .date-chips-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 0.5rem;
        }

        .date-chip-btn {
          background: var(--bg-card);
          border: 1px solid var(--border-strong);
          border-radius: var(--radius-xs);
          padding: 0.75rem 0.25rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.25rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .date-chip-btn:hover {
          border-color: var(--cyan-primary);
        }

        .date-chip-btn.active {
          background: rgba(0, 240, 255, 0.12);
          border-color: var(--cyan-primary);
          box-shadow: 0 0 15px rgba(0, 240, 255, 0.25);
        }

        [data-theme="light"] .date-chip-btn.active {
          background: rgba(2, 132, 199, 0.12);
          border-color: var(--cyan-primary);
        }

        .d-label {
          font-family: var(--font-mono);
          font-size: 0.65rem;
          font-weight: 600;
          color: var(--text-muted);
          text-transform: uppercase;
        }

        .d-val {
          font-family: var(--font-display);
          font-size: 0.88rem;
          font-weight: 800;
          color: var(--text-pure);
        }

        .slots-unified-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0.75rem;
        }

        .slot-cell {
          padding: 0.75rem;
          border-radius: var(--radius-xs);
          background: var(--bg-card);
          border: 1px solid var(--border-strong);
          color: var(--text-pure);
          font-family: var(--font-mono);
          font-size: 0.88rem;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.25rem;
          transition: all 0.2s ease;
        }

        .slot-cell:hover:not(:disabled) {
          border-color: var(--cyan-primary);
          transform: translateY(-1px);
        }

        .slot-cell.selected {
          background: rgba(0, 240, 255, 0.15);
          border-color: var(--cyan-primary);
          color: var(--cyan-primary);
          box-shadow: 0 0 15px rgba(0, 240, 255, 0.25);
        }

        [data-theme="light"] .slot-cell.selected {
          background: rgba(2, 132, 199, 0.15);
          border-color: var(--cyan-primary);
          color: var(--cyan-primary);
        }

        .slot-cell:disabled {
          opacity: 0.35;
          cursor: not-allowed;
          text-decoration: line-through;
        }

        .slot-c {
          font-size: 0.65rem;
          font-weight: 600;
          color: var(--text-muted);
        }

        .players-counter-block {
          display: flex;
          align-items: center;
          gap: 2rem;
        }

        .counter-btn-wrap {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          background: var(--bg-deep);
          border: 1px solid var(--border-strong);
          border-radius: var(--radius-xs);
          padding: 0.35rem;
        }

        .btn-counter {
          width: 36px;
          height: 36px;
          background: var(--bg-elevated);
          border: none;
          color: #ffffff;
          border-radius: var(--radius-xs);
          font-size: 1.2rem;
          cursor: pointer;
        }

        .val-counter {
          font-family: var(--font-mono);
          font-size: 1.35rem;
          font-weight: 800;
          min-width: 36px;
          text-align: center;
          color: #ffffff;
        }

        .counter-helper {
          font-size: 0.85rem;
          color: var(--text-secondary);
        }

        .alert-error-box {
          background: var(--crimson-dim);
          border: 1px solid var(--crimson-primary);
          color: #ffffff;
          padding: 1rem 1.25rem;
          border-radius: var(--radius-xs);
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
        }

        .summary-box-unified {
          padding: 2rem;
        }

        .summary-title-u {
          font-size: 1.3rem;
          margin: 0.4rem 0 1rem;
        }

        .summary-media-frame {
          position: relative;
          height: 160px;
          border-radius: var(--radius-xs);
          overflow: hidden;
          margin-bottom: 1.25rem;
        }

        .summary-img-u {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .summary-badge-pos {
          position: absolute;
          top: 0.75rem;
          left: 0.75rem;
        }

        .summary-specs-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          font-size: 0.85rem;
          color: var(--text-secondary);
          border-bottom: 1px solid var(--border-subtle);
          padding-bottom: 1.25rem;
          margin-bottom: 1.25rem;
        }

        .s-line {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .fare-breakdown-box {
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
          font-size: 0.88rem;
          margin-bottom: 1.5rem;
        }

        .fare-row {
          display: flex;
          justify-content: space-between;
        }

        .advance-row {
          background: var(--bg-deep);
          border-left: 3px solid var(--cyan-primary);
          padding: 0.5rem 0.75rem;
        }

        .hold-guarantee-note {
          background: var(--cyan-dim);
          border: 1px solid var(--border-cyan);
          border-radius: var(--radius-xs);
          padding: 1rem;
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          font-size: 0.8rem;
        }

        .hold-guarantee-note strong {
          display: block;
          color: #ffffff;
          margin-bottom: 0.2rem;
        }

        .hold-guarantee-note p {
          color: var(--text-secondary);
          line-height: 1.4;
        }

        @media (max-width: 1024px) {
          .booking-wizard-grid { grid-template-columns: 1fr; }
          .date-chips-grid { grid-template-columns: repeat(4, 1fr); }
          .slots-unified-grid { grid-template-columns: repeat(3, 1fr); }
        }

        @media (max-width: 640px) {
          .branch-chips-grid, .items-selector-grid { grid-template-columns: 1fr; }
          .date-chips-grid { grid-template-columns: repeat(3, 1fr); }
          .slots-unified-grid { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>
    </div>
  );
};
