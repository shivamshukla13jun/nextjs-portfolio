import React from 'react';
import { Resume, ResumeTemplateId } from '@/types/resume';
import { Mail, Phone, MapPin, Globe, Github, Linkedin, Calendar, ExternalLink } from 'lucide-react';

interface ResumeRendererProps {
  resume: Resume;
}

export default function ResumeRenderer({ resume }: ResumeRendererProps) {
  const { personalInfo, technicalSkills, workExperiences, projects, education, certifications, customSections, settings } = resume;
  const skillsList = resume.skills || technicalSkills || [];
  const template: ResumeTemplateId = settings?.template || 'modern';
  const accentColor = settings?.accentColor || '#2563eb';

  // Apply typography classes
  const fontClass =
    settings?.fontFamily === 'Roboto'
      ? 'font-sans'
      : settings?.fontFamily === 'Merriweather'
      ? 'font-serif'
      : settings?.fontFamily === 'JetBrains Mono'
      ? 'font-mono'
      : 'font-sans';

  // Common styles
  const containerStyle = {
    color: '#0f172a',
    backgroundColor: '#ffffff',
    width: '100%',
    maxWidth: '820px',
    minHeight: '1050px',
    padding: settings?.spacing === 'compact' ? '28px' : settings?.spacing === 'spacious' ? '48px' : '38px',
  };

  // ---------------- TEMPLATE 1: MODERN DEVELOPER ----------------
  if (template === 'modern') {
    return (
      <div id="printable-resume" className={`printable-resume ${fontClass} text-slate-900 leading-relaxed`} style={containerStyle}>
        {/* Header */}
        <div className="border-b-2 pb-5 mb-5" style={{ borderColor: accentColor }}>
          <h1 className="text-3xl font-extrabold tracking-tight" style={{ color: accentColor }}>
            {personalInfo.fullName}
          </h1>
          <p className="text-sm font-semibold text-slate-700 mt-1 uppercase tracking-wider">{personalInfo.professionalTitle}</p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-2.5 text-xs text-slate-600">
            <span className="flex items-center gap-1">
              <Mail className="h-3 w-3 text-slate-500" /> {personalInfo.email}
            </span>
            {personalInfo.phone && (
              <span className="flex items-center gap-1">
                <Phone className="h-3 w-3 text-slate-500" /> {personalInfo.phone}
              </span>
            )}
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3 text-slate-500" /> {personalInfo.location}
            </span>
            {personalInfo.github && (
              <span className="flex items-center gap-1">
                <Github className="h-3 w-3 text-slate-500" /> {personalInfo.github.replace('https://', '')}
              </span>
            )}
            {personalInfo.linkedin && (
              <span className="flex items-center gap-1">
                <Linkedin className="h-3 w-3 text-slate-500" /> {personalInfo.linkedin.replace('https://', '')}
              </span>
            )}
          </div>
        </div>

        {/* Summary */}
        {personalInfo.summary && (
          <div className="mb-5">
            <h2 className="text-xs font-bold uppercase tracking-wider mb-1.5 flex items-center gap-2" style={{ color: accentColor }}>
              <span>Executive Summary</span>
              <div className="h-[1px] flex-1 bg-slate-200" />
            </h2>
            <p className="text-xs text-slate-700 leading-relaxed text-justify">{personalInfo.summary}</p>
          </div>
        )}

        {/* Technical Skills */}
        {skillsList && skillsList.length > 0 && (
          <div className="mb-5">
            <h2 className="text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-2" style={{ color: accentColor }}>
              <span>Technical Skills</span>
              <div className="h-[1px] flex-1 bg-slate-200" />
            </h2>
            <div className="space-y-1.5 text-xs">
              {skillsList.map((cat, idx) => (
                <div key={idx} className="flex flex-wrap items-baseline gap-2">
                  <span className="font-bold text-slate-900 w-32 shrink-0">{cat.category}:</span>
                  <span className="text-slate-700">{cat.skills.join(' • ')}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Work Experience */}
        {workExperiences && workExperiences.length > 0 && (
          <div className="mb-5">
            <h2 className="text-xs font-bold uppercase tracking-wider mb-2.5 flex items-center gap-2" style={{ color: accentColor }}>
              <span>Professional Experience</span>
              <div className="h-[1px] flex-1 bg-slate-200" />
            </h2>
            <div className="space-y-4">
              {workExperiences.map((exp, idx) => (
                <div key={idx} className="page-break-avoid">
                  <div className="flex items-baseline justify-between text-xs">
                    <div>
                      <span className="font-bold text-slate-900 text-sm">{exp.position}</span>
                      <span className="text-slate-600 font-medium"> — {exp.company}</span>
                    </div>
                    <span className="font-semibold text-slate-500 text-[11px]">
                      {exp.startDate} – {exp.current ? 'Present' : exp.endDate} {exp.location && `| ${exp.location}`}
                    </span>
                  </div>
                  <ul className="mt-1.5 space-y-1 text-xs text-slate-700 list-disc list-outside ml-4">
                    {exp.bulletPoints.map((point, pIdx) => (
                      <li key={pIdx} className="leading-snug">
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Featured Projects */}
        {projects && projects.length > 0 && (
          <div className="mb-5">
            <h2 className="text-xs font-bold uppercase tracking-wider mb-2.5 flex items-center gap-2" style={{ color: accentColor }}>
              <span>Key Technical Projects</span>
              <div className="h-[1px] flex-1 bg-slate-200" />
            </h2>
            <div className="space-y-3">
              {projects.map((proj, idx) => (
                <div key={idx} className="page-break-avoid">
                  <div className="flex items-baseline justify-between text-xs">
                    <span className="font-bold text-slate-900">{proj.name}</span>
                    <span className="text-[11px] text-slate-500 italic">{proj.technologies?.join(', ')}</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5">{proj.description}</p>
                  {proj.bulletPoints && (
                    <ul className="mt-1 space-y-0.5 text-xs text-slate-700 list-disc list-outside ml-4">
                      {proj.bulletPoints.map((pt, pIdx) => (
                        <li key={pIdx}>{pt}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education & Certifications */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {education && education.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider mb-1.5 flex items-center gap-2" style={{ color: accentColor }}>
                <span>Education</span>
                <div className="h-[1px] flex-1 bg-slate-200" />
              </h2>
              {education.map((edu, idx) => (
                <div key={idx} className="text-xs mb-2">
                  <div className="font-bold text-slate-900">{edu.degree}</div>
                  <div className="text-slate-600 text-[11px]">{edu.institution} {edu.year && `(${edu.year})`}</div>
                </div>
              ))}
            </div>
          )}

          {certifications && certifications.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider mb-1.5 flex items-center gap-2" style={{ color: accentColor }}>
                <span>Certifications</span>
                <div className="h-[1px] flex-1 bg-slate-200" />
              </h2>
              {certifications.map((cert, idx) => (
                <div key={idx} className="text-xs mb-1.5">
                  <div className="font-semibold text-slate-800">{cert.name}</div>
                  <div className="text-slate-500 text-[11px]">{cert.issuer} {cert.year && `• ${cert.year}`}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ---------------- TEMPLATE 2: ATS FRIENDLY (Pure semantic hierarchy) ----------------
  if (template === 'ats') {
    return (
      <div id="printable-resume" className={`printable-resume font-sans text-black leading-snug`} style={{ ...containerStyle, padding: '32px' }}>
        <div className="text-center pb-3 border-b border-black mb-4">
          <h1 className="text-2xl font-bold uppercase tracking-wide">{personalInfo.fullName}</h1>
          <p className="text-xs font-bold tracking-wider mt-0.5">{personalInfo.professionalTitle}</p>
          <div className="text-[11px] mt-1 space-x-2">
            <span>{personalInfo.location}</span>
            <span>|</span>
            <span>{personalInfo.phone}</span>
            <span>|</span>
            <span>{personalInfo.email}</span>
            {personalInfo.linkedin && (
              <>
                <span>|</span>
                <span>{personalInfo.linkedin}</span>
              </>
            )}
          </div>
        </div>

        {/* Summary */}
        <div className="mb-4">
          <h2 className="text-xs font-bold uppercase border-b border-black pb-0.5 mb-1.5">Professional Summary</h2>
          <p className="text-xs text-justify">{personalInfo.summary}</p>
        </div>

        {/* Technical Skills */}
        <div className="mb-4">
          <h2 className="text-xs font-bold uppercase border-b border-black pb-0.5 mb-1.5">Core Competencies & Technical Skills</h2>
          <div className="space-y-1 text-xs">
            {(technicalSkills || []).map((cat, idx) => (
              <div key={idx}>
                <strong>{cat.category}: </strong>
                <span>{cat.skills.join(', ')}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Work Experience */}
        <div className="mb-4">
          <h2 className="text-xs font-bold uppercase border-b border-black pb-0.5 mb-2">Professional Experience</h2>
          <div className="space-y-3">
            {workExperiences.map((exp, idx) => (
              <div key={idx}>
                <div className="flex justify-between text-xs font-bold">
                  <span>{exp.company} — {exp.position}</span>
                  <span>{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</span>
                </div>
                <div className="text-[11px] italic text-slate-700">{exp.location}</div>
                <ul className="mt-1 space-y-1 text-xs list-disc list-outside ml-4">
                  {exp.bulletPoints.map((bp, pIdx) => (
                    <li key={pIdx}>{bp}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Education */}
        <div className="mb-4">
          <h2 className="text-xs font-bold uppercase border-b border-black pb-0.5 mb-1.5">Education</h2>
          {education.map((edu, idx) => (
            <div key={idx} className="flex justify-between text-xs mb-1">
              <div>
                <strong>{edu.degree}</strong>, {edu.institution}
              </div>
              <span>{edu.year}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ---------------- TEMPLATE 3: MINIMAL PROFESSIONAL ----------------
  if (template === 'minimal') {
    return (
      <div id="printable-resume" className={`printable-resume ${fontClass} text-slate-800 leading-normal`} style={containerStyle}>
        <div className="flex justify-between items-start border-b border-slate-200 pb-4 mb-6">
          <div>
            <h1 className="text-2xl font-light text-slate-900 tracking-tight">{personalInfo.fullName}</h1>
            <p className="text-xs text-slate-500 font-mono tracking-wider">{personalInfo.professionalTitle}</p>
          </div>
          <div className="text-right text-[11px] text-slate-500 space-y-0.5 font-mono">
            <div>{personalInfo.email}</div>
            <div>{personalInfo.phone}</div>
            <div>{personalInfo.location}</div>
          </div>
        </div>

        {personalInfo.summary && (
          <div className="mb-6">
            <p className="text-xs text-slate-600 leading-relaxed">{personalInfo.summary}</p>
          </div>
        )}

        {/* Experience */}
        <div className="mb-6">
          <h3 className="text-xs font-mono uppercase tracking-widest text-slate-400 mb-3">Experience</h3>
          <div className="space-y-4">
            {workExperiences.map((exp, idx) => (
              <div key={idx}>
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-900">{exp.position} · {exp.company}</span>
                  <span className="text-slate-400 font-mono text-[11px]">{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</span>
                </div>
                <ul className="mt-1 space-y-1 text-xs text-slate-600 list-disc list-outside ml-4">
                  {exp.bulletPoints.map((pt, pIdx) => (
                    <li key={pIdx}>{pt}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Skills */}
        <div className="mb-6">
          <h3 className="text-xs font-mono uppercase tracking-widest text-slate-400 mb-2">Technical Core</h3>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {(technicalSkills || []).map((c, idx) => (
              <div key={idx}>
                <span className="font-semibold text-slate-700">{c.category}: </span>
                <span className="text-slate-500">{c.skills.join(', ')}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ---------------- TEMPLATE 4: TWO COLUMN ----------------
  if (template === 'two-column') {
    return (
      <div id="printable-resume" className={`printable-resume ${fontClass} text-slate-900`} style={{ ...containerStyle, padding: '0px' }}>
        <div className="grid grid-cols-12 min-h-full">
          {/* Left Column (35%) */}
          <div className="col-span-4 bg-slate-900 text-slate-200 p-6 space-y-6">
            <div>
              <h1 className="text-xl font-extrabold text-white leading-tight">{personalInfo.fullName}</h1>
              <p className="text-xs text-blue-400 font-medium mt-1">{personalInfo.professionalTitle}</p>
            </div>

            <div className="space-y-2 text-xs text-slate-300">
              <h3 className="font-bold text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-1">Contact</h3>
              <div className="text-[11px] break-all">{personalInfo.email}</div>
              <div className="text-[11px]">{personalInfo.phone}</div>
              <div className="text-[11px]">{personalInfo.location}</div>
            </div>

            <div className="space-y-2 text-xs text-slate-300">
              <h3 className="font-bold text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-1">Skills</h3>
              {(technicalSkills || []).map((c, idx) => (
                <div key={idx} className="text-[11px]">
                  <div className="font-semibold text-white">{c.category}</div>
                  <div className="text-slate-400">{c.skills.join(', ')}</div>
                </div>
              ))}
            </div>

            {education && education.length > 0 && (
              <div className="space-y-2 text-xs text-slate-300">
                <h3 className="font-bold text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-1">Education</h3>
                {education.map((e, idx) => (
                  <div key={idx} className="text-[11px]">
                    <div className="font-semibold text-white">{e.degree}</div>
                    <div className="text-slate-400">{e.institution}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column (65%) */}
          <div className="col-span-8 p-6 space-y-5 bg-white">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-1 mb-2">
                Executive Profile
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed">{personalInfo.summary}</p>
            </div>

            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-1 mb-3">
                Experience
              </h2>
              <div className="space-y-4">
                {workExperiences.map((exp, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between text-xs">
                      <span className="font-bold text-slate-900">{exp.position}</span>
                      <span className="text-slate-500 text-[11px]">{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</span>
                    </div>
                    <div className="text-[11px] font-medium text-slate-600 mb-1">{exp.company} · {exp.location}</div>
                    <ul className="space-y-1 text-xs text-slate-700 list-disc list-outside ml-4">
                      {exp.bulletPoints.map((pt, pIdx) => (
                        <li key={pIdx}>{pt}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {projects && projects.length > 0 && (
              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-1 mb-2">
                  Featured Projects
                </h2>
                <div className="space-y-2 text-xs">
                  {projects.map((p, idx) => (
                    <div key={idx}>
                      <span className="font-bold text-slate-900">{p.name}: </span>
                      <span className="text-slate-600">{p.description}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ---------------- TEMPLATE 5: EXECUTIVE ----------------
  return (
    <div id="printable-resume" className={`printable-resume ${fontClass} text-slate-900`} style={containerStyle}>
      <div className="text-center border-b-2 border-slate-900 pb-4 mb-6">
        <h1 className="text-3xl font-serif font-bold text-slate-900 tracking-wide uppercase">{personalInfo.fullName}</h1>
        <p className="text-xs font-sans tracking-widest text-slate-600 uppercase mt-1">{personalInfo.professionalTitle}</p>
        <div className="flex justify-center items-center gap-3 text-xs text-slate-600 mt-2">
          <span>{personalInfo.location}</span>
          <span>•</span>
          <span>{personalInfo.email}</span>
          <span>•</span>
          <span>{personalInfo.phone}</span>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-xs font-serif font-bold uppercase tracking-widest text-slate-900 border-b border-slate-300 pb-1 mb-2">
          Executive Summary
        </h2>
        <p className="text-xs text-slate-700 leading-relaxed text-justify">{personalInfo.summary}</p>
      </div>

      <div className="mb-6">
        <h2 className="text-xs font-serif font-bold uppercase tracking-widest text-slate-900 border-b border-slate-300 pb-1 mb-3">
          Executive Career History
        </h2>
        <div className="space-y-4">
          {workExperiences.map((exp, idx) => (
            <div key={idx}>
              <div className="flex justify-between text-xs">
                <span className="font-bold text-slate-900 font-serif text-sm">{exp.company}</span>
                <span className="font-medium text-slate-600 text-[11px]">{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</span>
              </div>
              <div className="text-xs italic text-slate-700 mb-1">{exp.position} — {exp.location}</div>
              <ul className="space-y-1 text-xs text-slate-800 list-disc list-outside ml-4">
                {exp.bulletPoints.map((pt, pIdx) => (
                  <li key={pIdx}>{pt}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-xs font-serif font-bold uppercase tracking-widest text-slate-900 border-b border-slate-300 pb-1 mb-2">
          Technical Acumen & Core Competencies
        </h2>
        <div className="grid grid-cols-2 gap-2 text-xs">
          {(technicalSkills || []).map((c, idx) => (
            <div key={idx}>
              <span className="font-bold text-slate-900">{c.category}: </span>
              <span className="text-slate-700">{c.skills.join(', ')}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
