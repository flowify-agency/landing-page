"use client";

import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { useReveal } from '../../hooks/useReveal';

const engines = [
  {
    id: 'attract',
    num: '01',
    title: 'Attract',
    subtitle: 'Goal: Get attention',
    description: 'How people discover your business.',
    color: 'color-mix(in srgb, var(--color-accent) 45%, white 55%)', // Step 1: Lightest Green
    features: [
      'Instagram',
      'Facebook Ads',
      'Google Search',
      'YouTube',
      'Referrals',
      'SEO',
      'Word of mouth'
    ]
  },
  {
    id: 'convert',
    num: '02',
    title: 'Convert',
    subtitle: 'Goal: Get them to take action',
    description: 'Streamline customer inquiries and orders.',
    color: 'var(--color-accent)', // Step 2: Medium/A little dark Green
    features: [
      'Website',
      'Landing page',
      'Online store',
      'Contact form',
      'WhatsApp chat',
      'Booking system'
    ]
  },
  {
    id: 'deliver',
    num: '03',
    title: 'Deliver',
    subtitle: 'Goal: Create a great customer experience',
    description: 'Provide the product or service.',
    color: 'color-mix(in srgb, var(--color-accent) 75%, black 25%)', // Step 3: More dark Green
    features: [
      'Restaurant serves food',
      'E-commerce ships products',
      'Agency delivers work',
      'Salon provides service'
    ]
  },
  {
    id: 'retain',
    num: '04',
    title: 'Retain',
    subtitle: 'Goal: Turn customers into repeat customers',
    description: 'Bring customers back.',
    color: 'color-mix(in srgb, var(--color-accent) 50%, black 50%)', // Step 4: Darkest Green
    features: [
      'WhatsApp updates',
      'Email marketing',
      'Loyalty programs',
      'Discounts',
      'Follow-up messages',
      'Memberships'
    ]
  }
];

