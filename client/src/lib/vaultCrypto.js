/**
 * vaultCrypto.js
 * Zero-Knowledge client-side encryption using Web Crypto API (AES-GCM-256)
 */

const ITERATIONS = 100000;
const KEY_LEN = 256;

// Derive AES key from passphrase and salt
async function deriveKey(passphrase, salt) {
  const enc = new TextEncoder();
  const passphraseKey = await window.crypto.subtle.importKey(
    'raw',
    enc.encode(passphrase),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );

  return window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: ITERATIONS,
      hash: 'SHA-256',
    },
    passphraseKey,
    { name: 'AES-GCM', length: KEY_LEN },
    false,
    ['encrypt', 'decrypt']
  );
}

export async function encryptFile(arrayBuffer, passphrase) {
  const salt = window.crypto.getRandomValues(new Uint8Array(16));
  const iv = window.crypto.getRandomValues(new Uint8Array(12));

  const key = await deriveKey(passphrase, salt);

  const ciphertext = await window.crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: iv,
    },
    key,
    arrayBuffer
  );

  // Convert Uint8Array metadata to hex strings for transmission
  const saltHex = Array.from(salt).map(b => b.toString(16).padStart(2, '0')).join('');
  const ivHex = Array.from(iv).map(b => b.toString(16).padStart(2, '0')).join('');

  return {
    ciphertext,
    saltHex,
    ivHex,
  };
}

export async function decryptFile(ciphertextBuffer, passphrase, saltHex, ivHex) {
  // Convert hex strings back to Uint8Arrays
  const salt = new Uint8Array(saltHex.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
  const iv = new Uint8Array(ivHex.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));

  const key = await deriveKey(passphrase, salt);

  return window.crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv: iv,
    },
    key,
    ciphertextBuffer
  );
}
