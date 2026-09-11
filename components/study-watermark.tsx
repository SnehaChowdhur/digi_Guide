"use client";

import React from "react";

export default function StudyWatermark() {
  return (
    <div className="study-watermark-field" aria-hidden="true">
      {/* 1. Rocket - Ambition & Launch */}
      <div className="study-wm-item wm-rocket">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/>
          <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/>
          <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/>
          <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>
        </svg>
      </div>

      {/* 2. Graph - Trend & Growth */}
      <div className="study-wm-item wm-graph">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 3v18h18"/>
          <path d="m19 9-5 5-4-4-3 3"/>
          <circle cx="7" cy="13" r="1.5" fill="currentColor"/>
          <circle cx="10" cy="10" r="1.5" fill="currentColor"/>
          <circle cx="14" cy="14" r="1.5" fill="currentColor"/>
          <circle cx="19" cy="9" r="1.5" fill="currentColor"/>
        </svg>
      </div>

      {/* 3. Pen - Practice & Notes */}
      <div className="study-wm-item wm-pen">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="m18 2 4 4-12 12H6v-4L18 2z"/>
          <path d="m15 5 4 4"/>
          <path d="m2 22 3-1-2-2-1 3z"/>
        </svg>
      </div>

      {/* 4. Book - Learning & Knowledge */}
      <div className="study-wm-item wm-book">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5z"/>
          <path d="M6 6h10"/>
          <path d="M6 10h10"/>
          <path d="M6 14h7"/>
        </svg>
      </div>

      {/* 5. Graduation Cap - Mastery */}
      <div className="study-wm-item wm-cap">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
          <path d="M6 12v5c3 3 9 3 12 0v-5"/>
        </svg>
      </div>

      {/* 6. Atom - Science & STEM */}
      <div className="study-wm-item wm-atom">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="2.5" fill="currentColor"/>
          <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(30 12 12)"/>
          <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(-30 12 12)"/>
          <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(90 12 12)"/>
        </svg>
      </div>

      {/* 7. Lightbulb - Idea & Curiosity */}
      <div className="study-wm-item wm-bulb">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 18h6"/>
          <path d="M10 22h4"/>
          <path d="M12 2a7 7 0 0 0-7 7c0 2.5 1.25 4.5 3 5.5v1.5a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V14.5c1.75-1 3-3 3-5.5a7 7 0 0 0-7-7z"/>
        </svg>
      </div>

      {/* 8. Code - Programming & Algorithms */}
      <div className="study-wm-item wm-code">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="16 18 22 12 16 6"/>
          <polyline points="8 6 2 12 8 18"/>
          <line x1="14" y1="4" x2="10" y2="20"/>
        </svg>
      </div>

      {/* 9. Geometry Ruler - Logic */}
      <div className="study-wm-item wm-ruler">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
          <path d="M12 9v4"/>
          <path d="M12 17h.01"/>
        </svg>
      </div>
    </div>
  );
}
