import React from 'react';
import Link from 'next/link';
import { ArrowLeft, RefreshCw } from 'lucide-react';

export const metadata = {
  title: 'Cancellation & Refund Policy — Flowify Agency',
  description: 'Cancellation and Refund Policy for Flowify Agency technical services and operations diagnostic audits.',
};

export default function RefundPolicyPage() {
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
            <RefreshCw size={18} />
            <span style={{ fontFamily: 'var(--font-heading-mono)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Client Safeguards
            </span>
          </div>
          <h1 style={{ fontSize: 'var(--font-size-h2)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '8px' }}>
            Cancellation & Refund Policy
          </h1>
          <p style={{ fontFamily: 'var(--font-heading-mono)', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
            Last Updated: October 2026 // Clear guidelines on order cancellations, revisions, and refunds
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', lineHeight: 1.7, fontSize: '0.95rem', color: 'var(--color-text-secondary)' }}>
          <section>
            <h2 style={{ fontSize: '1.2rem', color: 'var(--color-text-primary)', marginBottom: '8px', fontWeight: 700 }}>
              1. Digital Technical Audit Service (₹1,000 INR)
            </h2>
            <p>
              Flowify Agency offers a professional one-time Operations Leakage Audit priced at ₹1,000 INR. This service consists of a technical bottleneck diagnostic, workflow mapping, and a custom operational repair blueprint.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.2rem', color: 'var(--color-text-primary)', marginBottom: '8px', fontWeight: 700 }}>
              2. Cancellation Window
            </h2>
            <p>
              You may request a complete cancellation and 100% refund of your audit order within <strong>12 hours</strong> of payment or at any time before our engineering team dispatches the finalized technical diagnostic report.
            </p>
            <p style={{ marginTop: '8px' }}>
              To request a cancellation, send an email to <strong>flowifyy.agency@gmail.com</strong> with your transaction ID and registered email.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.2rem', color: 'var(--color-text-primary)', marginBottom: '8px', fontWeight: 700 }}>
              3. Service Delivery Guarantee & Non-Delivery Refunds
            </h2>
            <p>
              We guarantee delivery of your customized digital audit report within <strong>48 business hours</strong> of successful payment. In the event that we fail to deliver your report within this period, you are entitled to a full 100% refund upon request.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.2rem', color: 'var(--color-text-primary)', marginBottom: '8px', fontWeight: 700 }}>
              4. Custom Implementation Projects
            </h2>
            <p>
              For custom enterprise workflow automation implementations (e.g., custom Tally sync bridges, tailored CRM pipelines), cancellation terms, milestone deliverables, and payment schedules are governed by the specific Service Level Agreement (SLA) signed between Flowify Agency and the client prior to project commencement.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.2rem', color: 'var(--color-text-primary)', marginBottom: '8px', fontWeight: 700 }}>
              5. Refund Processing Timeline
            </h2>
            <p>
              Once a refund request is approved, the funds are automatically initiated back to the original payment method (via Razorpay). The credit typically reflects in the customer&apos;s bank account or card within <strong>5 to 7 business days</strong>, depending on your issuing bank&apos;s settlement schedule.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.2rem', color: 'var(--color-text-primary)', marginBottom: '8px', fontWeight: 700 }}>
              6. Contact for Disputes & Refunds
            </h2>
            <p>
              For any billing concerns or to initiate a refund, please contact our support desk:
              <br />
              <strong>Email:</strong> flowifyy.agency@gmail.com
              <br />
              <strong>Subject:</strong> Refund Request - [Transaction ID]
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
