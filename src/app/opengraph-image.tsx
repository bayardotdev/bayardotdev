import { ImageResponse } from 'next/og';

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          background: '#000000',
          padding: '0 96px',
        }}
      >
        <div style={{ display: 'flex', fontSize: 116, fontWeight: 700, letterSpacing: -3 }}>
          <span style={{ color: '#ffffff' }}>bayar</span>
          <span style={{ color: '#34d399' }}>.dev</span>
        </div>
        <div
          style={{
            width: 120,
            height: 4,
            background: '#34d399',
            margin: '40px 0',
          }}
        />
        <div style={{ color: '#a3a3a3', fontSize: 36, lineHeight: 1.4, maxWidth: 820 }}>
          Low-latency streaming, edge routing, and zero-retention data boundaries.
        </div>
      </div>
    ),
    size
  );
}
