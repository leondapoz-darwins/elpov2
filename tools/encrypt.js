#!/usr/bin/env node
// Encrypts the protected HTML fragment for index.html.
// Usage: node tools/encrypt.js "<password>" path/to/content.html
// Prints a JSON object: { salt, iv, ct } as base64 strings.

const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');

const ITER = 200000;
const KEYLEN = 32; // AES-256
const SALT_LEN = 16;
const IV_LEN = 12;

async function deriveKey(password, salt) {
  return crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  ).then(km => crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: ITER, hash: 'SHA-256' },
    km,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt']
  ));
}

async function main() {
  const [password, file] = process.argv.slice(2);
  if (!password || !file) {
    console.error('Usage: node tools/encrypt.js <password> <content.html>');
    process.exit(1);
  }
  const plain = fs.readFileSync(path.resolve(file), 'utf8');
  const salt = crypto.randomBytes(SALT_LEN);
  const iv = crypto.randomBytes(IV_LEN);
  const key = await deriveKey(password, salt);
  const ct = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    new TextEncoder().encode(plain)
  );
  const out = {
    salt: Buffer.from(salt).toString('base64'),
    iv: Buffer.from(iv).toString('base64'),
    ct: Buffer.from(new Uint8Array(ct)).toString('base64'),
    iter: ITER,
  };
  console.log(JSON.stringify(out, null, 2));
}

main().catch(e => { console.error(e); process.exit(1); });
