import { useMemo } from 'react';

const HeartFireflies = () => {
  const fireflies = useMemo(() => {
    return Array.from({ length: 30 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      // Increased size slightly (10-25px) so the heart shape is visible
      size: Math.random() * 15 + 10, 
      delay: Math.random() * 8,
      duration: Math.random() * 4 + 6,
      glowDelay: Math.random() * 3,
    }));
  }, []);

  return (
    <div className="fireflies">
      {/* Included styles directly here for portability. 
         You can move this to your CSS file if preferred.
      */}
      <style>{`
        .fireflies {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none; /* Allows clicking through the layer */
          z-index: 10;
        }
        
        .firefly {
          position: absolute;
          /* Glow effect for the heart */
          filter: drop-shadow(0 0 4px rgba(255, 107, 107, 0.6));
          animation-name: move, pulse;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
        }

        @keyframes move {
          0% { transform: translate(0, 0); }
          50% { transform: translate(20px, -30px); }
          100% { transform: translate(0, 0); }
        }

        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; filter: drop-shadow(0 0 8px rgba(255, 107, 107, 1)); }
        }
      `}</style>

      {fireflies.map((fly) => (
        <div
          key={fly.id}
          className="firefly"
          style={{
            left: fly.left,
            top: fly.top,
            width: fly.size,
            height: fly.size,
            // Negative delay ensures they are already moving when page loads
            animationDelay: `-${fly.delay}s, -${fly.glowDelay}s`,
            animationDuration: `${fly.duration}s, 3s`,
          }}
        >
          {/* SVG Heart Icon */}
          <svg 
            viewBox="0 0 24 24" 
            fill="#ff6b6b" /* Pink/Red Color */
            width="100%" 
            height="100%"
            style={{ display: 'block' }}
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </div>
      ))}
    </div>
  );
};

export default HeartFireflies;