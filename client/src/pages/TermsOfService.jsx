import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Cloud, ArrowLeft, FileText, ChevronRight, AlertTriangle, Check } from 'lucide-react';

const sections = [
  { id: 'acceptance',    title: 'Acceptance of Terms' },
  { id: 'description',  title: 'Service Description' },
  { id: 'eligibility',  title: 'Eligibility' },
  { id: 'account',      title: 'Account Responsibilities' },
  { id: 'acceptable',   title: 'Acceptable Use' },
  { id: 'ip',           title: 'Intellectual Property' },
  { id: 'disclaimer',   title: 'Disclaimer of Warranties' },
  { id: 'liability',    title: 'Limitation of Liability' },
  { id: 'termination',  title: 'Termination' },
  { id: 'governing',    title: 'Governing Law' },
  { id: 'changes',      title: 'Changes to Terms' },
  { id: 'contact',      title: 'Contact' },
];

export default function TermsOfService() {
  const [active, setActive] = useState('acceptance');

  useEffect(() => {
    document.title = 'Terms of Service — RAHRUC';
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id); });
      },
      { rootMargin: '-20% 0px -70% 0px' }
    );
    sections.forEach(s => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-[#f9fafb]" style={{ fontFamily: "'Poppins', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&family=Plus+Jakarta+Sans:wght@700;800&display=swap'); * { font-family: 'Poppins', sans-serif; } .hf { font-family: 'Plus Jakarta Sans', sans-serif; }`}</style>

      {/* Nav */}
      <nav className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-[#ff7a00] rounded-lg flex items-center justify-center shadow-md shadow-orange-500/25">
              <Cloud className="w-4 h-4 text-white" />
            </div>
            <span className="hf font-extrabold text-lg text-slate-900">RAHRUC</span>
          </Link>
          <Link to="/" className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to home
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <div className="bg-white border-b border-slate-100"
        style={{ backgroundImage: 'linear-gradient(to right, #f1f5f9 1px, transparent 1px), linear-gradient(to bottom, #f1f5f9 1px, transparent 1px)', backgroundSize: '32px 32px' }}>
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-4">
            <Link to="/" className="hover:text-[#ff7a00] transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-slate-700">Terms of Service</span>
          </div>
          <div className="flex items-start gap-5">
            <div className="w-14 h-14 rounded-2xl bg-sky-50 border-2 border-sky-100 flex items-center justify-center shrink-0 mt-1">
              <FileText className="w-7 h-7 text-sky-500" strokeWidth={1.5} />
            </div>
            <div>
              <h1 className="hf font-extrabold text-4xl text-slate-900 mb-3">Terms of Service</h1>
              <p className="text-slate-500 text-sm">Last updated: <strong className="text-slate-700">June 18, 2025</strong> &nbsp;·&nbsp; Effective immediately</p>
              <p className="text-slate-500 text-sm mt-1 max-w-xl">Please read these terms carefully before using RAHRUC. By accessing or using our service, you agree to be bound by these terms.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-7xl mx-auto px-6 py-12 flex gap-12">

        {/* TOC Sidebar */}
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="sticky top-24 bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="px-5 py-4 border-b border-slate-100">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">On this page</p>
            </div>
            <nav className="p-3 space-y-0.5">
              {sections.map(s => (
                <a key={s.id} href={`#${s.id}`}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
                    active === s.id
                      ? 'bg-sky-50 text-sky-600 font-semibold'
                      : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                  }`}
                >
                  {active === s.id && <span className="w-1.5 h-1.5 rounded-full bg-sky-500 shrink-0"></span>}
                  {s.title}
                </a>
              ))}
            </nav>
          </div>
        </aside>

        {/* Content */}
        <main className="flex-1 max-w-3xl space-y-14">

          <section id="acceptance">
            <SH icon={<Check className="w-5 h-5 text-emerald-500" />} title="Acceptance of Terms" />
            <Prose>
              <p>By accessing or using RAHRUC ("the Service"), you acknowledge that you have read, understood, and agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, you may not access or use the Service.</p>
              <p>These Terms constitute a legally binding agreement between you and RAHRUC. If you are using the Service on behalf of an organization, you represent that you have the authority to bind that organization to these Terms.</p>
            </Prose>
          </section>

          <section id="description">
            <SH icon={<FileText className="w-5 h-5 text-sky-500" />} title="Service Description" />
            <Prose>
              <p>RAHRUC provides an encrypted cloud storage service that leverages Telegram's infrastructure as a storage backend. The Service allows you to:</p>
              <ul>
                <li>Upload files encrypted client-side using AES-GCM-256</li>
                <li>Store encrypted file data in designated Telegram channels/bots</li>
                <li>Access, manage, and download your files through the RAHRUC interface</li>
                <li>Share files via secure public links</li>
              </ul>
              <Warn>The Service is provided "as is." We reserve the right to modify, suspend, or discontinue any aspect of the Service at any time.</Warn>
            </Prose>
          </section>

          <section id="eligibility">
            <SH icon={<Check className="w-5 h-5 text-violet-500" />} title="Eligibility" />
            <Prose>
              <p>You must be at least 13 years of age to use RAHRUC. By using the Service, you represent and warrant that:</p>
              <ul>
                <li>You are at least 13 years old</li>
                <li>You have the legal capacity to enter into a binding contract</li>
                <li>You are not located in a country subject to a U.S. government embargo</li>
                <li>Your use of the Service complies with all applicable laws and regulations</li>
              </ul>
            </Prose>
          </section>

          <section id="account">
            <SH icon={<AlertTriangle className="w-5 h-5 text-amber-500" />} title="Account Responsibilities" />
            <Prose>
              <p>When you create an account with RAHRUC, you agree to:</p>
              <ul>
                <li>Provide accurate and complete registration information</li>
                <li>Maintain the security and confidentiality of your password</li>
                <li>Promptly notify us of any unauthorized access to your account</li>
                <li>Be responsible for all activities that occur under your account</li>
                <li>Not share your account credentials with third parties</li>
              </ul>
              <Warn><strong>Important:</strong> Because RAHRUC uses client-side encryption, we cannot recover your files if you lose your credentials. Keep your password safe.</Warn>
            </Prose>
          </section>

          <section id="acceptable">
            <SH icon={<AlertTriangle className="w-5 h-5 text-red-400" />} title="Acceptable Use" />
            <Prose>
              <p>You agree not to use RAHRUC to store, share, or transmit any content that:</p>
              <ul>
                <li>Is illegal under applicable law or regulation</li>
                <li>Violates any intellectual property rights</li>
                <li>Contains malware, viruses, or malicious code</li>
                <li>Constitutes child sexual abuse material (CSAM) — violations will be reported to authorities</li>
                <li>Is used to harass, threaten, or harm others</li>
                <li>Violates Telegram's Terms of Service</li>
              </ul>
              <p>RAHRUC reserves the right to terminate accounts found in violation of these terms without notice.</p>
            </Prose>
          </section>

          <section id="ip">
            <SH icon={<FileText className="w-5 h-5 text-purple-500" />} title="Intellectual Property" />
            <Prose>
              <p><strong>Your content:</strong> You retain all intellectual property rights to files you upload. By using RAHRUC, you grant us a limited, non-exclusive license to process your encrypted file data solely to provide the Service.</p>
              <p><strong>Our content:</strong> The RAHRUC platform, interface, software, and documentation are owned by RAHRUC and protected by intellectual property laws. You may not copy, modify, distribute, or create derivative works without our written permission.</p>
            </Prose>
          </section>

          <section id="disclaimer">
            <SH icon={<AlertTriangle className="w-5 h-5 text-orange-400" />} title="Disclaimer of Warranties" />
            <Prose>
              <p>THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO:</p>
              <ul>
                <li>Implied warranties of merchantability or fitness for a particular purpose</li>
                <li>Warranties of uninterrupted or error-free service</li>
                <li>Warranties regarding the security, accuracy, or reliability of the Service</li>
              </ul>
              <p>We do not warrant that defects will be corrected or that the Service is free of viruses or other harmful components.</p>
            </Prose>
          </section>

          <section id="liability">
            <SH icon={<AlertTriangle className="w-5 h-5 text-red-500" />} title="Limitation of Liability" />
            <Prose>
              <p>TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, RAHRUC SHALL NOT BE LIABLE FOR ANY:</p>
              <ul>
                <li>Indirect, incidental, special, or consequential damages</li>
                <li>Loss of data, profits, or goodwill</li>
                <li>Service interruptions caused by Telegram's infrastructure</li>
                <li>Unauthorized access to your encrypted data</li>
              </ul>
              <p>In no event shall RAHRUC's total liability exceed the amount you paid us in the 12 months preceding the claim, or USD $100, whichever is greater.</p>
            </Prose>
          </section>

          <section id="termination">
            <SH icon={<AlertTriangle className="w-5 h-5 text-slate-400" />} title="Termination" />
            <Prose>
              <p>You may terminate your account at any time through the Settings page. Upon termination:</p>
              <ul>
                <li>Your account metadata will be deleted from our systems within 30 days</li>
                <li>File data stored in Telegram will remain until manually deleted from your bot/channel</li>
                <li>We reserve the right to retain anonymized usage data for service improvement</li>
              </ul>
              <p>We may suspend or terminate your account immediately if you violate these Terms, without obligation to provide a refund or notice.</p>
            </Prose>
          </section>

          <section id="governing">
            <SH icon={<FileText className="w-5 h-5 text-slate-500" />} title="Governing Law" />
            <Prose>
              <p>These Terms shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law provisions. Any disputes arising under these Terms shall be subject to the exclusive jurisdiction of the courts located in India.</p>
            </Prose>
          </section>

          <section id="changes">
            <SH icon={<Check className="w-5 h-5 text-sky-400" />} title="Changes to Terms" />
            <Prose>
              <p>We reserve the right to modify these Terms at any time. We will notify you of material changes by updating the "Last updated" date and, where appropriate, via email. Your continued use of the Service after changes constitutes acceptance of the updated Terms.</p>
            </Prose>
          </section>

          <section id="contact">
            <SH icon={<FileText className="w-5 h-5 text-[#ff7a00]" />} title="Contact" />
            <Prose>
              <p>If you have questions about these Terms, please contact us:</p>
              <div className="bg-sky-50 border border-sky-100 rounded-2xl p-6 not-prose space-y-2">
                <p className="text-sm text-slate-700"><strong>Email:</strong> <a href="mailto:rahulkumarsharma776194@gmail.com" className="text-sky-600 hover:underline">rahulkumarsharma776194@gmail.com</a></p>
                <p className="text-sm text-slate-700"><strong>Website:</strong> <a href="https://rahruc.online" className="text-sky-600 hover:underline">rahruc.online</a></p>
              </div>
            </Prose>
          </section>

          <div className="pt-8 border-t border-slate-200 flex flex-wrap gap-4">
            <Link to="/privacy" className="inline-flex items-center gap-2 text-sm font-semibold text-[#ff7a00] hover:underline">
              <ChevronRight className="w-4 h-4" /> Privacy Policy
            </Link>
            <Link to="/" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to RAHRUC
            </Link>
          </div>
        </main>
      </div>

      <footer className="border-t border-slate-200 mt-12">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-400">© {new Date().getFullYear()} RAHRUC. All rights reserved.</p>
          <div className="flex items-center gap-6 text-xs text-slate-400">
            <Link to="/privacy" className="hover:text-slate-700 transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="text-sky-600 font-medium">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function SH({ icon, title }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-sm shrink-0">
        {icon}
      </div>
      <h2 className="hf font-extrabold text-xl text-slate-900">{title}</h2>
    </div>
  );
}

function Prose({ children }) {
  return (
    <div className="space-y-4 text-[14.5px] text-slate-600 leading-relaxed [&_strong]:text-slate-800 [&_a]:text-sky-600 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5">
      {children}
    </div>
  );
}

function Warn({ children }) {
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
      {children}
    </div>
  );
}