export const Section3 = () => {
  const [revealRef, isVisible] = useReveal(0.1);
  const [activeIndex, setActiveIndex] = useState(null);
  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(1200);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setContainerWidth(entry.contentRect.width);
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const getPanelCenters = () => {
    const W = containerWidth;
    const G = containerWidth < 768 ? 8 : 24; // var(--space-4) gap
    const P_total = W - 3 * G;
    const U = P_total / 5.8;
    const W_inactive = U;
    const W_active = 2.8 * U;
    const W_equal = P_total / 4;

    const calculatedCenters = [];
    let currentLeft = 0;
    for (let i = 0; i < 4; i++) {
      const width = activeIndex === null ? W_equal : (i === activeIndex ? W_active : W_inactive);
      calculatedCenters.push(currentLeft + width / 2);
      currentLeft += width + G;
    }
    return calculatedCenters;
  };

  const centers = getPanelCenters();
  const activeColor = activeIndex !== null ? engines[activeIndex].color : 'var(--color-border-high)';
  const svgHeight = containerWidth < 768 ? 90 : 130;
  const yEnd = containerWidth < 768 ? 55 : 85;
  const yLineEnd = containerWidth < 768 ? 80 : 120;

  return (
    <section
      id="engines"
      ref={revealRef}
      className={`reveal ${isVisible ? 'visible' : ''}`}
      style={{
        paddingTop: 'calc(var(--space-8) * 1.5)',
        paddingBottom: 'calc(var(--space-8) * 1.5)',
        borderBottom: '1px solid var(--color-border)',
        overflow: 'hidden',
        backgroundColor: 'var(--color-bg)'
      }}
    >
      <div 
        className="container" 
        ref={containerRef}
        onMouseLeave={() => setActiveIndex(null)}
      >
        
        {/* Section Heading */}
        <div style={{ maxWidth: '820px', marginBottom: 'var(--space-6)', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'left' }}>
        
          <h2
            style={{
              fontSize: 'var(--font-size-h2)',
              lineHeight: 1.15,
              letterSpacing: '-0.03em',
              marginBottom: 'var(--space-4)',
              color: 'var(--color-text-primary)'
            }}
          >
            Core <span className="editorial-serif" style={{ color: 'var(--color-accent)', fontFamily: 'var(--font-heading-serif)' }}> Concept</span>
          </h2>
          <div style={{ width: '64px', height: '2px', backgroundColor: 'var(--color-accent)', marginBottom: 'var(--space-4)' }} />
        </div>

        {/* Dynamic Accordion Chassis */}
        <div className="services-flex-container">
          {engines.map((engine, idx) => {
            const isActive = idx === activeIndex;
            return (
              <div
                key={engine.id}
                onMouseEnter={() => setActiveIndex(idx)}
                onClick={() => setActiveIndex(idx)}
                className={`service-panel ${isActive ? 'active' : ''}`}
                style={{
                  borderColor: isActive ? engine.color : 'var(--color-border)',
                  '--panel-color': engine.color,
                  boxShadow: isActive ? `8px 8px 0px ${engine.color}` : 'none'
                }}
              >
                {/* Active Column Layout (Visible on desktop when active, always on mobile if active) */}
                <div className="active-content">
                  <div>
                    {/* Header Row */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
                      <span 
                        style={{ 
                          fontFamily: 'var(--font-heading-mono)', 
                          fontSize: '1rem', 
                          fontWeight: 700, 
                          color: engine.color 
                        }}
                      >
                        {engine.num}
                      </span>
                      <div 
                        style={{ 
                          width: '12px', 
                          height: '12px', 
                          borderRadius: '50%', 
                          backgroundColor: engine.color 
                        }} 
                      />
                    </div>

                    {/* Titles */}
                    <h3 
                      style={{ 
                        fontSize: '1.2rem', 
                        fontWeight: 800, 
                        color: 'var(--color-text-primary)',
                        marginBottom: '8px'
                      }}
                    >
                      {engine.title}
                    </h3>
                    <h4 
                      style={{ 
                        fontSize: '0.8rem', 
                        fontFamily: 'var(--font-heading-mono)',
                        fontWeight: 600, 
                        color: engine.color,
                        marginBottom: 'var(--space-3)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.02em'
                      }}
                    >
                      {engine.subtitle}
                    </h4>

                    {/* Description */}
                    <p style={{ fontSize: '0.85rem', marginBottom: 'var(--space-4)', color: 'var(--color-text-secondary)' }}>
                      {engine.description}
                    </p>

                    {/* Features List */}
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: 'var(--space-4)' }}>
                      {engine.features.map((feat) => (
                        <li key={feat} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--color-text-primary)' }}>
                          <CheckCircle2 size={14} style={{ color: engine.color, flexShrink: 0 }} />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Call to Action Inside Panel */}
                  <a 
                    href="#build-spec"
                    className="btn-core"
                    style={{
                      border: `1.5px solid ${engine.color}`,
                      color: 'var(--color-text-primary)',
                      alignSelf: 'flex-start',
                      gap: '8px',
                      fontSize: '0.75rem',
                      padding: '8px 16px',
                      marginTop: 'auto'
                    }}
                  >
                    Deploy Engine <ArrowRight size={14} style={{ color: engine.color }} />
                  </a>
                </div>

                {/* Inactive Panel Layout (Only shown on Desktop when inactive) */}
                <div className="inactive-content">
                  <span 
                    style={{ 
                      fontFamily: 'var(--font-heading-mono)', 
                      fontSize: '1.2rem', 
                      fontWeight: 700, 
                      color: 'var(--color-text-muted)' 
                    }}
                  >
                    {engine.num}
                  </span>
                  
                  {/* Vertical rotated text */}
                  <span 
                    className="vertical-title-text"
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: '1.1rem',
                      fontWeight: 800,
                      color: 'var(--color-text-secondary)',
                      whiteSpace: 'nowrap',
                      letterSpacing: '-0.02em',
                      writingMode: 'vertical-rl',
                      transform: 'rotate(180deg)',
                      marginBlock: 'auto'
                    }}
                  >
                    {engine.title}
                  </span>

                  <div 
                    style={{ 
                      width: '8px', 
                      height: '8px', 
                      borderRadius: '50%', 
                      backgroundColor: 'var(--color-border-hover)' 
                    }} 
                  />
                </div>

              </div>
            );
          })}
        </div>

        {/* SVG Pipeline Diagram */}
        <div 
          className="pipeline-container" 
          style={{ 
            width: '100%', 
            marginTop: 'var(--space-4)', 
            position: 'relative',
            '--active-color': activeColor
          }}
        >
          <svg 
            width={containerWidth} 
            height={svgHeight} 
            viewBox={`0 0 ${containerWidth} ${svgHeight}`}
            style={{ display: 'block', overflow: 'visible' }}
          >
            <defs>
              <marker
                id="arrow-head"
                viewBox="0 0 10 10"
                refX="6"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto"
              >
                <path d="M 0 2 Q 4 5 0 8 L 8 5 Z" fill={activeColor} style={{ transition: 'fill 0.35s ease' }} />
              </marker>
            </defs>

            {/* Connecting Pipes */}
            {engines.map((engine, idx) => {
              const isPathActive = idx === activeIndex;
              const xStart = centers[idx] || 0;
              const xEnd = containerWidth / 2;
              const yStart = 0;

              // Cubic Bezier curve path
              const pathD = `M ${xStart} ${yStart} C ${xStart} ${yEnd / 2}, ${xEnd} ${yEnd / 2}, ${xEnd} ${yEnd}`;

              return (
                <path
                  key={engine.id}
                  d={pathD}
                  fill="none"
                  stroke={engine.color}
                  strokeWidth={isPathActive ? 4.5 : 2.5}
                  opacity={isPathActive ? 1 : 0.6}
                  style={{
                    transition: 'd 0.35s cubic-bezier(0.16, 1, 0.3, 1), stroke-width 0.35s ease, opacity 0.35s ease'
                  }}
                />
              );
            })}

            {/* Relay Node */}
            <circle 
              cx={containerWidth / 2} 
              cy={yEnd} 
              r={5.5} 
              fill={activeColor} 
              stroke="var(--color-bg)" 
              strokeWidth={2}
              style={{ transition: 'fill 0.35s ease' }}
            />

            {/* Main output pipeline stream going downwards */}
            <path 
              d={`M ${containerWidth / 2} ${yEnd} L ${containerWidth / 2} ${yLineEnd}`} 
              fill="none"
              stroke={activeColor}
              strokeWidth={3.5}
              markerEnd="url(#arrow-head)"
              style={{ transition: 'stroke 0.35s ease' }}
            />
          </svg>

          {/* Goal Callout Box */}
          <div 
            style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              marginTop: '12px' 
            }}
          >
            <div 
              style={{
                fontFamily: 'var(--font-heading-mono)',
                fontSize: '0.9rem',
                fontWeight: 700,
                color: 'var(--color-text-primary)',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                transition: 'border-color 0.35s ease, box-shadow 0.35s ease',
                textAlign: 'center',
                backgroundColor: 'var(--color-surface)',
                border: `2px solid ${activeColor}`,
                boxShadow: `6px 6px 0px ${activeColor}`,
                padding: '12px 24px',
                borderRadius: 'var(--radius-sm)',
                display: 'inline-block'
              }}
            >
              The flow that every crore company has used
            </div>

            {/* Real-time Contextual Message */}
            <p
              style={{
                marginTop: '16px',
                fontSize: 'var(--font-size-body)',
                color: 'var(--color-text-secondary)',
                fontFamily: 'var(--font-body)',
                textAlign: 'center',
                maxWidth: '520px',
                lineHeight: 'var(--line-height-body)',
                transition: 'color 0.35s ease',
                fontStyle: 'italic'
              }}
            >
              You are currently exploring our workflow architecture. Ready to streamline your operations with custom automation?
            </p>

            {/* Click to Contact Mailto Link */}
            <a
              href="mailto:flowifyy.agency@gmail.com?subject=Operational Inquiry"
              className="underline underline-offset-4"
              style={{
                marginTop: '12px',
                transition: 'color 0.35s ease',
                fontWeight: 600,
                textDecoration: 'underline',
                textUnderlineOffset: '4px'
              }}
            >
              Click to contact
            </a>
          </div>
        </div>

      </div>

      {/* Embedded styling for desktop vertical accordion and responsive collapse */}
      <style>{`
        .services-flex-container {
          display: flex;
          gap: var(--space-4);
          width: 100%;
          min-height: 540px;
          align-items: stretch;
        }

        .service-panel {
          position: relative;
          overflow: hidden;
          flex: 1;
          transition: flex 0.35s cubic-bezier(0.16, 1, 0.3, 1), 
                      border-color 0.25s cubic-bezier(0.16, 1, 0.3, 1), 
                      box-shadow 0.25s cubic-bezier(0.16, 1, 0.3, 1),
                      background-color 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          cursor: pointer;
          min-width: 0;
          background-color: var(--color-surface);
          border-width: 2px;
          border-style: solid;
          border-color: var(--color-border);
          border-radius: var(--radius-sm);
        }

        .service-panel.active {
          flex: 2.8;
          cursor: default;
        }

        /* Desktop specific content layout with smooth transitions */
        .service-panel .active-content {
          position: absolute;
          top: var(--space-5);
          left: var(--space-5);
          right: var(--space-5);
          bottom: var(--space-5);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          opacity: 0;
          transform: translateY(12px);
          transition: opacity 0.25s cubic-bezier(0.16, 1, 0.3, 1), 
                      transform 0.25s cubic-bezier(0.16, 1, 0.3, 1),
                      visibility 0.25s;
          visibility: hidden;
          pointer-events: none;
          width: calc(100% - 48px);
          height: calc(100% - 48px);
        }

        .service-panel.active .active-content {
          opacity: 1;
          transform: translateY(0);
          visibility: visible;
          pointer-events: auto;
          transition-delay: 0.1s; /*snappy, less delay*/
        }

        .service-panel .inactive-content {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
          padding-block: var(--space-5);
          opacity: 1;
          transform: scale(1);
          transition: opacity 0.2s cubic-bezier(0.16, 1, 0.3, 1), 
                      transform 0.2s cubic-bezier(0.16, 1, 0.3, 1),
                      visibility 0.2s;
          visibility: visible;
          pointer-events: auto;
        }

        .service-panel.active .inactive-content {
          opacity: 0;
          transform: scale(0.92);
          visibility: hidden;
          pointer-events: none;
        }

        .service-panel:hover:not(.active) {
          border-color: var(--color-border-high);
          background-color: var(--color-surface-subtle);
        }

        /* Mobile Responsive Overrides */
        @media (max-width: 767px) {
          .services-flex-container {
            flex-direction: row !important;
            min-height: 380px !important;
            gap: 8px !important;
          }

          .service-panel {
            flex: 1 !important;
          }

          .service-panel.active {
            flex: 2.8 !important;
            box-shadow: 4px 4px 0px var(--panel-color) !important;
          }

          .service-panel .active-content {
            top: var(--space-2) !important;
            left: var(--space-2) !important;
            right: var(--space-2) !important;
            bottom: var(--space-2) !important;
            width: calc(100% - 16px) !important;
            height: calc(100% - 16px) !important;
            position: absolute !important;
            display: flex !important;
            padding: 0 !important;
            visibility: hidden;
            opacity: 0;
            pointer-events: none;
          }

          .service-panel.active .active-content {
            visibility: visible !important;
            opacity: 1 !important;
            pointer-events: auto !important;
          }

          .service-panel .inactive-content {
            display: flex !important;
            position: absolute !important;
            inset: 0 !important;
            padding-block: var(--space-3) !important;
            opacity: 1 !important;
            visibility: visible !important;
            pointer-events: auto !important;
          }

          .service-panel.active .inactive-content {
            opacity: 0 !important;
            visibility: hidden !important;
            pointer-events: none !important;
          }

          /* Inactive rotated vertical title and indicator dots */
          .service-panel .inactive-content span {
            font-size: 8.5px !important;
          }
          .service-panel .inactive-content .vertical-title-text {
            font-size: 9px !important;
          }
          .service-panel .inactive-content div {
            width: 5px !important;
            height: 5px !important;
          }

          /* Active Panel Contents: Titles, Subtitles, Paragraphs, Lists */
          .service-panel .active-content h3 {
            font-size: 11px !important;
            margin-bottom: 4px !important;
            line-height: 1.1 !important;
          }
          .service-panel .active-content h4 {
            font-size: 7px !important;
            margin-bottom: 4px !important;
          }
          .service-panel .active-content p {
            font-size: 8px !important;
            line-height: 1.2 !important;
            margin-bottom: 6px !important;
          }
          .service-panel .active-content ul {
            gap: 3px !important;
            margin-bottom: 6px !important;
          }
          .service-panel .active-content li {
            font-size: 7.5px !important;
            gap: 3px !important;
          }
          .service-panel .active-content li svg {
            width: 8px !important;
            height: 8px !important;
          }

          /* active content buttons */
          .service-panel .active-content a.btn-core {
            font-size: 6.5px !important;
            padding: 4px 8px !important;
            gap: 3px !important;
            margin-top: auto !important;
          }
          .service-panel .active-content a.btn-core svg {
            width: 6.5px !important;
            height: 6.5px !important;
          }

          /* SVG Pipeline is visible on mobile too */
          .pipeline-container {
            display: block !important;
            margin-top: var(--space-3) !important;
          }
          .pipeline-container svg {
            height: 90px !important;
          }

          /* Goal Callout Box */
          .pipeline-container .underline {
            font-size: 8.5px !important;
            margin-top: 6px !important;
          }
          .pipeline-container p {
            font-size: 8.5px !important;
            margin-top: 8px !important;
            max-width: 290px !important;
            line-height: 1.4 !important;
          }
          .pipeline-container div div {
            font-size: 8.5px !important;
            padding: 5px 10px !important;
            box-shadow: 3px 3px 0px var(--active-color) !important;
            border-color: var(--active-color) !important;
          }
        }
      `}</style>
    </section>
  );
};
