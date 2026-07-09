import { useState, useEffect } from 'react'
import './App.css'
import Inbox from "./components/Inbox";
import {

motion,

AnimatePresence

} from "framer-motion";
import Dashboard from "./components/Dashboard";
const SENDER_OPTIONS = [
	'founder@soulmatrix.in',
	'hello@soulmatrix.in',
	'support@soulmatrix.in',
	'security@soulmatrix.in',
]

function deviceId() {
	try {
		const id = `${navigator.userAgent}|${navigator.platform}`
		return btoa(id)
	} catch (e) {
		return 'unknown'
	}
}

const getInitialView = () => {
	if (typeof window === 'undefined') return 'compose'
	return window.location.pathname === '/inbox' ? 'inbox' : 'compose'
}

const getInitialInboxVariant = () => {
	if (typeof window === 'undefined') return 'default'
	return window.location.pathname === '/inbox' ? 'bell' : 'default'
}

export default function App() {
	const [activeTab, setActiveTab] = useState(getInitialView);
	const [inboxView, setInboxView] = useState(getInitialInboxVariant);
	const [user, setUser] = useState(() => {
		if (typeof window === 'undefined') return ''
		return window.localStorage.getItem('mailapp-user') || ''
	})
	const [password, setPassword] = useState('')
	const [loggedIn, setLoggedIn] = useState(() => {
		if (typeof window === 'undefined') return false
		return window.localStorage.getItem('mailapp-auth') === 'true'
	})
	const [newDevice, setNewDevice] = useState(false)
	const [deviceName, setDeviceName] = useState('')
	const [to, setTo] = useState('')
	const [subject, setSubject] = useState('')
	const [body, setBody] = useState('')
	const [from, setFrom] = useState(SENDER_OPTIONS[0])
	const [status, setStatus] = useState('')

	const normalizeApiBase = (value = '') => {
		const base = String(value || '').trim()
		if (!base) return ''
		if (/^https?:\/\//i.test(base)) return base.replace(/\/+$/, '')
		return `https://${base.replace(/\/+$/, '')}`
	}

	const API_BASE = normalizeApiBase(import.meta.env.VITE_API_BASE)

	// preset users and their passwords (set real values in .env as VITE_PW_VICKY etc)
	const PRESET_USERS = ['vicky', 'manmat', 'yash']
	const PASSWORDS = {
		'vicky': import.meta.env.VITE_PW_VICKY,
		'manmat': import.meta.env.VITE_PW_MANMAT,
		'yash': import.meta.env.VITE_PW_YASH
	}

	useEffect(() => {
		const id = deviceId()
		const devices = JSON.parse(localStorage.getItem('devices') || '[]')
		if (devices.includes(id)) {
			// nothing
		}
	}, [])

	useEffect(() => {
		if (typeof window === 'undefined') return
		window.localStorage.setItem('mailapp-auth', String(loggedIn))
		if (loggedIn && user) {
			window.localStorage.setItem('mailapp-user', user)
		} else {
			window.localStorage.removeItem('mailapp-user')
		}
	}, [loggedIn, user])

	useEffect(() => {
		if (typeof window === 'undefined') return
		const storedAuth = window.localStorage.getItem('mailapp-auth') === 'true'
		if (storedAuth) {
			setLoggedIn(true)
			const storedUser = window.localStorage.getItem('mailapp-user') || ''
			if (storedUser) setUser(storedUser)
		}
		const nextTab = window.location.pathname === '/inbox' ? 'inbox' : 'compose'
		setActiveTab(nextTab)
		setInboxView(nextTab === 'inbox' ? 'bell' : 'default')
	}, [])

	useEffect(() => {
		const onPopState = () => {
			const nextTab = window.location.pathname === '/inbox' ? 'inbox' : 'compose'
			setActiveTab(nextTab)
			setInboxView(nextTab === 'inbox' ? 'bell' : 'default')
		}

		window.addEventListener('popstate', onPopState)
		return () => window.removeEventListener('popstate', onPopState)
	}, [])

	const navigateToView = (nextTab, nextPath) => {
		const resolvedTab = nextTab === 'inbox' ? 'inbox' : 'compose'
		const resolvedPath = nextPath || (resolvedTab === 'inbox' ? '/inbox' : '/')
		setActiveTab(resolvedTab)
		setInboxView(resolvedTab === 'inbox' ? 'bell' : 'default')
		if (typeof window !== 'undefined') {
			window.history.pushState({}, '', resolvedPath)
		}
	}

	const handleBellOpenInbox = () => {
		navigateToView('inbox', '/inbox')
	}

	const handleLogin = (e) => {
		e.preventDefault()

		// validate against env passwords
		const expected = PASSWORDS[user]
		if (expected && password === expected) {
			setUser(user)
			const id = deviceId()
			const devices = JSON.parse(localStorage.getItem('devices') || '[]')
			if (!devices.includes(id)) {
				setNewDevice(true)
			} else {
				setLoggedIn(true)
				if (window.location.pathname === '/inbox') {
					navigateToView('inbox', '/inbox')
				} else {
					navigateToView('compose', '/')
				}
			}
		} else {
			alert('invalid credentials — check password for selected user')
		}
	}

	const registerDevice = () => {
		const id = deviceId()
		const devices = JSON.parse(localStorage.getItem('devices') || '[]')
		devices.push(id)
		localStorage.setItem('devices', JSON.stringify(devices))
		// save device name mapping
		const names = JSON.parse(localStorage.getItem('deviceNames') || '{}')
		names[id] = deviceName || 'my device'
		localStorage.setItem('deviceNames', JSON.stringify(names))
		setNewDevice(false)
		setLoggedIn(true)
		setDeviceName('')
		if (window.location.pathname === '/inbox') {
			navigateToView('inbox', '/inbox')
		} else {
			navigateToView('compose', '/')
		}
	}

	const sendEmail = async () => {
		setStatus('sending')
		try {
			const res = await fetch(`${API_BASE}/send-email`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ from_email: from, to, subject, text: body, html: body }),
			})
			const text = await res.text()
			let data = null
			try {
				data = text ? JSON.parse(text) : null
			} catch (e) {
				data = text
			}
			if (!res.ok) throw new Error(JSON.stringify(data) || res.statusText)
			setStatus('sent')
		} catch (err) {
			console.error(err)
			setStatus('error')
		}
	}

	if (!loggedIn) {
		return (
			<div className="app">
				<div className="bg" />
				<div className="login-wrapper">
					<div className="login-card">
						<div className="logo-circle">✉</div>
						<h1>SoulMatrix Mail</h1>
						<p>Secure, polished messaging for everyday work and collaboration.</p>

						<form onSubmit={handleLogin} className="login-form">
							<div className="input-group">
								<label>Choose account</label>
								<select value={user} onChange={(e) => { setUser(e.target.value); setPassword('') }}>
									<option value="">-- select account --</option>
									{PRESET_USERS.map((u) => (
										<option key={u} value={u}>{u}</option>
									))}
								</select>
							</div>

							{user && (
								<div className="input-group">
									<label>Password</label>
									<div className="password-box">
										<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" />
									</div>
								</div>
							)}

							<button type="submit" className="login-submit">Sign in</button>
						</form>

						{newDevice && (
							<div className="device-panel">
								<h4>New device detected</h4>
								<p>Please give your device a name to register it for future access.</p>
								<input value={deviceName} onChange={(e) => setDeviceName(e.target.value)} placeholder="My laptop" />
								<div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
									<button className="login-submit secondary" onClick={registerDevice}>Register device</button>
								</div>
							</div>
						)}

						<div className="login-footer">No guest access • Use your personal account</div>
					</div>
				</div>
			</div>
		)
	}

	return (
  <div className="app">
    <div className="bg" />

    <Dashboard
  user={user}
  onLogout={() => {
    setLoggedIn(false);
    setPassword("");
    setStatus("");
    setActiveTab("compose");
    setInboxView("default");
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem('mailapp-auth');
      window.localStorage.removeItem('mailapp-user');
      window.history.pushState({}, '', '/');
    }
  }}
  onOpenInbox={handleBellOpenInbox}
