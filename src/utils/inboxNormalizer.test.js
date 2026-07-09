import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeInboxPayload } from './inboxNormalizer.js';

test('normalizes a raw string payload into an inbox item', () => {
  const mails = normalizeInboxPayload('Hello from API');
  assert.equal(mails.length, 1);
  assert.equal(mails[0].subject, 'Raw message');
  assert.equal(mails[0].text, 'Hello from API');
});

test('normalizes a wrapped object payload', () => {
  const mails = normalizeInboxPayload({ messages: [{ subject: 'Welcome', sender: 'team@example.com', text: 'Hi there' }] });
  assert.equal(mails.length, 1);
  assert.equal(mails[0].subject, 'Welcome');
  assert.equal(mails[0].sender, 'team@example.com');
  assert.equal(mails[0].text, 'Hi there');
});
