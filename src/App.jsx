import { useState, useEffect } from 'react'

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
	const [loggedIn, setLoggedIn] = useState(false)
	const [newDevice, setNewDevice] = useState(false)
	const [deviceName, setDeviceName] = useState('')
	const [to, setTo] = useState('')
	const [subject, setSubject] = useState('')
	const [body, setBody] = useState('')
	const [from, setFrom] = useState(SENDER_OPTIONS[0])
	const [status, setStatus] = useState('')

	const API_BASE = import.meta.env.VITE_API_BASE || 'https://admin-mail.soulmatrix.in'

	// simple demo credentials
	const DEMO_USER = 'admin'
	const DEMO_PASS = 'password123'

	useEffect(() => {
		const id = deviceId()
		const devices = JSON.parse(localStorage.getItem('devices') || '[]')
		if (devices.includes(id)) {
			// nothing
		}
	}, [])

	const handleLogin = (e) => {
		e.preventDefault()
		if (user === DEMO_USER && password === DEMO_PASS) {
			const id = deviceId()
			const devices = JSON.parse(localStorage.getItem('devices') || '[]')
			if (!devices.includes(id)) {
				setNewDevice(true)
			} else {
				setLoggedIn(true)
			}
		} else {
			alert('invalid credentials — demo: admin / password123')
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

	const sendEmail = async () => {
		setStatus('sending')
		try {
			const res = await fetch(`${API_BASE}/send-email`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ from, to, subject, html: body }),
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
			<div style={{ fontFamily: 'system-ui, sans-serif', padding: 24 }}>
				<h2>Mail App — Demo UI</h2>
				<form onSubmit={handleLogin} style={{ maxWidth: 420 }}>
					<div style={{ marginBottom: 8 }}>
						<label>Username</label>
						<input value={user} onChange={(e) => setUser(e.target.value)} style={{ width: '100%' }} />
					</div>
					<div style={{ marginBottom: 8 }}>
						<label>Password</label>
						<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: '100%' }} />
					</div>
					<button type="submit">Sign in</button>
				</form>

				{newDevice && (
					<div style={{ marginTop: 16, border: '1px solid #ddd', padding: 12, maxWidth: 420 }}>
						<h4>New device detected</h4>
						<p>Please give your device a name to register it for future access.</p>
						<input value={deviceName} onChange={(e) => setDeviceName(e.target.value)} placeholder="My laptop" style={{ width: '100%', marginBottom: 8 }} />
						<div style={{ display: 'flex', gap: 8 }}>
							<button onClick={registerDevice}>Register device</button>
						</div>
					</div>
				)}
			</div>
		)
	}

	return (
		<div style={{ fontFamily: 'system-ui, sans-serif', padding: 24 }}>
			<header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
				<h2>Inbox — Demo</h2>
				<div>
					<strong>{user}</strong>
				</div>
			</header>

			<section style={{ marginTop: 20, maxWidth: 780 }}>
				<h3>Compose</h3>
				<div style={{ marginBottom: 8 }}>
					<label>From</label>
					<select value={from} onChange={(e) => setFrom(e.target.value)} style={{ width: '100%' }}>
						{SENDER_OPTIONS.map((s) => (
							<option key={s} value={s}>{s}</option>
						))}
					</select>
				</div>
				<div style={{ marginBottom: 8 }}>
					<label>To</label>
					<input value={to} onChange={(e) => setTo(e.target.value)} style={{ width: '100%' }} />
				</div>
				<div style={{ marginBottom: 8 }}>
					<label>Subject</label>
					<input value={subject} onChange={(e) => setSubject(e.target.value)} style={{ width: '100%' }} />
				</div>
				<div style={{ marginBottom: 8 }}>
					<label>Body (HTML allowed)</label>
					<textarea value={body} onChange={(e) => setBody(e.target.value)} style={{ width: '100%', height: 140 }} />
				</div>
				<div style={{ display: 'flex', gap: 8 }}>
					<button onClick={sendEmail}>Send</button>
					<div style={{ alignSelf: 'center' }}>{status}</div>
				</div>
			</section>
		</div>
	)
}
