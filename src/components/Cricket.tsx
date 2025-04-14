
import React from "react";

export function Cricket() {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 800 600" 
      className="w-full h-full opacity-40"
      style={{ filter: "drop-shadow(0 0 10px rgba(255,255,255,0.3))" }}
    >
      {/* Stadium elements */}
      <ellipse cx="400" cy="400" rx="350" ry="100" fill="rgba(255,255,255,0.2)" />
      <rect x="250" y="300" width="300" height="200" fill="rgba(255,255,255,0.15)" />
      
      {/* Pitch */}
      <rect x="300" y="320" width="200" height="160" fill="rgba(255,255,255,0.25)" />
      
      {/* Crease lines */}
      <line x1="300" y1="360" x2="500" y2="360" stroke="white" strokeWidth="2" />
      <line x1="300" y1="440" x2="500" y2="440" stroke="white" strokeWidth="2" />
      
      {/* Batsman */}
      <g>
        {/* Animated batting motion */}
        <animateTransform
          attributeName="transform"
          type="rotate"
          values="-10 350 380; 30 350 380; -10 350 380"
          dur="2s"
          repeatCount="indefinite"
          additive="sum"
        />
        
        {/* Body */}
        <circle cx="350" cy="380" r="12" fill="white" />
        <line x1="350" y1="392" x2="350" y2="430" stroke="white" strokeWidth="4" />
        
        {/* Arms */}
        <line x1="350" y1="400" x2="330" y2="415" stroke="white" strokeWidth="3" />
        
        {/* Bat arm with dramatic swing */}
        <g>
          <animateTransform
            attributeName="transform"
            type="rotate"
            values="0 350 400; 120 350 400; 0 350 400"
            dur="2s"
            repeatCount="indefinite"
            additive="sum"
          />
          <line x1="350" y1="400" x2="390" y2="380" stroke="white" strokeWidth="3" />
          <rect x="390" y="360" width="8" height="40" rx="2" fill="#f3d19e" />
        </g>
        
        {/* Legs */}
        <line x1="350" y1="430" x2="335" y2="470" stroke="white" strokeWidth="4" />
        <line x1="350" y1="430" x2="365" y2="470" stroke="white" strokeWidth="4" />
      </g>
      
      {/* Ball with six trajectory */}
      <circle id="cricket-ball" cx="400" cy="380" r="6" fill="white">
        <animate 
          attributeName="cx" 
          values="450;400;350;300;250;200;150;100;50;0"
          dur="3s" 
          repeatCount="indefinite" 
        />
        <animate 
          attributeName="cy" 
          values="380;340;300;250;200;150;110;80;60;50"
          dur="3s" 
          repeatCount="indefinite" 
        />
        <animate 
          attributeName="r" 
          values="6;5;4;3;2"
          dur="3s" 
          repeatCount="indefinite" 
        />
      </circle>
      
      {/* Ball trail */}
      <path d="M 450 380 Q 400 340, 350 300 T 250 200 T 150 110 T 50 60" stroke="white" strokeDasharray="4,4" opacity="0.6">
        <animate attributeName="opacity" values="0;0.6;0" dur="3s" repeatCount="indefinite" />
      </path>
      
      {/* Crowd simplified */}
      <g opacity="0.7">
        <animate attributeName="transform" type="translate" values="0 0; 0 -3; 0 0" dur="2s" repeatCount="indefinite" />
        {Array.from({ length: 20 }).map((_, i) => (
          <circle key={i} cx={200 + i * 20} cy={300 - Math.sin(i * 0.3) * 5} r="2" fill="white" />
        ))}
        {Array.from({ length: 20 }).map((_, i) => (
          <circle key={i} cx={200 + i * 20} cy={280 - Math.cos(i * 0.2) * 5} r="2" fill="white" />
        ))}
      </g>
      
      {/* Stadium lights */}
      <circle cx="600" cy="200" r="15" fill="white" opacity="0.8">
        <animate attributeName="opacity" values="0.5;0.8;0.5" dur="3s" repeatCount="indefinite" />
      </circle>
      <circle cx="200" cy="200" r="15" fill="white" opacity="0.8">
        <animate attributeName="opacity" values="0.5;0.8;0.5" dur="2.5s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
}
