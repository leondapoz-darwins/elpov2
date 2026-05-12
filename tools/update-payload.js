#!/usr/bin/env node
// One-shot: encrypts content/protected.html and rewrites the PAYLOAD block
// inside index.html so deploy stays a single command.
//
//   node tools/update-payload.js <password>

const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');

const ITER = 200000;

async function deriveKey(password, salt) {
  const km = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: ITER, hash: 'SHA-256' },
    km,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt']
  );
}

async function main() {
  const password = process.argv[2];
  if (!password) {
    console.error('Usage: node tools/update-payload.js <password>');
    process.exit(1);
  }
  const root = path.resolve(__dirname, '..');
  const plain = fs.readFileSync(path.join(root, 'content/protected.html'), 'utf8');
  const salt = crypto.randomBytes(16);
  const iv = crypto.randomBytes(12);
  const key = await deriveKey(password, salt);
  const ct = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    new TextEncoder().encode(plain)
  );
  const payload = {
    salt: Buffer.from(salt).toString('base64'),
    iv: Buffer.from(iv).toString('base64'),
    ct: Buffer.from(new Uint8Array(ct)).toString('base64'),
    iter: ITER,
  };
  const formatted = `const PAYLOAD = ${JSON.stringify(payload, null, 6).replace(/^/gm, '    ').trimStart()};`;
  const indexPath = path.join(root, 'index.html');
  let html = fs.readFileSync(indexPath, 'utf8');
  const before = html;
  html = html.replace(/const PAYLOAD = \{[\s\S]*?\};/, formatted);
  if (html === before) {
    console.error('ERROR: PAYLOAD block not found in index.html');
    process.exit(2);
  }
  fs.writeFileSync(indexPath, html);
  console.log('OK — index.html PAYLOAD updated. ciphertext bytes:', payload.ct.length);
}

main().catch(e => { console.error(e); process.exit(1); });
