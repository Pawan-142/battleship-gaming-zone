import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLocation } from '../context/LocationContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, 
  Phone, 
  Mail,
  Send, 
  CheckCircle2, 
  MessageSquare,
  Building2,
  Clock,
  ArrowUpRight,
  ShieldCheck,
  ChevronDown
} from 'lucide-react';
import { TextEffect } from '../components/motion/TextEffect';
import { BorderTrail } from '../components/motion/BorderTrail';

export const ContactPage = () => {
  const { branches } = useLocation();

  const [inquiryType, setInquiryType] = useState('general');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [branch, setBranch] = useState('hyd-hitech');
  const [guestCount, setGuestCount] = useState('10');
  const [preferredDate, setPreferredDate] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const inquiryTypes = [
    { id: 'general', label: 'General Inquiry' },
    { id: 'corporate', label: 'Corporate & Offsite' },
    { id: 'birthday', label: 'VIP Birthday & Suite' },
    { id: 'arena-takeover', label: 'Full Arena Takeover' }
  ];

  const faqs = [
    {
      q: 'Can we book the entire arena exclusively for private events?',
      a: 'Yes. Full arena takeovers include private access to all 7 attractions (Laser Tag, UV Bowling, Bumper Cars, VR Pods, Arcade), dedicated marshals, and optional bespoke catering. Please submit an enquiry with "Full Arena Takeover".'
    },
    {
      q: 'What is the advance booking and cancellation policy?',
      a: 'Online reservations require a nominal ₹100 per player deposit to lock the slot. 100% full refunds are guaranteed if cancelled 24 hours prior to the slot time.'
    },
    {
      q: 'Are food and beverages permitted in the VIP Lounge suites?',
      a: 'Yes. Our private Party Lounges and Corporate Suites feature dedicated dining zones, gourmet catering packages, and custom beverage service handled by our in-house culinary crew.'
    },
    {
      q: 'How fast will a concierge respond to inquiries?',
      a: 'During operating hours (11:00 AM – 11:30 PM IST), our Hyderabad event directors typically respond within 15 to 30 minutes via WhatsApp or direct phone call.'
    }
  ];

  return (
    <div className="forge-contact-root">
      {/* Editorial Luxury Hero Header */}
      <section className="forge-hero-section">
        <div className="container">
          <div className="forge-breadcrumb">
            <Link to="/">HYPERDRIVE</Link>
            <span className="sep">/</span>
            <span className="current">CONCIERGE & DESKS</span>
          </div>

          <div className="forge-hero-content">
            <div className="forge-pill-tag">
              <span className="pulse-dot"></span>
              <span>HYDERABAD ARENAS • DIRECT ACCESS</span>
            </div>

            <h1 className="forge-title">
              <TextEffect per="word" preset="fade-in-blur">
                Every session starts with a conversation.
              </TextEffect>
            </h1>

            <p className="forge-subtitle">
              Whether you are curating a high-stakes corporate championship, reserving private VIP party suites, or booking walk-in lanes, our arena concierges are at your service.
            </p>
          </div>
        </div>
      </section>

      {/* Main Luxury Split Section */}
      <section className="forge-main-section">
        <div className="container">
          <div className="forge-grid">
            
            {/* Left Column: Direct Studio & Arena Contacts */}
            <div className="forge-info-col">
              
              <div className="forge-card forge-direct-contact">
                <div className="card-header-bar">
                  <span className="mono-badge">01 // DIRECT DESKS</span>
                  <span className="status-live-chip">
                    <span className="dot-green"></span> OPEN DAILY 11:00 AM – 11:30 PM
                  </span>
                </div>

                <div className="arena-studios-list">
                  {branches.map((b, idx) => (
                    <div key={b.id} className="studio-card">
                      <div className="studio-top">
                        <div className="studio-meta">
                          <span className="studio-index">ARENA 0{idx + 1}</span>
                          <h3 className="studio-name">{b.name}</h3>
                        </div>
                        <a 
                          href={b.googleMapsUrl} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="studio-map-btn"
                          title="Open in Google Maps"
                        >
                          <ArrowUpRight size={16} />
                        </a>
                      </div>

                      <p className="studio-address">
                        <MapPin size={14} className="icon-gold" />
                        <span>{b.address}</span>
                      </p>

                      <div className="studio-specs">
                        <div className="spec-item">
                          <Clock size={13} />
                          <span>11:00 AM – 11:30 PM</span>
                        </div>
                        <div className="spec-item">
                          <ShieldCheck size={13} />
                          <span>Valet Parking & Diner</span>
                        </div>
                      </div>

                      <div className="studio-actions">
                        <a href={`tel:${b.phone}`} className="forge-action-link">
                          <Phone size={14} />
                          <span>{b.phone}</span>
                        </a>
                        <a 
                          href={`https://wa.me/${b.whatsapp.replace(/\D/g, '')}?text=Hi%20HyperDrive%20Team,%20I%20would%20like%20to%20inquire%20about%20booking%20slots.`} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="forge-action-link whatsapp-link"
                        >
                          <MessageSquare size={14} />
                          <span>WhatsApp Concierge</span>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Corporate & VIP Atelier Card */}
              <div className="forge-card forge-corp-banner">
                <div className="card-header-bar">
                  <span className="mono-badge">02 // VIP & CORPORATE TAKE-OVERS</span>
                </div>
                <div className="corp-body">
                  <Building2 size={24} className="icon-cyan-glow" />
                  <div>
                    <h4>Corporate Outings & Tournaments</h4>
                    <p>Custom catering menus, exclusive 2-tier laser tag tournaments, and dedicated arena marshals for 20 to 300+ guests.</p>
                    <div className="corp-contact-row">
                      <Mail size={14} />
                      <a href="mailto:corporate@hyperdrivearena.com">corporate@hyperdrivearena.com</a>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Column: Minimalist Bespoke Form */}
            <div className="forge-form-col">
              <div className="forge-card form-container-card">
                
                <div className="card-header-bar">
                  <span className="mono-badge">03 // TRANSMIT INQUIRY</span>
                  <span className="mono-dim">TYPICAL RESPONSE &lt; 15 MINS</span>
                </div>

                {submitted ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="forge-success-state"
                  >
                    <div className="success-icon-wrap">
                      <CheckCircle2 size={44} className="icon-green" />
                    </div>
                    <h2>Inquiry Received</h2>
                    <p className="success-name">Thank you, <strong>{name}</strong>.</p>
                    <p className="success-desc">
                      Our Hyderabad Arena Director has received your dispatch for <strong>{branch === 'hyd-hitech' ? 'Hitech City' : 'Gachibowli'}</strong>. We will contact you at <strong>{phone}</strong> within 15–30 minutes with slot allocations and tailored rates.
                    </p>
                    <div className="success-ticket">
                      <span>DISPATCH REF:</span>
                      <code>HYP-ENQ-{Math.floor(100000 + Math.random() * 900000)}</code>
                    </div>
                    <button 
                      onClick={() => setSubmitted(false)} 
                      className="forge-reset-btn"
                    >
                      SEND ANOTHER TRANSMISSION
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="forge-form">
                    
                    {/* Inquiry Category Pills */}
                    <div className="inquiry-pill-group">
                      {inquiryTypes.map(t => (
                        <button
                          key={t.id}
                          type="button"
                          className={`inquiry-pill ${inquiryType === t.id ? 'active' : ''}`}
                          onClick={() => setInquiryType(t.id)}
                        >
                          {t.label}
                        </button>
                      ))}
                    </div>

                    <div className="forge-form-grid">
                      <div className="forge-input-field">
                        <label>FULL NAME *</label>
                        <input
                          type="text"
                          placeholder="e.g. Arjun Reddy"
                          value={name}
                          onChange={e => setName(e.target.value)}
                          required
                        />
                      </div>

                      <div className="forge-input-field">
                        <label>CONTACT NUMBER (+91) *</label>
                        <input
                          type="tel"
                          placeholder="e.g. 98480 12345"
                          value={phone}
                          onChange={e => setPhone(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="forge-form-grid">
                      <div className="forge-input-field">
                        <label>WORK / PERSONAL EMAIL *</label>
                        <input
                          type="email"
                          placeholder="e.g. arjun@innovate.com"
                          value={email}
                          onChange={e => setEmail(e.target.value)}
                          required
                        />
                      </div>

                      <div className="forge-input-field">
                        <label>PREFERRED ARENA BRANCH</label>
                        <select
                          value={branch}
                          onChange={e => setBranch(e.target.value)}
                        >
                          {branches.map(b => (
                            <option key={b.id} value={b.id}>{b.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {inquiryType !== 'general' && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="forge-form-grid"
                      >
                        <div className="forge-input-field">
                          <label>ESTIMATED SQUAD SIZE</label>
                          <input
                            type="number"
                            min="5"
                            max="500"
                            placeholder="e.g. 25"
                            value={guestCount}
                            onChange={e => setGuestCount(e.target.value)}
                          />
                        </div>

                        <div className="forge-input-field">
                          <label>TARGET DATE</label>
                          <input
                            type="date"
                            value={preferredDate}
                            onChange={e => setPreferredDate(e.target.value)}
                          />
                        </div>
                      </motion.div>
                    )}

                    <div className="forge-input-field full-width">
                      <label>SPECIFIC REQUIREMENTS / GAME PREFERENCES *</label>
                      <textarea
                        rows="4"
                        placeholder="Tell us about the desired timing, specific attractions (Laser Tag, Bowling, VR), catering requirements, or corporate team requirements..."
                        value={message}
                        onChange={e => setMessage(e.target.value)}
                        required
                      />
                    </div>

                    <div className="submit-wrap">
                      <button type="submit" className="forge-submit-btn">
                        <BorderTrail size={40} />
                        <span>TRANSMIT INQUIRY</span>
                        <ArrowUpRight size={18} />
                      </button>
                      <span className="privacy-note">
                        Your details are strictly confidential and used solely for reservation coordination.
                      </span>
                    </div>

                  </form>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Minimalist FAQ Atelier Section */}
      <section className="forge-faq-section">
        <div className="container">
          <div className="faq-header">
            <span className="mono-badge">04 // FREQUENTLY ADDRESSED</span>
            <h2>Common Inquiries & Guidelines</h2>
          </div>

          <div className="forge-faq-list">
            {faqs.map((faq, idx) => (
              <div 
                key={idx} 
                className={`forge-faq-item ${activeFaq === idx ? 'open' : ''}`}
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
              >
                <div className="faq-question">
                  <span className="faq-num">0{idx + 1}</span>
                  <span className="faq-q-text">{faq.q}</span>
                  <ChevronDown size={18} className="faq-icon" />
                </div>
                <AnimatePresence>
                  {activeFaq === idx && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="faq-answer"
                    >
                      <p>{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        .forge-contact-root {
          min-height: 100vh;
          padding-top: var(--header-offset, 110px);
          color: var(--text-main);
        }

        .forge-hero-section {
          padding: 3rem 0 2rem;
          border-bottom: 1px solid var(--border-subtle);
        }

        .forge-breadcrumb {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-family: var(--font-mono);
          font-size: 0.75rem;
          color: var(--text-muted);
          margin-bottom: 2rem;
          letter-spacing: 0.05em;
        }

        .forge-breadcrumb a {
          color: var(--text-muted);
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .forge-breadcrumb a:hover {
          color: var(--text-main);
        }

        .forge-breadcrumb .current {
          color: #ffffff;
        }

        .forge-pill-tag {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.35rem 0.85rem;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.15);
          font-family: var(--font-mono);
          font-size: 0.7rem;
          color: #ffffff;
          margin-bottom: 1.25rem;
          letter-spacing: 0.05em;
        }

        .pulse-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #ffffff;
          box-shadow: 0 0 8px rgba(255, 255, 255, 0.8);
        }

        .forge-title {
          font-family: var(--font-display);
          font-size: clamp(2.4rem, 4.2vw, 3.8rem);
          font-weight: 300;
          line-height: 1.15;
          letter-spacing: -0.01em;
          color: #ffffff;
          max-width: 1300px;
          margin-bottom: 1.25rem;
        }

        .forge-subtitle {
          font-size: 1.05rem;
          line-height: 1.65;
          color: var(--text-secondary);
          max-width: 900px;
          font-weight: 300;
        }

        .forge-main-section {
          padding: 3.5rem 0 5rem;
        }

        .forge-grid {
          display: grid;
          grid-template-columns: 1fr 1.25fr;
          gap: 2.5rem;
          align-items: flex-start;
        }

        .forge-info-col {
          display: flex;
          flex-direction: column;
          gap: 1.75rem;
        }

        .forge-card {
          background: rgba(14, 19, 29, 0.5);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-sm);
          padding: 1.75rem;
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3);
        }

        .card-header-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.25rem;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        .mono-badge {
          font-family: var(--font-mono);
          font-size: 0.65rem;
          font-weight: 500;
          color: #94a3b8;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .mono-dim {
          font-family: var(--font-mono);
          font-size: 0.62rem;
          color: #64748b;
          letter-spacing: 0.08em;
        }

        .status-live-chip {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-family: var(--font-mono);
          font-size: 0.62rem;
          color: #94a3b8;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .dot-green {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #ffffff;
          box-shadow: 0 0 6px rgba(255, 255, 255, 0.8);
        }

        .arena-studios-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .studio-card {
          background: rgba(255, 255, 255, 0.015);
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: var(--radius-xs);
          padding: 1.15rem;
          transition: all 0.25s ease;
        }

        .studio-card:hover {
          border-color: rgba(255, 255, 255, 0.2);
          background: rgba(255, 255, 255, 0.03);
        }

        .studio-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 0.6rem;
        }

        .studio-index {
          font-family: var(--font-mono);
          font-size: 0.6rem;
          color: #94a3b8;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          display: block;
          margin-bottom: 0.2rem;
        }

        .studio-name {
          font-family: var(--font-display);
          font-size: 1.05rem;
          font-weight: 400;
          color: #ffffff;
        }

        .studio-map-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.04);
          color: #ffffff;
          border: 1px solid rgba(255, 255, 255, 0.12);
          transition: all 0.2s ease;
        }

        .studio-map-btn:hover {
          background: #ffffff;
          color: #07090d;
          border-color: #ffffff;
        }

        .studio-address {
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
          font-size: 0.82rem;
          line-height: 1.5;
          color: #94a3b8;
          margin-bottom: 0.85rem;
          font-weight: 300;
        }

        .icon-gold {
          color: #ffffff;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .studio-specs {
          display: flex;
          gap: 1rem;
          font-family: var(--font-mono);
          font-size: 0.68rem;
          color: #64748b;
          margin-bottom: 0.85rem;
          padding-bottom: 0.65rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        }

        .spec-item {
          display: flex;
          align-items: center;
          gap: 0.35rem;
        }

        .studio-actions {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .forge-action-link {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.45rem 0.8rem;
          border-radius: var(--radius-pill);
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          font-family: var(--font-display);
          font-size: 0.72rem;
          letter-spacing: 0.06em;
          color: #ffffff;
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .forge-action-link:hover {
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(255, 255, 255, 0.3);
        }

        .whatsapp-link {
          color: #ffffff;
          border-color: rgba(255, 255, 255, 0.15);
        }

        .whatsapp-link:hover {
          background: rgba(255, 255, 255, 0.08);
          border-color: #ffffff;
        }

        .forge-corp-banner {
          background: rgba(255, 255, 255, 0.015);
        }

        .corp-body {
          display: flex;
          gap: 1.1rem;
          align-items: flex-start;
        }

        .icon-cyan-glow {
          color: #ffffff;
          flex-shrink: 0;
          margin-top: 3px;
        }

        .corp-body h4 {
          font-family: var(--font-display);
          font-size: 0.98rem;
          font-weight: 400;
          color: #ffffff;
          margin-bottom: 0.25rem;
        }

        .corp-body p {
          font-size: 0.8rem;
          line-height: 1.55;
          color: #94a3b8;
          margin-bottom: 0.65rem;
          font-weight: 300;
        }

        .corp-contact-row {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-family: var(--font-mono);
          font-size: 0.72rem;
          color: #ffffff;
        }

        .corp-contact-row a {
          color: inherit;
          text-decoration: none;
        }

        .corp-contact-row a:hover {
          text-decoration: underline;
        }

        /* Right Form Styling */
        .form-container-card {
          position: relative;
        }

        .inquiry-pill-group {
          display: flex;
          gap: 0.45rem;
          flex-wrap: wrap;
          margin-bottom: 1.5rem;
        }

        .inquiry-pill {
          padding: 0.45rem 0.85rem;
          border-radius: var(--radius-pill);
          border: 1px solid rgba(255, 255, 255, 0.12);
          background: rgba(255, 255, 255, 0.03);
          font-family: var(--font-mono);
          font-size: 0.68rem;
          font-weight: 500;
          letter-spacing: 0.06em;
          color: #cbd5e1;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .inquiry-pill:hover {
          color: #ffffff;
          border-color: rgba(255, 255, 255, 0.3);
          background: rgba(255, 255, 255, 0.06);
        }

        .inquiry-pill.active {
          background: #ffffff;
          color: #07090d;
          border-color: #ffffff;
          font-weight: 600;
        }

        .forge-form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .forge-input-field {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }

        .forge-input-field.full-width {
          margin-bottom: 1.25rem;
        }

        .forge-input-field label {
          font-family: var(--font-mono);
          font-size: 0.62rem;
          font-weight: 500;
          color: var(--text-muted);
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .forge-input-field input,
        .forge-input-field select,
        .forge-input-field textarea {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: var(--radius-xs);
          padding: 0.75rem 0.9rem;
          font-family: var(--font-body);
          font-size: 0.85rem;
          color: #ffffff;
          outline: none;
          transition: all 0.2s ease;
        }

        .forge-input-field input:focus,
        .forge-input-field select:focus,
        .forge-input-field textarea:focus {
          border-color: rgba(255, 255, 255, 0.4);
          background: rgba(255, 255, 255, 0.05);
        }

        .forge-input-field select option {
          background: #0f1422;
          color: #fff;
        }

        .submit-wrap {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .forge-submit-btn {
          position: relative;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.65rem;
          padding: 0.85rem;
          background: #ffffff;
          color: #07090d;
          border: none;
          border-radius: var(--radius-pill);
          font-family: var(--font-display);
          font-size: 0.82rem;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          cursor: pointer;
          overflow: hidden;
          box-shadow: 0 4px 15px rgba(255, 255, 255, 0.08);
          transition: transform 0.2s ease, opacity 0.2s ease;
        }

        .forge-submit-btn:hover {
          transform: translateY(-2px);
          opacity: 0.95;
        }

        .privacy-note {
          font-size: 0.72rem;
          color: #64748b;
          text-align: center;
          font-weight: 300;
        }

        /* Success State */
        .forge-success-state {
          padding: 2.5rem 1.5rem;
          text-align: center;
        }

        .success-icon-wrap {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 72px;
          height: 72px;
          border-radius: 50%;
          background: rgba(16, 185, 129, 0.1);
          border: 1px solid rgba(16, 185, 129, 0.3);
          margin-bottom: 1.5rem;
        }

        .icon-green {
          color: #10b981;
        }

        .forge-success-state h2 {
          font-family: var(--font-display);
          font-size: 1.75rem;
          margin-bottom: 0.5rem;
        }

        .success-name {
          font-size: 1.05rem;
          color: var(--text-secondary);
          margin-bottom: 1rem;
        }

        .success-desc {
          font-size: 0.9rem;
          line-height: 1.6;
          color: var(--text-secondary);
          max-width: 480px;
          margin: 0 auto 1.5rem;
        }

        .success-ticket {
          display: inline-flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.6rem 1.25rem;
          border-radius: 6px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border-subtle);
          font-family: var(--font-mono);
          font-size: 0.8rem;
          margin-bottom: 2rem;
        }

        .success-ticket code {
          color: var(--accent-cyan);
          font-weight: 700;
        }

        .forge-reset-btn {
          display: inline-block;
          padding: 0.75rem 1.5rem;
          border-radius: 6px;
          border: 1px solid var(--border-subtle);
          background: transparent;
          color: var(--text-main);
          font-family: var(--font-mono);
          font-size: 0.78rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .forge-reset-btn:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        /* FAQ section */
        .forge-faq-section {
          padding: 4rem 0 6rem;
          border-top: 1px solid var(--border-subtle);
        }

        .faq-header {
          margin-bottom: 2.5rem;
        }

        .faq-header h2 {
          font-family: var(--font-display);
          font-size: clamp(1.75rem, 3vw, 2.5rem);
          font-weight: 800;
          margin-top: 0.5rem;
        }

        .forge-faq-list {
          display: flex;
          flex-direction: column;
          border-top: 1px solid var(--border-subtle);
        }

        .forge-faq-item {
          border-bottom: 1px solid var(--border-subtle);
          cursor: pointer;
          transition: background 0.2s ease;
        }

        .forge-faq-item:hover {
          background: rgba(255, 255, 255, 0.015);
        }

        .faq-question {
          display: flex;
          align-items: center;
          padding: 1.5rem 0;
          gap: 1.5rem;
        }

        .faq-num {
          font-family: var(--font-mono);
          font-size: 0.8rem;
          color: var(--accent-cyan);
        }

        .faq-q-text {
          flex: 1;
          font-family: var(--font-display);
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--text-main);
        }

        .faq-icon {
          color: var(--text-muted);
          transition: transform 0.3s ease;
        }

        .forge-faq-item.open .faq-icon {
          transform: rotate(180deg);
          color: var(--accent-cyan);
        }

        .faq-answer {
          overflow: hidden;
          padding-left: 3rem;
          padding-bottom: 1.5rem;
          max-width: 800px;
        }

        .faq-answer p {
          font-size: 0.92rem;
          line-height: 1.6;
          color: var(--text-secondary);
        }

        @media (max-width: 1024px) {
          .forge-grid {
            grid-template-columns: 1fr;
          }
          .forge-faq-item .faq-answer {
            padding-left: 0;
          }
        }

        @media (max-width: 640px) {
          .forge-form-grid {
            grid-template-columns: 1fr;
          }
          .faq-question {
            gap: 0.75rem;
          }
          .inquiry-pill {
            flex: 1;
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
};
