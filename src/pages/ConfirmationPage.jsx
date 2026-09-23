import React, { useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';
import { QRCodeCard } from '../components/common/QRCodeCard';
import { formatCurrency, formatDateDisplay } from '../utils/formatters';
import confetti from 'canvas-confetti';
import { 
  CheckCircle2, 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  Share2, 
  Printer, 
  Ticket, 
  ShieldCheck 
} from 'lucide-react';

export const ConfirmationPage = () => {
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get('id');
  const { allBookings } = useBooking();

  const booking = allBookings.find(b => b.id === bookingId) || allBookings[0];

  useEffect(() => {
    try {
      confetti({
        particleCount: 50,
        spread: 50,
        origin: { y: 0.6 },
        colors: ['#ffffff', '#e2e8f0', '#94a3b8', '#cbd5e1']
      });
    } catch {
      // safe fallback
    }
  }, []);

  if (!booking) {
    return (
      <div className="container section-padding text-center">
        <h2>Booking Not Found</h2>
        <Link to="/booking" className="btn btn-primary mt-3">Start a New Reservation</Link>
      </div>
    );
  }

  const handleAddToCalendar = () => {
    const title = encodeURIComponent(`Battleship Gaming Zone: ${booking.itemName}`);
    const details = encodeURIComponent(`Booking Ref: ${booking.id}\nLocation: ${booking.branchName}\nPlayers: ${booking.playersCount}\nBalance at Desk: ${formatCurrency(booking.balanceDue)}`);
    const location = encodeURIComponent(booking.branchAddress);
    const googleCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}`;
    window.open(googleCalUrl, '_blank');
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(`Hey! I booked ${booking.itemName} at Battleship Gaming Zone (${booking.branchName}) for ${formatDateDisplay(booking.date)} at ${booking.timeSlotText}! Booking Ref: ${booking.id}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  return (
    <div className="confirmation-page-root">
      <section className="page-header-unified text-center">
        <div className="container">
          <div className="conf-icon-badge">
            <CheckCircle2 size={36} className="icon-cyan" />
          </div>
          <span className="section-tag">RESERVATION CONFIRMED</span>
          <h1 className="page-hero-title">YOU'RE READY TO PLAY!</h1>
          <p className="page-hero-desc mx-auto">
            Your physical station has been locked. Digital pass and receipt sent to <strong>{booking.customer?.phone}</strong>.
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container" style={{ maxWidth: '960px' }}>
          <div className="ticket-card-unified glass-card">
            {/* Left QR Side */}
            <div className="qr-ticket-side">
              <span className="badge badge-cyan">EXPRESS PASS</span>
              <QRCodeCard
                qrToken={booking.qrToken}
                bookingId={booking.id}
                customerName={booking.customer?.name}
              />
              <span className="qr-helper-t">Present this screen at the check-in desk</span>
            </div>

            {/* Right Ticket Info Side */}
            <div className="ticket-info-side">
              <div className="t-header-top">
                <div>
                  <span className="lbl-micro">RESERVATION REF</span>
                  <h2 className="ref-bold">{booking.id}</h2>
                </div>
                <span className="badge badge-emerald">Advance Confirmed</span>
              </div>

              <div className="item-snippet-t">
                <img src={booking.itemImage} alt={booking.itemName} className="item-thumb-t" />
                <div>
                  <span className="lbl-micro">ATTRACTION / PASS</span>
                  <h3 className="name-t">{booking.itemName}</h3>
                </div>
              </div>

              <div className="ticket-details-grid">
                <div className="td-box">
                  <MapPin size={15} className="icon-cyan" />
                  <div>
                    <span className="lbl-micro">ARENA</span>
                    <strong>{booking.branchName}</strong>
                  </div>
                </div>
                <div className="td-box">
                  <Calendar size={15} className="icon-amber" />
                  <div>
                    <span className="lbl-micro">DATE & SLOT</span>
                    <strong>{formatDateDisplay(booking.date)} • {booking.timeSlotText}</strong>
                  </div>
                </div>
                <div className="td-box">
                  <Users size={15} className="icon-emerald" />
                  <div>
                    <span className="lbl-micro">SQUAD</span>
                    <strong>{booking.playersCount} Players ({booking.customer?.name})</strong>
                  </div>
                </div>
              </div>

              <div className="fare-breakdown-box">
                <div className="fare-row">
                  <span>Total Booking Value:</span>
                  <span>{formatCurrency(booking.totalAmount)}</span>
                </div>
                <div className="fare-row text-emerald">
                  <span>Online Advance Paid:</span>
                  <strong>{formatCurrency(booking.advancePaid)} (Success)</strong>
                </div>
                <div className="fare-row advance-row">
                  <span>Balance Due at Venue Counter:</span>
                  <strong className="text-cyan">{formatCurrency(booking.balanceDue)}</strong>
                </div>
              </div>

              <div className="t-actions-row">
                <button onClick={() => window.print()} className="btn btn-glass btn-sm">
                  <Printer size={14} /> Print Pass
                </button>
                <button onClick={handleAddToCalendar} className="btn btn-glass btn-sm">
                  <Calendar size={14} /> Add to Calendar
                </button>
                <button onClick={handleShareWhatsApp} className="btn btn-glass btn-sm">
                  <Share2 size={14} /> WhatsApp
                </button>
                <Link to="/my-booking" className="btn btn-primary btn-sm flex-1">
                  <Ticket size={14} /> Manage Booking
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .conf-icon-badge {
          width: 64px;
          height: 64px;
          border-radius: var(--radius-xs);
          background: var(--cyan-dim);
          border: 1px solid var(--border-cyan);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.25rem;
        }

        .ticket-card-unified {
          display: grid;
          grid-template-columns: 320px 1fr;
          padding: 0;
          overflow: hidden;
          background: var(--bg-card);
        }

        .qr-ticket-side {
          background: #06090e;
          border-right: 1px dashed var(--border-subtle);
          padding: 2rem 1.5rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          text-align: center;
          color: #ffffff;
        }

        [data-theme="light"] .qr-ticket-side {
          background: #0b1120;
          color: #ffffff;
        }

        .qr-helper-t {
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        [data-theme="light"] .qr-helper-t {
          color: #94a3b8;
        }

        .ticket-info-side {
          padding: 2.25rem;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          background: var(--bg-card);
          color: var(--text-primary);
        }

        .t-header-top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
        }

        .lbl-micro {
          display: block;
          font-family: var(--font-mono);
          font-size: 0.65rem;
          color: var(--text-muted);
          text-transform: uppercase;
          font-weight: 700;
          letter-spacing: 0.05em;
        }

        .ref-bold {
          font-family: var(--font-mono);
          font-size: 1.5rem;
          color: var(--text-primary);
          font-weight: 800;
        }

        .item-snippet-t {
          background: var(--bg-surface-2);
          border: 1px solid var(--border-subtle);
          padding: 0.75rem 1rem;
          border-radius: var(--radius-xs);
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .item-thumb-t {
          width: 48px;
          height: 48px;
          border-radius: var(--radius-xs);
          object-fit: cover;
        }

        .name-t {
          font-size: 1.1rem;
          color: var(--text-primary);
          font-weight: 700;
          margin: 0;
        }

        .ticket-details-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.75rem;
        }

        .td-box {
          background: var(--bg-surface-2);
          border: 1px solid var(--border-subtle);
          padding: 0.85rem;
          border-radius: var(--radius-xs);
          display: flex;
          align-items: flex-start;
          gap: 0.6rem;
          font-size: 0.82rem;
          color: var(--text-primary);
        }

        .td-box strong {
          color: var(--text-primary);
          display: block;
          margin-top: 2px;
          font-weight: 700;
          line-height: 1.35;
        }

        .fare-breakdown-box {
          background: var(--bg-surface-2);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-xs);
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          font-size: 0.85rem;
        }

        .fare-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          color: var(--text-secondary);
        }

        .fare-row strong {
          color: var(--text-primary);
        }

        .t-actions-row {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          flex-wrap: wrap;
        }

        @media (max-width: 900px) {
          .ticket-card-unified { grid-template-columns: 1fr; }
          .qr-ticket-side { border-right: none; border-bottom: 1px dashed var(--border-subtle); }
          .ticket-details-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
};
