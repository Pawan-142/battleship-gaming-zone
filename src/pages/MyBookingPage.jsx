import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';
import { QRCodeCard } from '../components/common/QRCodeCard';
import { formatCurrency, formatDateDisplay } from '../utils/formatters';
import { 
  Search, 
  Ticket, 
  MapPin, 
  Calendar, 
  Clock, 
  Users, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  Printer
} from 'lucide-react';

export const MyBookingPage = () => {
  const { lookupBooking, cancelBooking } = useBooking();

  const [bookingIdInput, setBookingIdInput] = useState('');
  const [phoneInput, setPhoneInput] = useState('');
  const [searchedBooking, setSearchedBooking] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [cancellationNotice, setCancellationNotice] = useState(null);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    setCancellationNotice(null);
    setShowCancelConfirm(false);
    setHasSearched(true);

    const found = lookupBooking(bookingIdInput, phoneInput);
    setSearchedBooking(found || null);
  };

  const handleCancelReservation = () => {
    if (!searchedBooking) return;
    const res = cancelBooking(searchedBooking.id, "Customer Portal Request");
    if (res.success) {
      setSearchedBooking(res.booking);
      setCancellationNotice(`Booking cancelled. Refund of ${formatCurrency(res.refundAmount)} processed per tier: "${res.refundTierDesc}".`);
      setShowCancelConfirm(false);
    }
  };

  return (
    <div className="my-booking-page-root">
      {/* Unified Page Header */}
      <section className="page-header-unified">
        <div className="container">
          <div className="unified-breadcrumbs">
            <Link to="/">HOME</Link> <span>/</span> <span className="curr">LOOKUP MY BOOKING</span>
          </div>
          <span className="section-tag">SELF-SERVICE PORTAL</span>
          <h1 className="page-hero-title">
            MANAGE / RETRIEVE <span className="gradient-text-cyan">MY PASS</span>
          </h1>
          <p className="page-hero-desc">
            Enter your Booking Reference ID (e.g. HD-HYD-948102) and registered mobile number to retrieve your QR Gate Pass or manage your reservation.
          </p>

          {/* Search Form Card */}
          <div className="glass-card lookup-form-unified">
            <form onSubmit={handleSearch} className="lookup-inputs-row">
              <div className="form-group mb-0">
                <label className="form-label">Booking Ref ID *</label>
                <input
                  type="text"
                  className="form-input font-mono"
                  placeholder="e.g. HD-HYD-948102"
                  value={bookingIdInput}
                  onChange={e => setBookingIdInput(e.target.value.toUpperCase())}
                  required
                />
              </div>

              <div className="form-group mb-0">
                <label className="form-label">Registered Mobile Number *</label>
                <input
                  type="tel"
                  className="form-input"
                  placeholder="e.g. 9876543210"
                  value={phoneInput}
                  onChange={e => setPhoneInput(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary btn-md">
                <Search size={16} />
                <span>FIND BOOKING</span>
              </button>
            </form>

            <div className="demo-chip-bar">
              <span>💡 Quick test demo ID:</span>
              <button 
                type="button" 
                className="chip-btn"
                onClick={() => {
                  setBookingIdInput('HD-HYD-948102');
                  setPhoneInput('9876543210');
                }}
              >
                HD-HYD-948102 (Ph: 9876543210)
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="section-padding">
        <div className="container" style={{ maxWidth: '960px' }}>
          {cancellationNotice && (
            <div className="alert-cancelled-box animate-fade">
              <CheckCircle2 size={18} />
              <span>{cancellationNotice}</span>
            </div>
          )}

          {hasSearched && !searchedBooking && (
            <div className="glass-card p-5 text-center">
              <AlertCircle size={44} className="icon-amber mx-auto mb-2" />
              <h3>No Matching Reservation Found</h3>
              <p>Please double-check your booking reference ID and 10-digit mobile number.</p>
            </div>
          )}

          {searchedBooking && (
            <div className="ticket-card-unified glass-card">
              <div className="qr-ticket-side">
                <div className={`status-pill ${searchedBooking.status === 'CONFIRMED' ? 'status-ok' : 'status-cancel'}`}>
                  {searchedBooking.status === 'CONFIRMED' ? (
                    <>
                      <CheckCircle2 size={14} />
                      <span>CONFIRMED PASS</span>
                    </>
                  ) : (
                    <>
                      <XCircle size={14} />
                      <span>CANCELLED</span>
                    </>
                  )}
                </div>

                {searchedBooking.status === 'CONFIRMED' ? (
                  <QRCodeCard
                    qrToken={searchedBooking.qrToken}
                    bookingId={searchedBooking.id}
                    customerName={searchedBooking.customer?.name}
                  />
                ) : (
                  <div className="pass-void-box">
                    <XCircle size={44} className="icon-magenta" />
                    <span>Pass Invalidated</span>
                  </div>
                )}
              </div>

              <div className="ticket-info-side">
                <div className="t-header-top">
                  <div>
                    <span className="lbl-micro">BOOKING ID</span>
                    <h2 className="ref-bold">{searchedBooking.id}</h2>
                  </div>
                  <span className="source-mini">{searchedBooking.source === 'OFFLINE_WALKIN' ? 'Desk Walk-in' : 'Online Web'}</span>
                </div>

                <div className="item-snippet-t">
                  <img src={searchedBooking.itemImage} alt={searchedBooking.itemName} className="item-thumb-t" />
                  <div>
                    <span className="lbl-micro">ATTRACTION</span>
                    <h3 className="name-t">{searchedBooking.itemName}</h3>
                  </div>
                </div>

                <div className="ticket-details-grid">
                  <div className="td-box">
                    <MapPin size={15} className="icon-cyan" />
                    <div>
                      <span className="lbl-micro">ARENA</span>
                      <strong>{searchedBooking.branchName}</strong>
                    </div>
                  </div>
                  <div className="td-box">
                    <Calendar size={15} className="icon-amber" />
                    <div>
                      <span className="lbl-micro">DATE</span>
                      <strong>{formatDateDisplay(searchedBooking.date)}</strong>
                    </div>
                  </div>
                  <div className="td-box">
                    <Clock size={15} className="icon-magenta" />
                    <div>
                      <span className="lbl-micro">SLOT</span>
                      <strong>{searchedBooking.timeSlotText}</strong>
                    </div>
                  </div>
                </div>

                <div className="fare-breakdown-box">
                  <div className="fare-row">
                    <span>Total Value:</span>
                    <span>{formatCurrency(searchedBooking.totalAmount)}</span>
                  </div>
                  <div className="fare-row text-emerald">
                    <span>Advance Paid:</span>
                    <strong>{formatCurrency(searchedBooking.advancePaid)}</strong>
                  </div>
                  <div className="fare-row advance-row">
                    <span>Balance Due at Venue Counter:</span>
                    <strong className="text-cyan">{formatCurrency(searchedBooking.balanceDue)}</strong>
                  </div>
                </div>

                {searchedBooking.status === 'CONFIRMED' && (
                  <div className="t-actions-row">
                    <button onClick={() => window.print()} className="btn btn-glass btn-sm">
                      <Printer size={14} /> Print Pass
                    </button>

                    {!showCancelConfirm ? (
                      <button
                        type="button"
                        onClick={() => setShowCancelConfirm(true)}
                        className="btn btn-glass btn-sm text-magenta"
                      >
                        Cancel Booking
                      </button>
                    ) : (
                      <div className="cancel-box-inline">
                        <span>Confirm cancellation? Tier rules apply.</span>
                        <div className="confirm-btns-group">
                          <button onClick={handleCancelReservation} className="btn btn-magenta btn-sm">
                            Yes, Cancel
                          </button>
                          <button onClick={() => setShowCancelConfirm(false)} className="btn btn-glass btn-sm">
                            No, Keep
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      <style>{`
        .lookup-form-unified {
          margin-top: 2rem;
          padding: 1.75rem;
        }

        .lookup-inputs-row {
          display: grid;
          grid-template-columns: 1fr 1fr auto;
          gap: 1.25rem;
          align-items: flex-end;
        }

        .demo-chip-bar {
          margin-top: 1rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.8rem;
          color: var(--text-muted);
        }

        .chip-btn {
          background: var(--bg-deep);
          border: 1px solid var(--border-cyan);
          color: var(--cyan-primary);
          font-family: var(--font-mono);
          font-size: 0.75rem;
          padding: 0.2rem 0.6rem;
          border-radius: var(--radius-xs);
          cursor: pointer;
        }

        .alert-cancelled-box {
          background: var(--emerald-dim);
          border: 1px solid rgba(0, 230, 118, 0.35);
          color: var(--emerald-primary);
          padding: 1rem 1.25rem;
          border-radius: var(--radius-xs);
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 2rem;
        }

        .status-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          font-family: var(--font-mono);
          font-size: 0.75rem;
          font-weight: 700;
          padding: 0.3rem 0.75rem;
          border-radius: var(--radius-xs);
        }

        .status-ok {
          background: var(--emerald-dim);
          color: var(--emerald-primary);
          border: 1px solid rgba(0, 230, 118, 0.35);
        }

        .status-cancel {
          background: var(--crimson-dim);
          color: var(--crimson-primary);
          border: 1px solid rgba(255, 16, 83, 0.35);
        }

        .pass-void-box {
          padding: 2.5rem 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          color: var(--text-muted);
        }

        .source-mini {
          font-family: var(--font-mono);
          font-size: 0.7rem;
          color: var(--text-muted);
        }

        .cancel-box-inline {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          background: var(--bg-deep);
          border: 1px solid var(--crimson-primary);
          padding: 0.5rem 0.75rem;
          border-radius: var(--radius-xs);
        }

        .confirm-btns-group {
          display: flex;
          gap: 0.35rem;
        }

        @media (max-width: 1024px) {
          .lookup-inputs-row { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
};
