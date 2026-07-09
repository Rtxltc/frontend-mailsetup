const readValue = (value, fallback = '') => {
  if (value === null || value === undefined) return fallback;
  if (typeof value === 'string') return value.trim();
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  return fallback;
};

const getBodyText = (mail) => {
  const direct = readValue(mail?.text || mail?.body || mail?.content || mail?.message || mail?.raw);
  if (direct) return direct;

  if (typeof mail?.html === 'string' && mail.html.trim()) {
    return mail.html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  }

  if (mail?.body?.text) return readValue(mail.body.text);
  if (mail?.content?.text) return readValue(mail.content.text);

  return '';
};

const getPreview = (mail, textBody) => {
  const direct = readValue(mail?.preview || mail?.snippet || mail?.bodyPreview);
  if (direct) return direct;

  if (textBody) return textBody.length > 180 ? `${textBody.slice(0, 177)}...` : textBody;

  if (typeof mail?.html === 'string' && mail.html.trim()) {
    return mail.html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 180);
  }

  return 'No preview available.';
};

const normalizeMail = (mail, index) => {
  const rawText = getBodyText(mail);
  const subject = readValue(mail?.subject || mail?.title || mail?.headers?.subject || mail?.content?.subject || mail?.message?.subject);
  const sender = readValue(mail?.sender || mail?.from || mail?.from_email || mail?.fromAddress || mail?.author || mail?.headers?.from || mail?.mail_from);
  const recipient = readValue(mail?.recipient || mail?.to || mail?.to_email || mail?.mail_to || mail?.headers?.to);
  const date = readValue(mail?.date || mail?.timestamp || mail?.received_at || mail?.created_at || mail?.time);
  const id = readValue(mail?.id || mail?.message_id || mail?._id || mail?.uuid || `${index}-${Date.now()}`);

  return {
    id,
    subject: subject || '(No Subject)',
    sender: sender || 'Unknown sender',
    recipient,
    preview: getPreview(mail, rawText),
    text: rawText,
    html: readValue(mail?.html || mail?.body_html || mail?.content?.html),
    date,
    read: Boolean(mail?.read),
    starred: Boolean(mail?.starred),
    has_attachment: Boolean(mail?.has_attachment || mail?.attachments?.length),
    raw: typeof mail === 'string' ? mail : JSON.stringify(mail, null, 2),
  };
};

export function normalizeInboxPayload(payload) {
  if (!payload) return [];

  if (Array.isArray(payload)) {
    return payload.map((item, index) => normalizeMail(item, index));
  }

  if (typeof payload === 'string') {
    return [normalizeMail({ text: payload, subject: 'Raw message', sender: 'API' }, 0)];
  }

  if (typeof payload === 'object') {
    const candidates = [
      payload.emails,
      payload.messages,
      payload.mail,
      payload.data,
      payload.inbox,
      payload.result,
    ].find((value) => Array.isArray(value));

    if (candidates) {
      return candidates.map((item, index) => normalizeMail(item, index));
    }

    return [normalizeMail(payload, 0)];
  }

  return [];
}
