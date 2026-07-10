import { Trash2, Star, Paperclip, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function MailViewer({
  mail,
  loading,
  onDelete,
  onToggleStar,
  onRefresh,
}) {
  if (loading) {
    return (
      <div className="mail-viewer empty-state-viewer">
        <div className="mail-skeleton large" />
        <div className="mail-skeleton-line" />
        <div className="mail-skeleton-line" />
      </div>
    );
  }

  if (!mail) {
    return (
      <div className="mail-viewer empty-state-viewer">
        <RefreshCw size={44} />
        <h3>Select a message</h3>
        <p>Choose any email from the list to read its content here.</p>
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={mail.id}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        className="mail-viewer"
      >
        <div className="viewer-toolbar">
          <button className="icon-btn small" onClick={onRefresh} aria-label="Refresh messages">
            <RefreshCw size={16} />
          </button>
          <button className={`icon-btn small ${mail.starred ? 'active' : ''}`} onClick={() => onToggleStar(mail)}>
            <Star size={16} fill={mail.starred ? 'gold' : 'none'} />
          </button>
          <button className="icon-btn small danger" onClick={() => onDelete(mail)}>
            <Trash2 size={16} />
          </button>
        </div>

        <h2>{mail.subject || '(No Subject)'}</h2>
        <div className="mail-details">
          <div>
            <strong>{mail.sender}</strong>
            <p>To: {mail.recipient || 'Unknown recipient'}</p>
          </div>
          <span>{mail.date || 'Unknown date'}</span>
        </div>

        {mail.has_attachment && (
          <div className="attachment-pill">
            <Paperclip size={14} />
            Attachment available
          </div>
        )}

        <hr />

        {(() => {
          const isEscapedHtml = (html) => {
            if (!html) return false;
            const lower = html.toLowerCase();
            return lower.includes('&lt;!doctype html') || lower.includes('&lt;html');
          };

          const isPlainHtml = (text) => {
            if (!text) return false;
            const trimmed = text.trim().toLowerCase();
            return trimmed.startsWith('<!doctype html') || trimmed.startsWith('<html');
          };

          if (isEscapedHtml(mail.html)) {
            const doc = new DOMParser().parseFromString(mail.html, 'text/html');
            const unescaped = doc.documentElement.textContent || doc.documentElement.innerText || '';
            return (
              <iframe
                srcDoc={unescaped}
                title="Email content"
                className="mail-body-iframe"
                style={{ width: '100%', border: 'none', minHeight: '600px', background: '#fff', borderRadius: '12px', marginTop: '16px' }}
              />
            );
          }

          if (isPlainHtml(mail.text)) {
            return (
              <iframe
                srcDoc={mail.text}
                title="Email content"
                className="mail-body-iframe"
                style={{ width: '100%', border: 'none', minHeight: '600px', background: '#fff', borderRadius: '12px', marginTop: '16px' }}
              />
            );
          }

          if (mail.html) {
            return (
              <iframe
                srcDoc={mail.html}
                title="Email content"
                className="mail-body-iframe"
                style={{ width: '100%', border: 'none', minHeight: '600px', background: '#fff', borderRadius: '12px', marginTop: '16px' }}
              />
            );
          }

          return <pre className="mail-plain-text">{mail.text || mail.raw || 'No message content available.'}</pre>;
        })()}
      </motion.div>
    </AnimatePresence>
  );
}
