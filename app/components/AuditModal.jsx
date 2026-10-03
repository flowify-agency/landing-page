"use client";

import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, HelpCircle, Loader2 } from 'lucide-react';

export const AuditModal = ({ isOpen, onClose, computedLeak, onSubmit }) => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    company: '',
    bottleneck: 'Manual Data Entry & Invoicing'
  });
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  // Load Razorpay script dynamically
  useEffect(() => {
    if (isOpen) {
      setErrorMsg('');
      if (window.Razorpay) {
        setIsScriptLoaded(true);
        return;
      }
      
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => setIsScriptLoaded(true);
      script.onerror = () => {
        console.error('Failed to load Razorpay Checkout SDK');
        setErrorMsg('Failed to load payment gateway. Please check your connection.');
      };
      document.body.appendChild(script);

      return () => {
        // Leave script loaded to avoid multiple script tags if opened again
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handlePay = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email) {
      setErrorMsg('Please enter your Name and Email address.');
      return;
    }

    setIsProcessing(true);
    setErrorMsg('');

    try {
      // 1. Create order on server-side
      const response = await fetch('/api/razorpay', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ amount: 1000 })
      });

      const orderData = await response.json();

      if (orderData.error && !orderData.isDemo) {
        throw new Error(orderData.error);
      }

      // 2. Configure Razorpay checkout options
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_flowifyDemoKey', // Fallback for testing
        amount: 100000, // ₹1,000 in paise
        currency: 'INR',
        name: 'Flowify Agency',
        description: 'Operations Leakage Audit',
        image: 'https://www.flowify.agency/favicon.png',
        order_id: orderData.isDemo ? undefined : orderData.id, // If demo mode, don't pass order_id to trigger standard client checkout
        handler: function (response) {
          setIsProcessing(false);
          // Payment successful! Submit form details
          onSubmit(form.name, form.email, form.company, form.bottleneck, response.razorpay_payment_id);
          onClose();
        },
        prefill: {
          name: form.name,
          email: form.email,
          contact: ''
        },
        theme: {
          color: '#10B981' // Flowify emerald green
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
          }
        }
      };

      if (!window.Razorpay) {
        throw new Error('Razorpay SDK not loaded. Please try again.');
      }

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {
      console.error('Payment initialization failed:', err);
      // In case keys are missing/errored, offer a local bypass/mock checkout for local dev preview
      setErrorMsg(`Payment error: ${err.message || 'Verification failed.'}`);
      setIsProcessing(false);
    }
  };

  const handleDemoBypass = () => {
    // If the developer wants to preview without keys, we can bypass payment
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onSubmit(form.name, form.email, form.company, form.bottleneck, 'pay_mock_success_1000');
      onClose();
    }, 1200);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(7, 7, 9, 0.85)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2000,
        padding: 'var(--space-3)'
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '540px',
          backgroundColor: 'var(--color-surface)',
          border: '2px solid var(--color-text-primary)',
          boxShadow: '8px 8px 0px var(--color-accent)',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          animation: 'modalZoomIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Window title bar (Brutalist aesthetic) */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 18px',
            backgroundColor: 'var(--color-surface-subtle)',
            borderBottom: '2px solid var(--color-text-primary)',
            fontFamily: 'var(--font-heading-mono)',
            fontSize: 'var(--font-size-xs)',
            fontWeight: 700,
            color: 'var(--color-text-primary)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ display: 'flex', gap: '4px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--color-danger)' }}></span>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--color-warning)' }}></span>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--color-accent)' }}></span>
            </div>
            <span>paid-leakage-audit.exe</span>
          </div>
          <button 
            onClick={onClose} 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              color: 'var(--color-text-secondary)',
              transition: 'color var(--transition-fast)'
            }}
            className="hover-close"
          >
            <X size={16} />
          </button>
        </div>

        {/* Modal Content */}
        <div style={{ padding: 'var(--space-4) var(--space-5)' }}>
          {/* Header Description */}
          <div style={{ marginBottom: 'var(--space-4)' }}>
            <h3 style={{ fontSize: 'var(--font-size-h3)', marginBottom: '8px', color: 'var(--color-text-primary)' }}>
              Operations Leakage Audit
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
              Request a comprehensive technical blueprint of your operations. Our team analyzes manual friction points and implements automated flow channels.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handlePay} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Name input */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label 
                htmlFor="name" 
                style={{ 
                  fontFamily: 'var(--font-heading-mono)', 
                  fontSize: '0.75rem', 
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  color: 'var(--color-text-secondary)'
                }}
              >
                Org Contact Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={form.name}
                onChange={handleChange}
                placeholder="Enter contact person's name"
                style={{
                  width: '100%',
                  border: '2px solid var(--color-border)',
                  backgroundColor: 'var(--color-surface-subtle)',
                  color: 'var(--color-text-primary)',
                  padding: '10px 14px',
                  fontSize: '0.9rem',
                  outline: 'none',
                  transition: 'border-color var(--transition-fast)'
                }}
                className="modal-input"
              />
            </div>

            {/* Email input */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label 
                htmlFor="email" 
                style={{ 
                  fontFamily: 'var(--font-heading-mono)', 
                  fontSize: '0.75rem', 
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  color: 'var(--color-text-secondary)'
                }}
              >
                Business Node Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={form.email}
                onChange={handleChange}
                placeholder="example@company.com"
                style={{
                  width: '100%',
                  border: '2px solid var(--color-border)',
                  backgroundColor: 'var(--color-surface-subtle)',
                  color: 'var(--color-text-primary)',
                  padding: '10px 14px',
                  fontSize: '0.9rem',
                  outline: 'none',
                  transition: 'border-color var(--transition-fast)'
                }}
                className="modal-input"
              />
            </div>

            {/* Company input */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label 
                htmlFor="company" 
                style={{ 
                  fontFamily: 'var(--font-heading-mono)', 
                  fontSize: '0.75rem', 
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  color: 'var(--color-text-secondary)'
                }}
              >
                Organization / Company
              </label>
              <input
                type="text"
                id="company"
                name="company"
                value={form.company}
                onChange={handleChange}
                placeholder="e.g. Acme Corp"
                style={{
                  width: '100%',
                  border: '2px solid var(--color-border)',
                  backgroundColor: 'var(--color-surface-subtle)',
                  color: 'var(--color-text-primary)',
                  padding: '10px 14px',
                  fontSize: '0.9rem',
                  outline: 'none',
                  transition: 'border-color var(--transition-fast)'
                }}
                className="modal-input"
              />
            </div>

            {/* Bottleneck select */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label 
                htmlFor="bottleneck" 
                style={{ 
                  fontFamily: 'var(--font-heading-mono)', 
                  fontSize: '0.75rem', 
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  color: 'var(--color-text-secondary)'
                }}
              >
                Worst Operational Bottleneck
              </label>
              <select
                id="bottleneck"
                name="bottleneck"
                value={form.bottleneck}
                onChange={handleChange}
                style={{
                  width: '100%',
                  border: '2px solid var(--color-border)',
                  backgroundColor: 'var(--color-surface-subtle)',
                  color: 'var(--color-text-primary)',
                  padding: '10px 14px',
                  fontSize: '0.9rem',
                  outline: 'none',
                  transition: 'border-color var(--transition-fast)'
                }}
                className="modal-input"
              >
                <option value="Manual Data Entry & Invoicing">Manual Data Entry & Invoicing</option>
                <option value="WhatsApp API Notification Relays">WhatsApp API Notification Relays</option>
                <option value="Zoho CRM / Zoho Flow Pipelines">Zoho CRM / Zoho Flow Pipelines</option>
                <option value="Tally ERP Sync Delayed">Tally ERP Sync Delayed</option>
                <option value="Siloed POS Systems">Siloed POS Systems</option>
                <option value="Other Operations Drain">Other Operations Drain</option>
              </select>
            </div>

            {/* Diagnostics Leak (inherited context) */}
           

            {/* Price Banner */}
            <div 
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: 'var(--color-surface-subtle)',
                border: '2px solid var(--color-text-primary)',
                padding: '12px 18px',
                marginTop: '4px'
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', fontFamily: 'var(--font-heading-mono)', color: 'var(--color-text-muted)', fontWeight: 700 }}>
                  Billing Fee (One-time)
                </span>
                <span style={{ fontFamily: 'var(--font-heading-mono)', fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-text-primary)' }}>
                  ₹1,000 <span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--color-text-secondary)' }}>INR</span>
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-accent)', fontSize: '0.75rem', fontWeight: 600 }}>
                <ShieldCheck size={16} />
                <span>SECURE PAYMENT</span>
              </div>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div 
                style={{ 
                  fontSize: '0.8rem', 
                  color: 'var(--color-danger)', 
                  fontWeight: 600,
                  backgroundColor: 'rgba(239, 68, 68, 0.05)',
                  padding: '8px 12px',
                  border: '1px solid var(--color-danger)' 
                }}
              >
                {errorMsg}
                {errorMsg.includes('credentials') && (
                  <div style={{ marginTop: '8px', display: 'flex', gap: '8px' }}>
                    <button
                      type="button"
                      onClick={handleDemoBypass}
                      className="btn-core btn-pixel-brutal btn-sm-action"
                      style={{ fontSize: '10px', padding: '4px 8px', margin: 0, borderSize: '1.5px', background: 'var(--color-accent)', color: '#000' }}
                    >
                      Bypass & Submit (Mock Checkout)
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Pay Button */}
            <button
              type="submit"
              disabled={isProcessing || !isScriptLoaded}
              className="btn-core"
              style={{
                backgroundColor: 'var(--color-accent)',
                color: '#070709',
                border: '2px solid var(--color-text-primary)',
                boxShadow: isProcessing ? 'none' : '4px 4px 0px var(--color-text-primary)',
                transform: isProcessing ? 'translate(4px, 4px)' : 'none',
                fontFamily: 'var(--font-heading-mono)',
                fontSize: '0.85rem',
                fontWeight: 800,
                padding: '14px 20px',
                cursor: (isProcessing || !isScriptLoaded) ? 'not-allowed' : 'pointer',
                opacity: !isScriptLoaded ? 0.7 : 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.1s ease'
              }}
            >
              {isProcessing ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Processing Payment...</span>
                </>
              ) : (
                <span>Pay ₹1,000 & Get Technical Audit</span>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Local animation keyframes & hover overrides */}
      <style>{`
        @keyframes modalZoomIn {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        
        .hover-close:hover {
          color: var(--color-text-primary) !important;
        }

        .modal-input:focus {
          border-color: var(--color-accent) !important;
        }

        .animate-spin {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
