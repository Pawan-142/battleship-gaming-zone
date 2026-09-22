import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';
import { getGameBySlug } from '../data/gamesData';
import { getPackageById } from '../data/packagesData';
import { getBranchById } from '../data/branchesData';
import { validateCoupon } from '../data/offersData';
import { formatCurrency, formatDateDisplay } from '../utils/formatters';
import { CountdownTimer } from '../components/common/CountdownTimer';
import { 
  ShieldCheck, 
  Lock, 
  CreditCard, 
  Smartphone, 
  Building, 
  Wallet, 
  Tag, 
  CheckCircle2, 
  AlertTriangle,
  Info,
  MapPin,
  Calendar,
  Clock,
  Users
} from 'lucide-react';

export const CheckoutPage = () => {
  const navigate = useNavigate();
  const { activeHold, releaseSlotHold, confirmBookingPayment } = useBooking();

  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [upiId, setUpiId] = useState('');
  const [selectedUpiApp, setSelectedUpiApp] = useState('gpay');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardName, setCardName] = useState('');
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  const [isProcessing, setIsProcessing] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpInput, setOtpInput] = useState('4829');

  if (!activeHold) {
    return (
      <div className="container section-padding text-center">
        <div className="glass-card p-5 max-w-md mx-auto">
          <AlertTriangle size={48} className="icon-amber mx-auto mb-3" />
          <h2>No Active Slot Reservation</h2>
          <p className="my-3">Your 5-minute reservation timer may have expired or no slot was selected.</p>
          <Link to="/booking" className="btn btn-primary">Select an Arena & Slot</Link>
        </div>
      </div>
    );
  }

  const branch = getBranchById(activeHold.branchId);
  const item = activeHold.itemType === 'package' 
    ? getPackageById(activeHold.itemId) 
    : getGameBySlug(activeHold.itemId);

  const subtotal = item.pricePerPerson * activeHold.playersCount;
  const discountAmount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const finalTotal = Math.max(0, subtotal - discountAmount);

  let advanceAmount = Math.round((finalTotal * branch.advancePercent) / 100);
  advanceAmount = Math.max(branch.minAdvance * activeHold.playersCount, advanceAmount);
  advanceAmount = Math.min(advanceAmount, finalTotal);

  const balanceDueAtVenue = finalTotal - advanceAmount;

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    setCouponError('');
    setCouponSuccess('');

    const res = validateCoupon(couponInput, subtotal, activeHold.playersCount);
    if (!res.valid) {
      setCouponError(res.message);
      setAppliedCoupon(null);
    } else {
      setAppliedCoupon(res);
      setCouponSuccess(`Coupon ${res.offer.code} applied! Saved ${formatCurrency(res.discountAmount)}.`);
    }
  };

  const handlePayNow = (e) => {
    e.preventDefault();
    setIsProcessing(true);

    if (paymentMethod === 'CARD') {
      setTimeout(() => {
        setIsProcessing(false);
        setShowOtpModal(true);
      }, 900);
      return;
    }

    setTimeout(() => {
      completeTransaction();
    }, 1500);
  };

  const completeTransaction = () => {
    const res = confirmBookingPayment({
      paymentMethod: paymentMethod === 'CARD' ? 'DEBIT_CREDIT_CARD' : paymentMethod,
      couponCode: appliedCoupon ? appliedCoupon.offer.code : null,
      customNotes: activeHold.customerInfo?.notes || ''
    });

    setIsProcessing(false);
    setShowOtpModal(false);

    if (res.success) {
      navigate(`/confirmation?id=${res.booking.id}`);
    } else {
      alert(res.message);
    }
  };

  return (
    <div className="checkout-page-root">
      {/* Unified Page Header */}
      <section className="page-header-unified">
        <div className="container">
          <div className="unified-breadcrumbs">
            <Link to="/">HOME</Link> <span>/</span> <Link to="/booking">BOOKING</Link> <span>/</span> <span className="curr">CHECKOUT</span>
          </div>
          <span className="section-tag">256-BIT ENCRYPTED</span>
          <h1 className="page-hero-title">
            SECURE ADVANCE <span className="gradient-text-cyan">PAYMENT</span>
          </h1>
        </div>
      </section>

      <section className="section-padding">
        <div className="container">
          <CountdownTimer
            expiresAt={activeHold.expiresAt}
            onExpire={() => {
              alert('Your 5-minute slot hold has expired. The physical station has been released back to live inventory.');
              releaseSlotHold();
              navigate('/booking');
            }}
          />

          <div className="checkout-grid-u">
            {/* Payment Methods */}
            <div className="payment-flow-col">
              <div className="glass-card p-4">
                <div className="pay-header-row">
                  <h3 className="section-title-sm">Payment Gateway</h3>
                  <div className="secure-badge">
                    <Lock size={13} /> PCI-DSS Compliant
                  </div>
                </div>

                {/* Tabs */}
                <div className="pay-tabs-grid">
                  <button
                    type="button"
                    className={`pay-tab-btn ${paymentMethod === 'UPI' ? 'active' : ''}`}
                    onClick={() => setPaymentMethod('UPI')}
                  >
                    <Smartphone size={16} />
                    <span>Instant UPI</span>
                  </button>
                  <button
                    type="button"
                    className={`pay-tab-btn ${paymentMethod === 'CARD' ? 'active' : ''}`}
                    onClick={() => setPaymentMethod('CARD')}
                  >
                    <CreditCard size={16} />
                    <span>Card (Debit/Credit)</span>
                  </button>
                  <button
                    type="button"
                    className={`pay-tab-btn ${paymentMethod === 'NETBANKING' ? 'active' : ''}`}
                    onClick={() => setPaymentMethod('NETBANKING')}
                  >
                    <Building size={16} />
                    <span>Net Banking</span>
                  </button>
                  <button
                    type="button"
                    className={`pay-tab-btn ${paymentMethod === 'WALLET' ? 'active' : ''}`}
                    onClick={() => setPaymentMethod('WALLET')}
                  >
                    <Wallet size={16} />
                    <span>Wallets</span>
                  </button>
                </div>

                {/* UPI */}
                {paymentMethod === 'UPI' && (
                  <div className="pay-body-sub animate-fade">
                    <label className="form-label">Select Fast UPI App</label>
                    <div className="upi-app-grid">
                      {['gpay', 'phonepe', 'paytm', 'bhim'].map(app => (
                        <div
                          key={app}
                          className={`upi-tile ${selectedUpiApp === app ? 'active' : ''}`}
                          onClick={() => setSelectedUpiApp(app)}
                        >
                          <span className="app-title">{app.toUpperCase()}</span>
                          {selectedUpiApp === app && <CheckCircle2 size={14} className="icon-cyan" />}
                        </div>
                      ))}
                    </div>

                    <div className="form-group mt-3">
                      <label className="form-label">Or Enter UPI ID</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="e.g. mobile@upi / name@oksbi"
                        value={upiId}
                        onChange={e => setUpiId(e.target.value)}
                      />
                    </div>
                  </div>
                )}

                {/* Card */}
                {paymentMethod === 'CARD' && (
                  <div className="pay-body-sub animate-fade">
                    <div className="form-group">
                      <label className="form-label">Cardholder Name</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Name on card"
                        value={cardName}
                        onChange={e => setCardName(e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Card Number</label>
                      <input
                        type="text"
                        className="form-input font-mono"
                        placeholder="•••• •••• •••• ••••"
                        maxLength="19"
                        value={cardNumber}
                        onChange={e => setCardNumber(e.target.value)}
                      />
                    </div>
                    <div className="grid-2">
                      <div className="form-group">
                        <label className="form-label">Expiry (MM/YY)</label>
                        <input
                          type="text"
                          className="form-input font-mono"
                          placeholder="MM/YY"
                          maxLength="5"
                          value={cardExpiry}
                          onChange={e => setCardExpiry(e.target.value)}
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">CVV</label>
                        <input
                          type="password"
                          className="form-input font-mono"
                          placeholder="•••"
                          maxLength="4"
                          value={cardCvv}
                          onChange={e => setCardCvv(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Netbanking & Wallets */}
                {(paymentMethod === 'NETBANKING' || paymentMethod === 'WALLET') && (
                  <div className="pay-body-sub animate-fade">
                    <label className="form-label">Supported Providers</label>
                    <div className="upi-app-grid">
                      {(paymentMethod === 'NETBANKING' ? ['HDFC', 'ICICI', 'SBI', 'Axis'] : ['Amazon Pay', 'Mobikwik', 'Paytm', 'Airtel']).map(p => (
                        <div key={p} className="upi-tile active">
                          <span className="app-title">{p}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Promo Code */}
                <div className="promo-box-u">
                  <form onSubmit={handleApplyCoupon} className="promo-form-u">
                    <div className="promo-input-w">
                      <Tag size={15} className="icon-amber" />
                      <input
                        type="text"
                        placeholder="Promo Code (e.g. WEEKENDPLAY)"
                        value={couponInput}
                        onChange={e => setCouponInput(e.target.value.toUpperCase())}
                        className="p-input"
                      />
                    </div>
                    <button type="submit" className="btn btn-amber btn-sm">
                      Apply
                    </button>
                  </form>
                  {couponError && <span className="p-err">{couponError}</span>}
                  {couponSuccess && <span className="p-succ">{couponSuccess}</span>}
                </div>

                <button
                  type="button"
                  onClick={handlePayNow}
                  disabled={isProcessing}
                  className="btn btn-primary btn-lg btn-full mt-4"
                >
                  {isProcessing ? 'Verifying Gateway...' : `PAY ADVANCE ${formatCurrency(advanceAmount)} NOW`}
                </button>
              </div>
            </div>

            {/* Order Summary */}
            <div className="order-summary-col">
              <div className="glass-card sticky-sidebar p-4">
                <span className="section-tag">RESERVATION ORDER</span>
                <h3 className="summary-title-u">{item.name}</h3>

                <div className="summary-lines-u">
                  <div className="s-line">
                    <MapPin size={15} className="icon-cyan" />
                    <span>{branch.name}</span>
                  </div>
                  <div className="s-line">
                    <Calendar size={15} className="icon-amber" />
                    <span>{formatDateDisplay(activeHold.date)}</span>
                  </div>
                  <div className="s-line">
                    <Clock size={15} className="icon-magenta" />
                    <span>Slot: {activeHold.timeSlotText}</span>
                  </div>
                  <div className="s-line">
                    <Users size={15} className="icon-emerald" />
                    <span>{activeHold.playersCount} Players ({activeHold.customerInfo?.name})</span>
                  </div>
                </div>

                <div className="fare-breakdown-box">
                  <div className="fare-row">
                    <span>Base Fare ({activeHold.playersCount} × {formatCurrency(item.pricePerPerson)})</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  {appliedCoupon && (
                    <div className="fare-row text-emerald">
                      <span>Promo Discount ({appliedCoupon.offer.code})</span>
                      <span>- {formatCurrency(appliedCoupon.discountAmount)}</span>
                    </div>
                  )}
                  <div className="fare-row">
                    <span>Total Experience Value:</span>
                    <strong>{formatCurrency(finalTotal)}</strong>
                  </div>
                  <div className="fare-row advance-row">
                    <span>Pay Online (Advance Hold):</span>
                    <strong className="text-cyan">{formatCurrency(advanceAmount)}</strong>
                  </div>
                  <div className="fare-row">
                    <span>Remaining Balance at Desk:</span>
                    <span>{formatCurrency(balanceDueAtVenue)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* OTP Modal */}
      {showOtpModal && (
        <div className="modal-backdrop">
          <div className="modal-container p-4 text-center max-w-sm" onClick={e => e.stopPropagation()}>
            <ShieldCheck size={36} className="icon-cyan mx-auto mb-2" />
            <h3>Bank SMS Verification</h3>
            <p className="text-sm my-2">Simulating OTP verification for {formatCurrency(advanceAmount)}</p>
            <input
              type="text"
              className="form-input font-mono text-center my-3"
              value={otpInput}
              onChange={e => setOtpInput(e.target.value)}
              maxLength="4"
            />
            <button onClick={completeTransaction} className="btn btn-primary btn-full">
              Confirm & Issue Pass
            </button>
          </div>
        </div>
      )}

      <style>{`
        .checkout-grid-u {
          display: grid;
          grid-template-columns: 1.35fr 0.65fr;
          gap: 3rem;
          align-items: flex-start;
        }

        .pay-header-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.25rem;
        }

        .secure-badge {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          font-family: var(--font-mono);
          font-size: 0.72rem;
          color: var(--emerald-primary);
        }

        .pay-tabs-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0.5rem;
          background: var(--bg-deep);
          padding: 0.35rem;
          border-radius: var(--radius-xs);
          margin-bottom: 1.5rem;
        }

        .pay-tab-btn {
          background: transparent;
          border: none;
          color: var(--text-secondary);
          padding: 0.75rem 0.5rem;
          border-radius: var(--radius-xs);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.3rem;
          font-family: var(--font-display);
          font-size: 0.78rem;
          font-weight: 700;
          text-transform: uppercase;
          cursor: pointer;
        }

        .pay-tab-btn.active {
          background: var(--bg-elevated);
          color: var(--cyan-primary);
        }

        .pay-body-sub {
          background: var(--bg-deep);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-xs);
          padding: 1.25rem;
          margin-bottom: 1.5rem;
        }

        .upi-app-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0.75rem;
          margin-top: 0.5rem;
        }

        .upi-tile {
          background: var(--bg-elevated);
          border: 1px solid var(--border-subtle);
          padding: 0.75rem;
          border-radius: var(--radius-xs);
          display: flex;
          align-items: center;
          justify-content: space-between;
          cursor: pointer;
        }

        .upi-tile.active {
          border-color: var(--cyan-primary);
          background: var(--cyan-dim);
        }

        .app-title {
          font-family: var(--font-mono);
          font-size: 0.78rem;
          font-weight: 700;
          color: #ffffff;
        }

        .promo-box-u {
          background: var(--bg-deep);
          border: 1.5px dashed var(--border-amber);
          border-radius: var(--radius-xs);
          padding: 1rem;
          margin-bottom: 1.5rem;
        }

        .promo-form-u {
          display: flex;
          gap: 0.75rem;
        }

        .promo-input-w {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          background: var(--bg-card);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-xs);
          padding: 0 0.85rem;
          flex: 1;
        }

        .p-input {
          background: transparent;
          border: none;
          color: #ffffff;
          font-family: var(--font-mono);
          font-size: 0.9rem;
          width: 100%;
          outline: none;
        }

        .p-err {
          display: block;
          font-size: 0.75rem;
          color: var(--crimson-primary);
          margin-top: 0.4rem;
        }

        .p-succ {
          display: block;
          font-size: 0.75rem;
          color: var(--emerald-primary);
          margin-top: 0.4rem;
        }

        .summary-lines-u {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          font-size: 0.85rem;
          color: var(--text-secondary);
          border-bottom: 1px solid var(--border-subtle);
          padding-bottom: 1rem;
          margin-bottom: 1rem;
        }

        @media (max-width: 1024px) {
          .checkout-grid-u { grid-template-columns: 1fr; }
          .pay-tabs-grid, .upi-app-grid { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>
    </div>
  );
};
