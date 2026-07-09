import { useState } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

const initialDraft = {
  to: '',
  subject: '',
  body: '',
};

export default function ComposeDrawer({ open = false, onClose, onSend, submitting = false, status = '' }) {
  const [draft, setDraft] = useState(initialDraft);

  if (!open) return null;

  const updateField = (field, value) => {
    setDraft((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSend?.(draft);
    setDraft(initialDraft);
  };

  return (
    <div className="compose-drawer-backdrop" onClick={onClose}>
      <motion.div
        initial={{ x: 24, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="compose-drawer"
        onClick={(event) => event.stopPropagation()}
      >
        <form onSubmit={handleSubmit} className="compose-drawer-form">
          <div className="compose-drawer-header">
            <h3>Compose</h3>
            <button type="button" className="icon-btn small" onClick={onClose}>
              <X size={16} />
            </button>
          </div>

          <div className="field">
            <label>To</label>
            <input value={draft.to} onChange={(event) => updateField('to', event.target.value)} placeholder="name@example.com" />
          </div>

          <div className="field">
            <label>Subject</label>
            <input value={draft.subject} onChange={(event) => updateField('subject', event.target.value)} placeholder="Project update" />
          </div>

          <div className="field">
            <label>Message</label>
            <textarea value={draft.body} onChange={(event) => updateField('body', event.target.value)} placeholder="Write your message..." className="editor-textarea" />
          </div>

          <div className="bottom-bar">
            <span>{status || 'Ready to send'}</span>
            <button type="submit" className="send" disabled={submitting}>
              {submitting ? 'Sending…' : 'Send'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
