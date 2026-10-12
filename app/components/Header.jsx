"use client";

import React, { useState, useEffect } from 'react';

const navLinks = [
 
];

export const Header = ({ onOpenAudit }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  // Scroll height shrink trigger
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      className="mobile-header-container"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        zIndex: 1000,
        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
    >
      <header 
        className="mobile-header-wrapper"
        style={{
          width: '100%',
          borderLeft: 'none',
          borderRight: 'none',
          borderTop: 'none',
          borderBottom: '1px solid color-mix(in srgb, var(--color-border) 30%, transparent)',
          backgroundColor: 'color-mix(in srgb, var(--color-surface) 15%, transparent)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderRadius: 0,
          transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        <div 
          className="mobile-header-inner"
          style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            height: isScrolled ? '64px' : '76px',
            paddingInline: 'var(--space-4)',
            transition: 'height 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          {/* Brand Logo */}
          <a 
            href="#hero" 
            style={{ display: 'flex', alignItems: 'center' }}
          >
            <img 
              className="mobile-logo"
              src="/in-line-flowify.svg" 
              alt="Flowify" 
              style={{
                height: isScrolled ? '24px' : '30px',
                width: 'auto',
                display: 'block',
                transition: 'height 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
            />
          </a>

          {/* Desktop Navigation Link Track */}
          <nav className="desktop-links" style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center' }}>
            {navLinks.map((link) => {
              return (
                <a 
                  key={link.name} 
                  href={link.anchor}
                  className="nav-anchor-brutal"
                  style={{
                    fontFamily: 'var(--font-heading-mono)',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    color: 'var(--color-text-secondary)',
                    transition: 'all 0.15s ease',
                    padding: '8px 12px',
                    border: '1px solid transparent'
                  }}
                >
                  {link.name}
                </a>
              );
            })}
          </nav>

          {/* Global Controls & Call to Action */}
          <div className="mobile-controls-gap" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            {/* Merchant Portal Login Link */}
            <a
              href="/dashboard"
              className="nav-anchor-brutal"
              style={{
                fontFamily: 'var(--font-heading-mono)',
                fontSize: '0.75rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                color: 'var(--color-text-secondary)',
                padding: '6px 10px',
                textDecoration: 'none',
                borderRadius: '6px',
                border: '1px solid color-mix(in srgb, var(--color-border) 40%, transparent)'
              }}
            >
              Portal Login
            </a>

            {/* Book Audit Direct Trigger */}
            <button 
              onClick={onOpenAudit}
              className="btn-brutal-nav"
              style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', border: '2px solid var(--color-text-primary)' }}
            >
              Operations Audit
            </button>
          </div>
        </div>
      </header>
      
      {/* Brutalist styling variables & hover definitions */}
      <style>{`
        .btn-brutal-nav {
          font-family: var(--font-heading-mono);
          font-size: 0.8rem;
          font-weight: 700;
          text-transform: uppercase;
          background-color: var(--color-accent);
          color: #070709;
          border: 2px solid var(--color-text-primary);
          box-shadow: 4px 4px 0px var(--color-text-primary);
          padding: 8px 16px;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .btn-brutal-nav:hover {
          transform: translate(-2px, -2px);
          box-shadow: 6px 6px 0px var(--color-text-primary);
        }

        .btn-brutal-nav:active {
          transform: translate(2px, 2px);
          box-shadow: 0px 0px 0px var(--color-text-primary);
        }

        @media (max-width: 767px) {
          .desktop-links { display: none !important; }
          
          /* Mobile style overrides with !important to defeat inline styles */
          .mobile-header-container {
            top: 0 !important;
            left: 0 !important;
            width: 100% !important;
            transform: none !important;
          }
          .mobile-header-wrapper {
            box-shadow: none !important;
            border-radius: 0 !important;
            border-left: none !important;
            border-right: none !important;
            border-top: none !important;
            border-bottom: 1px solid color-mix(in srgb, var(--color-border) 30%, transparent) !important;
            background-color: color-mix(in srgb, var(--color-surface) 15%, transparent) !important;
          }
          .mobile-header-inner {
            height: 52px !important;
            padding-inline: var(--space-3) !important;
          }
          .mobile-logo {
            height: 20px !important;
          }
          .mobile-controls-gap {
            gap: var(--space-2) !important;
          }
          
          .btn-brutal-nav {
            padding: 6px 12px !important;
            font-size: 0.7rem !important;
            border-width: 1.5px !important;
            box-shadow: 2px 2px 0px var(--color-text-primary) !important;
          }

          .btn-brutal-nav:hover {
            transform: translate(-1px, -1px) !important;
            box-shadow: 3px 3px 0px var(--color-text-primary) !important;
          }

          .btn-brutal-nav:active {
            transform: translate(1px, 1px) !important;
            box-shadow: 0px 0px 0px var(--color-text-primary) !important;
          }
        }
        
        /* Brutalist link hover effects */
        .nav-anchor-brutal:hover {
          color: var(--color-text-primary) !important;
          background-color: var(--color-surface-subtle);
          border-color: var(--color-text-primary);
          box-shadow: 2px 2px 0px var(--color-text-primary);
          transform: translate(-1px, -1px);
        }
        
        @keyframes blink {
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  );
};
