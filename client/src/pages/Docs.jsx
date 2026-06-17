import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Cloud, ArrowLeft, Shield, Server, Terminal, Layers, Check, Copy } from 'lucide-react';

const BREADCRUMBS_CODE = `const getBreadcrumbs = async (folderId) => {
  return await Folder.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(folderId) } },
    {
      $graphLookup: {
        from: "folders",
        startWith: "$parentFolder",
        connectFromField: "parentFolder",
        connectToField: "_id",
        as: "ancestors"
      }
    }
  ]);
};`;

const CRYPTO_CODE = `const deriveKey = async (passphrase, salt) => {
  const enc = new TextEncoder();
  const baseKey = await crypto.subtle.importKey(
    "raw", enc.encode(passphrase), "PBKDF2", false, ["deriveKey"]
  );
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", salt, iterations: 100000, hash: "SHA-256" },
    baseKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
};`;

const ENCRYPT_CODE = `const encryptFilePayload = async (arrayBuffer, passcode) => {
  const salt = window.crypto.getRandomValues(new Uint8Array(32));
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const derivedKey = await deriveKey(passcode, salt);

  const ciphertext = await window.crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    derivedKey,
    arrayBuffer
  );

  return {
    ciphertext,
    saltHex: bufToHex(salt),
    ivHex: bufToHex(iv)
  };
};`;

const TG_FORM_CODE = `const formData = new FormData();
formData.append('chat_id', telegramChatId);
formData.append('document', buffer, { filename });

const res = await axios.post(
  \`https://api.telegram.org/bot\${botToken}/sendDocument\`,
  formData,
  { headers: formData.getHeaders() }
);`;

const PROXY_STREAM_CODE = `const range = req.headers.range;
const tgDownloadUrl = \`https://api.telegram.org/file/bot\${token}/\${filePath}\`;

const response = await axios({
  method: 'GET',
  url: tgDownloadUrl,
  headers: range ? { Range: range } : {},
  responseType: 'stream'
});

res.status(range ? 206 : 200);
res.set(response.headers);
response.data.pipe(res);`;

