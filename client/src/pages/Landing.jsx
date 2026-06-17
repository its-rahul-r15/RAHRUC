import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Cloud, Shield, Lock, Send, HardDrive, Key, ArrowRight, Menu, X, ArrowUpRight, Terminal, RefreshCw, Layers, Check, Database, Zap, Paperclip, Smile, MoreVertical, Search, ArrowLeft, CheckCheck } from 'lucide-react';

export default function Landing() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('father'); // 'father' | 'chatid' | 'encryption'
  const [gbValue, setGbValue] = useState(150);
  const [activeFaq, setActiveFaq] = useState(null);

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
        * {
          font-family: 'Poppins', sans-serif;
        }
        .header-title {
          font-family: 'Plus Jakarta Sans', sans-serif;
        }
      `}</style>

      {/* Hero Header + Action block with Grid Background */}
      <div className="bg-[url('https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/hero/gridBackground.png')] bg-no-repeat bg-cover bg-center pb-24 border-b border-border-subtle">
        {/* SaaS Navigation */}
        <nav className="flex items-center justify-between p-4 md:px-16 lg:px-24 xl:px-32 md:py-6 w-full bg-white/30 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-orange-primary rounded-xl flex items-center justify-center text-white shadow-md shadow-orange-primary/25">
              <Cloud className="w-5 h-5" />
            </div>
            <span className="header-title font-extrabold text-xl text-heading-text tracking-tight">RAHRUC</span>
          </div>

          {/* Menu Links */}
          <div 
            className={`
              max-md:fixed max-md:top-0 max-md:right-0 max-md:bottom-0 max-md:z-50 
              max-md:flex max-md:flex-col max-md:justify-start max-md:items-start 
              max-md:p-8 max-md:bg-white max-md:w-80 
              max-md:shadow-2xl max-md:border-l max-md:border-slate-100 
              max-md:transition-transform max-md:duration-300 ease-in-out
              ${mobileMenuOpen ? 'max-md:translate-x-0' : 'max-md:translate-x-full'} 
              md:flex md:items-center md:gap-8 font-medium text-muted-text
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
            
            <a href="#" onClick={() => setMobileMenuOpen(false)} className="max-md:w-full max-md:py-3 max-md:border-b max-md:border-slate-50 hover:text-heading-text transition-colors">Platform</a>
            <a href="#features" onClick={() => setMobileMenuOpen(false)} className="max-md:w-full max-md:py-3 max-md:border-b max-md:border-slate-50 hover:text-heading-text transition-colors">Features</a>
            <a href="#savings-calculator" onClick={() => setMobileMenuOpen(false)} className="max-md:w-full max-md:py-3 max-md:border-b max-md:border-slate-50 hover:text-heading-text transition-colors">Savings</a>
            <a href="#architecture" onClick={() => setMobileMenuOpen(false)} className="max-md:w-full max-md:py-3 max-md:border-b max-md:border-slate-50 hover:text-heading-text transition-colors">Architecture</a>
            <a href="#setup-guide" onClick={() => setMobileMenuOpen(false)} className="max-md:w-full max-md:py-3 max-md:border-b max-md:border-slate-50 hover:text-heading-text transition-colors">Setup</a>
            <a href="#pricing" onClick={() => setMobileMenuOpen(false)} className="max-md:w-full max-md:py-3 hover:text-heading-text transition-colors">Pricing</a>
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
            A zero-knowledge MERN stack cloud platform turning Telegram's global infrastructure into an encrypted storage cluster. Deploy backups, host assets, and stream videos on-demand with zero server storage costs.
          </p>

          <div className="mx-auto w-full flex flex-col sm:flex-row items-center justify-center gap-3 mt-8 max-w-md sm:max-w-none">
            <Link
              to="/register"
              className="w-full sm:w-auto bg-orange-primary hover:bg-orange-primary/95 text-white px-7 py-3 rounded-full font-semibold transition shadow-md shadow-orange-primary/20 flex items-center justify-center gap-2"
            >
              <span>Launch Console</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="#architecture"
              className="w-full sm:w-auto flex items-center justify-center gap-2 border border-slate-300 hover:bg-slate-200/30 rounded-full px-7 py-3 bg-white/50 text-heading-text font-medium transition"
            >
              Read Technical Spec
            </a>
          </div>
        </div>
      </div>

      {/* Main SaaS Section */}
      <main className="flex-1 pb-44 px-6 md:px-16 lg:px-24 xl:px-32">

        {/* Feature Grid Section */}
        <section id="features" className="mt-40">
          <div className="text-center space-y-2 mb-16">
            <h2 className="header-title font-extrabold text-3xl text-heading-text">Designed for modern developer setups</h2>
            <p className="text-sm text-secondary-text max-w-md mx-auto">Get absolute control over your media assets and databases.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white border border-border-subtle rounded-2xl p-6 shadow-xs relative overflow-hidden group">
              <div className="p-3 bg-orange-primary/10 rounded-xl text-orange-primary w-fit mb-4">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-lg text-heading-text mb-2">Zero-Knowledge Vault</h3>
              <p className="text-xs text-secondary-text leading-relaxed font-light">
                Encrypted at rest *before* leaving the client. Uses Web Crypto AES-GCM-256 in-browser. Keys are derived via PBKDF2 from your master vault password and never touch our servers.
              </p>
            </div>

            <div className="bg-white border border-border-subtle rounded-2xl p-6 shadow-xs relative overflow-hidden group">
              <div className="p-3 bg-blue-500/10 rounded-xl text-blue-500 w-fit mb-4">
                <Send className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-lg text-heading-text mb-2">Telegram Inbox Syncing</h3>
              <p className="text-xs text-secondary-text leading-relaxed font-light">
                Link your personal Telegram handle. Forward folders, voice notes, PDFs, or photos directly to your linked storage bot and watch them auto-catalog inside your dashboard.
              </p>
            </div>

            <div className="bg-white border border-border-subtle rounded-2xl p-6 shadow-xs relative overflow-hidden group">
              <div className="p-3 bg-green-success/10 rounded-xl text-green-success w-fit mb-4">
                <RefreshCw className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-lg text-heading-text mb-2">Public CDN Pipelines</h3>
              <p className="text-xs text-secondary-text leading-relaxed font-light">
                Generate static shareable slugs. Streams are proxied with custom Range headers supporting seek/scrub controls for video players, fully bypassing Telegram token expirations.
              </p>
            </div>
          </div>
        </section>

        {/* Interactive Savings Calculator */}
        <section id="savings-calculator" className="mt-40 bg-white border border-border-subtle rounded-3xl p-8 md:p-12 shadow-xs">
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-12">
            <span className="text-orange-primary font-bold text-xs uppercase tracking-wider">Cost Efficiency Calculator</span>
            <h2 className="header-title font-extrabold text-3xl text-heading-text">Calculate your cloud storage savings</h2>
            <p className="text-sm text-secondary-text">
              See how much you save by hosting your encrypted media assets and backups on RAHRUC's peer-to-peer cloud grid vs. traditional services.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Input Slider Card */}
            <div className="space-y-6 bg-slate-50 p-6 rounded-2xl border border-slate-100">
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
        <section id="architecture" className="mt-40 bg-slate-900 text-white rounded-3xl p-6 sm:p-12 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-orange-primary/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-[11px] text-orange-primary font-semibold">
                <Layers className="w-3.5 h-3.5" />
                <span>Backend Architecture</span>
              </div>
              <h2 className="header-title font-bold text-3xl text-white tracking-tight">
                No storage costs. High scalability.
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed font-light">
                RAHRUC separates data orchestration from bytes storage. Database indexes (Mongoose) live on fast SSD clusters mapping files to virtual folder trees via materialized paths. The physical file blobs are routed to secure private Telegram channels acting as dynamic cloud buckets.
              </p>
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-orange-primary shrink-0" />
                  <span className="text-xs text-slate-200">2GB upload capacity</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-orange-primary shrink-0" />
                  <span className="text-xs text-slate-200">Stream buffering proxy</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-orange-primary shrink-0" />
                  <span className="text-xs text-slate-200">Materialized path hierarchy</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-orange-primary shrink-0" />
                  <span className="text-xs text-slate-200">Rate limited uploads</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-950/50 border border-slate-800 rounded-2xl p-6 font-mono text-[11.5px] leading-relaxed text-slate-300 overflow-x-auto">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                <span className="text-slate-500">upload_pipeline.go</span>
                <span className="w-2.5 h-2.5 rounded-full bg-orange-primary"></span>
              </div>
              <p className="text-slate-500">// Client uploads payload via Multipart memory storage</p>
              <p>const buffer = req.file.buffer;</p>
              <p>const isEncrypted = req.body.isEncrypted === 'true';</p>
              <br />
              <p className="text-slate-500">// Route to active Telegram bucket adapter</p>
              <p>const tgResult = await storageProvider.upload(buffer, filename);</p>
              <p className="text-orange-primary">fileId: tgResult.fileId,</p>
              <p className="text-orange-primary">messageId: tgResult.messageId</p>
              <br />
              <p className="text-slate-500">// Commit metadata index to MongoDB</p>
              <p>await File.create(&#123;</p>
              <p className="pl-4">name: filename,</p>
              <p className="pl-4">telegramFileId: tgResult.fileId,</p>
              <p className="pl-4">isEncrypted</p>
              <p>&#125;);</p>
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
                className={`w-full text-left p-4 rounded-2xl border transition-all flex gap-4 items-center ${
                  activeTab === 'father' ? 'border-orange-primary bg-white shadow-sm' : 'border-slate-200 bg-white/40 hover:bg-white/70'
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                  activeTab === 'father' ? 'bg-orange-primary text-white' : 'bg-slate-200 text-body-text'
                }`}>1</div>
                <div>
                  <h4 className="font-semibold text-sm text-heading-text">Create bot via @BotFather</h4>
                  <p className="text-[11px] text-secondary-text">Message /newbot to retrieve your BOT_TOKEN</p>
                </div>
              </button>

              <button
                onClick={() => setActiveTab('chatid')}
                className={`w-full text-left p-4 rounded-2xl border transition-all flex gap-4 items-center ${
                  activeTab === 'chatid' ? 'border-orange-primary bg-white shadow-sm' : 'border-slate-200 bg-white/40 hover:bg-white/70'
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                  activeTab === 'chatid' ? 'bg-orange-primary text-white' : 'bg-slate-200 text-body-text'
                }`}>2</div>
                <div>
                  <h4 className="font-semibold text-sm text-heading-text">Channel & Admin privileges</h4>
                  <p className="text-[11px] text-secondary-text">Create a channel and make the Bot an Admin</p>
                </div>
              </button>

              <button
                onClick={() => setActiveTab('encryption')}
                className={`w-full text-left p-4 rounded-2xl border transition-all flex gap-4 items-center ${
                  activeTab === 'encryption' ? 'border-orange-primary bg-white shadow-sm' : 'border-slate-200 bg-white/40 hover:bg-white/70'
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                  activeTab === 'encryption' ? 'bg-orange-primary text-white' : 'bg-slate-200 text-body-text'
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
        </section>

        {/* SaaS Pricing Comparison Section */}
        <section id="pricing" className="mt-40 max-w-4xl mx-auto">
          <div className="text-center space-y-2 mb-16">
            <h2 className="header-title font-extrabold text-3xl text-heading-text">Flexible hosting architectures</h2>
            <p className="text-sm text-secondary-text max-w-sm mx-auto">Deploy open-source or scale with our hosted clusters.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white border border-border-subtle rounded-3xl p-8 shadow-xs flex flex-col justify-between">
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
              <a href="https://github.com" className="w-full py-2.5 text-center bg-slate-100 hover:bg-slate-200 text-body-text rounded-xl font-semibold text-xs mt-8 transition-colors">
                View GitHub Repository
              </a>
            </div>

            <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl p-8 shadow-md flex flex-col justify-between relative">
              <div className="absolute top-4 right-4 bg-orange-primary/10 border border-orange-primary/20 text-orange-primary text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                Popular
              </div>
              <div className="space-y-4">
                <span className="text-[10px] font-bold tracking-wider text-orange-primary uppercase">Cloud Managed</span>
                <h3 className="header-title font-bold text-2xl text-white">Hosted Console</h3>
                <p className="text-xs text-slate-400">Zero deployment configuration. Fully managed secure proxy pools.</p>
                <hr className="border-slate-800" />
                <ul className="space-y-2.5 text-xs text-slate-300">
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

        {/* Interactive FAQ Accordion */}
        <section id="faq" className="mt-40 max-w-3xl mx-auto">
          <div className="text-center space-y-2 mb-16">
            <span className="text-orange-primary font-bold text-xs uppercase tracking-wider">Common Inquiries</span>
            <h2 className="header-title font-extrabold text-3xl text-heading-text">Frequently Asked Questions</h2>
            <p className="text-sm text-secondary-text">Quick answers to clear up any doubts about RAHRUC's architecture.</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = activeFaq === index;
              return (
                <div 
                  key={index}
                  className="bg-white border border-border-subtle rounded-2xl overflow-hidden transition-all duration-300 shadow-2xs"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : index)}
                    className="w-full flex items-center justify-between p-6 text-left font-semibold text-heading-text text-sm hover:bg-slate-50/50 transition-colors"
                  >
                    <span>{faq.q}</span>
                    <span className={`w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                      ↓
                    </span>
                  </button>
                  <div 
                    className={`transition-all duration-305 ease-in-out overflow-hidden ${
                      isOpen ? 'max-h-[300px] border-t border-slate-100 p-6 text-xs text-secondary-text leading-relaxed font-light' : 'max-h-0'
                    }`}
                  >
                    {faq.a}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-12 px-6 text-center text-xs text-secondary-text">
        <p className="max-w-md mx-auto leading-normal">
          RAHRUC - Remote Access Hub for Resources, Uploads & Content. Designed with extreme privacy protocols.
        </p>
      </footer>
    </div>
  );
}
