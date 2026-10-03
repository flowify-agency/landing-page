import React from 'react';
import dynamic from 'next/dynamic';

const SoftAurora = dynamic(() => import('./SoftAurora'), { ssr: false });

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer 
      style={{
        backgroundColor: 'color-mix(in srgb, var(--color-bg) 85%, transparent)',
        borderTop: '1px solid var(--color-border)',
        paddingBlock: 'var(--space-7) var(--space-5)',
        fontSize: 'var(--font-size-sm)',
        color: 'var(--color-text-secondary)',
        position: 'relative',
        zIndex: 5,
        overflow: 'hidden'
      }}
    >
      {/* WebGL Animated Background */}
      <div 
        style={{ 
          position: 'absolute', 
          inset: 0, 
          zIndex: 1, 
          pointerEvents: 'none', 
          opacity: 0.6
        }}
      >
        <SoftAurora
          speed={0.6}
          scale={1.5}
          brightness={1.0}
          color1="#047857"
          color2="#047857"
          noiseFrequency={2.5}
          noiseAmplitude={1.0}
          bandHeight={0.5}
          bandSpread={1.0}
          octaveDecay={0.1}
          layerOffset={0}
          colorSpeed={1.0}
          enableMouseInteraction={true}
          mouseInfluence={0.25}
        />
      </div>

      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: 'var(--space-6)',
            marginBottom: 'var(--space-7)'
          }}
          className="footer-grid-chassis"
        >
          {/* Brand & Systems Status Panel */}
          <div className="footer-column" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <a 
              href="#hero" 
              style={{
                display: 'flex',
                alignItems: 'center',
                textDecoration: 'none'
              }}
            >
              <img 
                className="mobile-logo-footer"
                src="/in-line-flowify.svg" 
                alt="Flowify" 
                style={{
                  height: '32px',
                  width: 'auto',
                  display: 'block'
                }}
              />
            </a>
            <p style={{ fontSize: '0.8rem', lineHeight: 1.6, maxWidth: '340px' }}>
              Engineered for absolute efficiency. We build persistent, self-healing custom software systems, CRM relays, and ERP pipelines that eliminate operational friction for modern Indian enterprises.
            </p>
            <div className="pulse-dot-wrapper" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
              <span className="pulse-dot"></span>
              <span style={{ 
                fontFamily: 'var(--font-heading-mono)',
                fontSize: '0.65rem', 
                textTransform: 'uppercase', 
                letterSpacing: '0.08em', 
                color: 'var(--color-text-muted)',
                fontWeight: 700
              }}>
                system.online // blr_relay_active
              </span>
            </div>
          </div>

          {/* Launch Clients (First Case Studies) */}
          <div className="footer-column" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            <h4 style={{ 
              fontFamily: 'var(--font-heading-mono)', 
              fontSize: '0.8rem', 
              fontWeight: 800, 
              color: 'var(--color-text-primary)', 
              textTransform: 'uppercase', 
              letterSpacing: '0.08em' 
            }}>
              Launch Clients (V1.0)
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.85rem' }}>
              <li className="client-item">
                <a 
                  href="https://aesthetxways.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="ft-client-link"
                >
                  <span className="client-num">01.</span> Aesthetx Ways <span className="arrow-diagonal">↗</span>
                </a>
              </li>
              <li className="client-item">
                <a 
                  href="https://magnetclubandrestro.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="ft-client-link"
                >
                  <span className="client-num">02.</span> Magnet Club & Restro <span className="arrow-diagonal">↗</span>
                </a>
              </li>
              <li className="client-item">
                <a 
                  href="https://walkdrobe.in/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="ft-client-link"
                >
                  <span className="client-num">03.</span> Walkdrobe <span className="arrow-diagonal">↗</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Operational Capabilities */}
          <div className="footer-column" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            <h4 style={{ 
              fontFamily: 'var(--font-heading-mono)', 
              fontSize: '0.8rem', 
              fontWeight: 800, 
              color: 'var(--color-text-primary)', 
              textTransform: 'uppercase', 
              letterSpacing: '0.08em' 
            }}>
              Core Capabilities
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.8rem' }}>
              <li className="capability-item">WhatsApp API Notification Relays</li>
              <li className="capability-item">Zoho Flow & Zoho CRM Relays</li>
              <li className="capability-item">Tally ERP Automatic Sync</li>
              <li className="capability-item">Razorpay Webhook Engines</li>
              <li className="capability-item">Multi-Channel ERP & Order Ingestors</li>
            </ul>
          </div>

          {/* Quick Relays (Links) */}
          <div className="footer-column" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            <h4 style={{ 
              fontFamily: 'var(--font-heading-mono)', 
              fontSize: '0.8rem', 
              fontWeight: 800, 
              color: 'var(--color-text-primary)', 
              textTransform: 'uppercase', 
              letterSpacing: '0.08em' 
            }}>
              System Relays
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.8rem' }}>
              <li><a href="#hero" className="ft-lnk">Operational Cockpit</a></li>
              <li><a href="#engines" className="ft-lnk">Workflow Automations</a></li>
              <li><a href="#calculator" className="ft-lnk">Leakage Diagnostic</a></li>
              <li><a href="#contact-section" className="ft-lnk">Establish Connect</a></li>
            </ul>
          </div>
        </div>

        {/* Mandatory Payment Gateway Policy Links */}
        <div
          style={{
            borderTop: '1px solid color-mix(in srgb, var(--color-border) 40%, transparent)',
            paddingTop: 'var(--space-4)',
            paddingBottom: 'var(--space-4)',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px 20px',
            fontFamily: 'var(--font-heading-mono)',
            fontSize: '0.72rem'
          }}
        >
          <a href="/terms" className="ft-lnk" style={{ color: 'var(--color-text-secondary)', textDecoration: 'none' }}>
            Terms & Conditions
          </a>
          <span style={{ color: 'var(--color-border-high)' }}>•</span>
          <a href="/privacy" className="ft-lnk" style={{ color: 'var(--color-text-secondary)', textDecoration: 'none' }}>
            Privacy Policy
          </a>
          <span style={{ color: 'var(--color-border-high)' }}>•</span>
          <a href="/refund-policy" className="ft-lnk" style={{ color: 'var(--color-text-secondary)', textDecoration: 'none' }}>
            Cancellation & Refund Policy
          </a>
          <span style={{ color: 'var(--color-border-high)' }}>•</span>
          <a href="/contact" className="ft-lnk" style={{ color: 'var(--color-text-secondary)', textDecoration: 'none' }}>
            Contact & Service Delivery
          </a>
        </div>

        {/* Lower System Metadata Row */}
        <div 
          className="footer-bottom-row"
          style={{
            borderTop: '1px solid color-mix(in srgb, var(--color-border) 25%, transparent)',
            paddingTop: 'var(--space-4)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 'var(--space-4)',
            fontFamily: 'var(--font-heading-mono)',
            fontSize: '0.65rem',
            color: 'var(--color-text-muted)'
          }}
        >
          <div>
            © {currentYear} FLOWIFY AGENCY // ALL SYSTEMS RECONFIGURED.
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
            {/* <span>GSTIN: 27AAFCN8012E1ZS</span> */}
            <span style={{ color: 'var(--color-accent)' }}>SECURE_SSL: TRUE</span>
            <span>BUILD: V1.0.8_RELEASE</span>
          </div>
        </div>
      </div>

      <style>{`
        .ft-lnk {
          transition: all var(--transition-fast);
          padding-left: 0;
          display: inline-block;
        }
        .ft-lnk:hover {
          color: var(--color-accent) !important;
          transform: translateX(4px);
        }
        
        .ft-client-link {
          font-family: var(--font-heading);
          font-weight: 700;
          color: var(--color-text-primary);
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          transition: all var(--transition-fast);
        }
        .ft-client-link:hover {
          color: var(--color-accent) !important;
          transform: translateX(4px);
        }
        .client-num {
          font-family: var(--font-heading-mono);
          font-size: 0.75rem;
          color: var(--color-accent);
          font-weight: 700;
        }
        .arrow-diagonal {
          font-size: 0.7rem;
          opacity: 0.6;
          transition: transform var(--transition-fast);
        }
        .ft-client-link:hover .arrow-diagonal {
          transform: translate(2px, -2px);
          opacity: 1;
        }

        .capability-item {
          position: relative;
          padding-left: 12px;
        }
        .capability-item::before {
          content: '•';
          position: absolute;
          left: 0;
          color: var(--color-accent);
        }

        .pulse-dot {
          width: 8px;
          height: 8px;
          background-color: var(--color-accent);
          border-radius: 50%;
          display: inline-block;
          position: relative;
        }
        .pulse-dot::after {
          content: '';
          position: absolute;
          inset: -4px;
          border-radius: 50%;
          border: 2px solid var(--color-accent);
          animation: pulseGlow 1.8s cubic-bezier(0.16, 1, 0.3, 1) infinite;
        }

        @keyframes pulseGlow {
          0% {
            transform: scale(0.5);
            opacity: 1;
          }
          100% {
            transform: scale(1.8);
            opacity: 0;
          }
        }

        @media (max-width: 767px) {
          .footer-grid-chassis {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: var(--space-4) !important;
            text-align: left !important;
            margin-bottom: var(--space-5) !important;
          }
          .footer-column {
            align-items: flex-start !important;
            text-align: left !important;
            gap: var(--space-2) !important;
          }
          .footer-column p {
            font-size: 0.7rem !important;
            line-height: 1.5 !important;
            max-width: 100% !important;
          }
          .footer-column h4 {
            font-size: 0.7rem !important;
            margin-bottom: var(--space-1) !important;
          }
          .footer-column ul {
            align-items: flex-start !important;
            gap: 6px !important;
            font-size: 0.7rem !important;
            padding: 0 !important;
          }
          .ft-client-link {
            justify-content: flex-start !important;
            font-size: 0.7rem !important;
          }
          .ft-lnk {
            justify-content: flex-start !important;
            text-align: left !important;
            font-size: 0.7rem !important;
          }
          .capability-item {
            font-size: 0.7rem !important;
            padding-left: 10px !important;
          }
          .capability-item::before {
            display: inline-block !important;
            font-size: 0.6rem !important;
          }
          .mobile-logo-footer {
            height: 24px !important;
          }
          .pulse-dot-wrapper span {
            font-size: 0.55rem !important;
          }
          .footer-bottom-row {
            flex-direction: row !important;
            justify-content: space-between !important;
            align-items: flex-start !important;
            text-align: left !important;
            gap: var(--space-2) !important;
            font-size: 0.55rem !important;
            padding-top: var(--space-4) !important;
          }
          .footer-bottom-row > div:last-child {
            flex-direction: column !important;
            align-items: flex-end !important;
            text-align: right !important;
            gap: 4px !important;
          }
        }
      `}</style>
    </footer>
  );
};
