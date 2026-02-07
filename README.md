# Next.js beforeInteractive XSS Vulnerability Demo

## Vulnerability Details

**CVE-PENDING**: XSS via Next.js Script component with strategy="beforeInteractive"

This demo application demonstrates a **real-world exploitation scenario** for an XSS vulnerability in Next.js 16.1.6 (latest version).

### Affected Code

**File**: packages/next/src/client/script.tsx
**Lines**: 284-291, 308-315, 354-360

### Real-World Scenario

This vulnerability affects **multi-tenant SaaS platforms** where:

1. **OneTrust Cookie Consent** integration requires strategy="beforeInteractive" (documented in Issue #49830)
2. Tenant administrators configure their **OneTrust Domain ID** (stored in database)
3. The Domain ID is passed as data-domain-script attribute to the Script component
4. **No sanitization** occurs before injecting into HTML

### Attack Vector

**Attacker steps**:
1. Create tenant account in multi-tenant SaaS
2. Configure OneTrust Domain ID as: </script><img src=x onerror=alert(document.domain)>
3. When users visit attacker-tenant.saas.com, XSS executes
4. Can steal cookies, hijack sessions, perform actions as victim user

### Proof of Concept

#### Setup

```bash
npm install
npm run dev
```

Open http://localhost:3000

#### Exploitation Steps

1. Navigate to **/admin** panel
2. Enter XSS payload in "OneTrust Domain Script ID" field
3. Click "Save Configuration"
4. Return to homepage
5. **XSS fires** - alert dialog appears

## Testing with Shannon

Once deployed to Vercel, use Shannon to detect the XSS in black-box mode.

## Author

**Date**: 2026-02-07
**Next.js Version Tested**: 16.1.6 (latest)
