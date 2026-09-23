import { useState } from 'react';
import { Check, ArrowRight, ShieldCheck } from 'lucide-react';
import './Battleship.css';

export const BattleshipBookingPanel = () => {
  const [selectedDuration, setSelectedDuration] = useState('10min');
  const [playerCount, setPlayerCount] = useState(4);
  const [selectedDate, setSelectedDate] = useState('today');
  const [selectedSlot, setSelectedSlot] = useState('18:30');
  const [isBooked, setIsBooked] = useState(false);
  const [bookingRef, setBookingRef] = useState('');

  const DURATION_OPTIONS = [
    {
      id: '10min',
      title: 'Sprint Heat',
      duration: '10 Minutes',
      pricePerPlayer: 399,
      badge: 'Popular',
      desc: 'High-intensity collision heat with dynamic obstacle lighting.'
    },
    {
      id: '20min',
      title: 'Grand Prix',
      duration: '20 Minutes',
      pricePerPlayer: 699,
      badge: 'Extended',
      desc: 'Two 10-minute heats with pit lane telemetry and collision score tracking.'
    },
    {
      id: '45min',
      title: 'Track Takeover',
      duration: '45 Minutes',
      pricePerPlayer: 1399,
      badge: 'Private',
      desc: 'Exclusive private arena reservation for your group and party lounge.'
    }
  ];

  const TIME_SLOTS = [
    { time: '16:00', label: '4:00 PM', status: 'available' },
    { time: '16:30', label: '4:30 PM', status: 'available' },
    { time: '17:15', label: '5:15 PM', status: 'filling_fast' },
    { time: '18:00', label: '6:00 PM', status: 'available' },
    { time: '18:30', label: '6:30 PM', status: 'filling_fast' },
    { time: '19:15', label: '7:15 PM', status: 'filling_fast' },
    { time: '20:00', label: '8:00 PM', status: 'available' },
    { time: '20:45', label: '8:45 PM', status: 'available' },
    { time: '21:30', label: '9:30 PM', status: 'available' },
  ];

  const currentDuration = DURATION_OPTIONS.find(d => d.id === selectedDuration) || DURATION_OPTIONS[0];
  const baseSubtotal = currentDuration.pricePerPlayer * playerCount;
  const taxesGst = Math.round(baseSubtotal * 0.18);
  const totalAmount = baseSubtotal + taxesGst;

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    const refId = `BS-${Math.floor(100000 + Math.random() * 900000)}`;
    setBookingRef(refId);
    setIsBooked(true);
  };

  return (
    <section id="booking" className="bs-section" style={{ backgroundColor: 'var(--bs-black)', borderTop: 'var(--border-subtle)' }}>
      <div className="bs-container">
        
        {/* Section Header */}
        <div style={{ maxWidth: '800px', marginBottom: '64px' }}>
          <span className="bs-section-tag">
            Track Reservation &bull; Hyderabad
          </span>
          <h2 className="bs-section-title">
            Reserve Your Session
          </h2>
          <p className="bs-section-desc" style={{ marginTop: '16px', maxWidth: '600px' }}>
            Step onto the 12,000 sq.ft mirror epoxy deck. Select your heat duration, rally your crew, and lock in your starting grid.
          </p>
        </div>

        {isBooked ? (
          /* Confirmation State */
          <div style={{ backgroundColor: 'var(--bs-bg-card)', border: '1px solid var(--bs-crimson)', padding: '54px', maxWidth: '720px', margin: '0 auto', textAlign: 'center' }}>
            <div style={{ width: '56px', height: '56px', backgroundColor: 'rgba(203, 41, 87, 0.15)', border: '1px solid var(--bs-crimson)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', color: 'var(--bs-crimson)' }}>
              <Check size={28} />
            </div>
            <div>
              <span className="bs-section-tag">
                Grid Reservation Confirmed
              </span>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '38px', fontStyle: 'italic', fontWeight: 300, color: 'var(--bs-white)', margin: '8px 0' }}>
                You're locked on the grid
              </h3>
              <p style={{ color: 'var(--bs-gray)', fontSize: '14px', maxWidth: '460px', margin: '0 auto', lineHeight: 1.6 }}>
                Your track reservation at Battleship Hyderabad has been secured. Present this digital pass at pit lane check-in.
              </p>
            </div>

            <div style={{ backgroundColor: 'var(--bs-black)', border: 'var(--border-subtle)', padding: '28px', maxWidth: '460px', margin: '32px auto 0', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '14px', fontFamily: 'var(--font-mono)', fontSize: '11px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: 'var(--border-subtle)' }}>
                <span style={{ color: 'var(--bs-gray-mute)' }}>BOOKING PASS REF</span>
                <span style={{ color: 'var(--bs-white)', fontWeight: 700 }}>{bookingRef}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: 'var(--border-subtle)' }}>
                <span style={{ color: 'var(--bs-gray-mute)' }}>EXPERIENCE</span>
                <span style={{ color: 'var(--bs-white)' }}>Dual-Motor Bumper Cars</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: 'var(--border-subtle)' }}>
                <span style={{ color: 'var(--bs-gray-mute)' }}>HEAT FORMAT</span>
                <span style={{ color: 'var(--bs-white)' }}>{currentDuration.title} ({currentDuration.duration})</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: 'var(--border-subtle)' }}>
                <span style={{ color: 'var(--bs-gray-mute)' }}>DRIVERS</span>
                <span style={{ color: 'var(--bs-white)' }}>{playerCount} Drivers</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: 'var(--border-subtle)' }}>
                <span style={{ color: 'var(--bs-gray-mute)' }}>TIME SLOT</span>
                <span style={{ color: 'var(--bs-crimson)', fontWeight: 700 }}>{TIME_SLOTS.find(s => s.time === selectedSlot)?.label}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '6px' }}>
                <span style={{ color: 'var(--bs-gray-mute)' }}>TOTAL PAID</span>
                <span style={{ color: 'var(--bs-white)', fontWeight: 700, fontSize: '15px' }}>₹{totalAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div style={{ marginTop: '36px', display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <button
                onClick={() => setIsBooked(false)}
                className="bs-btn-forge"
              >
                Book Another Heat
              </button>
              <a
                href="#location"
                className="bs-btn-forge-crimson"
              >
                <span>Get Venue Directions</span>
                <ArrowRight size={13} />
              </a>
            </div>
          </div>
        ) : (
          /* Main Interactive Booking Panel */
          <div className="bs-booking-grid">
            
            {/* Left Col: Selections */}
            <div>
              
              {/* 1. Duration Selection */}
              <div className="bs-booking-group">
                <label className="bs-group-label">01 &bull; Select Heat Duration</label>
                <div className="bs-duration-grid">
                  {DURATION_OPTIONS.map((opt) => {
                    const isSelected = selectedDuration === opt.id;
                    return (
                      <div
                        key={opt.id}
                        onClick={() => setSelectedDuration(opt.id)}
                        className={`bs-duration-card ${isSelected ? 'selected' : ''}`}
                      >
                        {opt.badge && (
                          <span className="bs-duration-badge">{opt.badge}</span>
                        )}
                        <div>
                          <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--bs-gray-mute)' }}>
                            {opt.duration}
                          </span>
                          <h4 className="bs-duration-title" style={{ marginTop: '6px' }}>
                            {opt.title}
                          </h4>
                          <p style={{ fontSize: '13px', lineHeight: 1.6, color: 'rgba(221,221,221,0.7)', marginTop: '8px', margin: 0 }}>
                            {opt.desc}
                          </p>
                        </div>
                        <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: 'var(--border-subtle)', display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                          <span className="bs-duration-price">₹{opt.pricePerPlayer}</span>
                          <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', color: 'var(--bs-gray-mute)' }}>/ driver</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 2. Number of Players */}
              <div className="bs-booking-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '14px' }}>
                  <label className="bs-group-label" style={{ margin: 0 }}>02 &bull; Number of Drivers / Cars</label>
                  <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', letterSpacing: '0.1em', color: 'var(--bs-gray-mute)' }}>Max 12 cars per heat</span>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '10px' }}>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => {
                    const isSelected = playerCount === num;
                    return (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setPlayerCount(num)}
                        className={`bs-slot-btn ${isSelected ? 'selected' : ''}`}
                        style={{ padding: '10px 0' }}
                      >
                        {num}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. Date Selection */}
              <div className="bs-booking-group">
                <label className="bs-group-label">03 &bull; Select Date</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
                  {[
                    { id: 'today', title: 'Tonight', date: 'Mon, 21 Sep' },
                    { id: 'tomorrow', title: 'Tomorrow', date: 'Tue, 22 Sep' },
                    { id: 'weekend', title: 'Weekend', date: 'Sat, 26 Sep' },
                  ].map((d) => {
                    const isSelected = selectedDate === d.id;
                    return (
                      <button
                        key={d.id}
                        type="button"
                        onClick={() => setSelectedDate(d.id)}
                        className={`bs-slot-btn ${isSelected ? 'selected' : ''}`}
                        style={{ textAlign: 'left', padding: '18px 20px' }}
                      >
                        <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', letterSpacing: '0.15em', textTransform: 'uppercase', opacity: 0.65, display: 'block' }}>
                          {d.title}
                        </span>
                        <span style={{ fontSize: '13px', fontWeight: 600, marginTop: '4px', display: 'block', color: isSelected ? 'var(--bs-white)' : 'var(--bs-white)' }}>
                          {d.date}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 4. Available Session Slots */}
              <div className="bs-booking-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '14px' }}>
                  <label className="bs-group-label" style={{ margin: 0 }}>04 &bull; Available Sessions</label>
                  <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--bs-crimson)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span className="bs-live-dot" style={{ width: '5px', height: '5px' }}></span>
                    Live Track Open
                  </span>
                </div>

                <div className="bs-slots-grid">
                  {TIME_SLOTS.map((slot) => {
                    const isSelected = selectedSlot === slot.time;
                    return (
                      <button
                        key={slot.time}
                        type="button"
                        onClick={() => setSelectedSlot(slot.time)}
                        className={`bs-slot-btn ${isSelected ? 'selected' : ''}`}
                      >
                        <span style={{ fontSize: '13px', fontWeight: 600, display: 'block' }}>{slot.label}</span>
                        {slot.status === 'filling_fast' && (
                          <span style={{ fontSize: '8px', textTransform: 'uppercase', fontFamily: 'var(--font-mono)', color: isSelected ? '#FFFFFF' : 'var(--bs-crimson)', marginTop: '4px', display: 'block' }}>
                            Filling Fast
                          </span>
                        )}
                        {slot.status === 'available' && (
                          <span style={{ fontSize: '8px', textTransform: 'uppercase', fontFamily: 'var(--font-mono)', opacity: 0.45, marginTop: '4px', display: 'block' }}>
                            Available
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Right Col: Real-world Session Summary Card */}
            <div>
              <div className="bs-summary-card">
                <div>
                  <span className="bs-section-tag" style={{ fontSize: '9px' }}>Session Breakdown</span>
                  <h3 className="bs-summary-title">
                    Battleship Grid
                  </h3>
                  <p style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--bs-gray-mute)', margin: '8px 0 0' }}>
                    Jubilee Hills, Hyderabad
                  </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', padding: '16px 0', borderTop: 'var(--border-subtle)', borderBottom: 'var(--border-subtle)' }}>
                  <div className="bs-summary-row">
                    <span>Experience</span>
                    <span style={{ color: 'var(--bs-white)', fontWeight: 500 }}>Bumper Cars</span>
                  </div>
                  <div className="bs-summary-row">
                    <span>Heat Format</span>
                    <span style={{ color: 'var(--bs-white)', fontWeight: 500 }}>{currentDuration.title}</span>
                  </div>
                  <div className="bs-summary-row">
                    <span>Drivers / Cars</span>
                    <span style={{ color: 'var(--bs-white)', fontWeight: 500 }}>{playerCount} Drivers</span>
                  </div>
                  <div className="bs-summary-row">
                    <span>Session Time</span>
                    <span style={{ color: 'var(--bs-crimson)', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>{TIME_SLOTS.find(s => s.time === selectedSlot)?.label}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div className="bs-summary-row">
                    <span>Base Fare ({playerCount} &times; ₹{currentDuration.pricePerPlayer})</span>
                    <span style={{ fontFamily: 'var(--font-mono)' }}>₹{baseSubtotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="bs-summary-row">
                    <span>GST (18%)</span>
                    <span style={{ fontFamily: 'var(--font-mono)' }}>₹{taxesGst.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="bs-summary-total">
                    <span style={{ fontSize: '12px', color: 'var(--bs-gray-mute)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Total Due</span>
                    <span className="bs-total-amount">₹{totalAmount.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <button
                  onClick={handleBookingSubmit}
                  className="bs-btn-forge-crimson"
                  style={{ width: '100%', padding: '16px', fontSize: '11px' }}
                >
                  <span>Reserve Track &bull; Instant Hold</span>
                  <ArrowRight size={13} />
                </button>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: 'var(--bs-gray-mute)' }}>
                  <ShieldCheck size={15} color="var(--bs-crimson)" style={{ flexShrink: 0 }} />
                  <span>Free cancellation up to 2 hours before heat start</span>
                </div>
              </div>
            </div>

          </div>
        )}

      </div>
    </section>
  );
};
