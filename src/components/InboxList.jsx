import { Star, Paperclip, Mail } from 'lucide-react';

export default function InboxList({
  mails = [],
  selectedId,
  loading,
  onSelect,
  onToggleStar,
  emptyTitle = 'No messages',
  emptyMessage = 'There is nothing to show in this folder yet.',
}) {
  if (loading) {
    return (
      <div className="mail-list-body">
        {[1, 2, 3].map((item) => (
          <div key={item} className="mail-skeleton">
            <div className="mail-skeleton-line short" />
            <div className="mail-skeleton-line" />
            <div className="mail-skeleton-line tiny" />
          </div>
        ))}
      </div>
    );
  }

  if (!mails.length) {
    return (
      <div className="empty-state">
        <Mail size={42} />
        <h4>{emptyTitle}</h4>
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="mail-list-body">
      {mails.map((mail) => (
        <div
          key={mail.id}
          className={`mail-item ${selectedId === mail.id ? 'active' : ''} ${mail.read ? '' : 'unread'}`}
          onClick={() => onSelect?.(mail)}
        >
          <div className="mail-row">
            <strong>{mail.subject || '(No Subject)'}</strong>
            <button
              className={`star-toggle ${mail.starred ? 'active' : ''}`}
              onClick={(event) => {
                event.stopPropagation();
                onToggleStar?.(mail);
              }}
              aria-label="Toggle star"
            >
              <Star size={16} fill={mail.starred ? 'gold' : 'none'} />
            </button>
          </div>

          <div className="mail-meta-row">
            <small>{mail.sender}</small>
            <span>{mail.date || 'Unknown date'}</span>
          </div>

          <p>{mail.preview}</p>

          {mail.has_attachment && <Paperclip size={14} className="attachment-icon" />}
        </div>
      ))}
    </div>
  );
}
