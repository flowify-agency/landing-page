import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Mail, MapPin, Clock, Truck } from 'lucide-react';

export const metadata = {
  title: 'Contact & Service Delivery — Flowify Agency',
  description: 'Official contact details and digital service delivery timelines for Flowify Agency.',
};

export default function ContactDeliveryPage() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-bg)', color: 'var(--color-text-primary)' }}>
      {/* Header */}
      <header
        style={{
          borderBottom: '1px solid var(--color-border)',
          backgroundColor: 'var(--color-surface)',
          padding: '16px var(--space-4)',
          position: 'sticky',
          top: 0,
          zIndex: 100
        }}
      >
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
            <img src="/in-line-flowify.svg" alt="Flowify" style={{ height: '26px', width: 'auto' }} />
          </Link>
          <Link
            href="/"
            className="btn-core"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontFamily: 'var(--font-heading-mono)',
              fontSize: '0.8rem',
              color: 'var(--color-text-primary)',
              textDecoration: 'none',
              padding: '6px 12px',
              border: '1.5px solid var(--color-border)'
            }}
          >
            <ArrowLeft size={14} /> Back to Home
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container" style={{ maxWidth: '840px', padding: 'var(--space-7) var(--space-4)' }}>
        <div style={{ marginBottom: 'var(--space-6)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-accent)', marginBottom: 'var(--space-2)' }}>
            <Truck size={18} />
            <span style={{ fontFamily: 'var(--font-heading-mono)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Service Delivery & Contact
            </span>
          </div>
          <h1 style={{ fontSize: 'var(--font-size-h2)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '8px' }}>
            Contact Us & Fulfillment Policy
          </h1>
          <p style={{ fontFamily: 'var(--font-heading-mono)', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
            Official communication channels and service fulfillment timeline
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', lineHeight: 1.7, fontSize: '0.95rem', color: 'var(--color-text-secondary)' }}>
          {/* Contact Details Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 'var(--space-4)' }}>
            <div
              style={{
                backgroundColor: 'var(--color-surface)',
                border: '2px solid var(--color-border)',
                padding: 'var(--space-4)',
                borderRadius: 'var(--radius-sm)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--color-accent)', marginBottom: '10px' }}>
                <Mail size={20} />
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>Email Support</h3>
              </div>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
                General & Technical Enquiries:
              </p>
              <a
                href="mailto:flowifyy.agency@gmail.com"
                style={{
                  fontFamily: 'var(--font-heading-mono)',
                  color: 'var(--color-accent)',
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  display: 'inline-block',
                  marginTop: '6px'
                }}
              >
                flowifyy.agency@gmail.com
              </a>
            </div>

     
          </div>

          <section>
            <h2 style={{ fontSize: '1.2rem', color: 'var(--color-text-primary)', marginBottom: '8px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={18} style={{ color: 'var(--color-accent)' }} />
              Shipping & Delivery Policy (Digital Services)
            </h2>
            <p>
              Flowify Agency provides digital software development, API integration, and business workflow automation consulting services. As our deliverables are exclusively digital, no physical shipping takes place.
            </p>
            <ul style={{ paddingLeft: '20px', marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <li>
                <strong>Operations Leakage Audit (₹1,000 INR):</strong> Following successful payment verification, your technical audit report and customized workflow blueprint are compiled and sent directly to your submitted email address within <strong>24 to 48 business hours</strong>.
              </li>
              <li>
                <strong>Confirmation Notice:</strong> An automated confirmation email and receipt are issued immediately upon successful transaction completion via Razorpay.
              </li>
              <li>
                <strong>Custom Implementation Pipelines:</strong> Milestone-based software integrations (such as Tally ERP sync or Zoho Flow relays) are deployed directly to your designated staging or production infrastructure as outlined in your project statement of work.
              </li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: '1.2rem', color: 'var(--color-text-primary)', marginBottom: '8px', fontWeight: 700 }}>
              Need Assistance?
            </h2>
            <p>
              If you have not received your digital report within 48 business hours of payment, please write to us at <strong>flowifyy.agency@gmail.com</strong> with your payment transaction ID for priority assistance.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
