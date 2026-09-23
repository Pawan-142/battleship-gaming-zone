import React, { useEffect, useRef } from 'react';
import { Download, QrCode as QrIcon, CheckCircle2 } from 'lucide-react';

// Generates an interactive visual matrix code on HTML5 Canvas representing the ticket token
export const QRCodeCard = ({ qrToken, bookingId, customerName }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const size = 220;
    canvas.width = size;
    canvas.height = size;

    // Background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, size, size);

    // Deterministic pseudo-random matrix based on qrToken string
    const stringHash = (str) => {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        hash = (hash << 5) - hash + str.charCodeAt(i);
        hash |= 0;
      }
      return Math.abs(hash);
    };

    const hash = stringHash(qrToken || "BATTLESHIP-DEFAULT");
    const moduleCount = 25;
    const cellSize = size / moduleCount;

    ctx.fillStyle = '#0a0d14';

    // Corner target markers
    const drawFinderPattern = (startX, startY) => {
      ctx.fillRect(startX * cellSize, startY * cellSize, 7 * cellSize, 7 * cellSize);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect((startX + 1) * cellSize, (startY + 1) * cellSize, 5 * cellSize, 5 * cellSize);
      ctx.fillStyle = '#0a0d14';
      ctx.fillRect((startX + 2) * cellSize, (startY + 2) * cellSize, 3 * cellSize, 3 * cellSize);
    };

    drawFinderPattern(0, 0);
    drawFinderPattern(moduleCount - 7, 0);
    drawFinderPattern(0, moduleCount - 7);

    // Data grid
    for (let r = 0; r < moduleCount; r++) {
      for (let c = 0; c < moduleCount; c++) {
        // Skip corner finder zones
        if (
          (r < 8 && c < 8) ||
          (r < 8 && c >= moduleCount - 8) ||
          (r >= moduleCount - 8 && c < 8)
        ) {
          continue;
        }

        // Bit determination
        const bit = ((hash ^ (r * 31 + c * 17)) + (r * c)) % 3;
        if (bit === 0 || (r === 6 || c === 6)) {
          ctx.fillRect(c * cellSize + 0.5, r * cellSize + 0.5, cellSize - 1, cellSize - 1);
        }
      }
    }

    // Center logo badge
    const centerSize = 4.5 * cellSize;
    const centerPos = (size - centerSize) / 2;
    ctx.fillStyle = '#07090d';
    ctx.fillRect(centerPos, centerPos, centerSize, centerSize);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(centerPos + 2, centerPos + 2, centerSize - 4, centerSize - 4);
    ctx.fillStyle = '#07090d';
    ctx.font = 'bold 12px "Space Grotesk", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('BS', size / 2, size / 2);

  }, [qrToken]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `Battleship-Pass-${bookingId}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div className="qr-wrapper">
      <div className="qr-box">
        <canvas ref={canvasRef} className="qr-canvas" />
      </div>
      <div className="qr-meta">
        <div className="verified-badge">
          <CheckCircle2 size={15} className="icon-cyan" />
          <span>Official Gate Pass</span>
        </div>
        <code className="booking-token">{bookingId}</code>
        <button onClick={handleDownload} className="btn btn-glass btn-sm dl-btn">
          <Download size={14} /> Download QR Pass
        </button>
      </div>

      <style>{`
        .qr-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }

        .qr-box {
          background: #ffffff;
          padding: 0.75rem;
          border-radius: var(--radius-sm);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
          display: inline-block;
        }

        .qr-canvas {
          display: block;
          border-radius: var(--radius-sm);
        }

        .qr-meta {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.4rem;
        }

        .verified-badge {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-family: var(--font-mono);
          font-size: 0.75rem;
          color: var(--cyan-primary);
        }

        .booking-token {
          font-family: var(--font-mono);
          font-weight: 700;
          font-size: 0.95rem;
          color: #ffffff;
          letter-spacing: 0.05em;
        }

        .dl-btn {
          margin-top: 0.5rem;
        }
      `}</style>
    </div>
  );
};
