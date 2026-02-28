import React from 'react';

interface LogoProps {
  className?: string;
  textClassName?: string;
  showText?: boolean;
  variant?: 'icon' | 'full';
}

const Logo: React.FC<LogoProps> = ({ className = "w-8 h-8", textClassName = "text-xl", showText = true, variant = 'full' }) => {
  return (
    <div className="flex items-center gap-3 select-none group">
      <div className={`relative ${className} flex-shrink-0`}>
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full overflow-visible filter drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]">
          <defs>
            <linearGradient id="prism_grad_1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF0080" />
              <stop offset="100%" stopColor="#7928CA" />
            </linearGradient>
            <linearGradient id="prism_grad_2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#00DFD8" />
              <stop offset="100%" stopColor="#007CF0" />
            </linearGradient>
            <linearGradient id="prism_grad_3" x1="50%" y1="0%" x2="50%" y2="100%">
              <stop offset="0%" stopColor="#FF4D4D" />
              <stop offset="100%" stopColor="#F9CB28" />
            </linearGradient>
          </defs>
          
          {/* Abstract Prism Shape */}
          <path 
            d="M50 5 L95 80 L5 80 Z" 
            fill="white" 
            fillOpacity="0.05"
            stroke="white"
            strokeWidth="0.5"
            strokeOpacity="0.2"
          />
          
          {/* Refracted Light Beams */}
          <path 
            d="M50 40 L100 20" 
            stroke="url(#prism_grad_1)" 
            strokeWidth="8" 
            strokeLinecap="round"
            className="opacity-80 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-500"
          />
          <path 
            d="M50 50 L100 50" 
            stroke="url(#prism_grad_2)" 
            strokeWidth="8" 
            strokeLinecap="round"
            className="opacity-80 group-hover:translate-x-2 transition-transform duration-700"
          />
          <path 
            d="M50 60 L100 80" 
            stroke="url(#prism_grad_3)" 
            strokeWidth="8" 
            strokeLinecap="round"
            className="opacity-80 group-hover:translate-x-1 group-hover:translate-y-1 transition-transform duration-500"
          />
          
          {/* Core Prism */}
          <path 
            d="M30 70 L50 30 L70 70 Z" 
            fill="white"
            className="group-hover:scale-110 origin-center transition-transform duration-300"
          />
        </svg>
      </div>
      
      {showText && (
        <div className="flex flex-col -space-y-1">
          <span className={`font-black tracking-tighter text-white ${textClassName} uppercase italic`}>
            Speqtrum
          </span>
          <span className="text-[8px] font-black tracking-[0.4em] text-zinc-500 uppercase ml-0.5">
            Beyond Limits
          </span>
        </div>
      )}
    </div>
  );
};

export default Logo;
