import { motion } from 'framer-motion'

const shellStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: 16,
  padding: 20,
  borderRadius: 24,
  background: 'rgba(255,255,255,0.92)',
  boxShadow: '0 20px 60px rgba(15, 23, 42, 0.12)',
  minHeight: '70vh',
  color: '#0f172a',
}

const topBarStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: 12,
  paddingBottom: 12,
  borderBottom: '1px solid rgba(148,163,184,0.24)',
}

const bodyStyle = {
  display: 'flex',
  gap: 16,
  flex: 1,
  minHeight: 0,
}

const sidebarStyle = {
  width: 260,
  flexShrink: 0,
  borderRadius: 18,
  background: 'linear-gradient(135deg, #f8fafc, #eef2ff)',
  padding: 14,
  minHeight: 0,
}

const contentStyle = {
  flex: 1,
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: 14,
}

export default function MailLayout({ title = 'Mail', subtitle = 'Stay on top of your conversations.', sidebar, children, actions }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      style={shellStyle}
    >
      <div style={topBarStyle}>
        <div>
          <h2 style={{ margin: 0, fontSize: 22 }}>{title}</h2>
          <p style={{ margin: '2px 0 0', color: '#64748b', fontSize: 13 }}>{subtitle}</p>
        </div>
        {actions ? <div>{actions}</div> : null}
      </div>

      <div style={bodyStyle}>
        {sidebar ? <aside style={sidebarStyle}>{sidebar}</aside> : null}
        <main style={contentStyle}>{children}</main>
      </div>
    </motion.div>
  )
}
