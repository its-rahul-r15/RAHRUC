import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Cloud, Shield, Lock, Send, HardDrive, Key, ArrowRight, Menu, X, ArrowUpRight, Terminal, RefreshCw, Layers, Check, Database, Zap, Paperclip, Smile, MoreVertical, Search, ArrowLeft, CheckCheck, Monitor, ShieldCheck, FileText, Archive, Server, Globe, MapPin, ChevronRight, Upload, Lock as LockIcon, Activity } from 'lucide-react';

export default function Landing() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('father'); // 'father' | 'chatid' | 'encryption'
  const [gbValue, setGbValue] = useState(150);
  const [activeFaq, setActiveFaq] = useState(null);

  // ── Encryption Visualizer state ──
  const [encryptInput, setEncryptInput] = useState('my-secret-document.pdf');
  const [encryptedOutput, setEncryptedOutput] = useState('');
  const [isEncrypting, setIsEncrypting] = useState(false);
  const encryptRef = useRef(null);

  const triggerEncrypt = useCallback((text) => {
    if (encryptRef.current) clearInterval(encryptRef.current);
    if (!text) { setEncryptedOutput(''); return; }
    setIsEncrypting(true);
    const hex = '0123456789abcdef';
    const len = Math.max(80, text.length * 5);
    const target = Array.from({ length: len }, () => hex[Math.floor(Math.random() * 16)]).join('');
    let step = 0;
    encryptRef.current = setInterval(() => {
      step++;
      const revealed = step * 4;
      setEncryptedOutput(
        Array.from({ length: len }, (_, i) =>
          i < revealed ? target[i] : hex[Math.floor(Math.random() * 16)]
        ).join('')
      );
      if (revealed >= len) {
        clearInterval(encryptRef.current);
        setIsEncrypting(false);
      }
    }, 20);
  }, []);

  useEffect(() => {
    triggerEncrypt('my-secret-document.pdf');
    return () => { if (encryptRef.current) clearInterval(encryptRef.current); };
  }, [triggerEncrypt]);

  // ── Drag & Drop Demo state ──
  const [dragOver, setDragOver] = useState(false);
  const [demoFiles, setDemoFiles] = useState([
    { name: 'vacation-photos.zip', size: '48.2 MB', progress: 100, done: true, encrypted: false },
    { name: 'project-backup.sql', size: '12.8 MB', progress: 100, done: true, encrypted: true },
  ]);

  const simulateUpload = (fileName, fileSize) => {
    const newFile = { name: fileName, size: fileSize, progress: 0, done: false, encrypted: false };
    setDemoFiles(prev => [...prev, newFile]);
    let prog = 0;
    const iv = setInterval(() => {
      prog += Math.random() * 18;
      if (prog >= 100) {
        prog = 100;
        clearInterval(iv);
        setDemoFiles(prev => prev.map(f => f.name === fileName ? { ...f, progress: 100, done: true } : f));
      } else {
        setDemoFiles(prev => prev.map(f => f.name === fileName ? { ...f, progress: Math.floor(prog) } : f));
      }
    }, 90);
  };

  const faqs = [
    {
      q: "Is RAHRUC really secure? Can Telegram access my files?",
      a: "Yes, it is extremely secure. If you use the zero-knowledge Encrypted Vault, your files are encrypted in-browser using Web Crypto AES-GCM-256 before upload. Telegram only receives raw, encrypted blobs without the keys. Since keys never touch our servers or Telegram's servers, no one but you can decrypt them."
    },
    {
      q: "Are there any file size or storage limitations?",
      a: "No! Since we store blobs inside Telegram channels, there are no storage capacity limits. The maximum size for a single file upload is 2GB, which is Telegram's default API limit."
    },
    {
      q: "Do I need to pay anything to host the bot?",
      a: "No. You can create a bot for free on Telegram via @BotFather. You can host the RAHRUC backend yourself for free, or use our hosted managed console."
    },
    {
      q: "Can I stream video files stored in the cloud?",
      a: "Absolutely! RAHRUC features a built-in proxy stream buffering worker. It supports video seek/scrub controls, allowing you to stream large media files directly on the web player without waiting for full downloads."
    }
  ];

  return (
    <div className="min-h-screen bg-[#fafafa] text-sm font-['Poppins',sans-serif] flex flex-col justify-between overflow-x-hidden selection:bg-orange-primary/10">

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&family=Plus+Jakarta+Sans:wght@700;800&display=swap');
        * { font-family: 'Poppins', sans-serif; }
        .header-title { font-family: 'Plus Jakarta Sans', sans-serif; }

        @keyframes packetSlide {
          0%   { left: 0%;   opacity: 0; }
          5%   { opacity: 1; }
          95%  { opacity: 1; }
          100% { left: calc(100% - 12px); opacity: 0; }
        }
        .packet-dot {
          animation: packetSlide 2.8s ease-in-out infinite;
        }

        @keyframes journeyGlow {
          0%, 100% { box-shadow: 0 4px 12px rgba(255,122,0,0.10); transform: translateY(0); }
          50%       { box-shadow: 0 8px 28px rgba(255,122,0,0.35); transform: translateY(-4px); }
        }
        .journey-node {
          animation: journeyGlow 2.4s ease-in-out infinite;
        }

        @keyframes networkPing {
          0%, 100% { box-shadow: 0 0 0 0 rgba(255,122,0,0.4); }
          60%       { box-shadow: 0 0 0 10px rgba(255,122,0,0); }
        }
        .net-node {
          animation: networkPing 2.2s ease-in-out infinite;
        }

        @keyframes orbitRing {
          0%   { transform: translate(-50%,-50%) scale(1);   opacity: 0.18; }
          100% { transform: translate(-50%,-50%) scale(2.4); opacity: 0; }
        }
        .orbit-ring {
          animation: orbitRing 3s ease-out infinite;
        }
        .orbit-ring-2 {
          animation: orbitRing 3s ease-out 1s infinite;
        }
      `}</style>

      {/* SaaS Navigation */}
      <nav className="sticky top-0 z-50 flex items-center justify-between p-4 md:px-16 lg:px-24 xl:px-32 md:py-5 w-full bg-white border-b border-slate-100 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-orange-primary rounded-xl flex items-center justify-center text-white shadow-md shadow-orange-primary/25">
            <Cloud className="w-5 h-5" />
          </div>
          <span className="header-title font-extrabold text-xl text-heading-text tracking-tight">RAHRUC</span>
        </div>

        {/* Menu Links */}
        <div
          className={`
            fixed top-0 right-0 bottom-0 z-50 
            flex flex-col justify-start items-start 
            p-8 bg-white w-80 
            shadow-2xl border-l border-slate-100 
            transition-transform duration-300 ease-in-out
            ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'} 
            md:static md:flex-row md:items-center 
            md:p-0 md:bg-transparent md:w-auto 
            md:shadow-none md:border-none md:translate-x-0
            md:flex md:gap-8 font-medium text-muted-text
          `}
        >
          {/* Mobile Header Inside Menu */}
          <div className="md:hidden flex items-center justify-between w-full pb-6 mb-6 border-b border-slate-100">
            <span className="header-title font-extrabold text-lg text-heading-text">Navigation</span>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="bg-slate-100 hover:bg-slate-200 text-slate-800 p-2 rounded-full transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <Link to="/" onClick={() => setMobileMenuOpen(false)} className="w-full py-3 border-b border-slate-50 md:w-auto md:py-0 md:border-none hover:text-heading-text transition-colors">Home</Link>
          <a href="#features" onClick={() => setMobileMenuOpen(false)} className="w-full py-3 border-b border-slate-50 md:w-auto md:py-0 md:border-none hover:text-heading-text transition-colors">Features</a>
          <Link to="/docs" onClick={() => setMobileMenuOpen(false)} className="w-full py-3 border-b border-slate-50 md:w-auto md:py-0 md:border-none hover:text-heading-text transition-colors">Docs</Link>
          <Link to="/privacy" onClick={() => setMobileMenuOpen(false)} className="w-full py-3 border-b border-slate-50 md:w-auto md:py-0 md:border-none hover:text-heading-text transition-colors">Privacy Policy</Link>
          <Link to="/terms" onClick={() => setMobileMenuOpen(false)} className="w-full py-3 md:w-auto md:py-0 md:border-none hover:text-heading-text transition-colors">Terms of Service</Link>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/login" className="hidden sm:block hover:text-gray-600 font-medium transition-colors">
            Sign In
          </Link>
          <Link
            to="/register"
            className="bg-slate-800 hover:bg-black text-white px-5 py-2.5 rounded-full font-semibold transition shadow-xs text-xs"
          >
            Get Started
          </Link>
        </div>

        <button
          onClick={() => setMobileMenuOpen(true)}
          className="md:hidden bg-gray-800 hover:bg-black text-white p-2 rounded-md transition"
        >
          <Menu className="w-6 h-6" />
        </button>
      </nav>

      {/* Hero Header + Action block with Grid Background */}
      <div className="bg-[url('https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/hero/gridBackground.png')] bg-no-repeat bg-cover bg-center pb-24 border-b border-border-subtle">
        {/* Hero content */}
        <div className="px-6 md:px-16 lg:px-24 xl:px-32 text-center mt-12">
          {/* Banner */}
          <div className="flex items-center gap-2 border border-slate-200 bg-white hover:border-slate-300 rounded-full w-max mx-auto px-4 py-1.5 text-[11px] shadow-xs cursor-pointer select-none">
            <span className="w-2 h-2 rounded-full bg-green-success animate-pulse"></span>
            <span className="text-secondary-text font-medium">Developer beta is officially live</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-orange-primary" />
          </div>

          {/* Hero Section */}
          <h1 className="header-title text-4xl md:text-6xl lg:text-7xl font-extrabold text-center mx-auto mt-8 text-heading-text leading-tight tracking-tight max-w-4xl">
            <span className="text-orange-primary">R</span>emote <span className="text-orange-primary">A</span>ccess <span className="text-orange-primary">H</span>ub for <br />
            <span className="text-orange-primary">R</span>esources, <span className="text-orange-primary">U</span>ploads & <span className="text-orange-primary">C</span>ontent
          </h1>

          <p className="text-sm md:text-base mx-auto max-w-2xl text-center mt-6 text-secondary-text leading-relaxed font-light">
            A zero-knowledge secure cloud platform turning Telegram's global infrastructure into an encrypted storage cluster. Deploy backups, host assets, and stream videos on-demand with zero server storage costs.
          </p>

          <div className="mx-auto w-full flex flex-col sm:flex-row items-center justify-center gap-3 mt-8 max-w-md sm:max-w-none">
            <Link
              to="/register"
              className="w-full sm:w-auto bg-orange-primary hover:bg-orange-primary/95 text-white px-7 py-3 rounded-full font-semibold transition shadow-md shadow-orange-primary/20 flex items-center justify-center gap-2"
            >
              <span>Launch Console</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/docs"
              className="w-full sm:w-auto flex items-center justify-center gap-2 border border-slate-300 hover:bg-slate-200/30 rounded-full px-7 py-3 bg-white/50 text-heading-text font-medium transition"
            >
              Read Technical Spec
            </Link>
          </div>
        </div>
      </div>

      {/* Main SaaS Section */}
      <main className="flex-1 pb-44 px-6 md:px-16 lg:px-24 xl:px-32">

        {/* Features Section */}
        {/* ══ FEATURES — dotted grid bg ══ */}
        <section id="features" className="mt-40 flex flex-col items-center relative rounded-3xl overflow-hidden"
          style={{ backgroundImage: 'radial-gradient(circle, #e2e8f0 1px, transparent 1px)', backgroundSize: '22px 22px' }}>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/30 to-white pointer-events-none"></div>
          <div className="max-w-7xl w-full mb-12 text-center md:text-left">
            <h2 className="header-title font-extrabold text-2xl md:text-3xl text-heading-text mb-4 tracking-tight">
              Designed for modern cloud setups
            </h2>
            <p className="text-sm text-secondary-text max-w-xl">
              Thoughtfully crafted features to manage your assets securely using decentralized Telegram storage pipelines.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 w-full gap-6">

            {/* Feature 1 */}
            <div className="relative p-6 md:p-8 flex flex-col gap-4 transition-all duration-300 cursor-pointer bg-white rounded-2xl shadow-xs border border-border-subtle/40 hover:border-orange-primary/30 bg-gradient-to-b from-white to-orange-primary/5 hover:to-orange-primary/10">
              <div className="flex items-center gap-2.5 mb-1">
                <div>
                  <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8.25 15.75a7.5 7.5 0 1 0 0-15 7.5 7.5 0 0 0 0 15" stroke="#ff7a00" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M13.598 3.066C10.665 6.104 6.75 7.08.938 7.454m14.625 1.429c-4.966-1.057-9.106.75-12.285 4.74" stroke="#ff7a00" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M5.67 1.313c3.278 4.5 4.5 7.065 6 13.29" stroke="#ff7a00" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <h3 className="text-sm font-semibold text-zinc-800 leading-snug">
                  User-First Cryptography
                </h3>
              </div>
              <p className="text-xs text-zinc-600 leading-relaxed font-light">
                Zero-knowledge encryption happens completely in-browser before upload. Keys never touch any server.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="relative p-6 md:p-8 flex flex-col gap-4 transition-all duration-300 cursor-pointer bg-white rounded-2xl shadow-xs border border-border-subtle/40 hover:border-orange-primary/30 hover:bg-gradient-to-b hover:from-white hover:to-orange-primary/5">
              <div className="absolute left-0 top-12 bottom-12 w-1 bg-orange-primary rounded-r"></div>
              <div className="flex items-center gap-2.5 mb-1">
                <div>
                  <svg width="20" height="16" viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16.05.75H3.45a1.8 1.8 0 0 0-1.8 1.8v7.2a1.8 1.8 0 0 0 1.8 1.8h12.6a1.8 1.8 0 0 0 1.8-1.8v-7.2a1.8 1.8 0 0 0-1.8-1.8M.75 15.148h18" stroke="#ff7a00" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <h3 className="text-sm font-semibold text-zinc-800 leading-snug">
                  Fully Responsive Console
                </h3>
              </div>
              <p className="text-xs text-zinc-600 leading-relaxed font-light">
                Premium user experience tailored with micro-animations optimized for mobile, tablet, and desktop viewports.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="relative p-6 md:p-8 flex flex-col gap-4 transition-all duration-300 cursor-pointer bg-white rounded-2xl shadow-xs border border-border-subtle/40 hover:border-orange-primary/30 hover:bg-gradient-to-b hover:from-white hover:to-orange-primary/5">
              <div className="flex items-center gap-2.5 mb-1">
                <div>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g stroke="#ff7a00" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M8 14.665A6.667 6.667 0 1 0 8 1.332a6.667 6.667 0 0 0 0 13.333" />
                      <path d="M8 1.332a9.667 9.667 0 0 0 0 13.333A9.667 9.667 0 0 0 8 1.332M1.333 8h13.334" />
                    </g>
                  </svg>
                </div>
                <h3 className="text-sm font-semibold text-zinc-800 leading-snug">
                  Global Storage CDN
                </h3>
              </div>
              <p className="text-xs text-zinc-600 leading-relaxed font-light">
                Files are structured using materialized paths, making database retrieval fast and clean worldwide.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="relative p-6 md:p-8 flex flex-col gap-4 transition-all duration-300 cursor-pointer bg-white rounded-2xl shadow-xs border border-border-subtle/40 hover:border-orange-primary/30 hover:bg-gradient-to-b hover:from-white hover:to-orange-primary/5">
              <div className="flex items-center gap-2.5 mb-1">
                <div>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g stroke="#ff7a00" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M8.553 1.452a1.33 1.33 0 0 0-1.106 0l-5.714 2.6a.667.667 0 0 0 0 1.22l5.72 2.607a1.33 1.33 0 0 0 1.107 0l5.72-2.6a.667.667 0 0 0 0-1.22z" />
                      <path d="M1.333 8a.67.67 0 0 0 .387.607l5.733 2.606a1.33 1.33 0 0 0 1.1 0l5.72-2.6A.67.67 0 0 0 14.667 8" />
                      <path d="M1.333 11.332a.67.67 0 0 0 .387.607l5.733 2.606a1.33 1.33 0 0 0 1.1 0l5.72-2.6a.67.67 0 0 0 .394-.613" />
                    </g>
                  </svg>
                </div>
                <h3 className="text-sm font-semibold text-zinc-800 leading-snug">
                  Scalable File Vault
                </h3>
              </div>
              <p className="text-xs text-zinc-600 leading-relaxed font-light">
                An isolated client-side folder structure to secure database backups and key credentials.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="relative p-6 md:p-8 flex flex-col gap-4 transition-all duration-300 cursor-pointer bg-white rounded-2xl shadow-xs border border-border-subtle/40 hover:border-orange-primary/30 hover:bg-gradient-to-b hover:from-white hover:to-orange-primary/5">
              <div className="flex items-center gap-2.5 mb-1">
                <div>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11.333 1.332 14 3.999l-2.667 2.666" stroke="#ff7a00" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M2 7.333v-.666A2.667 2.667 0 0 1 4.667 4H14M4.667 14.665 2 12l2.667-2.667" stroke="#ff7a00" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M14 8.668v.667A2.667 2.667 0 0 1 11.333 12H2" stroke="#ff7a00" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <h3 className="text-sm font-semibold text-zinc-800 leading-snug">
                  Stream Buffering
                </h3>
              </div>
              <p className="text-xs text-zinc-600 leading-relaxed font-light">
                Video/audio streams are proxied supporting dynamic seek and scrubbing directly inside the console.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="relative p-6 md:p-8 flex flex-col gap-4 transition-all duration-300 cursor-pointer bg-white rounded-2xl shadow-xs border border-border-subtle/40 hover:border-orange-primary/30 hover:bg-gradient-to-b hover:from-white hover:to-orange-primary/5">
              <div className="flex items-center gap-2.5 mb-1">
                <div>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2.667 9.334a.667.667 0 0 1-.52-1.087l6.6-6.8a.333.333 0 0 1 .573.307L8.04 5.767a.667.667 0 0 0 .627.9h4.666a.666.666 0 0 1 .52 1.087l-6.6 6.8a.334.334 0 0 1-.573-.307l1.28-4.013a.667.667 0 0 0-.627-.9z" stroke="#ff7a00" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <h3 className="text-sm font-semibold text-zinc-800 leading-snug">
                  High-Performance
                </h3>
              </div>
              <p className="text-xs text-zinc-600 leading-relaxed font-light">
                Parallel chunk uploads directly to Telegram API workers ensure fast upload and download rates.
              </p>
            </div>

            {/* Feature 7 */}
            <div className="relative p-6 md:p-8 flex flex-col gap-4 transition-all duration-300 cursor-pointer bg-white rounded-2xl shadow-xs border border-border-subtle/40 hover:border-orange-primary/30 hover:bg-gradient-to-b hover:from-white hover:to-orange-primary/5">
              <div className="flex items-center gap-2.5 mb-1">
                <div>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.8 4.201a.667.667 0 0 0 0 .933l1.067 1.067a.666.666 0 0 0 .933 0l2.07-2.07c.214-.215.576-.147.656.145A4 4 0 0 1 9.02 8.981l-5.273 5.274a1.414 1.414 0 0 1-2-2L7.021 6.98a4 4 0 0 1 4.704-5.506c.292.08.36.441.146.656z" stroke="#ff7a00" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <h3 className="text-sm font-semibold text-zinc-800 leading-snug">
                  Inbox Auto-Syncing
                </h3>
              </div>
              <p className="text-xs text-zinc-600 leading-relaxed font-light">
                Forward images or voice notes directly to your linked Telegram storage bot to auto-catalog them.
              </p>
            </div>

            {/* Feature 8 */}
            <div className="relative p-6 md:p-8 flex flex-col gap-4 transition-all duration-300 cursor-pointer bg-white rounded-2xl shadow-xs border border-border-subtle/40 hover:border-orange-primary/30 hover:bg-gradient-to-b hover:from-white hover:to-orange-primary/5">
              <div className="flex items-center gap-2.5 mb-1">
                <div>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="m10.667 12 4-4-4-4M5.333 4l-4 4 4 4" stroke="#ff7a00" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <h3 className="text-sm font-semibold text-zinc-800 leading-snug">
                  Public Share Pipelines
                </h3>
              </div>
              <p className="text-xs text-zinc-600 leading-relaxed font-light">
                Generate static shareable CDN links bypass-ready to serve assets dynamically on public web endpoints.
              </p>
            </div>
          </div>
        </section>

        {/* ═══ ANIMATED FILE JOURNEY ═══ */}
        {/* ══ FILE JOURNEY — clean open, no bg ══ */}
        <section id="file-journey" className="mt-40">
          <div className="text-center mb-14 space-y-3">
            <span className="inline-flex items-center gap-1.5 text-orange-primary font-semibold text-xs uppercase tracking-widest bg-orange-primary/8 border border-orange-primary/15 px-3 py-1.5 rounded-full">
              <Activity className="w-3 h-3" /> Upload Pipeline
            </span>
            <h2 className="header-title font-extrabold text-4xl text-heading-text">Your file's 5-step secure journey</h2>
            <p className="text-base text-secondary-text max-w-xl mx-auto font-light leading-relaxed">
              Every upload takes a deterministic path through encryption, streaming, and permanent Telegram storage.
            </p>
          </div>

          {/* Visual pipeline — borderless (Desktop) */}
          <div className="hidden md:block relative" style={{ height: '260px' }}>
            {/* SVG animated pipeline connectors */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" viewBox="0 0 100 100" preserveAspectRatio="none">
              <defs>
                <style>{`
                  @keyframes pipeFlow { to { stroke-dashoffset: -16; } }
                  .pipe-1 { animation: pipeFlow 1.4s linear infinite; }
                  .pipe-2 { animation: pipeFlow 1.4s linear 0.28s infinite; }
                  .pipe-3 { animation: pipeFlow 1.4s linear 0.56s infinite; }
                  .pipe-4 { animation: pipeFlow 1.4s linear 0.84s infinite; }
                `}</style>
              </defs>
              <line x1="15" y1="50" x2="27" y2="50" stroke="#7c3aed" strokeWidth="0.7" strokeDasharray="3 2" strokeOpacity="0.5" className="pipe-1" />
              <line x1="32" y1="50" x2="44" y2="50" stroke="#ff7a00" strokeWidth="0.7" strokeDasharray="3 2" strokeOpacity="0.5" className="pipe-2" />
              <line x1="49" y1="50" x2="61" y2="50" stroke="#0ea5e9" strokeWidth="0.7" strokeDasharray="3 2" strokeOpacity="0.5" className="pipe-3" />
              <line x1="66" y1="50" x2="78" y2="50" stroke="#10b981" strokeWidth="0.7" strokeDasharray="3 2" strokeOpacity="0.5" className="pipe-4" />
            </svg>

            {/* Node row */}
            <div className="absolute inset-0 flex items-center justify-between px-[4%]">
              {[
                { Icon: Monitor, label: 'Browser', sub: 'File selected', bg: 'bg-violet-50', ico: 'text-violet-600', border: 'border-violet-200', glow: 'shadow-violet-200' },
                { Icon: ShieldCheck, label: 'AES-256', sub: 'In-browser encrypt', bg: 'bg-orange-50', ico: 'text-orange-500', border: 'border-orange-200', glow: 'shadow-orange-200' },
                { Icon: Zap, label: 'RAHRUC API', sub: 'RAM stream', bg: 'bg-sky-50', ico: 'text-sky-500', border: 'border-sky-200', glow: 'shadow-sky-200' },
                { Icon: Send, label: 'Telegram Bot', sub: 'Bot API', bg: 'bg-emerald-50', ico: 'text-emerald-600', border: 'border-emerald-200', glow: 'shadow-emerald-200' },
                { Icon: HardDrive, label: 'TG Channel', sub: 'Stored forever', bg: 'bg-purple-50', ico: 'text-purple-600', border: 'border-purple-200', glow: 'shadow-purple-200' },
              ].map((n, i) => (
                <div key={i} className="relative flex flex-col items-center gap-3 group z-10">
                  <div
                    className={`journey-node w-16 h-16 md:w-[88px] md:h-[88px] rounded-3xl ${n.bg} border-2 ${n.border} flex items-center justify-center shadow-lg ${n.glow} group-hover:scale-110 group-hover:shadow-xl transition-all duration-200`}
                    style={{ animationDelay: `${i * 0.5}s` }}
                  >
                    <n.Icon className={`w-7 h-7 md:w-9 md:h-9 ${n.ico}`} strokeWidth={1.5} />
                  </div>
                  <div className="text-center">
                    <p className="text-xs md:text-sm font-bold text-heading-text">{n.label}</p>
                    <p className="text-[10px] text-muted-text hidden md:block mt-0.5">{n.sub}</p>
                  </div>
                  <div className="absolute -top-1.5 -right-1 w-5 h-5 bg-slate-800 rounded-full text-white text-[9px] font-bold flex items-center justify-center shadow">
                    {i + 1}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile vertical pipeline (Mobile) */}
          <div className="block md:hidden space-y-6 relative pl-6 border-l-2 border-slate-200/60 ml-4 py-2">
            {[
              { Icon: Monitor, label: 'Browser', sub: 'File selected', bg: 'bg-violet-50', ico: 'text-violet-600', border: 'border-violet-200' },
              { Icon: ShieldCheck, label: 'AES-256', sub: 'In-browser encrypt', bg: 'bg-orange-50', ico: 'text-orange-500', border: 'border-orange-200' },
              { Icon: Zap, label: 'RAHRUC API', sub: 'RAM stream', bg: 'bg-sky-50', ico: 'text-sky-500', border: 'border-sky-200' },
              { Icon: Send, label: 'Telegram Bot', sub: 'Bot API', bg: 'bg-emerald-50', ico: 'text-emerald-600', border: 'border-emerald-200' },
              { Icon: HardDrive, label: 'TG Channel', sub: 'Stored forever', bg: 'bg-purple-50', ico: 'text-purple-600', border: 'border-purple-200' },
            ].map((n, i) => (
              <div key={i} className="relative flex items-center gap-4">
                <div className="absolute -left-[35px] top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-slate-800 text-white text-[10px] font-bold flex items-center justify-center border-2 border-white shadow">
                  {i + 1}
                </div>
                <div className={`w-12 h-12 rounded-xl ${n.bg} border ${n.border} flex items-center justify-center shrink-0 shadow-xs`}>
                  <n.Icon className={`w-6 h-6 ${n.ico}`} strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-sm font-bold text-heading-text">{n.label}</p>
                  <p className="text-xs text-muted-text">{n.sub}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Stats strip below */}
          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { v: '< 800ms', l: 'Average upload time', Icon: Zap, c: 'text-amber-500', bg: 'bg-amber-50' },
              { v: 'AES-GCM-256', l: 'Encryption standard', Icon: ShieldCheck, c: 'text-orange-500', bg: 'bg-orange-50' },
              { v: '2.0 GB', l: 'Max single file size', Icon: HardDrive, c: 'text-sky-500', bg: 'bg-sky-50' },
              { v: '$0.00 / mo', l: 'Monthly storage cost', Icon: Server, c: 'text-emerald-600', bg: 'bg-emerald-50' },
            ].map((s, i) => (
              <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-white border border-slate-100 hover:border-slate-200 hover:shadow-sm transition-all">
                <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center shrink-0`}>
                  <s.Icon className={`w-5 h-5 ${s.c}`} strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-base font-bold text-heading-text leading-none">{s.v}</p>
                  <p className="text-[10px] text-muted-text mt-0.5">{s.l}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Interactive Savings Calculator */}
        <section id="savings-calculator" className="mt-40 bg-transparent py-8 md:py-12">
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-12">
            <span className="text-orange-primary font-bold text-xs uppercase tracking-wider">Cost Efficiency Calculator</span>
            <h2 className="header-title font-extrabold text-3xl text-heading-text">Calculate your cloud storage savings</h2>
            <p className="text-sm text-secondary-text">
              See how much you save by hosting your encrypted media assets and backups on RAHRUC's peer-to-peer cloud grid vs. traditional services.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Input Slider Card */}
            <div className="space-y-6 bg-slate-50 p-6 rounded-2xl">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-heading-text">Storage Required:</span>
                <span className="text-lg font-bold text-orange-primary">{gbValue} GB</span>
              </div>
              <input
                type="range"
                min="10"
                max="2000"
                value={gbValue}
                onChange={(e) => setGbValue(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-primary"
              />
              <div className="flex justify-between text-[11px] text-muted-text">
                <span>10 GB</span>
                <span>500 GB</span>
                <span>1 TB</span>
                <span>2 TB</span>
              </div>

              <div className="space-y-2.5 pt-4 border-t border-slate-200">
                <div className="flex items-center gap-2 text-xs">
                  <Shield className="w-4 h-4 text-green-success" />
                  <span className="text-secondary-text">All stored data is AES-GCM encrypted</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <Zap className="w-4 h-4 text-green-success" />
                  <span className="text-secondary-text">Zero speed throttle / High throughput</span>
                </div>
              </div>
            </div>

            {/* Comparison Cost Card */}
            <div className="space-y-4">
              <h3 className="font-bold text-lg text-heading-text">Estimated monthly costs:</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs pb-2 border-b border-slate-100">
                  <span className="text-muted-text">AWS S3 (Standard Storage)</span>
                  <span className="font-semibold text-slate-700">${(gbValue * 0.023).toFixed(2)} / mo</span>
                </div>
                <div className="flex justify-between items-center text-xs pb-2 border-b border-slate-100">
                  <span className="text-muted-text">Google Drive / Dropbox</span>
                  <span className="font-semibold text-slate-700">${(gbValue * 0.015).toFixed(2)} / mo</span>
                </div>
                <div className="flex justify-between items-center p-3.5 bg-orange-primary/10 rounded-xl border border-orange-primary/20">
                  <div className="flex items-center gap-2.5">
                    <Cloud className="w-5 h-5 text-orange-primary" />
                    <div>
                      <p className="font-bold text-heading-text text-sm">RAHRUC Cloud</p>
                      <p className="text-[10px] text-secondary-text">Using Telegram infrastructure</p>
                    </div>
                  </div>
                  <span className="text-xl font-extrabold text-orange-primary">$0.00 / mo</span>
                </div>
              </div>
              <div className="bg-green-success/5 border border-green-success/15 rounded-xl p-3 text-center">
                <p className="text-xs text-green-700 font-semibold">
                  You save up to ${(gbValue * 12 * 0.023).toFixed(0)} every year!
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Architecture Spec Panel */}
        <section id="architecture" className="mt-40 bg-transparent py-6 sm:py-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-orange-primary/5 rounded-full blur-3xl pointer-events-none"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-primary/10 rounded-full text-[11px] text-orange-primary font-semibold">
                <Layers className="w-3.5 h-3.5" />
                <span>Backend Architecture</span>
              </div>
              <h2 className="header-title font-bold text-3xl text-heading-text tracking-tight">
                No storage costs. High scalability.
              </h2>
              <p className="text-xs text-secondary-text leading-relaxed font-light">
                RAHRUC separates data orchestration from bytes storage. Database indexes (Mongoose) live on fast SSD clusters mapping files to virtual folder trees via materialized paths. The physical file blobs are routed to secure private Telegram channels acting as dynamic cloud buckets.
              </p>
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-orange-primary shrink-0" />
                  <span className="text-xs text-zinc-800">2GB upload capacity</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-orange-primary shrink-0" />
                  <span className="text-xs text-zinc-800">Stream buffering proxy</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-orange-primary shrink-0" />
                  <span className="text-xs text-zinc-800">Materialized path hierarchy</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-orange-primary shrink-0" />
                  <span className="text-xs text-zinc-800">Rate limited uploads</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-6 font-mono text-[11.5px] leading-relaxed text-slate-700 overflow-x-auto shadow-2xs">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
                <span className="text-slate-400">upload_pipeline.go</span>
                <span className="w-2.5 h-2.5 rounded-full bg-orange-primary"></span>
              </div>
              <p className="text-slate-400">// Client uploads payload via Multipart memory storage</p>
              <p>const buffer = req.file.buffer;</p>
              <p>const isEncrypted = req.body.isEncrypted === 'true';</p>
              <br />
              <p className="text-slate-400">// Route to active Telegram bucket adapter</p>
              <p>const tgResult = await storageProvider.upload(buffer, filename);</p>
              <p className="text-orange-primary font-semibold">fileId: tgResult.fileId,</p>
              <p className="text-orange-primary font-semibold">messageId: tgResult.messageId</p>
              <br />
              <p className="text-slate-400">// Commit metadata index to MongoDB</p>
              <p>await File.create(&#123;</p>
              <p className="pl-4">name: filename,</p>
              <p className="pl-4">telegramFileId: tgResult.fileId,</p>
              <p className="pl-4">isEncrypted</p>
              <p>&#125;);</p>
            </div>
          </div>
        </section>

        {/* ═══ LIVE ENCRYPTION VISUALIZER ═══ */}
        {/* ══ ENCRYPTION DEMO — box grid bg ══ */}
        <section id="encryption-demo" className="mt-40 rounded-3xl overflow-hidden relative"
          style={{ backgroundImage: 'linear-gradient(to right, #f1f5f9 1px, transparent 1px), linear-gradient(to bottom, #f1f5f9 1px, transparent 1px)', backgroundSize: '28px 28px' }}>
          <div className="absolute inset-0 bg-gradient-to-br from-white/70 to-white/50 pointer-events-none"></div>
          <div className="relative p-4 sm:p-8 md:p-12">
            <div className="text-center mb-14 space-y-3">
              <span className="inline-flex items-center gap-1.5 text-orange-primary font-semibold text-xs uppercase tracking-widest bg-orange-primary/8 border border-orange-primary/15 px-3 py-1.5 rounded-full">
                <ShieldCheck className="w-3 h-3" /> Zero-Knowledge Demo
              </span>
              <h2 className="header-title font-extrabold text-4xl text-heading-text">Watch AES-256 encrypt your data live</h2>
              <p className="text-base text-secondary-text max-w-xl mx-auto font-light leading-relaxed">
                Type anything. Watch it become unreadable ciphertext — entirely in your browser. Our servers never see plaintext.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              {/* Left: Input panel */}
            <div className="bg-white p-4 sm:p-6 md:p-8 rounded-2xl shadow-sm space-y-5">
                <div className="flex items-center gap-3 pb-5 border-b border-slate-100">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5 text-orange-500" strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-heading-text">In-Browser Encryption</p>
                    <p className="text-[11px] text-muted-text">WebCrypto API — AES-GCM-256</p>
                  </div>
                  <div className={`ml-auto flex items-center gap-1.5 text-[10px] font-semibold px-2.5 py-1 rounded-full ${isEncrypting ? 'bg-orange-50 text-orange-600' : 'bg-green-50 text-green-700'
                    }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${isEncrypting ? 'bg-orange-500 animate-pulse' : 'bg-green-500'}`}></span>
                    {isEncrypting ? 'Encrypting' : 'Ready'}
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">Plaintext</label>
                  <div className="relative">
                    <input
                      id="encrypt-input"
                      type="text"
                      value={encryptInput}
                      onChange={(e) => { setEncryptInput(e.target.value); triggerEncrypt(e.target.value); }}
                      placeholder="Type anything to encrypt..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm text-heading-text outline-none focus:border-orange-primary/50 focus:ring-2 focus:ring-orange-primary/10 transition font-mono"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] text-slate-400 font-mono bg-white border border-slate-100 px-1.5 py-0.5 rounded">UTF-8</span>
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Encryption parameters</p>
                  {[
                    { k: 'Algorithm', v: 'AES-GCM-256' },
                    { k: 'Key derive', v: 'PBKDF2 + SHA-256' },
                    { k: 'IV mode', v: 'Random 96-bit per file' },
                    { k: 'Key storage', v: 'Never — client only' },
                  ].map(r => (
                    <div key={r.k} className="flex justify-between text-xs">
                      <span className="text-muted-text">{r.k}</span>
                      <span className="font-mono font-semibold text-heading-text">{r.v}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: Output terminal */}
              <div className="rounded-2xl overflow-hidden border border-slate-800 shadow-xl">
                {/* Terminal chrome */}
                <div className="bg-slate-800 px-5 py-3 flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                    <div className="w-3 h-3 rounded-full bg-amber-400/80"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                  </div>
                  <span className="text-slate-400 text-[11px] font-mono ml-2">rahruc-crypto — zsh</span>
                  <div className="ml-auto flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>
                    <span className="text-[10px] text-slate-400 font-mono">WebCrypto API</span>
                  </div>
                </div>
                {/* Output area */}
                <div className="bg-[#0d1117] p-4 sm:p-6 font-mono text-[11.5px] leading-relaxed min-h-[280px]">
                  <div className="text-slate-500 mb-3">$ rahruc encrypt --algo aes-gcm-256 --stdin</div>
                  <div className="text-slate-400 mb-4">Plaintext: <span className="text-slate-200">{encryptInput || '—'}</span></div>
                  <div className="text-slate-500 mb-1">Ciphertext (hex):</div>
                  <div className="text-green-400 break-all leading-loose">
                    <span className="text-slate-600">0x</span>{encryptedOutput || '---'}
                    {isEncrypting && <span className="inline-block w-2 h-3.5 bg-green-400 ml-0.5 align-text-bottom animate-pulse"></span>}
                  </div>
                  {!isEncrypting && encryptedOutput && (
                    <div className="mt-4 text-green-500 text-[11px]">✓ Encryption complete. {encryptedOutput.length} hex chars written.</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Telegram API Extraction Mockup Guide */}
        <section id="setup-guide" className="mt-40">
          <div className="text-center space-y-2 mb-16">
            <h2 className="header-title font-extrabold text-3xl text-heading-text">Visual setup workflow</h2>
            <p className="text-sm text-secondary-text max-w-lg mx-auto font-light">
              We leverage existing Telegram bot setups. Here is exactly how to extract your credentials.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Steps tabs selection */}
            <div className="space-y-4">
              <button
                onClick={() => setActiveTab('father')}
                className={`w-full text-left p-4 rounded-2xl border transition-all flex gap-4 items-center ${activeTab === 'father' ? 'border-orange-primary bg-white shadow-sm' : 'border-slate-200 bg-white/40 hover:bg-white/70'
                  }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${activeTab === 'father' ? 'bg-orange-primary text-white' : 'bg-slate-200 text-body-text'
                  }`}>1</div>
                <div>
                  <h4 className="font-semibold text-sm text-heading-text">Create bot via @BotFather</h4>
                  <p className="text-[11px] text-secondary-text">Message /newbot to retrieve your BOT_TOKEN</p>
                </div>
              </button>

              <button
                onClick={() => setActiveTab('chatid')}
                className={`w-full text-left p-4 rounded-2xl border transition-all flex gap-4 items-center ${activeTab === 'chatid' ? 'border-orange-primary bg-white shadow-sm' : 'border-slate-200 bg-white/40 hover:bg-white/70'
                  }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${activeTab === 'chatid' ? 'bg-orange-primary text-white' : 'bg-slate-200 text-body-text'
                  }`}>2</div>
                <div>
                  <h4 className="font-semibold text-sm text-heading-text">Channel & Admin privileges</h4>
                  <p className="text-[11px] text-secondary-text">Create a channel and make the Bot an Admin</p>
                </div>
              </button>

              <button
                onClick={() => setActiveTab('encryption')}
                className={`w-full text-left p-4 rounded-2xl border transition-all flex gap-4 items-center ${activeTab === 'encryption' ? 'border-orange-primary bg-white shadow-sm' : 'border-slate-200 bg-white/40 hover:bg-white/70'
                  }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${activeTab === 'encryption' ? 'bg-orange-primary text-white' : 'bg-slate-200 text-body-text'
                  }`}>3</div>
                <div>
                  <h4 className="font-semibold text-sm text-heading-text">Extract unique Chat ID</h4>
                  <p className="text-[11px] text-secondary-text">Forward a message to GetMyChatID_Bot</p>
                </div>
              </button>
            </div>

            {/* Simulated Telegram App Mockup */}
            <div className="relative mx-auto w-full max-w-[380px] bg-[#e7ebf0] border-8 border-slate-800 rounded-[40px] overflow-hidden shadow-2xl flex flex-col h-[520px]">
              {/* Phone Notch/Speaker */}
              <div className="absolute top-0 inset-x-0 h-4 bg-slate-800 flex justify-center items-center z-30">
                <div className="w-16 h-3 bg-black rounded-b-xl"></div>
              </div>

              {/* Telegram Phone Status Bar */}
              <div className="bg-[#4a6e8d] text-white/90 text-[10px] px-6 pt-5 pb-1 flex justify-between items-center font-sans z-20">
                <span>15:20</span>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-white rounded-full opacity-80 inline-block"></span>
                  <span className="w-3.5 h-2 border border-white rounded-xs opacity-80 inline-block relative after:content-[''] after:absolute after:top-0.5 after:-right-1 after:w-0.5 after:h-1 after:bg-white"></span>
                </div>
              </div>

              {/* Real Telegram Header */}
              <div className="bg-[#517da2] text-white px-4 py-3 flex items-center justify-between shadow-sm z-20">
                <div className="flex items-center gap-3">
                  <ArrowLeft className="w-4 h-4 cursor-pointer text-white/80 hover:text-white" />

                  {activeTab === 'father' && (
                    <>
                      <div className="w-9 h-9 rounded-full bg-[#e39e3b] flex items-center justify-center font-bold text-sm text-white shadow-xs">
                        BF
                      </div>
                      <div>
                        <div className="flex items-center gap-1">
                          <p className="text-xs font-semibold">BotFather</p>
                          <span className="inline-flex items-center justify-center bg-blue-400 text-white rounded-full p-0.5 w-3.5 h-3.5 text-[8px] font-bold">✓</span>
                        </div>
                        <p className="text-[10px] text-white/70">bot</p>
                      </div>
                    </>
                  )}

                  {activeTab === 'chatid' && (
                    <>
                      <div className="w-9 h-9 rounded-full bg-[#0088cc] flex items-center justify-center font-bold text-sm text-white shadow-xs">
                        RC
                      </div>
                      <div>
                        <p className="text-xs font-semibold">RAHRUC Cloud Channel</p>
                        <p className="text-[10px] text-white/70">private channel</p>
                      </div>
                    </>
                  )}

                  {activeTab === 'encryption' && (
                    <>
                      <div className="w-9 h-9 rounded-full bg-[#5288c1] flex items-center justify-center font-bold text-sm text-white shadow-xs">
                        ID
                      </div>
                      <div>
                        <p className="text-xs font-semibold">GetMyChatID_Bot</p>
                        <p className="text-[10px] text-white/70">bot</p>
                      </div>
                    </>
                  )}
                </div>

                <div className="flex items-center gap-3 text-white/80">
                  <Search className="w-4 h-4 cursor-pointer hover:text-white" />
                  <MoreVertical className="w-4 h-4 cursor-pointer hover:text-white" />
                </div>
              </div>

              {/* Chat Wallpaper Background */}
              <div
                className="flex-1 p-4 overflow-y-auto space-y-3.5 text-[11.5px] relative flex flex-col justify-end"
                style={{
                  backgroundColor: '#e7ebf0',
                  backgroundImage: 'radial-gradient(#b4c6d4 0.6px, #e7ebf0 0.6px)',
                  backgroundSize: '12px 12px'
                }}
              >
                {activeTab === 'father' && (
                  <>
                    {/* User Command */}
                    <div className="flex flex-col items-end w-full">
                      <div className="bg-[#effdde] text-slate-800 p-2.5 rounded-[15px] rounded-tr-none shadow-xs max-w-[80%] relative">
                        <p className="pr-4">/newbot</p>
                        <span className="absolute bottom-1 right-2 text-[8px] text-slate-400 flex items-center gap-0.5">
                          15:18 <CheckCheck className="w-3 h-3 text-green-success" />
                        </span>
                      </div>
                    </div>

                    {/* Bot Father Reply */}
                    <div className="flex gap-2 items-end">
                      <div className="w-6 h-6 rounded-full bg-[#e39e3b] flex items-center justify-center text-[8px] font-bold text-white shrink-0">BF</div>
                      <div className="bg-white text-slate-800 p-2.5 rounded-[15px] rounded-bl-none shadow-xs max-w-[80%] relative">
                        <p className="pb-1">Alright, a new bot. How are we going to call it? Please choose a name for your bot.</p>
                        <span className="text-[8px] text-slate-400 block text-right">15:18</span>
                      </div>
                    </div>

                    {/* User Response */}
                    <div className="flex flex-col items-end w-full">
                      <div className="bg-[#effdde] text-slate-800 p-2.5 rounded-[15px] rounded-tr-none shadow-xs max-w-[80%] relative">
                        <p className="pr-4">RAHRUC Space</p>
                        <span className="absolute bottom-1 right-2 text-[8px] text-slate-400 flex items-center gap-0.5">
                          15:19 <CheckCheck className="w-3 h-3 text-green-success" />
                        </span>
                      </div>
                    </div>

                    {/* Bot Father Final Token */}
                    <div className="flex gap-2 items-end">
                      <div className="w-6 h-6 rounded-full bg-[#e39e3b] flex items-center justify-center text-[8px] font-bold text-white shrink-0">BF</div>
                      <div className="bg-white text-slate-800 p-2.5 rounded-[15px] rounded-bl-none shadow-xs max-w-[80%] relative">
                        <p className="pb-1.5">Done! Use this token to access the HTTP API:</p>
                        <p className="font-mono bg-slate-100 p-1.5 text-orange-primary font-semibold rounded break-all select-all">
                          8528431625:AAGiKvBuZN...
                        </p>
                        <span className="text-[8px] text-slate-400 block text-right mt-1">15:19</span>
                      </div>
                    </div>
                  </>
                )}

                {activeTab === 'chatid' && (
                  <>
                    {/* Channel Setup */}
                    <div className="flex flex-col items-center my-2">
                      <span className="bg-[#b4c7d6]/60 text-white text-[10px] px-3 py-1 rounded-full font-medium shadow-2xs">
                        June 17
                      </span>
                    </div>

                    <div className="flex gap-2 items-end">
                      <div className="w-6 h-6 rounded-full bg-[#0088cc] flex items-center justify-center text-[8px] font-bold text-white shrink-0">RC</div>
                      <div className="bg-white text-slate-800 p-2.5 rounded-[15px] rounded-bl-none shadow-xs max-w-[80%] relative">
                        <p className="font-semibold text-[11px] text-[#0088cc] pb-1">System Channel</p>
                        <p>Channel created. Name: <strong>My Private Safe</strong></p>
                        <span className="text-[8px] text-slate-400 block text-right mt-1">15:20</span>
                      </div>
                    </div>

                    <div className="flex gap-2 items-end">
                      <div className="w-6 h-6 rounded-full bg-[#0088cc] flex items-center justify-center text-[8px] font-bold text-white shrink-0">RC</div>
                      <div className="bg-white text-slate-800 p-2.5 rounded-[15px] rounded-bl-none shadow-xs max-w-[80%] relative">
                        <p>Members updated: You, <strong>@RahruCloudBot</strong> added.</p>
                        <span className="text-[8px] text-slate-400 block text-right mt-1">15:20</span>
                      </div>
                    </div>

                    <div className="flex gap-2 items-end">
                      <div className="w-6 h-6 rounded-full bg-[#0088cc] flex items-center justify-center text-[8px] font-bold text-white shrink-0">RC</div>
                      <div className="bg-white text-slate-800 p-2.5 rounded-[15px] rounded-bl-none shadow-xs max-w-[80%] relative">
                        <p className="text-slate-500 italic">@RahruCloudBot has been promoted to Administrator with post permissions.</p>
                        <span className="text-[8px] text-slate-400 block text-right mt-1">15:20</span>
                      </div>
                    </div>
                  </>
                )}

                {activeTab === 'encryption' && (
                  <>
                    {/* User Forward */}
                    <div className="flex flex-col items-end w-full">
                      <div className="bg-[#effdde] text-slate-800 p-2.5 rounded-[15px] rounded-tr-none shadow-xs max-w-[85%] relative">
                        <p className="text-[9px] text-green-700 font-semibold border-l-2 border-green-600 pl-1.5 mb-1">
                          Forwarded from My Private Safe
                        </p>
                        <p className="pr-4 pb-1">Hello from my new channel!</p>
                        <span className="absolute bottom-1 right-2 text-[8px] text-slate-400 flex items-center gap-0.5">
                          15:21 <CheckCheck className="w-3 h-3 text-green-success" />
                        </span>
                      </div>
                    </div>

                    {/* Chat ID Response */}
                    <div className="flex gap-2 items-end">
                      <div className="w-6 h-6 rounded-full bg-[#5288c1] flex items-center justify-center text-[8px] font-bold text-white shrink-0">ID</div>
                      <div className="bg-white text-slate-800 p-2.5 rounded-[15px] rounded-bl-none shadow-xs max-w-[80%] relative">
                        <p className="font-semibold text-slate-500 pb-1">Chat Details</p>
                        <p><strong>Chat Title:</strong> My Private Safe</p>
                        <p><strong>Chat ID:</strong> <code className="text-orange-primary font-semibold font-mono bg-slate-55">-1005577166606</code></p>
                        <span className="text-[8px] text-slate-400 block text-right mt-1.5">15:21</span>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Bottom input area */}
              <div className="bg-white p-2 border-t border-slate-200 flex items-center gap-2 z-20">
                <Smile className="w-5 h-5 text-slate-400 cursor-pointer hover:text-slate-600 shrink-0" />
                <div className="flex-1 bg-slate-100 rounded-full px-3 py-1.5 text-xs text-slate-400 flex items-center justify-between">
                  <span>Message</span>
                  <Paperclip className="w-4 h-4 text-slate-400 cursor-pointer hover:text-slate-600" />
                </div>
                <div className="w-8 h-8 rounded-full bg-[#517da2] flex items-center justify-center text-white cursor-pointer hover:bg-[#43698b] shrink-0">
                  <Send className="w-3.5 h-3.5 transform rotate-45 -translate-x-0.5 -translate-y-0.5" />
                </div>
              </div>
            </div>
          </div>
        </section>        {/* SaaS Pricing Comparison Section */}
        <section id="pricing" className="mt-40 max-w-4xl mx-auto">
          <div className="text-center space-y-2 mb-16">
            <h2 className="header-title font-extrabold text-3xl text-heading-text">Flexible hosting architectures</h2>
            <p className="text-sm text-secondary-text max-w-sm mx-auto">Deploy open-source or scale with our hosted clusters.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white border border-border-subtle/40 rounded-2xl p-8 shadow-xs flex flex-col justify-between">
              <div className="space-y-4">
                <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">Self-Hosted</span>
                <h3 className="header-title font-bold text-2xl text-heading-text">Free Forever</h3>
                <p className="text-xs text-secondary-text">Deploy on your own VPS alongside a local Telegram API Docker container.</p>
                <hr className="border-border-subtle" />
                <ul className="space-y-2.5 text-xs text-muted-text">
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-success shrink-0" /> Open-Source MIT Backend</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-success shrink-0" /> Unlimited Telegram Buckets</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-success shrink-0" /> 2GB Max file size limit</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-success shrink-0" /> Zero storage subscription fees</li>
                </ul>
              </div>
              <a href="#" className="w-full py-2.5 text-center bg-slate-100 hover:bg-slate-200 text-body-text rounded-xl font-semibold text-xs mt-8 transition-colors">
                Coming soon..
              </a>
            </div>

            <div className="bg-white border border-orange-primary/30 text-heading-text rounded-2xl p-8 shadow-md flex flex-col justify-between relative">
              <div className="absolute top-4 right-4 bg-orange-primary/10 border border-orange-primary/20 text-orange-primary text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                Popular
              </div>
              <div className="space-y-4">
                <span className="text-[10px] font-bold tracking-wider text-orange-primary uppercase">Cloud Managed</span>
                <h3 className="header-title font-bold text-2xl text-heading-text">Hosted Console</h3>
                <p className="text-xs text-secondary-text">Zero deployment configuration. Fully managed secure proxy pools.</p>
                <hr className="border-slate-100" />
                <ul className="space-y-2.5 text-xs text-muted-text">
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-orange-primary shrink-0" /> Zero setup required</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-orange-primary shrink-0" /> Auto-scalable proxy workers</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-orange-primary shrink-0" /> Advanced client-side Vault</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-orange-primary shrink-0" /> 24/7 Bot inbox polling listener</li>
                </ul>
              </div>
              <Link to="/register" className="w-full py-2.5 text-center bg-orange-primary hover:bg-orange-primary/95 text-white rounded-xl font-semibold text-xs mt-8 transition-all shadow-md shadow-orange-primary/20">
                Register Free Console Account
              </Link>
            </div>
          </div>
        </section>

        {/* ═══ DRAG & DROP UPLOAD DEMO ═══ */}
        <section id="upload-demo" className="mt-40">
          <div className="text-center mb-14 space-y-3">
            <span className="inline-flex items-center gap-1.5 text-orange-primary font-semibold text-xs uppercase tracking-widest bg-orange-primary/8 border border-orange-primary/15 px-3 py-1.5 rounded-full">
              <Upload className="w-3 h-3" /> Console Preview
            </span>
            <h2 className="header-title font-extrabold text-4xl text-heading-text">Drag. Drop. Done.</h2>
            <p className="text-base text-secondary-text max-w-xl mx-auto font-light leading-relaxed">
              The RAHRUC console is built for speed. Drop a file — it's end-to-end encrypted and stored in under a second.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm overflow-hidden max-w-3xl mx-auto">
            {/* Browser chrome */}
            <div className="bg-slate-50 border-b border-slate-200 px-5 py-3.5 flex items-center gap-3">
              <div className="flex gap-1.5 shrink-0">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
              </div>
              <div className="flex-1 bg-white rounded-lg px-3 py-1.5 text-[11px] text-slate-400 border border-slate-200 font-mono select-none flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-400 shrink-0"></span>
                app.rahruc.online/drive
              </div>
              <div className="shrink-0 flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-slate-200/80 flex items-center justify-center">
                  <ShieldCheck className="w-3.5 h-3.5 text-slate-500" strokeWidth={2} />
                </div>
              </div>
            </div>

            {/* Toolbar */}
            <div className="border-b border-slate-100 px-5 py-2.5 flex items-center gap-3 bg-white">
              <span className="text-[11px] font-semibold text-heading-text">My Drive</span>
              <span className="text-slate-200 text-xs">/</span>
              <span className="text-[11px] text-muted-text">Projects</span>
              <div className="ml-auto flex items-center gap-2">
                <div className="text-[10px] text-orange-500 font-semibold bg-orange-50 border border-orange-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> E2E Encrypted
                </div>
              </div>
            </div>

            <div className="p-6 bg-[#fafafa] space-y-4">
              {/* Drop zone */}
              <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragOver(false);
                  const f = e.dataTransfer.files[0];
                  if (f) simulateUpload(f.name, `${(f.size / 1024 / 1024).toFixed(1)} MB`);
                }}
                onClick={() => simulateUpload(`report-${Date.now()}.pdf`, `${(Math.random() * 40 + 2).toFixed(1)} MB`)}
                className={`border-2 border-dashed rounded-xl p-10 text-center transition-all cursor-pointer select-none ${dragOver
                    ? 'border-orange-primary bg-orange-primary/5 shadow-inner'
                    : 'border-slate-200 hover:border-orange-primary/40 hover:bg-white'
                  }`}
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-colors ${dragOver ? 'bg-orange-100' : 'bg-slate-100'
                  }`}>
                  <Upload className={`w-6 h-6 transition-colors ${dragOver ? 'text-orange-500' : 'text-slate-400'}`} strokeWidth={1.5} />
                </div>
                <p className="text-sm font-semibold text-heading-text mb-1">
                  {dragOver ? 'Release to upload' : 'Drop files here or click to simulate'}
                </p>
                <p className="text-xs text-muted-text">AES-256 encrypted before upload &nbsp;&bull;&nbsp; Max 2 GB</p>
              </div>

              {/* File list */}
              <div className="space-y-2">
                {demoFiles.map((file, i) => {
                  const ext = file.name.split('.').pop();
                  const isZip = ext === 'zip';
                  const isSql = ext === 'sql';
                  return (
                    <div key={i} className="bg-white border border-slate-100 rounded-xl p-3.5 flex items-center gap-4 hover:shadow-xs hover:border-slate-200 transition-all">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${isZip ? 'bg-violet-50' : isSql ? 'bg-sky-50' : 'bg-orange-50'
                        }`}>
                        {isZip
                          ? <Archive className="w-5 h-5 text-violet-500" strokeWidth={1.5} />
                          : isSql
                            ? <Database className="w-5 h-5 text-sky-500" strokeWidth={1.5} />
                            : <FileText className="w-5 h-5 text-orange-400" strokeWidth={1.5} />
                        }
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1.5">
                          <p className="text-xs font-semibold text-heading-text truncate">{file.name}</p>
                          <div className="flex items-center gap-2 shrink-0 ml-2">
                            {file.encrypted && (
                              <span className="text-[9px] bg-green-50 text-green-700 border border-green-100 px-1.5 py-0.5 rounded font-semibold flex items-center gap-1">
                                <ShieldCheck className="w-2.5 h-2.5" /> E2E
                              </span>
                            )}
                            <span className="text-[10px] text-muted-text font-mono">{file.size}</span>
                          </div>
                        </div>
                        {!file.done ? (
                          <div className="space-y-1">
                            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-orange-400 to-orange-500 rounded-full transition-all duration-200"
                                style={{ width: `${file.progress}%` }}
                              ></div>
                            </div>
                            <p className="text-[9px] text-muted-text">{file.progress}% — encrypting &amp; uploading to Telegram…</p>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5">
                            <Check className="w-3 h-3 text-green-500" />
                            <p className="text-[10px] text-green-600 font-semibold">Stored in Telegram channel</p>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* ═══ GLOBAL NETWORK TOPOLOGY ═══ */}
        {/* ══ NETWORK — dotted grid bg ══ */}
        <section id="network" className="mt-40 rounded-3xl overflow-hidden relative"
          style={{ backgroundImage: 'radial-gradient(circle, #e2e8f0 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
          <div className="absolute inset-0 bg-gradient-to-b from-white/60 to-white/80 pointer-events-none"></div>
          <div className="relative">
            <div className="text-center mb-14 space-y-3">
              <span className="inline-flex items-center gap-1.5 text-orange-primary font-semibold text-xs uppercase tracking-widest bg-orange-primary/8 border border-orange-primary/15 px-3 py-1.5 rounded-full">
                <Globe className="w-3 h-3" /> Global Infrastructure
              </span>
              <h2 className="header-title font-extrabold text-4xl text-heading-text">Powered by Telegram's global CDN</h2>
              <p className="text-base text-secondary-text max-w-xl mx-auto font-light leading-relaxed">
                RAHRUC inherits Telegram's fault-tolerant, multi-datacenter infrastructure — the same backbone serving 700M+ users.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              {/* Status bar */}
              <div className="border-b border-slate-100 px-8 py-4 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                  <span className="text-sm font-semibold text-heading-text">All systems operational</span>
                </div>
                <span className="text-[11px] text-muted-text font-mono">6 regions active · 99.99% uptime</span>
              </div>

              {/* Visual topology (Desktop) */}
              <div className="hidden md:block relative select-none" style={{ height: '420px' }}>

                {/* SVG animated connection lines */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <defs>
                    <style>{`
                    @keyframes dash { to { stroke-dashoffset: -20; } }
                    .flow-line { animation: dash 1.8s linear infinite; }
                    .flow-line-2 { animation: dash 1.8s linear 0.3s infinite; }
                    .flow-line-3 { animation: dash 1.8s linear 0.6s infinite; }
                    .flow-line-4 { animation: dash 1.8s linear 0.9s infinite; }
                    .flow-line-5 { animation: dash 1.8s linear 1.2s infinite; }
                    .flow-line-6 { animation: dash 1.8s linear 1.5s infinite; }
                    .flow-line-7 { animation: dash 1.8s linear 0.45s infinite; }
                  `}</style>
                  </defs>
                  {/* Lines from center (50,50) to each satellite */}
                  <line x1="50" y1="50" x2="13" y2="17" stroke="#ff7a00" strokeWidth="0.4" strokeDasharray="3 2" strokeOpacity="0.35" className="flow-line" />
                  <line x1="50" y1="50" x2="87" y2="12" stroke="#6366f1" strokeWidth="0.4" strokeDasharray="3 2" strokeOpacity="0.35" className="flow-line-2" />
                  <line x1="50" y1="50" x2="91" y2="62" stroke="#0ea5e9" strokeWidth="0.4" strokeDasharray="3 2" strokeOpacity="0.35" className="flow-line-3" />
                  <line x1="50" y1="50" x2="22" y2="82" stroke="#22c55e" strokeWidth="0.4" strokeDasharray="3 2" strokeOpacity="0.35" className="flow-line-4" />
                  <line x1="50" y1="50" x2="85" y2="40" stroke="#ec4899" strokeWidth="0.4" strokeDasharray="3 2" strokeOpacity="0.35" className="flow-line-5" />
                  <line x1="50" y1="50" x2="63" y2="85" stroke="#14b8a6" strokeWidth="0.4" strokeDasharray="3 2" strokeOpacity="0.35" className="flow-line-6" />
                  {/* India — Mumbai */}
                  <line x1="50" y1="50" x2="65" y2="37" stroke="#f59e0b" strokeWidth="0.45" strokeDasharray="3 2" strokeOpacity="0.45" className="flow-line-7" />
                  {/* Subtle glow at center */}
                  <circle cx="50" cy="50" r="6" fill="none" stroke="#ff7a00" strokeWidth="0.3" strokeOpacity="0.2" />
                  <circle cx="50" cy="50" r="10" fill="none" stroke="#ff7a00" strokeWidth="0.2" strokeOpacity="0.12" />
                </svg>

                {/* Center RAHRUC hub */}
                <div className="absolute z-20" style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                  {/* Orbit rings */}
                  <div className="orbit-ring absolute w-28 h-28 rounded-full border border-orange-primary/25" style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}></div>
                  <div className="orbit-ring-2 absolute w-28 h-28 rounded-full border border-orange-primary/15" style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}></div>
                  {/* Hub icon */}
                  <div className="relative w-16 h-16 rounded-2xl bg-orange-primary shadow-xl shadow-orange-primary/35 flex items-center justify-center ring-4 ring-orange-primary/15 ring-offset-4 ring-offset-white">
                    <Cloud className="w-7 h-7 text-white" strokeWidth={1.5} />
                  </div>
                  <p className="text-[9px] font-extrabold text-center text-orange-primary mt-2 tracking-widest uppercase">RAHRUC</p>
                </div>

                {/* Satellite DC nodes */}
                {[
                  { city: 'New York', region: 'US East', latency: '12ms', left: '5%', top: '10%', accent: 'border-orange-200 bg-orange-50', ico: 'text-orange-500', dot: 'bg-orange-400' },
                  { city: 'Frankfurt', region: 'EU Central', latency: '8ms', left: '76%', top: '4%', accent: 'border-violet-200 bg-violet-50', ico: 'text-violet-500', dot: 'bg-violet-400' },
                  { city: 'Singapore', region: 'SEA', latency: '14ms', left: '80%', top: '55%', accent: 'border-sky-200 bg-sky-50', ico: 'text-sky-500', dot: 'bg-sky-400' },
                  { city: 'São Paulo', region: 'SA East', latency: '18ms', left: '3%', top: '73%', accent: 'border-emerald-200 bg-emerald-50', ico: 'text-emerald-500', dot: 'bg-emerald-400' },
                  { city: 'Tokyo', region: 'AP Northeast', latency: '11ms', left: '74%', top: '33%', accent: 'border-pink-200 bg-pink-50', ico: 'text-pink-500', dot: 'bg-pink-400' },
                  { city: 'Sydney', region: 'AP Southeast', latency: '16ms', left: '55%', top: '78%', accent: 'border-teal-200 bg-teal-50', ico: 'text-teal-500', dot: 'bg-teal-400' },
                  { city: 'Mumbai', region: 'IN West', latency: '6ms', left: '62%', top: '28%', accent: 'border-amber-200 bg-amber-50', ico: 'text-amber-600', dot: 'bg-amber-400' },
                ].map((dc, i) => (
                  <div
                    key={i}
                    className={`absolute z-10 flex items-center gap-2.5 px-3 py-2.5 rounded-xl border ${dc.accent} shadow-sm hover:shadow-md transition-shadow cursor-default`}
                    style={{ left: dc.left, top: dc.top }}
                  >
                    <div className={`w-8 h-8 rounded-lg ${dc.accent} border flex items-center justify-center shrink-0`}>
                      <Server className={`w-4 h-4 ${dc.ico}`} strokeWidth={1.5} />
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-heading-text whitespace-nowrap">{dc.city}</p>
                      <div className="flex items-center gap-1.5">
                        <span className={`w-1.5 h-1.5 rounded-full ${dc.dot} animate-pulse shrink-0`}></span>
                        <span className="text-[9px] text-muted-text font-mono">{dc.latency}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Mobile grid list of regions (Mobile) */}
              <div className="block md:hidden p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { city: 'New York',   region: 'US East',      latency: '12ms', accent: 'border-orange-100 bg-orange-50/50',  ico: 'text-orange-500' },
                  { city: 'Frankfurt',  region: 'EU Central',   latency: '8ms',  accent: 'border-violet-100 bg-violet-50/50',  ico: 'text-violet-500' },
                  { city: 'Singapore',  region: 'SEA',          latency: '14ms', accent: 'border-sky-100 bg-sky-50/50',        ico: 'text-sky-500'    },
                  { city: 'São Paulo',  region: 'SA East',      latency: '18ms', accent: 'border-emerald-100 bg-emerald-50/50',ico: 'text-emerald-500' },
                  { city: 'Tokyo',      region: 'AP Northeast', latency: '11ms', accent: 'border-pink-100 bg-pink-50/50',      ico: 'text-pink-500'   },
                  { city: 'Sydney',     region: 'AP Southeast', latency: '16ms', accent: 'border-teal-100 bg-teal-50/50',      ico: 'text-teal-500'   },
                  { city: 'Mumbai',     region: 'IN West',      latency: '6ms',  accent: 'border-amber-100 bg-amber-50/50',    ico: 'text-amber-600'  },
                ].map((dc, i) => (
                  <div key={i} className={`flex items-center gap-3 p-3 rounded-xl border ${dc.accent} shadow-2xs`}>
                    <div className={`w-8 h-8 rounded-lg ${dc.accent} border flex items-center justify-center shrink-0`}>
                      <Server className={`w-4 h-4 ${dc.ico}`} strokeWidth={1.5} />
                    </div>
                    <div>
                      <p className="text-[11.5px] font-bold text-heading-text">{dc.city}</p>
                      <p className="text-[9.5px] text-muted-text font-mono">Latency: {dc.latency}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Stats footer */}
              <div className="border-t border-slate-100 px-8 py-6 grid grid-cols-3 gap-6">
                {[
                  { v: '700M+', l: 'Active Telegram users', Icon: Globe },
                  { v: '99.99%', l: 'Uptime SLA', Icon: Activity },
                  { v: '~0ms', l: 'Additional latency', Icon: Zap },
                ].map((s, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                      <s.Icon className="w-5 h-5 text-slate-500" strokeWidth={1.5} />
                    </div>
                    <div>
                      <p className="header-title font-extrabold text-xl text-heading-text">{s.v}</p>
                      <p className="text-[10px] text-muted-text">{s.l}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Interactive FAQ Accordion */}
        <section id="faq" className="mt-40 max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-sm font-medium tracking-wider text-slate-900 mb-2">FAQ'S</p>
            <h1 className="text-3xl font-medium text-zinc-800">Everything you need to know</h1>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = activeFaq === index;
              return (
                <div key={index}>
                  <div className="bg-white border border-zinc-200 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setActiveFaq(isOpen ? null : index)}
                      className="w-full flex items-center justify-between p-4 text-left hover:bg-zinc-50 transition-colors cursor-pointer"
                    >
                      <span className="text-sm text-zinc-800 pr-4 font-medium">{faq.q}</span>
                      <div className="shrink-0 size-7 rounded-full bg-black/5 flex items-center justify-center cursor-pointer">
                        {isOpen ? (
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="m8.348 8.348 6.874 6.874m.001-6.874-6.875 6.874" stroke="#000" strokeOpacity=".4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        ) : (
                          <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3.472 8.332h9.722M8.333 3.473v9.722" stroke="#000" strokeOpacity=".4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </div>
                    </button>
                  </div>

                  <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="px-5 py-4">
                      <p className="text-sm font-light text-zinc-600 leading-relaxed">
                        {faq.a}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      {/* ══════════════ PREMIUM FOOTER ══════════════ */}
      <footer className="w-full bg-slate-950 text-slate-400 mt-32">
        {/* Top section */}
        <div className="max-w-7xl mx-auto px-6 pt-16 pb-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">

          {/* Brand — 2 cols */}
          <div className="lg:col-span-2 space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/30">
                <Cloud className="w-5 h-5 text-white" />
              </div>
              <span className="header-title font-extrabold text-xl text-white tracking-tight">RAHRUC</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-xs">
              A zero-knowledge encrypted cloud — powered by Telegram's global CDN. Store anything. Pay nothing.
            </p>
            {/* Status badge */}
            <div className="inline-flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-full px-3 py-1.5 text-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
              <span className="text-slate-300 font-medium">All systems operational</span>
            </div>
          </div>

          {/* Product */}
          <div className="space-y-4">
            <p className="text-xs font-bold text-slate-200 uppercase tracking-widest">Product</p>
            <ul className="space-y-2.5">
              {[
                { label: 'Features', href: '#features' },
                { label: 'Architecture', href: '#architecture' },
                { label: 'Pricing', href: '#pricing' },
                { label: 'Changelog', href: '#' },
                { label: 'Roadmap', href: '#' },
              ].map(l => (
                <li key={l.label}>
                  <a href={l.href} className="text-sm text-slate-400 hover:text-white transition-colors">{l.label}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Developers */}
          <div className="space-y-4">
            <p className="text-xs font-bold text-slate-200 uppercase tracking-widest">Developers</p>
            <ul className="space-y-2.5">
              {[
                { label: 'Documentation', href: '/docs' },
                { label: 'API Reference', href: '/docs' },
                { label: 'Telegram Bot', href: '#' },
                { label: 'SDKs', href: '#' },
                { label: 'Status Page', href: '#' },
              ].map(l => (
                <li key={l.label}>
                  <Link to={l.href} className="text-sm text-slate-400 hover:text-white transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <p className="text-xs font-bold text-slate-200 uppercase tracking-widest">Legal</p>
            <ul className="space-y-2.5">
              {[
                { label: 'Privacy Policy', href: '/privacy' },
                { label: 'Terms of Service', href: '/terms' },
                { label: 'Cookie Policy', href: '/privacy' },
                { label: 'Security', href: '/docs' },
                { label: 'Contact Us', href: 'mailto:rahulkumarsharma776194@gmail.com' },
              ].map(l => (
                <li key={l.label}>
                  {l.href.startsWith('mailto') || l.href.startsWith('#')
                    ? <a href={l.href} className="text-sm text-slate-400 hover:text-white transition-colors">{l.label}</a>
                    : <Link to={l.href} className="text-sm text-slate-400 hover:text-white transition-colors">{l.label}</Link>
                  }
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-800 max-w-7xl mx-auto"></div>

        {/* Bottom bar */}
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} RAHRUC. All rights reserved. &nbsp;·&nbsp;
            <a href="https://rahruc.online" className="hover:text-orange-400 transition-colors">rahruc.online</a>
          </p>
          <div className="flex items-center gap-4">
            <Link to="/privacy" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">Privacy</Link>
            <Link to="/terms" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">Terms</Link>
            <a href="https://t.me" target="_blank" rel="noreferrer"
              className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-sky-500/20 border border-slate-700 hover:border-sky-500/40 flex items-center justify-center transition-all group">
              <Send className="w-3.5 h-3.5 text-slate-400 group-hover:text-sky-400" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
