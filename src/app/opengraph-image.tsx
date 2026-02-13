import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'Design Vision AI'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  // We use a simple system font stack here for speed and reliability
  return new ImageResponse(
    (
      <div
        style={{
          background: '#050505',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'monospace', // Matches your "Mono" theme
          color: '#e5e5e5',
          position: 'relative',
        }}
      >
        {/* Background Grid Texture */}
        <div
           style={{
             position: 'absolute',
             inset: 0,
             backgroundImage: 'linear-gradient(#262626 1px, transparent 1px), linear-gradient(90deg, #262626 1px, transparent 1px)',
             backgroundSize: '50px 50px',
             opacity: 0.3,
           }}
        />

        {/* Center Logo Block */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '30px', zIndex: 10 }}>
            {/* The "Logo Mark" */}
            <div 
                style={{ 
                    width: '60px', 
                    height: '60px', 
                    background: '#e5e5e5',
                    boxShadow: '0 0 30px rgba(229, 229, 229, 0.2)'
                }} 
            />
            
            {/* The Text */}
            <h1 style={{ 
                fontSize: '70px', 
                letterSpacing: '0.1em', 
                margin: 0, 
                textTransform: 'uppercase',
                fontWeight: 'bold'
            }}>
                Design_Vision_AI
            </h1>
        </div>

        {/* Footer Subtext */}
        <div style={{ 
            marginTop: '40px', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '15px',
            fontSize: '24px', 
            letterSpacing: '0.3em', 
            opacity: 0.6, 
            textTransform: 'uppercase',
            zIndex: 10
        }}>
            <span>Jet Noir Systems</span>
            <span>//</span>
            <span>Multimodal Audit Engine</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}