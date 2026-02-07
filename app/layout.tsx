import Script from 'next/script'
import { cookies } from 'next/headers'
import './globals.css'

// Simula obtener configuración del tenant desde DB
async function getTenantConfig() {
  const cookieStore = await cookies()
  const oneTrustId = cookieStore.get('onetrust_id')?.value

  return {
    oneTrustDomainId: oneTrustId || 'default-domain-id',
    companyName: 'Demo SaaS Platform'
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const config = await getTenantConfig()

  return (
    <html lang="en">
      <head>
        {/*
          VULNERABLE PATTERN: OneTrust cookie consent integration

          Real-world scenario:
          - Multi-tenant SaaS platforms let tenant admins configure their OneTrust Domain ID
          - OneTrust REQUIRES strategy="beforeInteractive" to load before React hydrates
          - The Domain ID comes from tenant configuration (database)

          Issue #49830: https://github.com/vercel/next.js/issues/49830
          Documents that OneTrust integration is a common use case requiring custom attributes
          with beforeInteractive strategy
        */}
        <Script
          strategy="beforeInteractive"
          src="https://cdn.cookielaw.org/scripttemplates/otSDKStub.js"
          data-domain-script={config.oneTrustDomainId}
          data-language="en"
        />
      </head>
      <body>
        <div style={{ padding: '20px', fontFamily: 'system-ui' }}>
          <header style={{
            background: '#0070f3',
            color: 'white',
            padding: '20px',
            marginBottom: '20px',
            borderRadius: '8px'
          }}>
            <h1>{config.companyName}</h1>
            <p>Multi-Tenant SaaS Platform Demo</p>
          </header>
          {children}
        </div>
      </body>
    </html>
  )
}
