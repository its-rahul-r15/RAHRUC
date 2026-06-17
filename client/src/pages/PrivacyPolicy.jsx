import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Cloud, ArrowLeft, Shield, Lock, Eye, Trash2, Globe, Mail, ChevronRight } from 'lucide-react';

const sections = [
  { id: 'overview',     title: 'Overview' },
  { id: 'collection',  title: 'Information We Collect' },
  { id: 'usage',       title: 'How We Use Your Data' },
  { id: 'storage',     title: 'Data Storage & Security' },
  { id: 'third-party', title: 'Third-Party Services' },
  { id: 'rights',      title: 'Your Rights' },
  { id: 'cookies',     title: 'Cookies' },
  { id: 'children',    title: "Children's Privacy" },
  { id: 'changes',     title: 'Changes to This Policy' },
  { id: 'contact',     title: 'Contact Us' },
];

export default function PrivacyPolicy() {
  const [active, setActive] = useState('overview');

  useEffect(() => {
    document.title = 'Privacy Policy — RAHRUC';
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

      {/* Top nav */}
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
        style={{ backgroundImage: 'radial-gradient(circle, #e2e8f0 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-4">
            <Link to="/" className="hover:text-[#ff7a00] transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-slate-700">Privacy Policy</span>
          </div>
          <div className="flex items-start gap-5">
            <div className="w-14 h-14 rounded-2xl bg-orange-50 border-2 border-orange-100 flex items-center justify-center shrink-0 mt-1">
              <Shield className="w-7 h-7 text-[#ff7a00]" strokeWidth={1.5} />
            </div>
            <div>
              <h1 className="hf font-extrabold text-4xl text-slate-900 mb-3">Privacy Policy</h1>
              <p className="text-slate-500 text-sm">Last updated: <strong className="text-slate-700">June 18, 2025</strong> &nbsp;·&nbsp; Effective immediately</p>
              <p className="text-slate-500 text-sm mt-1 max-w-xl">RAHRUC is a zero-knowledge platform. We are designed from the ground up to collect as little personal data as possible.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-7xl mx-auto px-6 py-12 flex gap-12">

        {/* Sidebar TOC */}
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
                      ? 'bg-orange-50 text-[#ff7a00] font-semibold'
                      : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                  }`}
                >
                  {active === s.id && <span className="w-1.5 h-1.5 rounded-full bg-[#ff7a00] shrink-0"></span>}
                  {s.title}
                </a>
              ))}
            </nav>
          </div>
        </aside>

        {/* Content */}
        <main className="flex-1 max-w-3xl space-y-14">

          <section id="overview">
            <SectionHead icon={<Shield className="w-5 h-5 text-[#ff7a00]" />} title="Overview" />
            <Prose>
              <p>RAHRUC ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our service at <strong>rahruc.online</strong> and related platforms.</p>
              <p>RAHRUC operates on a <strong>zero-knowledge</strong> architecture. Your files are encrypted in your browser using AES-GCM-256 <em>before</em> they leave your device. We never have access to the plaintext contents of your files.</p>
              <Callout color="orange">
                <strong>Key principle:</strong> We cannot read your files. They are end-to-end encrypted. Not even our team can access your data.
              </Callout>
            </Prose>
          </section>

          <section id="collection">
            <SectionHead icon={<Eye className="w-5 h-5 text-violet-500" />} title="Information We Collect" />
            <Prose>
              <p>We collect the minimum information necessary to provide our service:</p>
              <InfoTable rows={[
                { label: 'Account email', purpose: 'Authentication and account recovery', retained: 'Until deletion' },
                { label: 'Hashed password', purpose: 'Login verification (bcrypt)', retained: 'Until deletion' },
                { label: 'File metadata', purpose: 'Name, size, type, upload timestamp', retained: 'Until you delete file' },
                { label: 'IP address', purpose: 'Rate limiting and abuse prevention', retained: '30 days max' },
                { label: 'Usage logs', purpose: 'Debugging and service improvement', retained: '14 days' },
              ]} />
              <p><strong>We do not collect:</strong> payment information, browsing history, advertising identifiers, or the contents of your encrypted files.</p>
            </Prose>
          </section>

          <section id="usage">
            <SectionHead icon={<Globe className="w-5 h-5 text-sky-500" />} title="How We Use Your Data" />
            <Prose>
              <p>We use the data we collect solely to operate and improve the RAHRUC platform:</p>
              <ul>
                <li>Authenticate your account and maintain your session</li>
                <li>Display your file library (names, sizes, types — never file contents)</li>
                <li>Enforce storage quotas and rate limits</li>
                <li>Respond to support requests</li>
                <li>Send transactional emails (password resets, security alerts) — no marketing</li>
                <li>Detect and prevent unauthorized access and abuse</li>
              </ul>
              <p>We do <strong>not</strong> sell, rent, or share your personal data with third parties for advertising or marketing purposes.</p>
            </Prose>
          </section>

          <section id="storage">
            <SectionHead icon={<Lock className="w-5 h-5 text-emerald-500" />} title="Data Storage & Security" />
            <Prose>
              <p>Your file data is stored exclusively within <strong>Telegram's encrypted cloud infrastructure</strong> — not on our own servers. Here is what this means for you:</p>
              <ul>
                <li>Files are AES-GCM-256 encrypted in your browser before being uploaded</li>
                <li>Encryption keys are derived from your credentials and <em>never transmitted</em> to our servers</li>
                <li>Our backend stores only metadata (file name, size, Telegram message IDs)</li>
                <li>Telegram's infrastructure is distributed across multiple datacenters globally</li>
                <li>Account data is stored in MongoDB with encrypted connections (TLS 1.3)</li>
              </ul>
              <Callout color="green">
                Even if our database were compromised, attackers would only obtain encrypted metadata — not your actual files.
              </Callout>
            </Prose>
          </section>

          <section id="third-party">
            <SectionHead icon={<Globe className="w-5 h-5 text-blue-500" />} title="Third-Party Services" />
            <Prose>
              <p>RAHRUC integrates with the following third-party services:</p>
              <InfoTable rows={[
                { label: 'Telegram', purpose: 'File storage via Bot API', retained: 'Subject to Telegram ToS' },
                { label: 'MongoDB Atlas', purpose: 'Account and metadata storage', retained: 'Encrypted at rest' },
                { label: 'Vercel / Railway', purpose: 'Application hosting', retained: 'Transient request logs' },
              ]} />
              <p>Each third-party service is governed by its own privacy policy. We recommend reviewing Telegram's privacy policy at <a href="https://telegram.org/privacy" target="_blank" rel="noreferrer" className="text-[#ff7a00] underline">telegram.org/privacy</a>.</p>
            </Prose>
          </section>

          <section id="rights">
            <SectionHead icon={<Shield className="w-5 h-5 text-pink-500" />} title="Your Rights" />
            <Prose>
              <p>You have the following rights with respect to your personal data:</p>
              <ul>
                <li><strong>Access:</strong> Request a copy of the personal data we hold about you</li>
                <li><strong>Correction:</strong> Update inaccurate account information at any time in Settings</li>
                <li><strong>Deletion:</strong> Delete your account and all associated metadata from our systems</li>
                <li><strong>Portability:</strong> Export your file metadata in JSON format</li>
                <li><strong>Objection:</strong> Object to certain processing activities</li>
              </ul>
              <p>To exercise any right, email us at <a href="mailto:rahulkumarsharma776194@gmail.com" className="text-[#ff7a00] underline">rahulkumarsharma776194@gmail.com</a>. We respond within 30 days.</p>
            </Prose>
          </section>

          <section id="cookies">
            <SectionHead icon={<Eye className="w-5 h-5 text-amber-500" />} title="Cookies" />
            <Prose>
              <p>We use a minimal set of cookies strictly necessary for the service to function:</p>
              <InfoTable rows={[
                { label: 'auth_token', purpose: 'Maintains your login session (httpOnly, Secure)', retained: '7 days' },
                { label: 'csrf_token', purpose: 'Cross-site request forgery protection', retained: 'Session' },
              ]} />
              <p>We do <strong>not</strong> use analytics cookies, advertising cookies, or third-party tracking pixels.</p>
            </Prose>
          </section>

          <section id="children">
            <SectionHead icon={<Shield className="w-5 h-5 text-red-400" />} title="Children's Privacy" />
            <Prose>
              <p>RAHRUC is not directed at children under the age of 13. We do not knowingly collect personal information from children under 13. If you believe a child has provided us with personal information, please contact us immediately at <a href="mailto:rahulkumarsharma776194@gmail.com" className="text-[#ff7a00] underline">rahulkumarsharma776194@gmail.com</a> and we will promptly delete it.</p>
            </Prose>
          </section>

          <section id="changes">
            <SectionHead icon={<Globe className="w-5 h-5 text-slate-400" />} title="Changes to This Policy" />
            <Prose>
              <p>We may update this Privacy Policy from time to time. When we make material changes, we will notify you by updating the "Last updated" date at the top of this page and, where appropriate, sending you an email notification.</p>
              <p>Your continued use of RAHRUC after any changes constitutes your acceptance of the updated policy. We encourage you to review this page periodically.</p>
            </Prose>
          </section>

          <section id="contact">
            <SectionHead icon={<Mail className="w-5 h-5 text-[#ff7a00]" />} title="Contact Us" />
            <Prose>
              <p>If you have any questions, concerns, or requests regarding this Privacy Policy, please reach out to us:</p>
              <div className="bg-orange-50 border border-orange-100 rounded-2xl p-6 space-y-2 not-prose">
                <p className="text-sm text-slate-700"><strong>Email:</strong> <a href="mailto:rahulkumarsharma776194@gmail.com" className="text-[#ff7a00] hover:underline">rahulkumarsharma776194@gmail.com</a></p>
                <p className="text-sm text-slate-700"><strong>Website:</strong> <a href="https://rahruc.online" className="text-[#ff7a00] hover:underline">rahruc.online</a></p>
                <p className="text-sm text-slate-500 mt-2">We aim to respond to all privacy inquiries within 5 business days.</p>
              </div>
            </Prose>
          </section>

          {/* Related links */}
          <div className="pt-8 border-t border-slate-200 flex flex-wrap gap-4">
            <Link to="/terms" className="inline-flex items-center gap-2 text-sm font-semibold text-[#ff7a00] hover:underline">
              <ChevronRight className="w-4 h-4" /> Terms of Service
            </Link>
            <Link to="/" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to RAHRUC
            </Link>
          </div>
        </main>
      </div>

      {/* Mini footer */}
      <footer className="border-t border-slate-200 mt-12">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-400">© {new Date().getFullYear()} RAHRUC. All rights reserved.</p>
          <div className="flex items-center gap-6 text-xs text-slate-400">
            <Link to="/privacy" className="text-[#ff7a00] font-medium">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-slate-700 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function SectionHead({ icon, title }) {
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
    <div className="space-y-4 text-[14.5px] text-slate-600 leading-relaxed [&_strong]:text-slate-800 [&_a]:text-[#ff7a00] [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5">
      {children}
    </div>
  );
}

function Callout({ children, color }) {
  const colors = {
    orange: 'bg-orange-50 border-orange-200 text-orange-800',
    green:  'bg-emerald-50 border-emerald-200 text-emerald-800',
  };
  return (
    <div className={`border rounded-xl p-4 text-sm ${colors[color]}`}>
      {children}
    </div>
  );
}

function InfoTable({ rows }) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 my-4">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr>
            <th className="text-left px-4 py-2.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Data</th>
            <th className="text-left px-4 py-2.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Purpose</th>
            <th className="text-left px-4 py-2.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Retention</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.map((r, i) => (
            <tr key={i} className="hover:bg-slate-50/50 transition-colors">
              <td className="px-4 py-3 font-medium text-slate-700 whitespace-nowrap">{r.label}</td>
              <td className="px-4 py-3 text-slate-500">{r.purpose}</td>
              <td className="px-4 py-3 text-slate-500 font-mono text-xs whitespace-nowrap">{r.retained}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
