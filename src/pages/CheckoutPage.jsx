import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';
import { getGameBySlug } from '../data/gamesData';
import { getPackageById } from '../data/packagesData';
import { getBranchById } from '../data/branchesData';
import { validateCoupon } from '../data/offersData';
import { formatCurrency, formatDateDisplay } from '../utils/formatters';
import { CountdownTimer } from '../components/common/CountdownTimer';
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

  // Process payment using Razorpay Gateway SDK
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
      console.warn("Payment flow interrupted or cancelled:", err);
      setIsProcessing(false);
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
    <div className="checkout-page-root" style={{ background: '#030508', color: '#EEEEEE', minHeight: '100vh', paddingBottom: '4rem' }}>
      {/* Page Header */}
      <section className="page-header-unified" style={{ padding: '2.5rem 0 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="container">
          <div className="unified-breadcrumbs" style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.75rem' }}>
            <Link to="/" style={{ color: '#00f0ff' }}>HOME</Link> <span style={{ margin: '0 6px' }}>/</span> 
            <Link to="/booking" style={{ color: '#00f0ff' }}>BOOKING</Link> <span style={{ margin: '0 6px' }}>/</span> 
            <span style={{ color: '#ffffff' }}>CHECKOUT</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span className="section-tag" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', color: '#00f0ff', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.72rem', letterSpacing: '0.1em' }}>
                <Lock size={12} /> 256-BIT ENCRYPTED RAZORPAY GATEWAY
              </span>
              <h1 className="page-hero-title" style={{ fontFamily: 'Cinzel, serif', fontSize: '2.2rem', margin: '0.35rem 0 0', fontWeight: 800 }}>
                SECURE ADVANCE <span style={{ color: '#00f0ff' }}>PAYMENT</span>
              </h1>
            </div>

            {/* Gateway Key Settings Pill */}
            <button
              type="button"
              onClick={() => setShowKeyModal(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(15, 23, 42, 0.8)',
                border: '1px solid rgba(0, 240, 255, 0.3)',
                padding: '6px 14px',
                borderRadius: '9999px',
                color: '#94a3b8',
                fontSize: '0.75rem',
                fontFamily: 'JetBrains Mono, monospace',
                cursor: 'pointer',
              }}
              title="Configure Razorpay Public API Key"
            >
              <Settings size={13} color="#00f0ff" />
              <span>KEY: <strong style={{ color: '#00f0ff' }}>{currentRzpKey.slice(0, 12)}...</strong></span>
            </button>
          </div>
        </div>
      </section>

      <section className="section-padding" style={{ paddingTop: '2rem' }}>
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
              <div className="glass-card p-4 mb-4" style={{ 
                background: 'linear-gradient(135deg, rgba(8, 20, 35, 0.95), rgba(15, 10, 25, 0.95))',
                border: '1.5px solid rgba(0, 240, 255, 0.4)',
                borderRadius: '16px',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: '0 10px 30px rgba(0, 240, 255, 0.1)'
              }}>
                <BorderTrail size={60} duration={3.5} />
                
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ background: '#00f0ff', color: '#000000', padding: '6px', borderRadius: '8px' }}>
                      <Zap size={20} />
                    </div>
                    <div>
                      <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#ffffff', fontWeight: 700 }}>
                        Official Razorpay Checkout
                      </h3>
                      <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                        UPI QR • Google Pay • PhonePe • Cards • NetBanking • EMI
                      </span>
                    </div>
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: '0.72rem',
                    color: '#10b981',
                    background: 'rgba(16, 185, 129, 0.15)',
                    padding: '4px 10px',
                    borderRadius: '9999px',
                    border: '1px solid rgba(16, 185, 129, 0.3)'
                  }}>
                    <ShieldCheck size={13} />
                    <span>INSTANT VERIFICATION</span>
                  </div>
                </div>

                <p style={{ fontSize: '0.85rem', color: '#cbd5e1', lineHeight: 1.5, margin: '0 0 1.25rem' }}>
                  Click below to open the secure Razorpay payment modal with live or sandbox credentials. Your physical game station is guaranteed for <strong>{formatDateDisplay(activeHold.date)} at {activeHold.timeSlotText}</strong>.
                </p>

                <button
                  type="button"
                  onClick={handleRazorpayGatewayPay}
                  disabled={isProcessing}
                  className="btn btn-cyber btn-cyber-primary btn-lg"
                  style={{
                    width: '100%',
                    padding: '1rem 1.5rem',
                    fontSize: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px'
                  }}
                >
                  <Lock size={18} />
                  <span>
                    {isProcessing ? 'INITIALIZING SECURE GATEWAY...' : `PAY ${formatCurrency(advanceAmount)} VIA RAZORPAY`}
                  </span>
                </button>
              </div>

              {/* SECONDARY / DIRECT TABBED SIMULATOR */}
              <div className="glass-card p-4" style={{ borderRadius: '16px', background: 'rgba(10, 15, 25, 0.8)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <div className="pay-header-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                  <h3 className="section-title-sm" style={{ margin: 0, fontSize: '1rem', color: '#ffffff' }}>
                    Or Select Direct Method Sandbox
                  </h3>
                  <div className="secure-badge" style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#10b981', fontSize: '0.75rem' }}>
                    <ShieldCheck size={14} /> PCI-DSS Level 1
                  </div>
                </div>

                {/* Tabs */}
                <div className="pay-tabs-grid" style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: '0.5rem',
                  background: 'rgba(3, 7, 18, 0.8)',
                  padding: '4px',
                  borderRadius: '10px',
                  marginBottom: '1.5rem'
                }}>
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
                        style={{
                          background: paymentMethod === tab.id ? 'rgba(0, 240, 255, 0.15)' : 'transparent',
                          border: paymentMethod === tab.id ? '1px solid #00f0ff' : '1px solid transparent',
                          color: paymentMethod === tab.id ? '#00f0ff' : '#94a3b8',
                          padding: '0.75rem 0.5rem',
                          borderRadius: '8px',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '0.3rem',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <Icon size={16} />
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* UPI Tab */}
                {paymentMethod === 'UPI' && (
                  <div className="pay-body-sub animate-fade" style={{ background: 'rgba(3, 7, 18, 0.6)', padding: '1.25rem', borderRadius: '10px', marginBottom: '1.5rem' }}>
                    <label className="form-label" style={{ display: 'block', fontSize: '0.78rem', color: '#94a3b8', marginBottom: '0.5rem' }}>
                      Select Fast UPI App
                    </label>
                    <div className="upi-app-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem', marginBottom: '1rem' }}>
                      {['gpay', 'phonepe', 'paytm', 'bhim'].map(app => (
                        <div
                          key={app}
                          className={`upi-tile ${selectedUpiApp === app ? 'active' : ''}`}
                          onClick={() => setSelectedUpiApp(app)}
                          style={{
                            background: selectedUpiApp === app ? 'rgba(0, 240, 255, 0.12)' : 'rgba(15, 23, 42, 0.6)',
                            border: `1px solid ${selectedUpiApp === app ? '#00f0ff' : 'rgba(255, 255, 255, 0.1)'}`,
                            padding: '0.75rem',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            cursor: 'pointer',
                          }}
                        >
                          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.78rem', fontWeight: 700, color: '#ffffff' }}>
                            {app.toUpperCase()}
                          </span>
                          {selectedUpiApp === app && <CheckCircle2 size={14} color="#00f0ff" />}
                        </div>
                      ))}
                    </div>

                    <div className="form-group">
                      <label className="form-label" style={{ display: 'block', fontSize: '0.78rem', color: '#94a3b8', marginBottom: '0.4rem' }}>
                        Or Enter Virtual Payment Address (UPI ID)
                      </label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="e.g. mobile@upi or name@oksbi"
                        value={upiId}
                        onChange={e => setUpiId(e.target.value)}
                        style={{
                          width: '100%',
                          background: 'rgba(15, 23, 42, 0.9)',
                          border: '1px solid rgba(255, 255, 255, 0.15)',
                          borderRadius: '8px',
                          padding: '0.75rem 1rem',
                          color: '#ffffff',
                          fontFamily: 'JetBrains Mono, monospace',
                          fontSize: '0.88rem'
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* Card Tab */}
                {paymentMethod === 'CARD' && (
                  <div className="pay-body-sub animate-fade" style={{ background: 'rgba(3, 7, 18, 0.6)', padding: '1.25rem', borderRadius: '10px', marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                      <label className="form-label" style={{ margin: 0, fontSize: '0.78rem', color: '#94a3b8' }}>
                        Credit or Debit Card Details
                      </label>
                      <button
                        type="button"
                        onClick={handleFillTestCard}
                        style={{
                          background: 'rgba(0, 240, 255, 0.1)',
                          border: '1px solid rgba(0, 240, 255, 0.3)',
                          borderRadius: '6px',
                          color: '#00f0ff',
                          fontSize: '0.72rem',
                          fontFamily: 'JetBrains Mono, monospace',
                          padding: '3px 8px',
                          cursor: 'pointer'
                        }}
                      >
                        ⚡ Fill Test Card
                      </button>
                    </div>

                    <div className="form-group mb-3">
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Cardholder Name"
                        value={cardName}
                        onChange={e => setCardName(e.target.value)}
                        style={{
                          width: '100%',
                          background: 'rgba(15, 23, 42, 0.9)',
                          border: '1px solid rgba(255, 255, 255, 0.15)',
                          borderRadius: '8px',
                          padding: '0.75rem 1rem',
                          color: '#ffffff',
                          fontSize: '0.88rem',
                          marginBottom: '0.75rem'
                        }}
                      />
                      <input
                        type="text"
                        className="form-input font-mono"
                        placeholder="•••• •••• •••• ••••"
                        maxLength="19"
                        value={cardNumber}
                        onChange={e => setCardNumber(e.target.value)}
                        style={{
                          width: '100%',
                          background: 'rgba(15, 23, 42, 0.9)',
                          border: '1px solid rgba(255, 255, 255, 0.15)',
                          borderRadius: '8px',
                          padding: '0.75rem 1rem',
                          color: '#ffffff',
                          fontFamily: 'JetBrains Mono, monospace',
                          fontSize: '0.88rem'
                        }}
                      />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                      <input
                        type="text"
                        className="form-input font-mono"
                        placeholder="MM/YY"
                        maxLength="5"
                        value={cardExpiry}
                        onChange={e => setCardExpiry(e.target.value)}
                        style={{
                          width: '100%',
                          background: 'rgba(15, 23, 42, 0.9)',
                          border: '1px solid rgba(255, 255, 255, 0.15)',
                          borderRadius: '8px',
                          padding: '0.75rem 1rem',
                          color: '#ffffff',
                          fontFamily: 'JetBrains Mono, monospace',
                          fontSize: '0.88rem'
                        }}
                      />
                      <input
                        type="password"
                        className="form-input font-mono"
                        placeholder="CVV"
                        maxLength="4"
                        value={cardCvv}
                        onChange={e => setCardCvv(e.target.value)}
                        style={{
                          width: '100%',
                          background: 'rgba(15, 23, 42, 0.9)',
                          border: '1px solid rgba(255, 255, 255, 0.15)',
                          borderRadius: '8px',
                          padding: '0.75rem 1rem',
                          color: '#ffffff',
                          fontFamily: 'JetBrains Mono, monospace',
                          fontSize: '0.88rem'
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* Netbanking & Wallets */}
                {(paymentMethod === 'NETBANKING' || paymentMethod === 'WALLET') && (
                  <div className="pay-body-sub animate-fade" style={{ background: 'rgba(3, 7, 18, 0.6)', padding: '1.25rem', borderRadius: '10px', marginBottom: '1.5rem' }}>
                    <label className="form-label" style={{ display: 'block', fontSize: '0.78rem', color: '#94a3b8', marginBottom: '0.5rem' }}>
                      Supported Banking Providers
                    </label>
                    <div className="upi-app-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem' }}>
                      {(paymentMethod === 'NETBANKING' ? ['HDFC Bank', 'ICICI Bank', 'SBI', 'Axis Bank'] : ['Amazon Pay', 'Mobikwik', 'Paytm', 'Airtel Money']).map(p => (
                        <div key={p} className="upi-tile active" style={{
                          background: 'rgba(15, 23, 42, 0.6)',
                          border: '1px solid rgba(255, 255, 255, 0.15)',
                          padding: '0.75rem',
                          borderRadius: '8px',
                          textAlign: 'center'
                        }}>
                          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#ffffff' }}>{p}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Promo Code Box */}
                <div className="promo-box-u" style={{
                  background: 'rgba(3, 7, 18, 0.5)',
                  border: '1.5px dashed rgba(245, 158, 11, 0.4)',
                  borderRadius: '10px',
                  padding: '1rem',
                  marginBottom: '1.5rem'
                }}>
                  <form onSubmit={handleApplyCoupon} style={{ display: 'flex', gap: '0.75rem' }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.6rem',
                      background: 'rgba(15, 23, 42, 0.9)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      borderRadius: '8px',
                      padding: '0 0.85rem',
                      flex: 1
                    }}>
                      <Tag size={15} color="#f59e0b" />
                      <input
                        type="text"
                        placeholder="Promo Code (e.g. WEEKENDPLAY / SQUAD20)"
                        value={couponInput}
                        onChange={e => setCouponInput(e.target.value.toUpperCase())}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: '#ffffff',
                          fontFamily: 'JetBrains Mono, monospace',
                          fontSize: '0.85rem',
                          width: '100%',
                          outline: 'none',
                          padding: '0.65rem 0'
                        }}
                      />
                    </div>
                    <button type="submit" className="btn btn-cyber" style={{ background: '#f59e0b', color: '#000000', fontWeight: 700, padding: '0 1.25rem' }}>
                      Apply
                    </button>
                  </form>
                  {couponError && <span style={{ display: 'block', fontSize: '0.75rem', color: '#ff0055', marginTop: '0.4rem' }}>{couponError}</span>}
                  {couponSuccess && <span style={{ display: 'block', fontSize: '0.75rem', color: '#10b981', marginTop: '0.4rem' }}>{couponSuccess}</span>}
                </div>

                <button
                  type="button"
                  onClick={handleDirectMethodPay}
                  disabled={isProcessing}
                  className="btn btn-cyber btn-cyber-outline"
                  style={{ width: '100%', padding: '0.85rem' }}
                >
                  {isProcessing ? 'Verifying Sandbox Gateway...' : `PROCESS DIRECT SIMULATION (${formatCurrency(advanceAmount)})`}
                </button>
              </div>
            </div>

            {/* Order Summary Column */}
            <div className="order-summary-col">
              <div className="glass-card sticky-sidebar p-4" style={{ borderRadius: '16px', background: 'rgba(10, 15, 25, 0.85)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <span className="section-tag" style={{ color: '#00f0ff', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.72rem' }}>
                  RESERVATION SUMMARY
                </span>
                <h3 className="summary-title-u" style={{ fontFamily: 'Cinzel, serif', fontSize: '1.25rem', color: '#ffffff', margin: '0.35rem 0 1rem' }}>
                  {item.name}
                </h3>

                <div className="summary-lines-u" style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '1rem', marginBottom: '1rem', fontSize: '0.85rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <MapPin size={15} color="#00f0ff" />
                    <span>{branch.name}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Calendar size={15} color="#f59e0b" />
                    <span>{formatDateDisplay(activeHold.date)}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Clock size={15} color="#ff0055" />
                    <span>Slot: <strong>{activeHold.timeSlotText}</strong></span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Users size={15} color="#10b981" />
                    <span>{activeHold.playersCount} Players ({activeHold.customerInfo?.name || 'Guest'})</span>
                  </div>
                </div>

                <div className="fare-breakdown-box" style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.85rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#94a3b8' }}>Base Fare ({activeHold.playersCount} × {formatCurrency(item.pricePerPerson)})</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  {appliedCoupon && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#10b981' }}>
                      <span>Promo Discount ({appliedCoupon.offer.code})</span>
                      <span>- {formatCurrency(appliedCoupon.discountAmount)}</span>
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px dashed rgba(255, 255, 255, 0.1)', paddingTop: '0.5rem' }}>
                    <span>Total Experience Value:</span>
                    <strong style={{ color: '#ffffff' }}>{formatCurrency(finalTotal)}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', background: 'rgba(0, 240, 255, 0.08)', padding: '8px', borderRadius: '6px' }}>
                    <span style={{ color: '#00f0ff', fontWeight: 600 }}>Pay Online Now (Advance):</span>
                    <strong style={{ color: '#00f0ff', fontSize: '1.05rem' }}>{formatCurrency(advanceAmount)}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8' }}>
                    <span>Balance Due At Venue Desk:</span>
                    <span>{formatCurrency(balanceDueAtVenue)}</span>
                  </div>
                </div>

                {/* Guarantee Policy Badge */}
                <div style={{ marginTop: '1.25rem', padding: '10px', background: 'rgba(16, 185, 129, 0.08)', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.2)', display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                  <ShieldCheck size={16} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <p style={{ margin: 0, fontSize: '0.72rem', color: '#94a3b8', lineHeight: 1.4 }}>
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
        <div className="modal-backdrop" style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.85)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          backdropFilter: 'blur(8px)'
        }}>
          <div className="modal-container p-4 max-w-md" style={{
            background: '#080c16',
            border: '1px solid rgba(0, 240, 255, 0.3)',
            borderRadius: '16px',
            width: '90%',
            maxWidth: '460px',
            padding: '1.5rem',
            boxShadow: '0 20px 40px rgba(0,0,0,0.8)'
          }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
              <Settings size={22} color="#00f0ff" />
              <h3 style={{ margin: 0, color: '#ffffff', fontSize: '1.2rem', fontFamily: 'Cinzel, serif' }}>
                Razorpay API Key Config
              </h3>
            </div>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8', lineHeight: 1.5, margin: '0 0 1rem' }}>
              You can supply your custom Razorpay Key ID (e.g. <code>rzp_test_...</code> or <code>rzp_live_...</code>). Leave blank to revert to the default interactive sandbox key.
            </p>
            <form onSubmit={handleSaveCustomKey}>
              <div className="form-group mb-3">
                <label className="form-label" style={{ display: 'block', fontSize: '0.75rem', color: '#cbd5e1', marginBottom: '0.35rem' }}>
                  Razorpay Key ID
                </label>
                <input
                  type="text"
                  placeholder="rzp_test_..."
                  defaultValue={getRazorpayKey()}
                  onChange={e => setCustomKeyInput(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'rgba(15, 23, 42, 0.9)',
                    border: '1px solid rgba(0, 240, 255, 0.3)',
                    borderRadius: '8px',
                    padding: '0.75rem 1rem',
                    color: '#ffffff',
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: '0.85rem'
                  }}
                />
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setShowKeyModal(false)}
                  className="btn btn-cyber"
                  style={{ background: 'rgba(255,255,255,0.1)', color: '#ffffff' }}
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
        <div className="modal-backdrop" style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.85)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          backdropFilter: 'blur(8px)'
        }}>
          <div className="modal-container p-4 text-center max-w-sm" style={{
            background: '#080c16',
            border: '1px solid rgba(0, 240, 255, 0.4)',
            borderRadius: '16px',
            width: '90%',
            maxWidth: '380px',
            padding: '1.75rem',
            boxShadow: '0 20px 40px rgba(0,0,0,0.9)'
          }} onClick={e => e.stopPropagation()}>
            <ShieldCheck size={40} color="#00f0ff" style={{ margin: '0 auto 0.75rem' }} />
            <h3 style={{ color: '#ffffff', margin: '0 0 0.5rem', fontFamily: 'Cinzel, serif' }}>Bank OTP Verification</h3>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: '0 0 1rem' }}>
              Simulating 3D-Secure 2.0 verification for <strong>{formatCurrency(advanceAmount)}</strong>.
            </p>
            <input
              type="text"
              className="form-input font-mono text-center my-3"
              value={otpInput}
              onChange={e => setOtpInput(e.target.value)}
              maxLength="4"
              style={{
                width: '140px',
                margin: '0 auto 1.25rem',
                display: 'block',
                textAlign: 'center',
                letterSpacing: '0.4em',
                fontSize: '1.25rem',
                fontWeight: 700,
                background: 'rgba(15, 23, 42, 0.9)',
                border: '1.5px solid #00f0ff',
                borderRadius: '8px',
                padding: '0.5rem',
                color: '#00f0ff'
              }}
            />
            <button 
              onClick={() => completeTransaction({ paymentMethod: 'CARD_3DS', paymentTransactionId: `TXN-CARD-${Date.now()}` })} 
              className="btn btn-cyber btn-cyber-primary"
              style={{ width: '100%', padding: '0.75rem' }}
            >
              Confirm & Issue Pass
            </button>
          </div>
        </div>
      )}

      <style>{`
        .checkout-grid-u {
          display: grid;
          grid-template-columns: 1.3fr 0.7fr;
          gap: 2.5rem;
          align-items: flex-start;
        }
        @media (max-width: 1024px) {
          .checkout-grid-u { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
};
