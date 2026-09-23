import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';
import { useLocation } from '../context/LocationContext';
import { gamesData } from '../data/gamesData';
import { generateDailyTimeSlots, getTodayDateString, formatCurrency } from '../utils/formatters';
import { 
  ShieldAlert, 
  UserCheck, 
  Zap, 
  PlusCircle, 
  Radio, 
  RefreshCw,
  CheckCircle,
  Clock,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { TextEffect } from '../components/motion/TextEffect';

export const StaffPosPage = () => {
  const { createStaffWalkinBooking, allBookings, checkSlotAvailability } = useBooking();
  const { currentBranch, branches } = useLocation();

  const [selectedBranchId, setSelectedBranchId] = useState(currentBranch.id);
  const [selectedGameId, setSelectedGameId] = useState("bumper-cars");
  const [selectedDate, setSelectedDate] = useState(getTodayDateString());
  const [selectedSlot, setSelectedSlot] = useState("1800");
  const [playersCount, setPlayersCount] = useState(2);
  const [guestName, setGuestName] = useState("Walk-in Guest");
  const [guestPhone, setGuestPhone] = useState("9848011223");
  const [successNotice, setSuccessNotice] = useState("");

  const timeSlots = generateDailyTimeSlots();
  const currentGame = gamesData.find(g => g.id === selectedGameId) || gamesData[0];
  const slotAvailability = checkSlotAvailability(selectedBranchId, selectedGameId, selectedDate, selectedSlot);

  const handleCreateWalkin = (e) => {
    e.preventDefault();
    const chosenSlotObj = timeSlots.find(s => s.id === selectedSlot) || timeSlots[0];

    const res = createStaffWalkinBooking({
      branchId: selectedBranchId,
      itemId: selectedGameId,
      itemType: "game",
      date: selectedDate,
      timeSlotId: selectedSlot,
      timeSlotText: chosenSlotObj.time,
      playersCount: Number(playersCount),
      customerName: guestName,
      customerPhone: guestPhone
    });

    if (res.success) {
      setSuccessNotice(`✅ Walk-in booking confirmed (${res.booking.id})! Slot capacity immediately locked across all online channels.`);
      setTimeout(() => setSuccessNotice(""), 6000);
    }
  };

  const activeWalkins = allBookings.filter(b => b.source === "OFFLINE_WALKIN").slice(0, 8);

  return (
    <div className="forge-admin-root">
      <section className="forge-header-section">
        <div className="container">
          <div className="forge-breadcrumbs">
            <Link to="/">BATTLESHIP</Link>
            <span className="sep">/</span>
            <span className="current">CENTRAL INVENTORY ENGINE & POS</span>
          </div>

          <div className="forge-pill-tag">
            <span className="pulse-dot"></span>
            <span>STAFF WALK-IN COUNTER MATRIX</span>
          </div>

          <h1 className="forge-page-title">
            <TextEffect per="word" preset="fade-in-blur">
              Physical Counter POS Simulator.
            </TextEffect>
          </h1>

          <p className="forge-page-desc">
            Simulate physical walk-in customer bookings at the reception desk to verify real-time 2-way slot inventory locking against the customer online portal.
          </p>
        </div>
      </section>

      <section className="forge-admin-body">
        <div className="container">
          <div className="forge-admin-grid">
            {/* Form */}
            <div className="forge-admin-card">
              <span className="mono-badge">01 // DISPATCH WALK-IN TICKET</span>

              {successNotice && (
                <div className="alert-success-admin">
                  <CheckCircle size={18} />
                  <span>{successNotice}</span>
                </div>
              )}

              <form onSubmit={handleCreateWalkin} className="admin-form">
                <div className="admin-grid-2">
                  <div className="admin-field">
                    <label>COUNTER BRANCH</label>
                    <select
                      value={selectedBranchId}
                      onChange={e => setSelectedBranchId(e.target.value)}
                    >
                      {branches.map(b => (
                        <option key={b.id} value={b.id}>{b.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="admin-field">
                    <label>PHYSICAL ATTRACTION</label>
                    <select
                      value={selectedGameId}
                      onChange={e => setSelectedGameId(e.target.value)}
                    >
                      {gamesData.map(g => (
                        <option key={g.id} value={g.id}>{g.name} ({formatCurrency(g.pricePerPerson)})</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="admin-grid-3">
                  <div className="admin-field">
                    <label>DATE</label>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={e => setSelectedDate(e.target.value)}
                    />
                  </div>

                  <div className="admin-field">
                    <label>TIME SLOT</label>
                    <select
                      value={selectedSlot}
                      onChange={e => setSelectedSlot(e.target.value)}
                    >
                      {timeSlots.map(s => (
                        <option key={s.id} value={s.id}>{s.time}</option>
                      ))}
                    </select>
                  </div>

                  <div className="admin-field">
                    <label>WALK-IN PLAYERS</label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={playersCount}
                      onChange={e => setPlayersCount(e.target.value)}
                    />
                  </div>
                </div>

                {/* Capacity HUD */}
                <div className="capacity-hud-box">
                  <div className="hud-cell">
                    <span className="hud-lbl">MAX CAPACITY</span>
                    <span className="hud-val">{slotAvailability.maxCapacity}</span>
                  </div>
                  <div className="hud-cell">
                    <span className="hud-lbl">CONFIRMED PLAYERS</span>
                    <span className="hud-val text-amber">{slotAvailability.confirmedPlayers}</span>
                  </div>
                  <div className="hud-cell">
                    <span className="hud-lbl">HELD (5-MIN HOLD)</span>
                    <span className="hud-val text-cyan">{slotAvailability.heldPlayers}</span>
                  </div>
                  <div className="hud-cell">
                    <span className="hud-lbl">AVAILABLE RIGHT NOW</span>
                    <span className={`hud-val ${slotAvailability.availableSeats > 0 ? 'text-green' : 'text-red'}`}>
                      {slotAvailability.availableSeats}
                    </span>
                  </div>
                </div>

                <div className="admin-grid-2">
                  <div className="admin-field">
                    <label>GUEST FULL NAME</label>
                    <input
                      type="text"
                      value={guestName}
                      onChange={e => setGuestName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="admin-field">
                    <label>GUEST PHONE (+91)</label>
                    <input
                      type="tel"
                      value={guestPhone}
                      onChange={e => setGuestPhone(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="forge-admin-submit-btn"
                  disabled={slotAvailability.availableSeats < playersCount}
                >
                  <PlusCircle size={16} />
                  <span>BOOK OFFLINE WALK-IN (LOCK CENTRAL INVENTORY)</span>
                </button>
              </form>
            </div>

            {/* Recent transactions */}
            <div className="forge-admin-card">
              <span className="mono-badge">02 // REAL-TIME TRANSACTION LOG</span>
              <div className="admin-log-stack">
                {activeWalkins.map(b => (
                  <div key={b.id} className="admin-log-item">
                    <div className="log-top">
                      <code>{b.id}</code>
                      <span className="log-badge">COUNTER CONFIRMED</span>
                    </div>
                    <div className="log-details">
                      <span><strong>{b.itemName}</strong></span>
                      <span>•</span>
                      <span>{b.date} at {b.timeSlotText}</span>
                      <span>•</span>
                      <span>{b.playersCount} Players ({formatCurrency(b.totalAmount)})</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .forge-admin-root {
          min-height: 100vh;
          padding-top: var(--header-offset, 110px);
          color: var(--text-main);
        }

        .forge-header-section {
          padding: 3rem 0 2.5rem;
          border-bottom: 1px solid var(--border-subtle);
        }

        .forge-breadcrumbs {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-family: var(--font-mono);
          font-size: 0.75rem;
          color: var(--text-muted);
          margin-bottom: 1.5rem;
          letter-spacing: 0.05em;
        }

        .forge-breadcrumbs a {
          color: var(--text-muted);
          text-decoration: none;
        }

        .forge-breadcrumbs .current {
          color: var(--accent-cyan);
        }

        .forge-pill-tag {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.35rem 0.85rem;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--border-subtle);
          font-family: var(--font-mono);
          font-size: 0.7rem;
          color: var(--text-secondary);
          margin-bottom: 1.25rem;
          letter-spacing: 0.05em;
        }

        .pulse-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--accent-cyan);
          box-shadow: 0 0 10px var(--accent-cyan);
        }

        .forge-page-title {
          font-family: var(--font-display);
          font-size: clamp(2.2rem, 5vw, 3.8rem);
          font-weight: 800;
          line-height: 1.1;
          letter-spacing: -0.03em;
          color: var(--text-main);
          margin-bottom: 1rem;
        }

        .forge-page-desc {
          font-size: 1.05rem;
          line-height: 1.6;
          color: var(--text-secondary);
          max-width: 720px;
        }

        .forge-admin-body {
          padding: 3.5rem 0 6rem;
        }

        .forge-admin-grid {
          display: grid;
          grid-template-columns: 1.3fr 1fr;
          gap: 2.5rem;
          align-items: flex-start;
        }

        .forge-admin-card {
          background: var(--bg-surface);
          border: 1px solid var(--border-subtle);
          border-radius: 12px;
          padding: 2rem;
        }

        .mono-badge {
          font-family: var(--font-mono);
          font-size: 0.7rem;
          font-weight: 700;
          color: var(--text-muted);
          letter-spacing: 0.08em;
          display: block;
          margin-bottom: 1.5rem;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid var(--border-subtle);
        }

        .admin-form {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .admin-grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .admin-grid-3 {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 1rem;
        }

        .admin-field {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        .admin-field label {
          font-family: var(--font-mono);
          font-size: 0.65rem;
          font-weight: 700;
          color: var(--text-muted);
          letter-spacing: 0.05em;
        }

        .admin-field input,
        .admin-field select {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--border-subtle);
          border-radius: 6px;
          padding: 0.75rem 1rem;
          color: var(--text-main);
          font-size: 0.88rem;
          outline: none;
        }

        .admin-field input:focus,
        .admin-field select:focus {
          border-color: var(--accent-cyan);
        }

        .capacity-hud-box {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0.75rem;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid var(--border-subtle);
          border-radius: 8px;
          padding: 1rem;
          text-align: center;
        }

        .hud-lbl {
          font-family: var(--font-mono);
          font-size: 0.6rem;
          color: var(--text-muted);
          display: block;
          margin-bottom: 0.25rem;
        }

        .hud-val {
          font-family: var(--font-mono);
          font-size: 1.1rem;
          font-weight: 800;
          color: #ffffff;
        }

        .text-amber { color: #f59e0b; }
        .text-cyan { color: var(--accent-cyan); }
        .text-green { color: #34d399; }
        .text-red { color: #ef4444; }

        .forge-admin-submit-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 1rem;
          background: var(--text-main);
          color: var(--bg-deep);
          border: none;
          border-radius: 6px;
          font-family: var(--font-display);
          font-size: 0.84rem;
          font-weight: 800;
          letter-spacing: 0.04em;
          cursor: pointer;
          transition: transform 0.2s ease, opacity 0.2s ease;
          margin-top: 0.5rem;
        }

        .forge-admin-submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          opacity: 0.95;
        }

        .forge-admin-submit-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .admin-log-stack {
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
        }

        .admin-log-item {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid var(--border-subtle);
          border-radius: 6px;
          padding: 0.85rem 1rem;
        }

        .log-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.35rem;
        }

        .log-top code {
          font-family: var(--font-mono);
          font-size: 0.75rem;
          color: var(--accent-cyan);
          font-weight: 700;
        }

        .log-badge {
          font-family: var(--font-mono);
          font-size: 0.65rem;
          color: #34d399;
          background: rgba(52, 211, 153, 0.1);
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
        }

        .log-details {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.8rem;
          color: var(--text-secondary);
        }

        .alert-success-admin {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.85rem 1rem;
          background: rgba(52, 211, 153, 0.1);
          border: 1px solid rgba(52, 211, 153, 0.3);
          border-radius: 6px;
          font-size: 0.85rem;
          color: #34d399;
          margin-bottom: 1.25rem;
        }

        @media (max-width: 1024px) {
          .forge-admin-grid {
            grid-template-columns: 1fr;
          }
          .capacity-hud-box {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
    </div>
  );
};
