import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Shield } from 'lucide-react';

export const metadata = {
  title: 'Terms & Conditions — Flowify Agency',
  description: 'Terms and Conditions for Flowify Agency workflow automation, software integration, and operations auditing services.',
};

export default function TermsPage() {
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
            <Shield size={18} />
            <span style={{ fontFamily: 'var(--font-heading-mono)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Legal Framework
            </span>
          </div>
          <h1 style={{ fontSize: 'var(--font-size-h2)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '8px' }}>
            Terms & Conditions
          </h1>
          <p style={{ fontFamily: 'var(--font-heading-mono)', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
            Last Updated: October 2026 // Effective immediately for all Flowify Agency users and clients
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', lineHeight: 1.7, fontSize: '0.95rem', color: 'var(--color-text-secondary)' }}>
          <section>
            <h2 style={{ fontSize: '1.2rem', color: 'var(--color-text-primary)', marginBottom: '8px', fontWeight: 700 }}>
              1. Overview and Scope of Services
            </h2>
            <p>
              Flowify Agency (&quot;Flowify&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) provides specialized information technology, custom software development, API integration, and business workflow automation consulting services. Our offerings include enterprise resource planning (ERP) sync solutions (e.g., Tally ERP, Zoho CRM), WhatsApp Business API automated notification pipelines, custom client applications, and paid technical diagnostic audits (e.g., the ₹1,000 Operations Leakage Audit).
            </p>
            <p style={{ marginTop: '8px' }}>
              Flowify operates strictly as a software engineering and workflow automation firm. We do not provide, resell, or broker telemarketing lists, lead generation databases, or unauthorized scraping services.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.2rem', color: 'var(--color-text-primary)', marginBottom: '8px', fontWeight: 700 }}>
              2. Operations Audit and Consulting Deliverables
            </h2>
            <p>
              When purchasing a digital Operations Diagnostic Audit (₹1,000 INR one-time fee), our systems engineering team reviews your reported operational bottlenecks (e.g., manual spreadsheet data entry, delayed ERP synchronization, disconnected software endpoints) and generates a comprehensive digital technical diagnostic report and automation architecture blueprint.
            </p>
            <p style={{ marginTop: '8px' }}>
              The digital diagnostic report is delivered via email to the address provided during checkout within 24 to 48 business hours.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.2rem', color: 'var(--color-text-primary)', marginBottom: '8px', fontWeight: 700 }}>
              3. Payment and Fees
            </h2>
            <p>
              All payments on our platform are processed securely via verified third-party payment gateways, including Razorpay. Prices are displayed in Indian Rupees (INR). By placing an order, you warrant that you are authorized to utilize the chosen payment instrument.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.2rem', color: 'var(--color-text-primary)', marginBottom: '8px', fontWeight: 700 }}>
              4. Intellectual Property
            </h2>
            <p>
              All proprietary code, algorithms, software architectures, interfaces, visual styling, and brand assets created by Flowify remain the intellectual property of Flowify Agency unless explicitly transferred via a separate written contract.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.2rem', color: 'var(--color-text-primary)', marginBottom: '8px', fontWeight: 700 }}>
              5. Governing Law and Jurisdiction
            </h2>
            <p>
              These Terms and Conditions are governed by and construed in accordance with the laws of India. Any disputes arising from or in connection with these terms shall be subject to the exclusive jurisdiction of the competent courts in Maharashtra, India.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.2rem', color: 'var(--color-text-primary)', marginBottom: '8px', fontWeight: 700 }}>
              6. Contact Information
            </h2>
            <p>
              For legal inquiries or operational notices, please contact us at:
              <br />
              <strong>Email:</strong> flowifyy.agency@gmail.com
              <br />
              <strong>Entity:</strong> Flowify Agency
              <br />
              {/* <strong>GSTIN:</strong> 27AAFCN8012E1ZS */}
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
