import { useState } from 'react';
import { Link } from 'react-router-dom';
import { faqData, venueRules } from '../data/policiesData';
import { ChevronDown, ChevronUp, ShieldCheck, Calendar } from 'lucide-react';

export const FaqPage = () => {
  const [openIndex, setOpenIndex] = useState("0-0");

  const toggleAccordion = (key) => {
    setOpenIndex(openIndex === key ? null : key);
  };

  return (
    <div className="faq-page-root">
      {/* Unified Page Header */}
      <section className="page-header-unified">
        <div className="container">
          <div className="unified-breadcrumbs">
            <Link to="/">HOME</Link> <span>/</span> <span className="curr">FAQS & RULES</span>
          </div>
          <span className="section-tag">ANSWERS & GUIDELINES</span>
          <h1 className="page-hero-title">
            FREQUENTLY ASKED <span className="gradient-text-cyan">QUESTIONS</span>
          </h1>
          <p className="page-hero-desc">
            Everything you need to know about online advance booking, temporary slot holds, equipment safety, footwear rules, and venue entry.
          </p>
        </div>
      </section>

      {/* Main Grid */}
      <section className="section-padding">
        <div className="container">
          <div className="faq-unified-layout">
            <div className="faq-list-col">
              {faqData.map((cat, catIdx) => (
                <div key={cat.category} className="faq-cat-group mb-5">
                  <h3 className="cat-title-u">{cat.category}</h3>
                  <div className="faq-items-stack">
                    {cat.items.map((item, itemIdx) => {
                      const key = `${catIdx}-${itemIdx}`;
                      const isOpen = openIndex === key;
                      return (
                        <div key={itemIdx} className={`glass-card faq-card-u ${isOpen ? 'open' : ''}`}>
                          <button
                            className="faq-q-btn"
                            onClick={() => toggleAccordion(key)}
                          >
                            <span>{item.q}</span>
                            {isOpen ? <ChevronUp size={16} className="icon-cyan" /> : <ChevronDown size={16} />}
                          </button>
                          {isOpen && (
                            <div className="faq-a-body animate-fade">
                              <p>{item.a}</p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Sidebar Rules */}
            <div className="faq-rules-col">
              <div className="glass-card sticky-sidebar p-4">
                <span className="section-tag">VENUE REGULATIONS</span>
                <h3 className="mb-3">Rules of Engagement</h3>
                <ul className="rules-list-u">
                  {venueRules.map((rule, idx) => (
                    <li key={idx}>
                      <ShieldCheck size={16} className="icon-cyan flex-shrink-0" />
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>
                <Link to="/booking" className="btn btn-primary btn-full mt-3">
                  <Calendar size={16} />
                  <span>BOOK ARENA SLOT</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .faq-unified-layout {
          display: grid;
          grid-template-columns: 1.35fr 0.65fr;
          gap: 3.5rem;
          align-items: flex-start;
        }

        .cat-title-u {
          font-size: 1.35rem;
          color: var(--text-primary);
          margin-bottom: 1.25rem;
          border-left: 3px solid var(--cyan-primary);
          padding-left: 0.75rem;
        }

        .faq-items-stack {
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
        }

        .faq-card-u {
          padding: 0;
          overflow: hidden;
        }

        .faq-card-u.open {
          border-color: var(--cyan-primary);
        }

        .faq-q-btn {
          width: 100%;
          background: transparent;
          border: none;
          padding: 1.25rem 1.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          text-align: left;
          color: var(--text-primary);
          font-family: var(--font-display);
          font-size: 1rem;
          font-weight: 700;
          cursor: pointer;
          gap: 1rem;
        }

        .faq-a-body {
          padding: 0 1.5rem 1.5rem;
          font-size: 0.92rem;
          line-height: 1.6;
          color: var(--text-secondary);
          border-top: 1px solid var(--border-subtle);
          padding-top: 1rem;
        }

        .rules-list-u {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
        }

        .rules-list-u li {
          display: flex;
          align-items: flex-start;
          gap: 0.6rem;
          font-size: 0.82rem;
          line-height: 1.4;
          color: var(--text-secondary);
        }

        [data-theme="light"] .faq-page-root {
          background: #f8fafc;
          color: #0f172a;
        }

        [data-theme="light"] .cat-title-u {
          color: #0f172a;
        }

        [data-theme="light"] .faq-card-u {
          background: #ffffff;
          border-color: rgba(15, 23, 42, 0.1);
        }

        [data-theme="light"] .faq-q-btn {
          color: #0f172a;
        }

        [data-theme="light"] .faq-a-body {
          color: #334155;
          border-top-color: rgba(15, 23, 42, 0.08);
        }

        [data-theme="light"] .rules-list-u li {
          color: #334155;
        }

        @media (max-width: 1024px) {
          .faq-unified-layout { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
};
