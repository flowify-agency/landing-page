import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Lock } from 'lucide-react';

export const metadata = {
  title: 'Privacy Policy — Flowify Agency',
  description: 'Privacy Policy for Flowify Agency outlining our data collection, security, and privacy practices.',
};

export default function PrivacyPage() {
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
            <Lock size={18} />
            <span style={{ fontFamily: 'var(--font-heading-mono)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Data Protection
            </span>
          </div>
          <h1 style={{ fontSize: 'var(--font-size-h2)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '8px' }}>
            Privacy Policy
          </h1>
          <p style={{ fontFamily: 'var(--font-heading-mono)', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
            Last Updated: October 2026 // Compliant with Indian Information Technology Act and Digital Personal Data Protection
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', lineHeight: 1.7, fontSize: '0.95rem', color: 'var(--color-text-secondary)' }}>
          <section>
            <h2 style={{ fontSize: '1.2rem', color: 'var(--color-text-primary)', marginBottom: '8px', fontWeight: 700 }}>
              1. Information We Collect
            </h2>
            <p>
              When you interact with Flowify Agency, request a technical audit, or set up a consultation meeting, we may collect the following details:
            </p>
            <ul style={{ paddingLeft: '20px', marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <li><strong>Contact Information:</strong> Name, business email address, phone number.</li>
              <li><strong>Organizational Details:</strong> Company/organization name, operational stack, reported system bottlenecks.</li>
              <li><strong>Transaction Data:</strong> Payment transaction identifier (processed securely via Razorpay; Flowify does not store or process card numbers, CVVs, or bank credentials directly).</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: '1.2rem', color: 'var(--color-text-primary)', marginBottom: '8px', fontWeight: 700 }}>
              2. How We Use Your Information
            </h2>
            <p>
              Your information is utilized strictly to:
            </p>
            <ul style={{ paddingLeft: '20px', marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <li>Compile and deliver your customized Operations Diagnostic Blueprint and technical audit.</li>
              <li>Coordinate meetings and technical workflow proposals.</li>
              <li>Issue payment confirmations, GST receipts, and transaction records.</li>
            </ul>
            <p style={{ marginTop: '10px' }}>
              <strong>Zero Data Selling:</strong> Flowify does not sell, rent, lease, or distribute your personal or commercial contact information to any third-party marketing companies, advertisers, or lead brokers.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.2rem', color: 'var(--color-text-primary)', marginBottom: '8px', fontWeight: 700 }}>
              3. Payment Security & Third-Party Processors
            </h2>
            <p>
              Payments for technical services are securely processed via Razorpay (PCI-DSS compliant payment gateway). All payment data is encrypted in transit using industry-standard Transport Layer Security (TLS 1.3).
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.2rem', color: 'var(--color-text-primary)', marginBottom: '8px', fontWeight: 700 }}>
              4. Data Retention and Rights
            </h2>
            <p>
              We retain business consultation records only as long as necessary to fulfill contractual obligations and comply with applicable statutory accounting laws in India. You may request the deletion or correction of your details at any time by contacting us.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.2rem', color: 'var(--color-text-primary)', marginBottom: '8px', fontWeight: 700 }}>
              5. Contact Us
            </h2>
            <p>
              If you have any questions regarding this Privacy Policy, please email us at <strong>flowifyy.agency@gmail.com</strong>.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