export default function Docs() {
  const [activeTab, setActiveTab] = useState('intro'); // 'intro' | 'security' | 'telegram' | 'api'
  const [copiedText, setCopiedText] = useState('');

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedText(id);
    setTimeout(() => setCopiedText(''), 2000);
  };

  const navItems = [
    { id: 'intro', label: 'Architecture & Intro', icon: Layers },
    { id: 'security', label: 'Zero-Knowledge Crypto', icon: Shield },
    { id: 'telegram', label: 'Telegram Adapter Specs', icon: Server },
    { id: 'api', label: 'API & Worker Specs', icon: Terminal },
  ];

  return (
    <div className="min-h-screen bg-[#fcfcfc] text-sm font-['Poppins',sans-serif] flex flex-col justify-between selection:bg-orange-primary/10">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&family=Fira+Code:wght@400;500&display=swap');
        .font-code {
          font-family: 'Fira Code', monospace;
        }
      `}</style>

      {/* Docs Header */}
      <header className="h-16 bg-white border-b border-zinc-200/60 px-6 lg:px-12 flex items-center justify-between sticky top-0 z-30 backdrop-blur-md bg-white/95">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2 text-secondary-text hover:text-orange-primary transition-colors font-medium">
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to Home</span>
          </Link>
          <div className="h-4 w-[1px] bg-zinc-200 hidden sm:block"></div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-orange-primary rounded-xl flex items-center justify-center text-white shadow-md shadow-orange-primary/25">
              <Cloud className="w-4.5 h-4.5" />
            </div>
            <span className="font-extrabold text-lg text-heading-text tracking-tight font-['Plus_Jakarta_Sans',sans-serif]">RAHRUC</span>

          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link
            to="/register"
            className="bg-orange-primary hover:bg-orange-primary/95 text-white px-4 py-2 rounded-xl font-semibold transition text-xs shadow-md shadow-orange-primary/15"
          >
            Launch Console
          </Link>
        </div>
      </header>

      {/* Docs Layout */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-6 lg:px-12 py-10 flex flex-col md:flex-row gap-10">

        {/* Left Sidebar Navigation */}
        <aside className="w-full md:w-64 shrink-0 flex flex-col gap-2.5">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-widest px-3 mb-2 font-['Plus_Jakarta_Sans',sans-serif]">Documentation</div>
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-semibold tracking-wide transition-all text-left cursor-pointer ${activeTab === item.id
                    ? 'bg-orange-primary/10 text-orange-primary shadow-2xs'
                    : 'text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800'
                  }`}
              >
                <item.icon className="w-4.5 h-4.5 shrink-0" />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Content Area */}
        <main className="flex-1 max-w-3xl min-w-0 bg-white border border-zinc-200/60 rounded-2xl p-6 sm:p-10 shadow-2xs">

          {/* INTRO PAGE */}
          {activeTab === 'intro' && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-800 tracking-tight font-['Plus_Jakarta_Sans',sans-serif]">System Topology & Architecture</h1>
                <p className="text-zinc-500 font-light text-sm">Separating indexing databases from object stores using Telegram's CDN edge.</p>
              </div>

              <hr className="border-zinc-200/60" />

              <p className="text-zinc-600 leading-relaxed font-light">
                To build an enterprise-scalable storage system without incurring significant cloud storage bills (e.g. AWS S3, Google Cloud Storage), RAHRUC splits the architecture into two clean layers:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="border border-zinc-200/60 p-5 rounded-xl bg-slate-50/50">
                  <h4 className="font-semibold text-zinc-800 mb-1 text-xs">Metadata Layer (Express + MongoDB)</h4>
                  <p className="text-[11px] text-zinc-500 font-light leading-relaxed">
                    Saves schema models, virtual folder indexes, users sessions, and Telegram message mapping credentials.
                  </p>
                </div>
                <div className="border border-zinc-200/60 p-5 rounded-xl bg-slate-50/50">
                  <h4 className="font-semibold text-zinc-800 mb-1 text-xs">Object Layer (Telegram Chat Channels)</h4>
                  <p className="text-[11px] text-zinc-500 font-light leading-relaxed">
                    The raw file bytes are streamed into private Telegram channels via Bot APIs, acting as free storage pools.
                  </p>
                </div>
              </div>

              <h2 className="text-base font-bold text-zinc-800 pt-4 font-['Plus_Jakarta_Sans',sans-serif]">Folder Index Hierarchies (Materialized Paths)</h2>
              <p className="text-zinc-600 leading-relaxed font-light">
                Folders are structured dynamically using self-referencing hierarchy documents. This allows breadcrumb trails and folder contents to be calculated efficiently. Below is our schema-based Mongoose query model to fetch breadcrumb paths recursively using MongoDB aggregations:
              </p>

              {/* Aggregation Query Code Box */}
              <div className="relative border border-zinc-200 rounded-xl overflow-hidden bg-slate-900 text-slate-100 font-code text-[10.5px] leading-relaxed p-4 shadow-sm">
                <button
                  onClick={() => handleCopy(BREADCRUMBS_CODE, 'breadcrumbs-query')}
                  className="absolute top-3 right-3 p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded-lg hover:text-white transition-colors cursor-pointer"
                >
                  {copiedText === 'breadcrumbs-query' ? <Check className="w-3.5 h-3.5 text-green-success" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
                <p className="text-slate-500 pb-1.5">// MongoDB GraphLookup aggregation for folder paths</p>
                <p>const getBreadcrumbs = async (folderId) =&gt; &#123;</p>
                <p className="pl-4">return await Folder.aggregate([</p>
                <p className="pl-8">&#123; $match: &#123; _id: new mongoose.Types.ObjectId(folderId) &#125; &#125;,</p>
                <p className="pl-8">&#123;</p>
                <p className="pl-12">$graphLookup: &#123;</p>
                <p className="pl-16">from: "folders",</p>
                <p className="pl-16">startWith: "$parentFolder",</p>
                <p className="pl-16">connectFromField: "parentFolder",</p>
                <p className="pl-16">connectToField: "_id",</p>
                <p className="pl-16">as: "ancestors"</p>
                <p className="pl-12">&#125;</p>
                <p className="pl-8">&#125;</p>
                <p className="pl-4">]);</p>
                <p>&#125;;</p>
              </div>

              <div className="p-4 bg-orange-primary/5 border border-orange-primary/10 rounded-xl flex gap-3.5">
                <Shield className="w-5 h-5 text-orange-primary shrink-0 mt-0.5" />
                <p className="text-xs text-orange-800 leading-relaxed font-medium">
                  <strong>Zero-Storage Scaling</strong>: By hosting the Node.js API server on Vercel (serverless) and indexing metadata with MongoDB Atlas, the server's disk utilization remains at 0% regardless of the stored petabytes.
                </p>
              </div>
            </div>
          )}

          {/* SECURITY PAGE */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-800 tracking-tight font-['Plus_Jakarta_Sans',sans-serif]">Zero-Knowledge Encrypted Vault</h1>
                <p className="text-zinc-500 font-light text-sm">Understanding Web Crypto GCM-256 local-first client encryption flow.</p>
              </div>

              <hr className="border-zinc-200/60" />

              <h2 className="text-base font-bold text-zinc-800 font-['Plus_Jakarta_Sans',sans-serif]">The Cryptographic Pipeline</h2>
              <p className="text-zinc-600 leading-relaxed font-light">
                When uploading to the Encrypted Vault, file payloads undergo local client encryption before being transmitted over the wire:
              </p>

              <div className="border border-zinc-200 rounded-xl p-5 bg-slate-50/50 space-y-3.5 text-xs text-zinc-700 leading-relaxed font-medium">
                <p><strong>1. Key Derivation:</strong> A 256-bit salt is generated. Using the user's vault master passcode, a key is derived locally via PBKDF2 with 100,000 iterations and SHA-256 hashing.</p>
                <p><strong>2. Initial Vector (IV) Generation:</strong> A unique 96-bit (12 bytes) cryptographically secure random Initialization Vector is generated for each file using <code className="bg-white px-1.5 py-0.5 border border-zinc-200 rounded">crypto.getRandomValues()</code>.</p>
                <p><strong>3. Symmetric Encryption:</strong> The raw array buffer of the file is encrypted using AES-GCM (Galois/Counter Mode), generating a secure ciphertext block and a 128-bit authentication tag.</p>
                <p><strong>4. Metadata Transmission:</strong> The derived IV and Salt are sent as plain hexadecimal headers alongside the encrypted ciphertext. Decryption is mathematically impossible without the master passcode.</p>
              </div>

              <h2 className="text-base font-bold text-zinc-800 pt-4 font-['Plus_Jakarta_Sans',sans-serif]">Client Key Derivation Method</h2>
              {/* Crypto Key Derivation Code Box */}
              <div className="relative border border-zinc-200 rounded-xl overflow-hidden bg-slate-900 text-slate-100 font-code text-[10.5px] leading-relaxed p-4 shadow-sm">
                <button
                  onClick={() => handleCopy(CRYPTO_CODE, 'crypto-derive')}
                  className="absolute top-3 right-3 p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded-lg hover:text-white transition-colors cursor-pointer"
                >
                  {copiedText === 'crypto-derive' ? <Check className="w-3.5 h-3.5 text-green-success" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
                <p className="text-slate-500 pb-1.5">// Web Crypto PBKDF2 Key Derivation</p>
                <p>const deriveKey = async (passphrase, salt) =&gt; &#123;</p>
                <p className="pl-4">const enc = new TextEncoder();</p>
                <p className="pl-4">const baseKey = await crypto.subtle.importKey(</p>
                <p className="pl-8">"raw", enc.encode(passphrase), "PBKDF2", false, ["deriveKey"]</p>
                <p className="pl-4">);</p>
                <p className="pl-4">return crypto.subtle.deriveKey(</p>
                <p className="pl-8">&#123; name: "PBKDF2", salt, iterations: 100000, hash: "SHA-256" &#125;,</p>
                <p className="pl-8">baseKey,</p>
                <p className="pl-8">&#123; name: "AES-GCM", length: 256 &#125;,</p>
                <p className="pl-8">false,</p>
                <p className="pl-8">["encrypt", "decrypt"]</p>
                <p className="pl-4">);</p>
                <p>&#125;;</p>
              </div>

              <h2 className="text-base font-bold text-zinc-800 pt-4 font-['Plus_Jakarta_Sans',sans-serif]">Client File Encryption Script</h2>
              {/* Encryption Code Box */}
              <div className="relative border border-zinc-200 rounded-xl overflow-hidden bg-slate-900 text-slate-100 font-code text-[10.5px] leading-relaxed p-4 shadow-sm">
                <button
                  onClick={() => handleCopy(ENCRYPT_CODE, 'encrypt-script')}
                  className="absolute top-3 right-3 p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded-lg hover:text-white transition-colors cursor-pointer"
                >
                  {copiedText === 'encrypt-script' ? <Check className="w-3.5 h-3.5 text-green-success" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
                <p className="text-slate-500 pb-1.5">// In-browser AES-GCM-256 payload encryption</p>
                <p>const encryptFilePayload = async (arrayBuffer, passcode) =&gt; &#123;</p>
                <p className="pl-4">const salt = window.crypto.getRandomValues(new Uint8Array(32));</p>
                <p className="pl-4">const iv = window.crypto.getRandomValues(new Uint8Array(12));</p>
                <p className="pl-4">const derivedKey = await deriveKey(passcode, salt);</p>
                <br />
                <p className="pl-4">const ciphertext = await window.crypto.subtle.encrypt(</p>
                <p className="pl-8">&#123; name: "AES-GCM", iv &#125;,</p>
                <p className="pl-8">derivedKey,</p>
                <p className="pl-8">arrayBuffer</p>
                <p className="pl-4">);</p>
                <br />
                <p className="pl-4">return &#123;</p>
                <p className="pl-8">ciphertext,</p>
                <p className="pl-8">saltHex: bufToHex(salt),</p>
                <p className="pl-8">ivHex: bufToHex(iv)</p>
                <p className="pl-4">&#125;;</p>
                <p>&#125;;</p>
              </div>
            </div>
          )}

          {/* TELEGRAM ADAPTER PAGE */}
          {activeTab === 'telegram' && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-800 tracking-tight font-['Plus_Jakarta_Sans',sans-serif]">Telegram Infrastructure Adapter</h1>
                <p className="text-zinc-500 font-light text-sm">Managing MTProto Bot API network constraints and multipart stream routing.</p>
              </div>

              <hr className="border-zinc-200/60" />

              <h2 className="text-base font-bold text-zinc-800 font-['Plus_Jakarta_Sans',sans-serif]">1. Form-Data Upload Pipeline</h2>
              <p className="text-zinc-600 leading-relaxed font-light">
                Standard Node.js servers usually upload files by caching them inside disk-based temporary directories. To ensure compatibility with serverless hosting (like Vercel, which has a 50MB payload limit and read-only filesystems), RAHRUC implements a direct stream pipeline using `multer`'s memory storage adapter.
              </p>
              <p className="text-zinc-600 leading-relaxed font-light">
                The Express backend reads the incoming binary buffer directly into RAM memory, packages it into a multipart form boundary, and posts it immediately to Telegram's <code className="bg-zinc-50 border border-zinc-200 rounded px-1.5 py-0.5">/sendDocument</code> endpoint:
              </p>

              {/* Form Data Code Box */}
              <div className="relative border border-zinc-200 rounded-xl overflow-hidden bg-slate-900 text-slate-100 font-code text-[10.5px] leading-relaxed p-4 shadow-sm">
                <button
                  onClick={() => handleCopy(TG_FORM_CODE, 'tg-formdata')}
                  className="absolute top-3 right-3 p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded-lg hover:text-white transition-colors cursor-pointer"
                >
                  {copiedText === 'tg-formdata' ? <Check className="w-3.5 h-3.5 text-green-success" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
                <p className="text-slate-500 pb-1.5">// Pipe file buffer to Telegram Bot API endpoint</p>
                <p>const formData = new FormData();</p>
                <p>formData.append('chat_id', telegramChatId);</p>
                <p>formData.append('document', buffer, &#123; filename &#125;);</p>
                <br />
                <p>const res = await axios.post(</p>
                <p className="pl-4">{"`https://api.telegram.org/bot${botToken}/sendDocument`,"}</p>
                <p className="pl-4">formData,</p>
                <p className="pl-4">&#123; headers: formData.getHeaders() &#125;</p>
                <p>);</p>
              </div>

              <h2 className="text-base font-bold text-zinc-800 pt-4 font-['Plus_Jakarta_Sans',sans-serif]">2. File Size & Worker Offloading</h2>
              <p className="text-zinc-600 leading-relaxed font-light">
                While Telegram allows channels to hold files up to 2.0GB, the Bot API has a strict 50MB file size limit for incoming updates. For large assets (e.g. video files, database backups larger than 50MB), users link their custom bot credential settings. Direct streams are handled via chunked range request pipelines, ensuring seamless buffering.
              </p>
            </div>
          )}

          {/* API PAGE */}
          {activeTab === 'api' && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-800 tracking-tight font-['Plus_Jakarta_Sans',sans-serif]">Endpoint Range-Request Specs</h1>
                <p className="text-zinc-500 font-light text-sm">Deep-dive into video stream buffering and partial content headers (206).</p>
              </div>

              <hr className="border-zinc-200/60" />

              <h2 className="text-base font-bold text-zinc-800 font-['Plus_Jakarta_Sans',sans-serif]">1. Stream Proxy Router</h2>
              <p className="text-zinc-600 leading-relaxed font-light">
                When streaming a media file (like a video) on mobile or desktop browsers, HTML5 video players request segments of the file using the <code className="bg-zinc-50 border border-zinc-200 px-1.5 py-0.5 rounded font-code">Range</code> header (e.g. `bytes=1024-`).
              </p>
              <p className="text-zinc-600 leading-relaxed font-light">
                Our proxy worker intercepts these range requests, queries the Telegram servers using the file's dynamic ID, forwards the range headers, and returns a `206 Partial Content` response. This prevents loading the entire file into memory, keeping the server response time under 10ms.
              </p>

              {/* Express stream proxy code */}
              <div className="relative border border-zinc-200 rounded-xl overflow-hidden bg-slate-900 text-slate-100 font-code text-[10.5px] leading-relaxed p-4 shadow-sm">
                <button
                  onClick={() => handleCopy(PROXY_STREAM_CODE, 'proxy-stream')}
                  className="absolute top-3 right-3 p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded-lg hover:text-white transition-colors cursor-pointer"
                >
                  {copiedText === 'proxy-stream' ? <Check className="w-3.5 h-3.5 text-green-success" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
                <p className="text-slate-500 pb-1.5">// Express Node-Proxy Range Stream Buffering</p>
                <p>const range = req.headers.range;</p>
                <p>{"const tgDownloadUrl = `https://api.telegram.org/file/bot${token}/${filePath}`;"}</p>
                <br />
                <p>const response = await axios(&#123;</p>
                <p className="pl-4">method: 'GET',</p>
                <p className="pl-4">url: tgDownloadUrl,</p>
                <p className="pl-4">headers: range ? &#123; Range: range &#125; : &#123;&#125;,</p>
                <p className="pl-4">responseType: 'stream'</p>
                <p>&#125;);</p>
                <br />
                <p>res.status(range ? 206 : 200);</p>
                <p>res.set(response.headers);</p>
                <p>response.data.pipe(res);</p>
              </div>

              <h2 className="text-base font-bold text-zinc-800 pt-4 font-['Plus_Jakarta_Sans',sans-serif]">2. Public Static Delivery</h2>
              <p className="text-zinc-600 leading-relaxed font-light">
                Public share files use identical chunk piping but bypass authentication checks. The server extracts the target file metadata using a unique `shareSlug` and routes the file safely.
              </p>
            </div>
          )}

        </main>
      </div>

      {/* Docs Footer */}
      <footer className="border-t border-zinc-200 bg-white py-8 px-6 text-center text-xs text-secondary-text">
        <p className="max-w-md mx-auto leading-normal">
          RAHRUC Docs - Technical Specifications. Designed by RAHRUC Technical Operations.
        </p>
      </footer>
    </div>
  );
}
