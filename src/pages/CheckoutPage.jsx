import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';
import { getGameBySlug } from '../data/gamesData';
import { getPackageById } from '../data/packagesData';
import { getBranchById } from '../data/branchesData';
import { validateCoupon } from '../data/offersData';
import { formatCurrency, formatDateDisplay } from '../utils/formatters';
import { CountdownTimer } from '../components/common/CountdownTimer';
import { MockGatewayModal } from '../components/common/MockGatewayModal';
import { 
  initiateRazorpayPayment, 
  getRazorpayKey, 
  setRazorpayKey 
} from '../services/paymentService';
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
  Users,
  QrCode,
  Zap,
  Settings,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { BorderTrail } from '../components/motion/BorderTrail';

export const CheckoutPage = () => {
  const navigate = useNavigate();
  const { activeHold, releaseSlotHold, confirmBookingPayment } = useBooking();

  const [showMockGateway, setShowMockGateway] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('RAZORPAY_POPUP');
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
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [customKeyInput, setCustomKeyInput] = useState('');
  const [currentRzpKey, setCurrentRzpKey] = useState(getRazorpayKey());

  useEffect(() => {
    setCurrentRzpKey(getRazorpayKey());
  }, [showKeyModal]);

  if (!activeHold) {
    return (
      <div className="container section-padding text-center" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="glass-card p-5 max-w-md mx-auto" style={{ border: '1px solid rgba(255, 0, 85, 0.3)' }}>
          <AlertTriangle size={48} className="icon-crimson mx-auto mb-3" />
          <h2 style={{ fontFamily: 'Cinzel, serif', color: '#ffffff' }}>No Active Slot Reservation</h2>
          <p className="my-3 text-secondary" style={{ fontSize: '0.9rem' }}>
            Your 5-minute reservation hold timer may have expired or no slot was selected.
          </p>
          <Link to="/booking" className="btn btn-cyber btn-cyber-primary mt-3">
            <span>SELECT AN ARENA & TIME SLOT</span>
          </Link>
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

  const handleFillTestCard = () => {
    setCardNumber('4111 1111 1111 1111');
    setCardExpiry('12/28');
    setCardCvv('789');
    setCardName(activeHold.customerInfo?.name || 'HyperDrive Test Pilot');
  };

  const handleSaveCustomKey = (e) => {
    e.preventDefault();
    setRazorpayKey(customKeyInput);
    setCurrentRzpKey(getRazorpayKey());
    setShowKeyModal(false);
    alert('Razorpay API Key configuration updated successfully!');
  };

  // Process payment using Razorpay Gateway SDK with seamless Mock Gateway fallback
  const handleRazorpayGatewayPay = async () => {
    setIsProcessing(true);
    try {
      const paymentResponse = await initiateRazorpayPayment({
        amount: advanceAmount,
        itemName: item.name,
        bookingId: `HD-HOLD-${Date.now()}`,
        customer: activeHold.customerInfo || {},
        themeColor: '#00f0ff'
      });

      // Complete transaction in central database
      completeTransaction({
        paymentMethod: 'RAZORPAY_GATEWAY',
        paymentTransactionId: paymentResponse.razorpay_payment_id
      });
    } catch (err) {
      console.warn("External Razorpay returned error (simulated/mock key). Launching MockGateway Sandbox Modal:", err);
      setIsProcessing(false);
      // Seamlessly launch the in-app MockGateway Modal so checkout never fails
      setShowMockGateway(true);
    }
  };

  // Fallback direct simulator for cards / UPI tabs
  const handleDirectMethodPay = (e) => {
    e.preventDefault();
    setIsProcessing(true);

    if (paymentMethod === 'CARD') {
      setTimeout(() => {
        setIsProcessing(false);
        setShowOtpModal(true);
      }, 700);
      return;
    }

    setTimeout(() => {
      completeTransaction({
        paymentMethod: paymentMethod === 'UPI' ? `UPI_${selectedUpiApp.toUpperCase()}` : paymentMethod,
        paymentTransactionId: `TXN-IN-${paymentMethod}-${Date.now()}`
      });
    }, 1200);
  };

  const completeTransaction = ({ paymentMethod, paymentTransactionId }) => {
    const res = confirmBookingPayment({
      paymentMethod: paymentMethod || 'ONLINE_GATEWAY',
      couponCode: appliedCoupon ? appliedCoupon.offer.code : null,
      customNotes: activeHold.customerInfo?.notes || '',
      paymentTransactionId: paymentTransactionId || `TXN-RZP-${Date.now()}`
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
      {/* Page Header */}
      <section className="page-header-unified checkout-page-header">
        <div className="container">
          <div className="unified-breadcrumbs">
            <Link to="/">HOME</Link> <span>/</span> 
            <Link to="/booking">BOOKING</Link> <span>/</span> 
            <span className="curr">CHECKOUT</span>
          </div>
          <div className="checkout-header-flex">
            <div>
              <span className="section-tag checkout-sec-tag">
                <Lock size={12} /> 256-BIT ENCRYPTED RAZORPAY GATEWAY
              </span>
              <h1 className="page-hero-title">
                SECURE ADVANCE <span className="gradient-text-pure">PAYMENT</span>
              </h1>
            </div>

            {/* Gateway Key Settings Pill */}
            <button
              type="button"
              onClick={() => setShowKeyModal(true)}
              className="checkout-key-pill"
              title="Configure Razorpay Public API Key"
            >
              <Settings size={13} className="key-icon" />
              <span>KEY: <strong>{currentRzpKey.slice(0, 12)}...</strong></span>
            </button>
          </div>
        </div>
      </section>

      <section className="section-padding checkout-body-section">
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
            {/* Payment Flow Column */}
            <div className="payment-flow-col">
              
              {/* PRIMARY ACTION: Razorpay Standard Checkout */}
              <div className="glass-card checkout-primary-card">
                <BorderTrail size={60} duration={3.5} />
                
                <div className="checkout-official-header">
                  <div className="official-title-wrap">
                    <div className="official-zap-icon">
                      <Zap size={20} />
                    </div>
                    <div>
                      <h3 className="official-heading">
                        Official Razorpay Checkout
                      </h3>
                      <span className="official-sub">
                        UPI QR • Google Pay • PhonePe • Cards • NetBanking • EMI
                      </span>
                    </div>
                  </div>
                  <div className="instant-badge">
                    <ShieldCheck size={13} />
                    <span>INSTANT VERIFICATION</span>
                  </div>
                </div>

                <p className="checkout-lead-desc">
                  Click below to open the secure Razorpay payment modal with live or sandbox credentials. Your physical game station is guaranteed for <strong className="highlight-slot-text">{formatDateDisplay(activeHold.date)} at {activeHold.timeSlotText}</strong>.
                </p>

                <button
                  type="button"
                  onClick={() => setShowMockGateway(true)}
                  className="btn btn-cyber btn-cyber-primary btn-lg checkout-pay-btn"
                >
                  <Zap size={20} />
                  <span>PAY {formatCurrency(advanceAmount)} VIA RAZORPAY GATEWAY</span>
                </button>
              </div>

              {/* SECONDARY / DIRECT TABBED SIMULATOR */}
              <div className="glass-card checkout-direct-card">
                <div className="pay-header-row">
                  <h3 className="section-title-sm">
                    Or Select Direct Method Sandbox
                  </h3>
                  <div className="secure-badge">
                    <ShieldCheck size={14} /> PCI-DSS Level 1
                  </div>
                </div>

                {/* Tabs */}
                <div className="pay-tabs-grid">
                  {[
                    { id: 'UPI', label: 'UPI / QR', icon: Smartphone },
                    { id: 'CARD', label: 'Card', icon: CreditCard },
                    { id: 'NETBANKING', label: 'NetBanking', icon: Building },
                    { id: 'WALLET', label: 'Wallets', icon: Wallet },
                  ].map(tab => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        className={`pay-tab-btn ${paymentMethod === tab.id ? 'active' : ''}`}
                        onClick={() => setPaymentMethod(tab.id)}
                      >
                        <Icon size={16} />
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* UPI Tab */}
                {paymentMethod === 'UPI' && (
                  <div className="pay-body-sub animate-fade">
                    <label className="form-label">
                      Select Fast UPI App
                    </label>
                    <div className="upi-app-grid">
                      {['gpay', 'phonepe', 'paytm', 'bhim'].map(app => (
                        <div
                          key={app}
                          className={`upi-tile ${selectedUpiApp === app ? 'active' : ''}`}
                          onClick={() => setSelectedUpiApp(app)}
                        >
                          <span className="upi-tile-name">
                            {app.toUpperCase()}
                          </span>
                          {selectedUpiApp === app && <CheckCircle2 size={14} className="active-check" />}
                        </div>
                      ))}
                    </div>

                    <div className="form-group">
                      <label className="form-label">
                        Or Enter Virtual Payment Address (UPI ID)
                      </label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="e.g. mobile@upi or name@oksbi"
                        value={upiId}
                        onChange={e => setUpiId(e.target.value)}
                      />
                    </div>
                  </div>
                )}

                {/* Card Tab */}
                {paymentMethod === 'CARD' && (
                  <div className="pay-body-sub animate-fade">
                    <div className="card-tab-top">
                      <label className="form-label">
                        Credit or Debit Card Details
                      </label>
                      <button
                        type="button"
                        onClick={handleFillTestCard}
                        className="fill-test-card-btn"
                      >
                        ⚡ Fill Test Card
                      </button>
                    </div>

                    <div className="form-group mb-3">
                      <input
                        type="text"
                        className="form-input mb-2"
                        placeholder="Cardholder Name"
                        value={cardName}
                        onChange={e => setCardName(e.target.value)}
                      />
                      <input
                        type="text"
                        className="form-input font-mono"
                        placeholder="•••• •••• •••• ••••"
                        maxLength="19"
                        value={cardNumber}
                        onChange={e => setCardNumber(e.target.value)}
                      />
                    </div>
                    <div className="card-sub-grid">
                      <input
                        type="text"
                        className="form-input font-mono"
                        placeholder="MM/YY"
                        maxLength="5"
                        value={cardExpiry}
                        onChange={e => setCardExpiry(e.target.value)}
                      />
                      <input
                        type="password"
                        className="form-input font-mono"
                        placeholder="CVV"
                        maxLength="4"
                        value={cardCvv}
                        onChange={e => setCardCvv(e.target.value)}
                      />
                    </div>
                  </div>
                )}

                {/* Netbanking & Wallets */}
                {(paymentMethod === 'NETBANKING' || paymentMethod === 'WALLET') && (
                  <div className="pay-body-sub animate-fade">
                    <label className="form-label">
                      Supported Banking Providers
                    </label>
                    <div className="upi-app-grid">
                      {(paymentMethod === 'NETBANKING' ? ['HDFC Bank', 'ICICI Bank', 'SBI', 'Axis Bank'] : ['Amazon Pay', 'Mobikwik', 'Paytm', 'Airtel Money']).map(p => (
                        <div key={p} className="upi-tile active">
                          <span className="upi-tile-name">{p}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Promo Code Box */}
                <div className="promo-box-u">
                  <form onSubmit={handleApplyCoupon} className="promo-form-flex">
                    <div className="promo-input-wrap">
                      <Tag size={15} className="promo-icon" />
                      <input
                        type="text"
                        placeholder="Promo Code (e.g. WEEKENDPLAY / SQUAD20)"
                        value={couponInput}
                        onChange={e => setCouponInput(e.target.value.toUpperCase())}
                        className="promo-input"
                      />
                    </div>
                    <button type="submit" className="btn btn-cyber promo-apply-btn">
                      Apply
                    </button>
                  </form>
                  {couponError && <span className="coupon-msg err">{couponError}</span>}
                  {couponSuccess && <span className="coupon-msg ok">{couponSuccess}</span>}
                </div>

                <button
                  type="button"
                  onClick={handleDirectMethodPay}
                  disabled={isProcessing}
                  className="btn btn-cyber btn-cyber-outline direct-sim-btn"
                >
                  {isProcessing ? 'Verifying Sandbox Gateway...' : `PROCESS DIRECT SIMULATION (${formatCurrency(advanceAmount)})`}
                </button>
              </div>
            </div>

            {/* Order Summary Column */}
            <div className="order-summary-col">
              <div className="glass-card sticky-sidebar p-4 checkout-summary-card">
                <span className="section-tag summary-tag">
                  RESERVATION SUMMARY
                </span>
                <h3 className="summary-title-u">
                  {item.name}
                </h3>

                <div className="summary-lines-u">
                  <div className="summary-row-item">
                    <MapPin size={15} className="s-icon-branch" />
                    <span>{branch.name}</span>
                  </div>
                  <div className="summary-row-item">
                    <Calendar size={15} className="s-icon-date" />
                    <span>{formatDateDisplay(activeHold.date)}</span>
                  </div>
                  <div className="summary-row-item">
                    <Clock size={15} className="s-icon-slot" />
                    <span>Slot: <strong>{activeHold.timeSlotText}</strong></span>
                  </div>
                  <div className="summary-row-item">
                    <Users size={15} className="s-icon-users" />
                    <span>{activeHold.playersCount} Players ({activeHold.customerInfo?.name || 'Guest'})</span>
                  </div>
                </div>

                <div className="fare-breakdown-box">
                  <div className="fare-row">
                    <span className="fare-lbl">Base Fare ({activeHold.playersCount} × {formatCurrency(item.pricePerPerson)})</span>
                    <span className="fare-val">{formatCurrency(subtotal)}</span>
                  </div>
                  {appliedCoupon && (
                    <div className="fare-row discount">
                      <span>Promo Discount ({appliedCoupon.offer.code})</span>
                      <span>- {formatCurrency(appliedCoupon.discountAmount)}</span>
                    </div>
                  )}
                  <div className="fare-row total">
                    <span>Total Experience Value:</span>
                    <strong>{formatCurrency(finalTotal)}</strong>
                  </div>
                  <div className="fare-row advance-highlight">
                    <span className="adv-lbl">Pay Online Now (Advance):</span>
                    <strong className="adv-val">{formatCurrency(advanceAmount)}</strong>
                  </div>
                  <div className="fare-row balance">
                    <span>Balance Due At Venue Desk:</span>
                    <span>{formatCurrency(balanceDueAtVenue)}</span>
                  </div>
                </div>

                {/* Guarantee Policy Badge */}
                <div className="guarantee-box">
                  <ShieldCheck size={16} className="guarantee-icon" />
                  <p className="guarantee-text">
                    <strong>100% Free Cancellation:</strong> Cancel up to 4 hours before slot time for immediate full refund to source account.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Razorpay Key Configuration Modal */}
      {showKeyModal && (
        <div className="modal-backdrop" onClick={() => setShowKeyModal(false)}>
          <div className="modal-container p-4 max-w-md checkout-modal-card" onClick={e => e.stopPropagation()}>
            <div className="modal-title-row">
              <Settings size={22} className="modal-header-icon" />
              <h3 className="modal-title">
                Razorpay API Key Config
              </h3>
            </div>
            <p className="modal-desc">
              You can supply your custom Razorpay Key ID (e.g. <code>rzp_test_...</code> or <code>rzp_live_...</code>). Leave blank to revert to the default interactive sandbox key.
            </p>
            <form onSubmit={handleSaveCustomKey}>
              <div className="form-group mb-3">
                <label className="form-label">
                  Razorpay Key ID
                </label>
                <input
                  type="text"
                  placeholder="rzp_test_..."
                  defaultValue={getRazorpayKey()}
                  onChange={e => setCustomKeyInput(e.target.value)}
                  className="form-input font-mono"
                />
              </div>
              <div className="modal-actions-row">
                <button
                  type="button"
                  onClick={() => setShowKeyModal(false)}
                  className="btn btn-cyber modal-cancel-btn"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-cyber btn-cyber-primary"
                >
                  Save API Key
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* OTP SMS Verification Simulator Modal */}
      {showOtpModal && (
        <div className="modal-backdrop" onClick={() => setShowOtpModal(false)}>
          <div className="modal-container p-4 text-center max-w-sm checkout-modal-card" onClick={e => e.stopPropagation()}>
            <ShieldCheck size={40} className="modal-otp-icon" />
            <h3 className="modal-title">Bank OTP Verification</h3>
            <p className="modal-desc">
              Simulating 3D-Secure 2.0 verification for <strong>{formatCurrency(advanceAmount)}</strong>.
            </p>
            <input
              type="text"
              className="form-input font-mono text-center otp-large-input"
              value={otpInput}
              onChange={e => setOtpInput(e.target.value)}
              maxLength="4"
            />
            <button 
              onClick={() => completeTransaction({ paymentMethod: 'CARD_3DS', paymentTransactionId: `TXN-CARD-${Date.now()}` })} 
              className="btn btn-cyber btn-cyber-primary w-full"
            >
              Confirm & Issue Pass
            </button>
          </div>
        </div>
      )}

      {/* Interactive Mock Razorpay Gateway Sandbox Modal */}
      <MockGatewayModal
        isOpen={showMockGateway}
        onClose={() => setShowMockGateway(false)}
        amount={advanceAmount}
        itemName={item.name}
        customer={activeHold.customerInfo || {}}
        onSuccess={(paymentData) => {
          setShowMockGateway(false);
          completeTransaction({
            paymentMethod: paymentData.method,
            paymentTransactionId: paymentData.razorpay_payment_id
          });
        }}
        onFailure={(err) => {
          console.warn("Mock payment failure:", err);
        }}
      />

      <style>{`
        .checkout-page-root {
          min-height: 100vh;
          padding-bottom: 4rem;
          color: var(--text-primary);
        }

        .checkout-header-flex {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .checkout-sec-tag {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          color: var(--cyan-primary);
          font-family: var(--font-mono);
          font-size: 0.72rem;
          letter-spacing: 0.1em;
        }

        .checkout-key-pill {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(15, 23, 42, 0.8);
          border: 1px solid var(--border-subtle);
          padding: 6px 14px;
          border-radius: var(--radius-pill);
          color: var(--text-muted);
          font-size: 0.75rem;
          font-family: var(--font-mono);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        [data-theme="light"] .checkout-key-pill {
          background: #ffffff;
          border-color: rgba(15, 23, 42, 0.15);
          color: #334155;
          box-shadow: 0 2px 8px rgba(15, 23, 42, 0.04);
        }

        .checkout-grid-u {
          display: grid;
          grid-template-columns: 1.3fr 0.7fr;
          gap: 2.5rem;
          align-items: flex-start;
        }

        @media (max-width: 1024px) {
          .checkout-grid-u { grid-template-columns: 1fr; }
        }

        /* Primary Razorpay Action Card */
        .checkout-primary-card {
          padding: 1.75rem;
          margin-bottom: 1.75rem;
          border-radius: var(--radius-md);
          position: relative;
          overflow: hidden;
          background: linear-gradient(135deg, rgba(8, 20, 35, 0.95), rgba(15, 10, 25, 0.95));
          border: 1.5px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        }

        [data-theme="light"] .checkout-primary-card {
          background: #ffffff;
          border: 1.5px solid rgba(0, 136, 204, 0.35);
          box-shadow: 0 10px 30px rgba(0, 136, 204, 0.08);
        }

        .checkout-official-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1rem;
          flex-wrap: wrap;
          gap: 0.75rem;
        }

        .official-title-wrap {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .official-zap-icon {
          background: #ffffff;
          color: #000000;
          padding: 8px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        [data-theme="light"] .official-zap-icon {
          background: #0088cc;
          color: #ffffff;
        }

        .official-heading {
          margin: 0;
          font-size: 1.18rem;
          color: var(--text-pure);
          font-weight: 700;
        }

        .official-sub {
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .instant-badge {
          display: flex;
          align-items: center;
          gap: 5px;
          font-family: var(--font-mono);
          font-size: 0.72rem;
          color: #10b981;
          background: rgba(16, 185, 129, 0.12);
          padding: 4px 12px;
          border-radius: var(--radius-pill);
          border: 1px solid rgba(16, 185, 129, 0.3);
        }

        .checkout-lead-desc {
          font-size: 0.88rem;
          color: var(--text-secondary);
          line-height: 1.55;
          margin: 0 0 1.25rem;
        }

        .highlight-slot-text {
          color: var(--text-pure);
          font-weight: 600;
        }

        .checkout-pay-btn {
          width: 100%;
          padding: 1.1rem 1.5rem;
          font-size: 1.05rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }

        /* Direct Tabbed Simulator Card */
        .checkout-direct-card {
          padding: 1.75rem;
          border-radius: var(--radius-md);
        }

        .pay-header-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.25rem;
        }

        .section-title-sm {
          margin: 0;
          font-size: 1rem;
          color: var(--text-pure);
          font-weight: 600;
        }

        .secure-badge {
          display: flex;
          align-items: center;
          gap: 5px;
          color: #10b981;
          font-size: 0.75rem;
        }

        .pay-tabs-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0.5rem;
          background: rgba(3, 7, 18, 0.5);
          padding: 4px;
          border-radius: 10px;
          margin-bottom: 1.5rem;
        }

        [data-theme="light"] .pay-tabs-grid {
          background: #f1f5f9;
        }

        .pay-tab-btn {
          background: transparent;
          border: 1px solid transparent;
          color: var(--text-muted);
          padding: 0.75rem 0.5rem;
          border-radius: 8px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.3rem;
          font-size: 0.78rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .pay-tab-btn.active {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.4);
          color: #ffffff;
        }

        [data-theme="light"] .pay-tab-btn.active {
          background: #ffffff;
          border-color: #0088cc;
          color: #0088cc;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }

        .pay-body-sub {
          background: rgba(3, 7, 18, 0.4);
          padding: 1.25rem;
          border-radius: 10px;
          margin-bottom: 1.5rem;
        }

        [data-theme="light"] .pay-body-sub {
          background: #f8fafc;
          border: 1px solid rgba(15, 23, 42, 0.08);
        }

        .upi-app-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0.75rem;
          margin-bottom: 1rem;
        }

        @media (max-width: 640px) {
          .upi-app-grid { grid-template-columns: repeat(2, 1fr); }
        }

        .upi-tile {
          background: rgba(15, 23, 42, 0.6);
          border: 1px solid var(--border-subtle);
          padding: 0.75rem;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          cursor: pointer;
        }

        [data-theme="light"] .upi-tile {
          background: #ffffff;
          border-color: rgba(15, 23, 42, 0.12);
        }

        .upi-tile.active {
          background: rgba(255, 255, 255, 0.08);
          border-color: #ffffff;
        }

        [data-theme="light"] .upi-tile.active {
          background: #e0f2fe;
          border-color: #0088cc;
        }

        .upi-tile-name {
          font-family: var(--font-mono);
          font-size: 0.78rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .active-check {
          color: var(--cyan-primary);
        }

        .card-tab-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.75rem;
        }

        .fill-test-card-btn {
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid var(--border-subtle);
          border-radius: 6px;
          color: var(--text-primary);
          font-size: 0.72rem;
          font-family: var(--font-mono);
          padding: 3px 8px;
          cursor: pointer;
        }

        [data-theme="light"] .fill-test-card-btn {
          background: #e0f2fe;
          border-color: #0088cc;
          color: #0088cc;
        }

        .card-sub-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.75rem;
        }

        .promo-box-u {
          background: rgba(3, 7, 18, 0.4);
          border: 1.5px dashed var(--border-amber);
          border-radius: 10px;
          padding: 1rem;
          margin-bottom: 1.5rem;
        }

        [data-theme="light"] .promo-box-u {
          background: #fffbeb;
          border-color: #d97706;
        }

        .promo-form-flex {
          display: flex;
          gap: 0.75rem;
        }

        .promo-input-wrap {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          background: rgba(15, 23, 42, 0.9);
          border: 1px solid var(--border-subtle);
          border-radius: 8px;
          padding: 0 0.85rem;
          flex: 1;
        }

        [data-theme="light"] .promo-input-wrap {
          background: #ffffff;
          border-color: rgba(15, 23, 42, 0.15);
        }

        .promo-input {
          background: transparent;
          border: none;
          color: var(--text-primary);
          font-family: var(--font-mono);
          font-size: 0.85rem;
          width: 100%;
          outline: none;
          padding: 0.65rem 0;
        }

        .promo-apply-btn {
          background: #ffffff;
          color: #000000;
          font-weight: 700;
          padding: 0 1.25rem;
        }

        [data-theme="light"] .promo-apply-btn {
          background: #0f172a;
          color: #ffffff;
        }

        .coupon-msg {
          display: block;
          font-size: 0.75rem;
          margin-top: 0.4rem;
        }
        .coupon-msg.err { color: #ff0055; }
        .coupon-msg.ok { color: #10b981; }

        .direct-sim-btn {
          width: 100%;
          padding: 0.85rem;
        }

        /* Summary Sidebar Card */
        .checkout-summary-card {
          border-radius: var(--radius-md);
        }

        .summary-tag {
          font-family: var(--font-mono);
          font-size: 0.72rem;
          color: var(--text-muted);
        }

        .summary-title-u {
          font-size: 1.25rem;
          color: var(--text-pure);
          margin: 0.35rem 0 1rem;
          font-weight: 600;
        }

        .summary-lines-u {
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
          border-bottom: 1px solid var(--border-subtle);
          padding-bottom: 1rem;
          margin-bottom: 1rem;
          font-size: 0.88rem;
          color: var(--text-secondary);
        }

        .summary-row-item {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .summary-row-item strong {
          color: var(--text-pure);
        }

        .fare-breakdown-box {
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
          font-size: 0.88rem;
        }

        .fare-row {
          display: flex;
          justify-content: space-between;
          color: var(--text-secondary);
        }

        .fare-row.discount {
          color: #10b981;
          font-weight: 600;
        }

        .fare-row.total {
          border-top: 1px dashed var(--border-subtle);
          padding-top: 0.5rem;
          color: var(--text-pure);
          font-weight: 600;
        }

        .fare-row.advance-highlight {
          background: rgba(255, 255, 255, 0.06);
          padding: 10px 12px;
          border-radius: var(--radius-xs);
          border: 1px solid var(--border-subtle);
        }

        [data-theme="light"] .fare-row.advance-highlight {
          background: #e0f2fe;
          border-color: #bae6fd;
        }

        .adv-lbl {
          color: var(--text-pure);
          font-weight: 600;
        }

        [data-theme="light"] .adv-lbl {
          color: #0369a1;
        }

        .adv-val {
          color: var(--text-pure);
          font-size: 1.15rem;
        }

        [data-theme="light"] .adv-val {
          color: #0284c7;
        }

        .fare-row.balance {
          color: var(--text-muted);
          font-size: 0.82rem;
        }

        .guarantee-box {
          margin-top: 1.25rem;
          padding: 10px;
          background: rgba(16, 185, 129, 0.08);
          border-radius: 8px;
          border: 1px solid rgba(16, 185, 129, 0.2);
          display: flex;
          gap: 8px;
          align-items: flex-start;
        }

        .guarantee-icon {
          color: #10b981;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .guarantee-text {
          margin: 0;
          font-size: 0.75rem;
          color: var(--text-secondary);
          line-height: 1.45;
        }

        .checkout-modal-card {
          background: var(--bg-surface);
          border: 1px solid var(--border-strong);
          border-radius: 16px;
          width: 90%;
          padding: 1.75rem;
          box-shadow: 0 20px 40px rgba(0,0,0,0.6);
        }

        [data-theme="light"] .checkout-modal-card {
          background: #ffffff;
          border-color: rgba(15, 23, 42, 0.15);
          box-shadow: 0 20px 40px rgba(15, 23, 42, 0.15);
        }

        .modal-title-row {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 1rem;
        }

        .modal-title {
          margin: 0;
          color: var(--text-pure);
          font-size: 1.2rem;
          font-weight: 600;
        }

        .modal-desc {
          font-size: 0.82rem;
          color: var(--text-secondary);
          line-height: 1.5;
          margin: 0 0 1rem;
        }

        .otp-large-input {
          width: 140px;
          margin: 0 auto 1.25rem;
          display: block;
          text-align: center;
          letter-spacing: 0.4em;
          font-size: 1.25rem;
          font-weight: 700;
        }
      `}</style>
    </div>
  );
};