>
  <div className="dashboard-tabs">
    <button
      className={activeTab === "compose" ? "active" : ""}
      onClick={() => navigateToView("compose", "/")}
    >
      ✍️ Compose
    </button>

    <button
      className={activeTab === "inbox" ? "active" : ""}
      onClick={() => navigateToView("inbox", "/inbox")}
    >
      📥 Inbox
    </button>
  </div>

  {activeTab === "compose" && (
    <section className="compose-area">
      <div className="compose-layout">
        {/* ================= LEFT SIDE ================= */}

        <div className="editor">
          <div className="compose-header">
            <div>
              <h2>Compose Email</h2>
              <p>Create and preview your email before sending.</p>
            </div>

            <div className="editor-tools">
              <button className="tool-btn">📎</button>
              <button className="tool-btn">😊</button>
            </div>
          </div>

          <div className="field">
            <label>From</label>

            <select
              value={from}
              onChange={(e) => setFrom(e.target.value)}
            >
              {SENDER_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label>To</label>

            <input
              placeholder="john@example.com"
              value={to}
              onChange={(e) => setTo(e.target.value)}
            />
          </div>

          <div className="field">
            <label>Subject</label>

            <input
              placeholder="Email subject..."
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>

          <div className="field">
            <label>Body (HTML Supported)</label>

            <textarea
              className="editor-textarea"
              placeholder="<h1>Hello!</h1>"
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />
          </div>

          <div className="bottom-bar">
            <span>{body.length} Characters</span>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
              className="send"
              onClick={sendEmail}
            >
              📤 Send Email
            </motion.button>
          </div>

          <AnimatePresence>
            {status && (
              <motion.div
                initial={{
                  opacity: 0,
                  scale: 0.8,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                }}
                exit={{
                  opacity: 0,
                  scale: 0.8,
                }}
                className={`status-badge ${status}`}
              >
                {status}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ================= RIGHT SIDE ================= */}

        <div className="preview">
          <div className="preview-header">
            Live Preview
          </div>

          <div className="preview-body">
            {body ? (
              <div
                dangerouslySetInnerHTML={{
                  __html: body,
                }}
              />
            ) : (
              <div className="empty-preview">
                Your HTML preview will appear here.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )}

  {activeTab === "inbox" && (
    <Inbox

		API_BASE={API_BASE}

		activeTab={activeTab}

		setActiveTab={setActiveTab}

		/>
  )}
</Dashboard>
  </div>
)
}
