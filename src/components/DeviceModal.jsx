import React from 'react'

export default function DeviceModal({ newDevice, deviceName, setDeviceName, registerDevice }) {
  if (!newDevice) return null
  return (
    <div className="device-panel">
      <h4>New device detected</h4>
      <p>Please give your device a name to register it for future access.</p>
      <input value={deviceName} onChange={(e) => setDeviceName(e.target.value)} placeholder="My laptop" />
      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={registerDevice}>Register device</button>
      </div>
    </div>
  )
}
