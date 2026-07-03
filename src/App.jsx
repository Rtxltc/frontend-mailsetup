import { useState, useEffect } from 'react'
import './App.css'
import {

motion,

AnimatePresence

} from "framer-motion";
import Login from "./components/Login";
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

export default function App() {
	const [user, setUser] = useState('')
	const [password, setPassword] = useState('')
	const [guestMode, setGuestMode] = useState(false)
	const [loggedIn, setLoggedIn] = useState(false)
	const [newDevice, setNewDevice] = useState(false)
	const [deviceName, setDeviceName] = useState('')
	const [to, setTo] = useState('')
	const [subject, setSubject] = useState('')
	const [body, setBody] = useState('')
	const [from, setFrom] = useState(SENDER_OPTIONS[0])
	const [status, setStatus] = useState('')

	const API_BASE = import.meta.env.VITE_API_BASE || 'https://admin-mail.soulmatrix.in'

	// preset users and their passwords (set real values in .env as VITE_PW_VICKY etc)
	const PRESET_USERS = ['vicky lode', 'manmat gand mare', 'yash daddy', 'guest']
	const PASSWORDS = {
		'vicky lode': import.meta.env.VITE_PW_VICKY, 
		'manmat gand mare': import.meta.env.VITE_PW_MANMAT,
		'yash daddy': import.meta.env.VITE_PW_YASH 
	}

	useEffect(() => {
		const id = deviceId()
		const devices = JSON.parse(localStorage.getItem('devices') || '[]')
		if (devices.includes(id)) {
			// nothing
		}
	}, [])

	const handleLogin = (e) => {
		e.preventDefault()
		if (user === 'guest') {
			setGuestMode(true)
			const id = deviceId()
			const devices = JSON.parse(localStorage.getItem('devices') || '[]')
			if (!devices.includes(id)) {
				setNewDevice(true)
			} else {
				setLoggedIn(true)
			}
			return
		}

		// validate against env passwords
		const expected = PASSWORDS[user]
		if (expected && password === expected) {
			const id = deviceId()
			const devices = JSON.parse(localStorage.getItem('devices') || '[]')
			if (!devices.includes(id)) {
				setNewDevice(true)
			} else {
				setLoggedIn(true)
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
	}

	const guestAllowed = () => {
		try {
			const last = parseInt(localStorage.getItem('guest-last-sent') || '0', 10)
			const now = Date.now()
			// 24 hours
			return now - last >= 24 * 60 * 60 * 1000
		} catch (e) {
			return true
		}
	}

	const sendEmail = async () => {
		setStatus('sending')
		try {
			if (guestMode && !guestAllowed()) {
				alert('Guest mode allows 1 send per day per browser. Try again later.')
				setStatus('idle')
				return
			}
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
			// mark guest send time
			if (guestMode) localStorage.setItem('guest-last-sent', String(Date.now()))
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
				<div className="login-panel">
					<h2>Mail App — Demo UI</h2>
					<form onSubmit={handleLogin} className="login-form">
						<div>
							<label>Choose user</label>
							<select value={user} onChange={(e) => setUser(e.target.value)}>
								<option value="">-- select --</option>
								{PRESET_USERS.map((u) => (
									<option key={u} value={u}>{u}</option>
								))}
							</select>
						</div>
						{user && user !== 'guest' && (
							<div>
								<label>Password</label>
								<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
							</div>
						)}
						<div style={{ marginTop: 12 }}>
							<button type="submit">Sign in</button>
						</div>
					</form>

					{newDevice && (
						<div className="device-panel">
							<h4>New device detected</h4>
							<p>Please give your device a name to register it for future access.</p>
							<input value={deviceName} onChange={(e) => setDeviceName(e.target.value)} placeholder="My laptop" />
							<div style={{ display: 'flex', gap: 8 }}>
								<button onClick={registerDevice}>Register device</button>
							</div>
						</div>
					)}
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
    }}
>
      <section className="compose-area">
        <div className="compose-layout">

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
          <option
            key={s}
            value={s}
          >
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

      <span>
        {body.length} Characters
      </span>

      <button
        className="send"
        onClick={sendEmail}
      >
        📤 Send Email
      </button>

    </div>
		<AnimatePresence>
			{status && (
			<motion.div

				initial={{
				opacity:0,
				scale:.8
				}}

				animate={{
				opacity:1,
				scale:1
				}}

				exit={{
				opacity:0,
				scale:.8
				}}

className={`status-badge ${status}`}
>
				{status}
			</motion.div>
			)}
		</AnimatePresence>

  </div>

  <div className="preview">

    <div className="preview-header">

      Live Preview

    </div>

    <div className="preview-body">

      {body ? (
        <div
          dangerouslySetInnerHTML={{
            __html: body
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
    </Dashboard>
  </div>
)
}
