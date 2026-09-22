import React, { useState } from 'react';
import { useBooking } from '../../context/BookingContext';
import { useLocation } from '../../context/LocationContext';
import { gamesData } from '../../data/gamesData';
import { generateDailyTimeSlots, getTodayDateString, formatCurrency } from '../../utils/formatters';
import { 
  ShieldAlert, 
  UserCheck, 
  Zap, 
  X, 
  PlusCircle, 
  Radio, 
  RefreshCw,
  CheckCircle,
  Clock,
  Layers
} from 'lucide-react';

export const StaffWalkinPanel = () => {
  const { createStaffWalkinBooking, allBookings, slotHolds, checkSlotAvailability } = useBooking();
  const { currentBranch, branches } = useLocation();

  const [isOpen, setIsOpen] = useState(false);
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

  const activeWalkins = allBookings.filter(b => b.source === "OFFLINE_WALKIN").slice(0, 4);

  // Only render if explicitly opened via custom event or route
  if (!isOpen) {
    return null;
  }

  return (
    <>
        <div className="staff-panel-backdrop" onClick={() => setIsOpen(false)}>
          <div className="staff-panel-drawer" onClick={e => e.stopPropagation()}>
            <div className="staff-drawer-header">
              <div className="header-title">
                <div className="badge badge-magenta badge-live">CENTRAL INVENTORY ENGINE</div>
                <h3>Physical Counter POS Simulator</h3>
                <p>Simulate staff creating an in-person walk-in booking to verify instant live slot locking on the customer web platform.</p>
              </div>
              <button className="close-btn" onClick={() => setIsOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <div className="staff-drawer-content">
              {successNotice && (
                <div className="alert-success animate-fade">
                  <CheckCircle size={18} />
                  <span>{successNotice}</span>
                </div>
              )}

              {/* Booking Simulator Form */}
              <form onSubmit={handleCreateWalkin} className="walkin-form">
                <div className="form-row-2">
                  <div className="form-group">
                    <label className="form-label">Counter Branch</label>
                    <select
                      className="form-select"
                      value={selectedBranchId}
                      onChange={e => setSelectedBranchId(e.target.value)}
                    >
                      {branches.map(b => (
                        <option key={b.id} value={b.id}>{b.shortName}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Physical Attraction</label>
                    <select
                      className="form-select"
                      value={selectedGameId}
                      onChange={e => setSelectedGameId(e.target.value)}
                    >
                      {gamesData.map(g => (
                        <option key={g.id} value={g.id}>{g.name} ({formatCurrency(g.pricePerPerson)})</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-row-3">
                  <div className="form-group">
                    <label className="form-label">Date</label>
                    <input
                      type="date"
                      className="form-input"
                      value={selectedDate}
                      onChange={e => setSelectedDate(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Time Slot</label>
                    <select
                      className="form-select"
                      value={selectedSlot}
                      onChange={e => setSelectedSlot(e.target.value)}
                    >
                      {timeSlots.map(s => (
                        <option key={s.id} value={s.id}>{s.time}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Walk-in Players</label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      className="form-input"
                      value={playersCount}
                      onChange={e => setPlayersCount(e.target.value)}
                    />
                  </div>
                </div>

                {/* Real-time Inventory Snapshot Indicator */}
                <div className="live-status-box">
                  <div className="status-metric">
                    <span className="metric-label">Max Capacity</span>
                    <span className="metric-val">{slotAvailability.maxCapacity}</span>
                  </div>
                  <div className="status-metric">
                    <span className="metric-label">Confirmed (Online+Offline)</span>
                    <span className="metric-val text-amber">{slotAvailability.confirmedPlayers}</span>
                  </div>
                  <div className="status-metric">
                    <span className="metric-label">Held Online (5m hold)</span>
                    <span className="metric-val text-magenta">{slotAvailability.heldPlayers}</span>
                  </div>
                  <div className="status-metric">
                    <span className="metric-label">Available Right Now</span>
                    <span className={`metric-val ${slotAvailability.availableSeats > 0 ? 'text-cyan' : 'text-danger'}`}>
                      {slotAvailability.availableSeats}
                    </span>
                  </div>
                </div>

                <div className="form-row-2">
                  <div className="form-group">
                    <label className="form-label">Guest Name</label>
                    <input
                      type="text"
                      className="form-input"
                      value={guestName}
                      onChange={e => setGuestName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Guest Phone</label>
                    <input
                      type="tel"
                      className="form-input"
                      value={guestPhone}
                      onChange={e => setGuestPhone(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-amber btn-full"
                  disabled={slotAvailability.availableSeats < playersCount}
                >
                  <PlusCircle size={18} />
                  Book Offline Walk-in (Lock Central Slot)
                </button>
              </form>

              {/* Recent Walk-in Log */}
              <div className="recent-walkins-section">
                <h4 className="sub-title">Recent Central Walk-in Transactions</h4>
                <div className="walkin-list">
                  {activeWalkins.map(b => (
                    <div key={b.id} className="walkin-item">
                      <div className="walkin-item-header">
                        <span className="walkin-id">{b.id}</span>
                        <span className="badge badge-emerald">Counter Confirmed</span>
                      </div>
                      <div className="walkin-details">
                        <span>{b.itemName}</span>
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
        </div>
      <style>{`
        .staff-desk-trigger-btn {
          position: fixed;
          bottom: 24px;
          right: 24px;
          background: #0d121c;
          border: 1px solid var(--border-cyan);
          color: var(--cyan-primary);
          padding: 0.6rem 1.1rem;
          border-radius: var(--radius-full);
          font-family: var(--font-mono);
          font-size: 0.78rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 0.6rem;
          cursor: pointer;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.7), 0 0 20px rgba(0, 240, 255, 0.2);
          z-index: 950;
          transition: all var(--transition-fast);
        }

        .staff-desk-trigger-btn:hover {
          background: var(--cyan-dim);
          transform: translateY(-2px);
          box-shadow: 0 10px 35px rgba(0, 240, 255, 0.4);
        }

        .pulse-indicator {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--cyan-primary);
          animation: pulse-dot 1.5s infinite;
        }

        .staff-panel-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(4, 6, 10, 0.85);
          backdrop-filter: blur(10px);
          z-index: 2500;
          display: flex;
          align-items: center;
          justify-content: flex-end;
        }

        .staff-panel-drawer {
          background: var(--bg-surface-1);
          border-left: 1px solid var(--border-medium);
          width: 100%;
          max-width: 580px;
          height: 100%;
          display: flex;
          flex-direction: column;
          box-shadow: var(--shadow-lg);
          animation: slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }

        .staff-drawer-header {
          padding: 1.75rem 2rem;
          border-bottom: 1px solid var(--border-light);
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          background: var(--bg-surface-2);
        }

        .staff-drawer-header h3 {
          font-size: 1.3rem;
          color: #ffffff;
          margin-top: 0.4rem;
        }

        .staff-drawer-header p {
          font-size: 0.85rem;
          color: var(--text-secondary);
          margin-top: 0.25rem;
        }

        .close-btn {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border-light);
          color: #ffffff;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .staff-drawer-content {
          padding: 2rem;
          overflow-y: auto;
          flex: 1;
        }

        .alert-success {
          background: rgba(0, 230, 118, 0.12);
          border: 1px solid rgba(0, 230, 118, 0.3);
          color: var(--emerald-primary);
          padding: 0.85rem 1.25rem;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 0.88rem;
          margin-bottom: 1.5rem;
        }

        .form-row-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .form-row-3 {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 1rem;
        }

        .live-status-box {
          background: var(--bg-surface-2);
          border: 1px solid var(--border-cyan);
          border-radius: var(--radius-md);
          padding: 1rem;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0.75rem;
          margin-bottom: 1.5rem;
          text-align: center;
        }

        .metric-label {
          display: block;
          font-family: var(--font-mono);
          font-size: 0.65rem;
          color: var(--text-muted);
          margin-bottom: 0.2rem;
        }

        .metric-val {
          font-family: var(--font-mono);
          font-size: 1.1rem;
          font-weight: 700;
          color: #ffffff;
        }

        .text-amber { color: var(--amber-primary); }
        .text-magenta { color: var(--magenta-primary); }
        .text-cyan { color: var(--cyan-primary); }
        .text-danger { color: #ff3333; }

        .recent-walkins-section {
          margin-top: 2.5rem;
          border-top: 1px solid var(--border-light);
          padding-top: 1.5rem;
        }

        .sub-title {
          font-family: var(--font-mono);
          font-size: 0.82rem;
          color: var(--text-muted);
          margin-bottom: 1rem;
        }

        .walkin-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .walkin-item {
          background: var(--bg-surface-2);
          border: 1px solid var(--border-light);
          border-radius: var(--radius-md);
          padding: 0.85rem 1rem;
        }

        .walkin-item-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.35rem;
        }

        .walkin-id {
          font-family: var(--font-mono);
          font-size: 0.8rem;
          font-weight: 700;
          color: #ffffff;
        }

        .walkin-details {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.8rem;
          color: var(--text-secondary);
        }

        @media (max-width: 600px) {
          .form-row-2, .form-row-3, .live-status-box {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
};
