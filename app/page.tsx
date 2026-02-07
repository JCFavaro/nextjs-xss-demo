import Link from 'next/link'
import { cookies } from 'next/headers'

export default async function Home() {
  const cookieStore = await cookies()
  const currentOneTrustId = cookieStore.get('onetrust_id')?.value || 'Not configured'

  return (
    <div>
      <div style={{
        background: 'white',
        padding: '30px',
        borderRadius: '8px',
        marginBottom: '20px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ marginBottom: '15px' }}>Welcome to Your SaaS Platform</h2>
        <p style={{ marginBottom: '10px', color: '#666' }}>
          This demo simulates a multi-tenant SaaS application where tenant administrators
          can configure their OneTrust Cookie Consent Domain ID.
        </p>

        <div style={{
          background: '#f9f9f9',
          padding: '15px',
          borderRadius: '4px',
          marginTop: '20px'
        }}>
          <strong>Current OneTrust Domain ID:</strong>
          <code style={{
            display: 'block',
            marginTop: '10px',
            padding: '10px',
            background: 'white',
            border: '1px solid #ddd',
            borderRadius: '4px'
          }}>
            {currentOneTrustId}
          </code>
        </div>
      </div>

      <div style={{
        background: 'white',
        padding: '30px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ marginBottom: '15px' }}>Demo Actions</h3>

        <Link
          href="/admin"
          style={{
            display: 'inline-block',
            background: '#0070f3',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '6px',
            textDecoration: 'none',
            fontWeight: '500'
          }}
        >
          Go to Admin Panel →
        </Link>

        <p style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
          Configure your OneTrust Domain ID from the admin panel
        </p>
      </div>

      <div style={{
        background: '#fff3cd',
        padding: '20px',
        borderRadius: '8px',
        marginTop: '20px',
        border: '1px solid #ffc107'
      }}>
        <h4 style={{ marginBottom: '10px' }}>⚠️ Vulnerability Demonstration</h4>
        <p style={{ fontSize: '14px', marginBottom: '10px' }}>
          This app demonstrates CVE-XXXX-XXXX: XSS via Next.js Script component with
          beforeInteractive strategy.
        </p>
        <p style={{ fontSize: '14px', color: '#666' }}>
          The OneTrust Domain ID is injected into a beforeInteractive script without proper
          sanitization, allowing XSS attacks when tenant admins configure malicious values.
        </p>
      </div>
    </div>
  )
}
