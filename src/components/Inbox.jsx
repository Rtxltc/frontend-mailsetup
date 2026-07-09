import { useEffect, useMemo, useState } from 'react';
import { Plus, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import Sidebar from './Sidebar';
import InboxList from './InboxList';
import MailViewer from './MailViewer';
import ComposeDrawer from './ComposeDrawer';
import {
  deleteMail,
  getDeleted,
  getInbox,
  getMail,
  getSent,
  getStarred,
  markMailRead,
  sendMail,
  toggleMailStar,
} from '../api/mail';

const folderConfig = {
  inbox: { label: 'Inbox', fetcher: getInbox, emptyTitle: 'Your inbox is clear', emptyMessage: 'No messages are waiting for you right now.' },
  sent: { label: 'Sent', fetcher: getSent, emptyTitle: 'No sent mail', emptyMessage: 'Messages you send will appear here.' },
  starred: { label: 'Starred', fetcher: getStarred, emptyTitle: 'No starred messages', emptyMessage: 'Star important mail to keep it handy.' },
  trash: { label: 'Trash', fetcher: getDeleted, emptyTitle: 'Trash is empty', emptyMessage: 'Deleted mail will show up here.' },
};

export default function Inbox({ activeTab, setActiveTab, inboxView }) {
  const [folder, setFolder] = useState('inbox');
  const [mails, setMails] = useState([]);
  const [selectedMail, setSelectedMail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewerLoading, setViewerLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [composeOpen, setComposeOpen] = useState(false);
  const [composeStatus, setComposeStatus] = useState('');
  const [composeSubmitting, setComposeSubmitting] = useState(false);
  const isBellInbox = inboxView === 'bell';

  const handleSidebarSelection = (value) => {
    if (value === 'compose') {
      setActiveTab('compose');
      return;
    }

    setFolder(value);
  };

  const loadFolder = async (nextFolder = folder, preserveSelection = true) => {
    try {
      setLoading(true);
      const config = folderConfig[nextFolder] || folderConfig.inbox;
      const data = await config.fetcher();
      setMails(data);
      if (!data.length) {
        setSelectedMail(null);
      }

      if (!preserveSelection) {
        setSelectedMail(null);
        return;
      }

      if (selectedMail && data.some((item) => item.id === selectedMail.id)) {
        setSelectedMail(data.find((item) => item.id === selectedMail.id) || null);
      } else if (data.length) {
        setSelectedMail(data[0]);
      } else {
        setSelectedMail(null);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message || 'Unable to load mail');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadFolder(folder, false);
  }, [folder]);

  useEffect(() => {
    if (!selectedMail) return;
    const current = mails.find((item) => item.id === selectedMail.id);
    if (current) {
      setSelectedMail(current);
    }
  }, [mails, selectedMail?.id]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      void loadFolder(folder, true);
    }, 30000);

    return () => window.clearInterval(interval);
  }, [folder, selectedMail?.id]);

  const filteredMails = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return mails;

    return mails.filter((mail) => {
      const haystack = `${mail.sender || ''} ${mail.recipient || ''} ${mail.subject || ''} ${mail.preview || ''}`.toLowerCase();
      return haystack.includes(query);
    });
  }, [mails, search]);

  const handleOpenMail = async (mail) => {
    try {
      setViewerLoading(true);
      const detail = await getMail(mail.id);
      setSelectedMail(detail || mail);
      if (!mail.read) {
        await markMailRead(mail.id);
        setMails((prev) => prev.map((item) => (item.id === mail.id ? { ...item, read: true } : item)));
      }
    } catch (error) {
      toast.error(error.message || 'Unable to load message');
    } finally {
      setViewerLoading(false);
    }
  };

  const handleSelect = async (mail) => {
    await handleOpenMail(mail);
  };

  const handleToggleStar = async (mail) => {
    try {
      await toggleMailStar(mail.id);
      setMails((prev) => prev.map((item) => (item.id === mail.id ? { ...item, starred: !item.starred } : item)));
      setSelectedMail((prev) => (prev && prev.id === mail.id ? { ...prev, starred: !prev.starred } : prev));
      toast.success(mail.starred ? 'Star removed' : 'Starred');
    } catch (error) {
      toast.error(error.message || 'Unable to update star');
    }
  };

  const handleDelete = async (mail) => {
    try {
      await deleteMail(mail.id);
      setMails((prev) => prev.filter((item) => item.id !== mail.id));
      setSelectedMail(null);
      toast.success('Message moved to trash');
    } catch (error) {
      toast.error(error.message || 'Unable to delete message');
    }
  };

  const handleComposeSend = async (draft) => {
    try {
      setComposeSubmitting(true);
      setComposeStatus('Sending…');
      await sendMail({ from_email: 'hello@soulmatrix.in', to: draft.to, subject: draft.subject, text: draft.body, html: draft.body });
      setComposeStatus('Sent');
      toast.success('Message sent');
      setComposeOpen(false);
    } catch (error) {
      setComposeStatus('Failed');
      toast.error(error.message || 'Unable to send message');
    } finally {
      setComposeSubmitting(false);
    }
  };

  return (
    <div className={`mail-app ${isBellInbox ? 'mail-app-featured' : ''}`}>
      <Sidebar activeTab={folder} setActiveTab={handleSidebarSelection} loadInbox={() => void loadFolder(folder, true)} />

      <div className="mail-list">
        <div className={`mail-list-header ${isBellInbox ? 'featured' : ''}`}>
          <div className="title-block">
            <p className="section-label">{isBellInbox ? 'Bell-triggered view' : 'Mail'} </p>
            <h3>{folderConfig[folder].label}</h3>
          </div>

          <input
            className="search-input"
            placeholder="Search mail..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />

          <button className="icon-btn small" onClick={() => void loadFolder(folder, true)}>
            <RefreshCw size={16} />
          </button>
        </div>

        {isBellInbox && (
          <div className="inbox-feature-banner">
            <div>
              <span className="feature-pill">Live mail</span>
              <h4>Your active mailbox</h4>
              <p>Messages refresh automatically and stay in sync with the backend.</p>
            </div>
            <div className="feature-stat">Auto-refresh</div>
          </div>
        )}

        <div className="folder-switcher">
          {Object.entries(folderConfig).map(([key, config]) => (
            <button key={key} className={folder === key ? 'active' : ''} onClick={() => { setFolder(key); setSearch(''); }}>
              {config.label}
            </button>
          ))}
        </div>

        <button className="compose-fab" onClick={() => setComposeOpen(true)}>
          <Plus size={16} />
          Compose
        </button>

        <InboxList
          mails={filteredMails}
          selectedId={selectedMail?.id}
          loading={loading}
          onSelect={handleSelect}
          onToggleStar={handleToggleStar}
          emptyTitle={folderConfig[folder].emptyTitle}
          emptyMessage={folderConfig[folder].emptyMessage}
        />
      </div>

      <MailViewer
        mail={selectedMail}
        loading={viewerLoading}
        onDelete={handleDelete}
        onToggleStar={handleToggleStar}
        onRefresh={() => void loadFolder(folder, true)}
      />

      <ComposeDrawer
        open={composeOpen}
        onClose={() => setComposeOpen(false)}
        onSend={handleComposeSend}
        submitting={composeSubmitting}
        status={composeStatus}
      />
    </div>
  );
}
