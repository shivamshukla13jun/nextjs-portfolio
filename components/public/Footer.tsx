import React from 'react';
import { Mail, Phone, MapPin, Github, Linkedin, Twitter, ArrowUpRight } from 'lucide-react';

interface FooterProps {
  navigate: (p: string) => void;
}

export default function Footer({ navigate }: FooterProps) {
  return (
    <footer className="border-t border-slate-800/80 bg-[#080c14] py-12 text-slate-400 no-print text-xs">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 font-mono font-bold text-white text-xs">
                SS
              </span>
              <span className="font-bold text-white text-sm">Shivam Shukla</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Senior MERN Stack Developer specializing in Node.js, TypeScript, React, MongoDB, Redis caching, and RabbitMQ event queues in Mumbai, India.
            </p>
          </div>

          <div>
            <div className="font-mono text-slate-200 uppercase text-[11px] mb-3 font-semibold tracking-wider">
              Navigation
            </div>
            <ul className="space-y-2 text-[11px]">
              <li><button onClick={() => navigate('/')} className="hover:text-white">Overview</button></li>
              <li><button onClick={() => navigate('/about')} className="hover:text-white">About & Education</button></li>
              <li><button onClick={() => navigate('/projects')} className="hover:text-white">Architecture Projects</button></li>
              <li><button onClick={() => navigate('/experience')} className="hover:text-white">Work Experience</button></li>
              <li><button onClick={() => navigate('/resume')} className="hover:text-white text-blue-400 font-semibold">Resume & ATS Builder</button></li>
            </ul>
          </div>

          <div>
            <div className="font-mono text-slate-200 uppercase text-[11px] mb-3 font-semibold tracking-wider">
              Flagship Work
            </div>
            <ul className="space-y-2 text-[11px]">
              <li><span className="text-slate-300">FreightBooks</span> — Logistics & Accounting SaaS</li>
              <li><span className="text-slate-300">Safalam</span> — Fleet Dispatch Platform</li>
              <li><span className="text-slate-300">C3Express</span> — High-Throughput Logistics Engine</li>
              <li><span className="text-slate-300">ITD</span> — Transport & Delivery Module</li>
            </ul>
          </div>

          <div>
            <div className="font-mono text-slate-200 uppercase text-[11px] mb-3 font-semibold tracking-wider">
              Contact & Social
            </div>
            <ul className="space-y-2 text-[11px]">
              <li className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 text-blue-400" />
                <span>Mumbai, Maharashtra, India</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-blue-400" />
                <a href="mailto:shivam13jun@gmail.com" className="hover:text-white">shivam13jun@gmail.com</a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-blue-400" />
                <span>8459784241</span>
              </li>
              <li className="pt-2 flex items-center gap-3">
                <a
                  href="https://www.linkedin.com/in/shivam-shukla-344973235?utm_source=share_via&utm_content=profile&utm_medium=member_android"
                  target="_blank"
                  rel="noreferrer"
                  className="rounded bg-slate-800 p-2 text-slate-300 hover:text-white"
                  title="LinkedIn Profile"
                >
                  <Linkedin className="h-4 w-4" />
                </a>
                <a
                  href="https://github.com/shivamshukla13"
                  target="_blank"
                  rel="noreferrer"
                  className="rounded bg-slate-800 p-2 text-slate-300 hover:text-white"
                  title="GitHub Profile"
                >
                  <Github className="h-4 w-4" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800/80 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-500">
          <div>© {new Date().getFullYear()} Shivam Shukla. All rights reserved.</div>
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/admin')} className="font-mono text-slate-500 hover:text-slate-300">
              Admin CMS Login
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
