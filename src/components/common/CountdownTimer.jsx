import { useState, useEffect } from 'react';
import { Clock, AlertTriangle } from 'lucide-react';

export const CountdownTimer = ({ expiresAt, onExpire }) => {
  const [timeLeft, setTimeLeft] = useState(() => {
    return Math.max(0, Math.floor((expiresAt - Date.now()) / 1000));
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const remaining = Math.max(0, Math.floor((expiresAt - Date.now()) / 1000));
      setTimeLeft(remaining);

      if (remaining <= 0) {
        clearInterval(timer);
        if (onExpire) onExpire();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [expiresAt, onExpire]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const isUrgent = timeLeft < 60;

  return (
    <div className={`countdown-container ${isUrgent ? 'urgent' : ''}`}>
      <div className="countdown-icon-wrap">
        {isUrgent ? <AlertTriangle className="animate-bounce" size={20} /> : <Clock size={20} />}
      </div>
      <div className="countdown-info">
        <span className="hold-title">TEMPORARY SLOT HOLD ACTIVE</span>
        <span className="hold-desc">
          This slot is held exclusively for you. Complete payment within:
        </span>
      </div>
      <div className="time-digits">
        <span className="digit-box">{String(minutes).padStart(2, '0')}</span>
        <span className="colon">:</span>
        <span className="digit-box">{String(seconds).padStart(2, '0')}</span>
      </div>

      <style>{`
        .countdown-container {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: var(--radius-sm);
          padding: 1rem 1.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1.25rem;
          margin-bottom: 1.5rem;
        }

        .countdown-container.urgent {
          background: rgba(255, 255, 255, 0.08);
          border-color: #ffffff;
        }

        .countdown-icon-wrap {
          color: #ffffff;
          display: flex;
          align-items: center;
        }

        .countdown-container.urgent .countdown-icon-wrap {
          color: #ffffff;
        }

        .countdown-info {
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .hold-title {
          font-family: var(--font-mono);
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          color: #ffffff;
        }

        .countdown-container.urgent .hold-title {
          color: #ffffff;
        }

        .hold-desc {
          font-size: 0.82rem;
          color: var(--text-secondary);
        }

        .time-digits {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-family: var(--font-mono);
          font-weight: 800;
          font-size: 1.4rem;
        }

        .digit-box {
          background: rgba(255, 255, 255, 0.08);
          color: #ffffff;
          padding: 0.25rem 0.5rem;
          border-radius: var(--radius-xs);
          border: 1px solid rgba(255, 255, 255, 0.2);
          min-width: 42px;
          text-align: center;
        }

        .colon {
          color: #ffffff;
        }

        [data-theme="light"] .countdown-container {
          background: #ffffff;
          border-color: rgba(15, 23, 42, 0.12);
          box-shadow: 0 4px 16px rgba(15, 23, 42, 0.04);
        }

        [data-theme="light"] .countdown-container.urgent {
          background: #fff1f2;
          border-color: #f43f5e;
        }

        [data-theme="light"] .countdown-icon-wrap {
          color: #0f172a;
        }

        [data-theme="light"] .countdown-container.urgent .countdown-icon-wrap {
          color: #e11d48;
        }

        [data-theme="light"] .hold-title {
          color: #0f172a;
        }

        [data-theme="light"] .countdown-container.urgent .hold-title {
          color: #be123c;
        }

        [data-theme="light"] .hold-desc {
          color: #475569;
        }

        [data-theme="light"] .digit-box {
          background: #0f172a;
          color: #ffffff;
          border-color: #0f172a;
        }

        [data-theme="light"] .colon {
          color: #0f172a;
        }

        @media (max-width: 640px) {
          .countdown-container {
            flex-direction: column;
            text-align: center;
          }
          .countdown-info {
            align-items: center;
          }
        }
      `}</style>
    </div>
  );
};
