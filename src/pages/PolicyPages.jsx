import { Link } from 'react-router-dom';
import { cancellationPolicyTiers } from '../data/policiesData';

export const CancellationPolicyPage = () => {
  return (
    <div className="policy-page-root">
      {/* Unified Page Header */}
      <section className="page-header-unified">
        <div className="container">
          <div className="unified-breadcrumbs">
            <Link to="/">HOME</Link> <span>/</span> <span className="curr">CANCELLATION & REFUND POLICY</span>
          </div>
          <span className="section-tag">POLICY TRANSPARENCY</span>
          <h1 className="page-hero-title">
            CANCELLATION & <span className="gradient-text-cyan">REFUND POLICY</span>
          </h1>
          <p className="page-hero-desc">
            We provide clear, tiered cancellation guidelines for all online advance reservations.
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container" style={{ maxWidth: '900px' }}>
          <div className="glass-card p-4">
            <h2 className="mb-4">Advance Booking Refund Tiers</h2>
            <div className="tiers-stack">
              {cancellationPolicyTiers.map((tier, idx) => (
                <div key={idx} className="tier-box-u">
                  <div className="tier-h-row">
                    <span className="badge badge-cyan">{tier.badge}</span>
                    <strong className="tier-amt">{tier.refundText}</strong>
                  </div>
                  <h4 className="tier-win">{tier.timeWindow}</h4>
                  <p className="tier-desc">{tier.description}</p>
                </div>
              ))}
            </div>

            <h3 className="mt-5 mb-3">How Refunds are Processed</h3>
            <p className="policy-p">
              Approved refunds are credited back to the original payment source (UPI ID or Bank Card) within 3-5 banking days. Alternatively, you can opt for 100% instant Battleship arena wallet credit with 12 months validity.
            </p>

            <h3 className="mt-4 mb-3">Rescheduling Policy</h3>
            <p className="policy-p">
              Guests can reschedule their booked date and time slot free of charge up to 6 hours before the scheduled session by calling their respective branch desk or through the My Booking portal.
            </p>
          </div>
        </div>
      </section>

      <style>{`
        .tiers-stack {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .tier-box-u {
          background: var(--bg-card);
          border: 1px solid var(--border-subtle);
          padding: 1.25rem;
          border-radius: var(--radius-xs);
        }

        .tier-h-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.4rem;
        }

        .tier-amt {
          font-family: var(--font-mono);
          font-size: 1.05rem;
          color: var(--cyan-primary);
        }

        .tier-win {
          font-size: 1.05rem;
          color: var(--text-primary);
          margin-bottom: 0.2rem;
        }

        .tier-desc {
          font-size: 0.85rem;
          color: var(--text-secondary);
        }

        .policy-p {
          font-size: 0.92rem;
          line-height: 1.7;
          color: var(--text-secondary);
        }

        [data-theme="light"] .policy-page-root {
          background: #f8fafc;
          color: #0f172a;
        }

        [data-theme="light"] .tier-box-u {
          background: #ffffff;
          border-color: rgba(15, 23, 42, 0.1);
        }

        [data-theme="light"] .tier-win {
          color: #0f172a;
        }

        [data-theme="light"] .policy-p {
          color: #334155;
        }
      `}</style>
    </div>
  );
};

export const TermsPage = () => {
  return (
    <div className="policy-page-root">
      {/* Unified Page Header */}
      <section className="page-header-unified">
        <div className="container">
          <div className="unified-breadcrumbs">
            <Link to="/">HOME</Link> <span>/</span> <span className="curr">TERMS OF SERVICE</span>
          </div>
          <span className="section-tag">LEGAL AGREEMENT</span>
          <h1 className="page-hero-title">
            TERMS OF <span className="gradient-text-cyan">SERVICE</span>
          </h1>
          <p className="page-hero-desc">
            Terms and conditions governing arena entry, online booking reservations, and venue safety.
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container" style={{ maxWidth: '900px' }}>
          <div className="glass-card p-4">
            <h2 className="mb-2">1. Admission & Age Verification</h2>
            <p className="policy-p">
              Entry to physical attractions is subject to height and age requirements specified on each game page. Battleship marshals reserve the right to verify government/school ID if age compliance is in question.
            </p>

            <h2 className="mt-4 mb-2">2. Safety Compliance & Gear</h2>
            <p className="policy-p">
              Guests must strictly follow marshals' instructions and wear provided safety harnesses, eye-safe laser vests, and bowling shoes. Guests who deliberately endanger other players or violate safety protocols will be asked to leave without refund.
            </p>

            <h2 className="mt-4 mb-2">3. Advance Payments & Slot Holding</h2>
            <p className="policy-p">
              Online advance payments are required to secure physical station reservations. The balance amount must be settled at the venue counter prior to activity commencement.
            </p>

            <h2 className="mt-4 mb-2">4. Liability & Personal Belongings</h2>
            <p className="policy-p">
              Complimentary electronic lockers are provided for customer belongings. Battleship Gaming Zone accepts no responsibility for unsecured personal items.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export const PrivacyPolicyPage = () => {
  return (
    <div className="policy-page-root">
      {/* Unified Page Header */}
      <section className="page-header-unified">
        <div className="container">
          <div className="unified-breadcrumbs">
            <Link to="/">HOME</Link> <span>/</span> <span className="curr">PRIVACY POLICY</span>
          </div>
          <span className="section-tag">DATA PROTECTION</span>
          <h1 className="page-hero-title">
            PRIVACY <span className="gradient-text-cyan">POLICY</span>
          </h1>
          <p className="page-hero-desc">
            How Battleship Gaming Zone collects, protects, and handles your customer details.
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container" style={{ maxWidth: '900px' }}>
          <div className="glass-card p-4">
            <h2 className="mb-2">1. Information We Collect</h2>
            <p className="policy-p">
              When booking an experience, we collect your name, mobile phone number, email address, and payment transaction references. We never store raw debit/credit card numbers or CVVs on our servers.
            </p>

            <h2 className="mt-4 mb-2">2. How We Use Your Data</h2>
            <p className="policy-p">
              Your contact details are used strictly to issue digital QR gate passes, send booking confirmation SMS/WhatsApp notifications, provide directions, and process eligible refunds.
            </p>

            <h2 className="mt-4 mb-2">3. Payment Gateway Security</h2>
            <p className="policy-p">
              All online payments are processed through RBI-authorized, PCI-DSS compliant Indian payment gateways using 256-bit TLS encryption.
            </p>

            <h2 className="mt-4 mb-2">4. Zero Third-Party Data Selling</h2>
            <p className="policy-p">
              We do not sell, rent, or trade your personal information to third-party telemarketers.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
