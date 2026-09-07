// Real SVG icons replacing text emojis/AI characters (matching images 3, 4, 5)

export function CartIcon({ size = 24, className = "" }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle cx="50" cy="50" r="45" stroke="#C81E1E" strokeWidth="6" fill="white" />
      <path d="M50 8 A42 42 0 0 1 92 50" stroke="#C81E1E" strokeWidth="7" strokeLinecap="round" />
      <path d="M28 36 H38 L44 62 H72 L78 44 H38" stroke="#C81E1E" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <circle cx="48" cy="72" r="4" fill="#C81E1E" />
      <circle cx="68" cy="72" r="4" fill="#C81E1E" />
    </svg>
  );
}

export function LocationPinIcon({ size = 24, className = "" }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path 
        d="M50 10 C32 10 18 24 18 42 C18 64 50 90 50 90 C50 90 82 64 82 42 C82 24 68 10 50 10 Z" 
        fill="#DC2626" 
      />
      <circle cx="50" cy="40" r="14" fill="white" />
      <ellipse cx="50" cy="92" rx="24" ry="4" fill="#DC2626" opacity="0.3" />
    </svg>
  );
}

export function DeliveryScooterIcon({ size = 28, className = "" }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 120 80" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Scooter wheels */}
      <circle cx="30" cy="58" r="12" fill="#1E293B" stroke="#F59E0B" strokeWidth="4" />
      <circle cx="90" cy="58" r="12" fill="#1E293B" stroke="#F59E0B" strokeWidth="4" />
      {/* Scooter body */}
      <path d="M25 58 L45 58 L55 42 L85 42 L90 58" fill="#F59E0B" stroke="#DC2626" strokeWidth="3" />
      {/* Delivery box */}
      <rect x="58" y="22" width="28" height="20" rx="3" fill="#DC2626" />
      <path d="M60 32 H84" stroke="white" strokeWidth="2" />
      {/* Driver */}
      <circle cx="48" cy="22" r="8" fill="#EA580C" />
      <path d="M40 32 Q48 26 56 32" fill="#EA580C" />
    </svg>
  );
}

export function SearchIcon({ size = 18, className = "" }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

export function UserIcon({ size = 20, className = "" }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}
