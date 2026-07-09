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

        {mail.html ? (
          <div className="mail-body" dangerouslySetInnerHTML={{ __html: mail.html }} />
        ) : (
          <pre className="mail-plain-text">{mail.text || mail.raw || 'No message content available.'}</pre>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
