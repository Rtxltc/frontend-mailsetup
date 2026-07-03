import React from 'react'
import { motion } from "framer-motion";
export default function ComposeCard({ from, setFrom, to, setTo, subject, setSubject, body, setBody, sendEmail, status, SENDER_OPTIONS }) {
  return (
    <div className="compose-card">
      <h3>Compose</h3>
      <div className="field">
        <label>From</label>
        <select value={from} onChange={(e) => setFrom(e.target.value)}>
          {SENDER_OPTIONS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>
      <div className="field">
        <label>To</label>
        <input value={to} onChange={(e) => setTo(e.target.value)} />
      </div>
      <div className="field">
        <label>Subject</label>
        <input value={subject} onChange={(e) => setSubject(e.target.value)} />
      </div>
      <div className="field">
        <label>Body (HTML allowed)</label>
        <textarea value={body} onChange={(e) => setBody(e.target.value)} />
      </div>
      <div className="actions">
        <motion.button

                whileHover={{
                    scale:1.03
                }}

                whileTap={{
                    scale:.95
                }}

                whileFocus={{
                    scale:1.02
                }}

                className="send"

                onClick={sendEmail}

                ></motion.button>
        <div className="status">{status}</div>
      </div>
    </div>
  )
}
