import React from 'react';

// duplicate skeleton for better bundling

export default function Skeleton() {
  const BG = '#A6A8AB';
  const EMPTY = '#E1E2E3';

  const wi = 20;
  const padding = 10;

  const sWidth = 75;
  const sY = 110;

  const cHeight = 100;
  const csX = 85;

  const cOffsets = [10, 20, 35, 60, 65, 80, 90];
  const sOffsets = [50, 30, 15];
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg viewBox="0 0 300 200" style={{ maxWidth: '80vw', maxHeight: '80vh', flexGrow: 1, background: '#F4F4F4' }}>
        {cOffsets.map((offset, i) => (
          <rect key={i} x={csX + i * (wi + padding)} y={offset} width={wi} height={cHeight - offset} fill={BG} />
        ))}
        {sOffsets.map((offset, i) => (
          <rect key={i} x={offset} y={sY + i * (wi + padding)} width={sWidth - offset} height={wi} fill={BG} />
        ))}

        {cOffsets.map((_, i) =>
          sOffsets.map((_, j) => {
            const filled = j === 2 - i || (i === 3 && j > 0) || (i === 4 && j !== 1) || (i === 5 && j < 2) || i === 6;
            return (
              <circle
                key={`${i}x${j}`}
                cx={csX + i * (wi + padding) + wi / 2}
                cy={sY + j * (wi + padding) + wi / 2}
                r={wi / 2}
                fill={filled ? BG : EMPTY}
              />
            );
          })
        )}
        <rect x="182" y="150" width="6" height="30" fill={BG} />
        <rect x="212" y="120" width="6" height="60" fill={BG} />
        <rect x="242" y="120" width="6" height="30" fill={BG} />
        <rect x="272" y="120" width="6" height="60" fill={BG} />
      </svg>
    </div>
  );
}
