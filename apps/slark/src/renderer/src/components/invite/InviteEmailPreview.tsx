export interface InviteEmailPreviewProps {
  inviterName: string
  workspaceName: string
  inviteLink: string
}

export function InviteEmailPreview({
  inviterName,
  workspaceName,
  inviteLink
}: InviteEmailPreviewProps): React.ReactElement {
  return (
    <div style={{ background: '#f4f4f5', padding: 32, borderRadius: 12, fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      <div style={{ maxWidth: 480, margin: '0 auto', background: '#ffffff', borderRadius: 12, overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
        <div style={{ padding: '28px 32px 20px', borderBottom: '1px solid #f0f0f0' }}>
          <span style={{ fontSize: 20, fontWeight: 700, color: '#6d28d9', letterSpacing: '-0.3px' }}>Slark</span>
        </div>

        <div style={{ padding: '32px 32px 28px' }}>
          <h1 style={{ fontSize: 20, fontWeight: 600, color: '#18181b', lineHeight: 1.4, margin: '0 0 12px' }}>
            {inviterName} invited you to join <strong>{workspaceName}</strong>
          </h1>
          <p style={{ fontSize: 14, color: '#71717a', lineHeight: 1.6, margin: '0 0 28px' }}>
            Slark is where teams collaborate with AI agents — write code, review PRs, and ship faster together.
          </p>

          <a
            href={inviteLink}
            style={{
              display: 'inline-block',
              padding: '12px 28px',
              background: '#6d28d9',
              color: '#ffffff',
              fontSize: 14,
              fontWeight: 600,
              borderRadius: 8,
              textDecoration: 'none',
              letterSpacing: '0.01em'
            }}
          >
            Join {workspaceName}
          </a>

          <p style={{ fontSize: 12, color: '#a1a1aa', lineHeight: 1.6, margin: '24px 0 0' }}>
            Or copy this link into your browser:
            <br />
            <span style={{ color: '#6d28d9', wordBreak: 'break-all' }}>{inviteLink}</span>
          </p>
        </div>

        <div style={{ padding: '16px 32px', background: '#fafafa', borderTop: '1px solid #f0f0f0' }}>
          <p style={{ fontSize: 11, color: '#a1a1aa', margin: 0, lineHeight: 1.5 }}>
            If you didn't expect this invitation, you can safely ignore this email.
            <br />
            Sent by Slark on behalf of {inviterName}.
          </p>
        </div>
      </div>
    </div>
  )
}
