import React from 'react';
import { Resume, ResumeTemplateId } from '@/types/resume';
import { Mail, Phone, MapPin, Globe, Github, Linkedin, ExternalLink } from 'lucide-react';

interface ResumeRendererProps {
  resume: Resume;
  /** When true, text fields become click-to-edit (document editing mode). */
  editable?: boolean;
  /** Called with a dot path ("workExperiences.0.position") and new text on blur. */
  onEdit?: (path: string, value: string) => void;
}

interface EdProps {
  path: string;
  value?: string;
  editable?: boolean;
  onEdit?: (path: string, value: string) => void;
  className?: string;
  style?: React.CSSProperties;
  tag?: keyof React.JSX.IntrinsicElements;
}

// Click-to-edit inline text. Commits on blur so typing never fights React re-renders.
function Ed({ path, value, editable, onEdit, className = '', style, tag = 'span' }: EdProps) {
  const Tag = tag as any;
  if (!editable) {
    return (
      <Tag className={className} style={style}>
        {value}
      </Tag>
    );
  }
  return (
    <Tag
      contentEditable
      suppressContentEditableWarning
      spellCheck={false}
      onBlur={(e: React.FocusEvent<HTMLElement>) => onEdit?.(path, e.currentTarget.textContent || '')}
      className={`${className} outline-none rounded px-0.5 -mx-0.5 cursor-text transition-colors hover:bg-blue-100/70 focus:bg-blue-50 focus:ring-1 focus:ring-blue-400`}
      style={style}
      title="Click to edit"
    >
      {value}
    </Tag>
  );
}

export default function ResumeRenderer({ resume, editable, onEdit }: ResumeRendererProps) {
  const { personalInfo, technicalSkills, workExperiences, projects, education, certifications, settings } = resume;
  const skillsList = resume.skills || technicalSkills || [];
  const template: ResumeTemplateId = settings?.template || 'modern';
  const accentColor = settings?.accentColor || '#2563eb';

  const fontClass =
    settings?.fontFamily === 'Roboto'
      ? 'font-sans'
      : settings?.fontFamily === 'Merriweather'
        ? 'font-serif'
        : settings?.fontFamily === 'JetBrains Mono'
          ? 'font-mono'
          : 'font-sans';

  const containerStyle: React.CSSProperties = {
    color: '#0f172a',
    backgroundColor: '#ffffff',
    width: '100%',
    maxWidth: '820px',
    minHeight: '1050px',
    padding: settings?.spacing === 'compact' ? '28px' : settings?.spacing === 'spacious' ? '48px' : '38px',
  };

  const ed = { editable, onEdit };
  const sectionTitle = (label: string) => (
    <h2
      className="text-xs font-bold uppercase tracking-wider mb-2.5 flex items-center gap-2"
      style={{ color: accentColor }}
    >
      <span>{label}</span>
      <div className="h-[1px] flex-1 bg-slate-200" />
    </h2>
  );

  // ---------------- TEMPLATE 1: MODERN DEVELOPER ----------------
  if (template === 'modern') {
    return (
      <div id="printable-resume" className={`printable-resume ${fontClass} text-slate-900 leading-relaxed`} style={containerStyle}>
        {/* Header */}
        <div className="border-b-2 pb-5 mb-5" style={{ borderColor: accentColor }}>
          <h1 className="text-3xl font-extrabold tracking-tight" style={{ color: accentColor }}>
            <Ed path="personalInfo.fullName" value={personalInfo.fullName} {...ed} />
          </h1>
          <p className="text-sm font-semibold text-slate-700 mt-1 uppercase tracking-wider">
            <Ed path="personalInfo.professionalTitle" value={personalInfo.professionalTitle} {...ed} />
          </p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-2.5 text-xs text-slate-600">
            <span className="flex items-center gap-1">
              <Mail className="h-3 w-3 text-slate-500" />
              <Ed path="personalInfo.email" value={personalInfo.email} {...ed} />
            </span>
            <span className="flex items-center gap-1">
              <Phone className="h-3 w-3 text-slate-500" />
              <Ed path="personalInfo.phone" value={personalInfo.phone} {...ed} />
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3 text-slate-500" />
              <Ed path="personalInfo.location" value={personalInfo.location} {...ed} />
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
            {sectionTitle('Executive Summary')}
            <p className="text-xs text-slate-700 leading-relaxed text-justify">
              <Ed path="personalInfo.summary" value={personalInfo.summary} {...ed} />
            </p>
          </div>
        )}

        {/* Technical Skills */}
        {skillsList && skillsList.length > 0 && (
          <div className="mb-5">
            {sectionTitle('Technical Skills')}
            <div className="space-y-1.5 text-xs">
              {skillsList.map((cat, idx) => (
                <div key={idx} className="flex flex-wrap items-baseline gap-2">
                  <span className="font-bold text-slate-900 w-32 shrink-0">
                    <Ed path={`skills.${idx}.category`} value={cat.category} {...ed} />:
                  </span>
                  <span className="text-slate-700">
                    <Ed path={`skills.${idx}.skills`} value={cat.skills.join(', ')} {...ed} />
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Work Experience */}
        {workExperiences && workExperiences.length > 0 && (
          <div className="mb-5">
            {sectionTitle('Professional Experience')}
            <div className="space-y-4">
              {workExperiences.map((exp, idx) => (
                <div key={idx} className="page-break-avoid">
                  <div className="flex items-baseline justify-between text-xs">
                    <div>
                      <span className="font-bold text-slate-900 text-sm">
                        <Ed path={`workExperiences.${idx}.position`} value={exp.position} {...ed} />
                      </span>
                      <span className="text-slate-600 font-medium">
                        {' — '}
                        <Ed path={`workExperiences.${idx}.company`} value={exp.company} {...ed} />
                      </span>
                    </div>
                    <span className="font-semibold text-slate-500 text-[11px]">
                      <Ed path={`workExperiences.${idx}.startDate`} value={exp.startDate} {...ed} />
                      {' – '}
                      {exp.current ? 'Present' : <Ed path={`workExperiences.${idx}.endDate`} value={exp.endDate} {...ed} />}
                      {exp.location && (
                        <>
                          {' | '}
                          <Ed path={`workExperiences.${idx}.location`} value={exp.location} {...ed} />
                        </>
                      )}
                    </span>
                  </div>
                  <ul className="mt-1.5 space-y-1 text-xs text-slate-700 list-disc list-outside ml-4">
                    {exp.bulletPoints.map((point, pIdx) => (
                      <li key={pIdx} className="leading-snug">
                        <Ed path={`workExperiences.${idx}.bulletPoints.${pIdx}`} value={point} {...ed} />
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
            {sectionTitle('Key Technical Projects')}
            <div className="space-y-3">
              {projects.map((proj, idx) => (
                <div key={idx} className="page-break-avoid">
                  <div className="flex items-baseline justify-between text-xs">
                    <span className="font-bold text-slate-900">
                      <Ed path={`projects.${idx}.name`} value={proj.name} {...ed} />
                    </span>
                    <span className="text-[11px] text-slate-500 italic">
                      <Ed path={`projects.${idx}.technologies`} value={proj.technologies?.join(', ')} {...ed} />
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5">
                    <Ed path={`projects.${idx}.description`} value={proj.description} {...ed} />
                  </p>
                  {proj.bulletPoints && (
                    <ul className="mt-1 space-y-0.5 text-xs text-slate-700 list-disc list-outside ml-4">
                      {proj.bulletPoints.map((pt, pIdx) => (
                        <li key={pIdx}>
                          <Ed path={`projects.${idx}.bulletPoints.${pIdx}`} value={pt} {...ed} />
                        </li>
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
              {sectionTitle('Education')}
              {education.map((edu, idx) => (
                <div key={idx} className="text-xs mb-2">
                  <div className="font-bold text-slate-900">
                    <Ed path={`education.${idx}.degree`} value={edu.degree} {...ed} />
                  </div>
                  <div className="text-slate-600 text-[11px]">
                    <Ed path={`education.${idx}.institution`} value={edu.institution} {...ed} />{' '}
                    {edu.year && `(${edu.year})`}
                  </div>
                </div>
              ))}
            </div>
          )}

          {certifications && certifications.length > 0 && (
            <div>
              {sectionTitle('Certifications')}
              {certifications.map((cert, idx) => (
                <div key={idx} className="text-xs mb-1.5">
                  <div className="font-semibold text-slate-800">
                    <Ed path={`certifications.${idx}.name`} value={cert.name} {...ed} />
                  </div>
                  <div className="text-slate-500 text-[11px]">
                    <Ed path={`certifications.${idx}.issuer`} value={cert.issuer} {...ed} />{' '}
                    {cert.year && `• ${cert.year}`}
                  </div>
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
          <h1 className="text-2xl font-bold uppercase tracking-wide">
            <Ed path="personalInfo.fullName" value={personalInfo.fullName} {...ed} />
          </h1>
          <p className="text-xs font-bold tracking-wider mt-0.5">
            <Ed path="personalInfo.professionalTitle" value={personalInfo.professionalTitle} {...ed} />
          </p>
          <div className="text-[11px] mt-1 space-x-2">
            <Ed path="personalInfo.location" value={personalInfo.location} {...ed} />
            <span>|</span>
            <Ed path="personalInfo.phone" value={personalInfo.phone} {...ed} />
            <span>|</span>
            <Ed path="personalInfo.email" value={personalInfo.email} {...ed} />
            {personalInfo.linkedin && (
              <>
                <span>|</span>
                <span>{personalInfo.linkedin}</span>
              </>
            )}
          </div>
        </div>

        <div className="mb-4">
          <h2 className="text-xs font-bold uppercase border-b border-black pb-0.5 mb-1.5">Professional Summary</h2>
          <p className="text-xs text-justify">
            <Ed path="personalInfo.summary" value={personalInfo.summary} {...ed} />
          </p>
        </div>

        <div className="mb-4">
          <h2 className="text-xs font-bold uppercase border-b border-black pb-0.5 mb-1.5">Core Competencies & Technical Skills</h2>
          <div className="space-y-1 text-xs">
            {(technicalSkills || []).map((cat, idx) => (
              <div key={idx}>
                <strong>
                  <Ed path={`technicalSkills.${idx}.category`} value={cat.category} {...ed} />:{' '}
                </strong>
                <Ed path={`technicalSkills.${idx}.skills`} value={cat.skills.join(', ')} {...ed} />
              </div>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <h2 className="text-xs font-bold uppercase border-b border-black pb-0.5 mb-2">Professional Experience</h2>
          <div className="space-y-3">
            {workExperiences.map((exp, idx) => (
              <div key={idx}>
                <div className="flex justify-between text-xs font-bold">
                  <span>
                    <Ed path={`workExperiences.${idx}.company`} value={exp.company} {...ed} />
                    {' — '}
                    <Ed path={`workExperiences.${idx}.position`} value={exp.position} {...ed} />
                  </span>
                  <span>
                    <Ed path={`workExperiences.${idx}.startDate`} value={exp.startDate} {...ed} />
                    {' – '}
                    {exp.current ? 'Present' : <Ed path={`workExperiences.${idx}.endDate`} value={exp.endDate} {...ed} />}
                  </span>
                </div>
                <div className="text-[11px] italic text-slate-700">
                  <Ed path={`workExperiences.${idx}.location`} value={exp.location} {...ed} />
                </div>
                <ul className="mt-1 space-y-1 text-xs list-disc list-outside ml-4">
                  {exp.bulletPoints.map((bp, pIdx) => (
                    <li key={pIdx}>
                      <Ed path={`workExperiences.${idx}.bulletPoints.${pIdx}`} value={bp} {...ed} />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <h2 className="text-xs font-bold uppercase border-b border-black pb-0.5 mb-1.5">Education</h2>
          {education.map((edu, idx) => (
            <div key={idx} className="flex justify-between text-xs mb-1">
              <div>
                <strong>
                  <Ed path={`education.${idx}.degree`} value={edu.degree} {...ed} />
                </strong>
                {', '}
                <Ed path={`education.${idx}.institution`} value={edu.institution} {...ed} />
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
            <h1 className="text-2xl font-light text-slate-900 tracking-tight">
              <Ed path="personalInfo.fullName" value={personalInfo.fullName} {...ed} />
            </h1>
            <p className="text-xs text-slate-500 font-mono tracking-wider">
              <Ed path="personalInfo.professionalTitle" value={personalInfo.professionalTitle} {...ed} />
            </p>
          </div>
          <div className="text-right text-[11px] text-slate-500 space-y-0.5 font-mono">
            <div>
              <Ed path="personalInfo.email" value={personalInfo.email} {...ed} />
            </div>
            <div>
              <Ed path="personalInfo.phone" value={personalInfo.phone} {...ed} />
            </div>
            <div>
              <Ed path="personalInfo.location" value={personalInfo.location} {...ed} />
            </div>
          </div>
        </div>

        {personalInfo.summary && (
          <div className="mb-6">
            <p className="text-xs text-slate-600 leading-relaxed">
              <Ed path="personalInfo.summary" value={personalInfo.summary} {...ed} />
            </p>
          </div>
        )}

        <div className="mb-6">
          <h3 className="text-xs font-mono uppercase tracking-widest text-slate-400 mb-3">Experience</h3>
          <div className="space-y-4">
            {workExperiences.map((exp, idx) => (
              <div key={idx}>
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-900">
                    <Ed path={`workExperiences.${idx}.position`} value={exp.position} {...ed} />
                    {' · '}
                    <Ed path={`workExperiences.${idx}.company`} value={exp.company} {...ed} />
                  </span>
                  <span className="text-slate-400 font-mono text-[11px]">
                    <Ed path={`workExperiences.${idx}.startDate`} value={exp.startDate} {...ed} />
                    {' - '}
                    {exp.current ? 'Present' : <Ed path={`workExperiences.${idx}.endDate`} value={exp.endDate} {...ed} />}
                  </span>
                </div>
                <ul className="mt-1 space-y-1 text-xs text-slate-600 list-disc list-outside ml-4">
                  {exp.bulletPoints.map((pt, pIdx) => (
                    <li key={pIdx}>
                      <Ed path={`workExperiences.${idx}.bulletPoints.${pIdx}`} value={pt} {...ed} />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-xs font-mono uppercase tracking-widest text-slate-400 mb-2">Technical Core</h3>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {(technicalSkills || []).map((c, idx) => (
              <div key={idx}>
                <span className="font-semibold text-slate-700">
                  <Ed path={`technicalSkills.${idx}.category`} value={c.category} {...ed} />:{' '}
                </span>
                <span className="text-slate-500">
                  <Ed path={`technicalSkills.${idx}.skills`} value={c.skills.join(', ')} {...ed} />
                </span>
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
              <h1 className="text-xl font-extrabold text-white leading-tight">
                <Ed path="personalInfo.fullName" value={personalInfo.fullName} {...ed} />
              </h1>
              <p className="text-xs text-blue-400 font-medium mt-1">
                <Ed path="personalInfo.professionalTitle" value={personalInfo.professionalTitle} {...ed} />
              </p>
            </div>

            <div className="space-y-2 text-xs text-slate-300">
              <h3 className="font-bold text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-1">Contact</h3>
              <div className="text-[11px] break-all">
                <Ed path="personalInfo.email" value={personalInfo.email} {...ed} />
              </div>
              <div className="text-[11px]">
                <Ed path="personalInfo.phone" value={personalInfo.phone} {...ed} />
              </div>
              <div className="text-[11px]">
                <Ed path="personalInfo.location" value={personalInfo.location} {...ed} />
              </div>
            </div>

            <div className="space-y-2 text-xs text-slate-300">
              <h3 className="font-bold text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-1">Skills</h3>
              {(technicalSkills || []).map((c, idx) => (
                <div key={idx} className="text-[11px]">
                  <div className="font-semibold text-white">
                    <Ed path={`technicalSkills.${idx}.category`} value={c.category} {...ed} />
                  </div>
                  <div className="text-slate-400">
                    <Ed path={`technicalSkills.${idx}.skills`} value={c.skills.join(', ')} {...ed} />
                  </div>
                </div>
              ))}
            </div>

            {education && education.length > 0 && (
              <div className="space-y-2 text-xs text-slate-300">
                <h3 className="font-bold text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-1">Education</h3>
                {education.map((e, idx) => (
                  <div key={idx} className="text-[11px]">
                    <div className="font-semibold text-white">
                      <Ed path={`education.${idx}.degree`} value={e.degree} {...ed} />
                    </div>
                    <div className="text-slate-400">
                      <Ed path={`education.${idx}.institution`} value={e.institution} {...ed} />
                    </div>
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
              <p className="text-xs text-slate-600 leading-relaxed">
                <Ed path="personalInfo.summary" value={personalInfo.summary} {...ed} />
              </p>
            </div>

            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-1 mb-3">
                Experience
              </h2>
              <div className="space-y-4">
                {workExperiences.map((exp, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between text-xs">
                      <span className="font-bold text-slate-900">
                        <Ed path={`workExperiences.${idx}.position`} value={exp.position} {...ed} />
                      </span>
                      <span className="text-slate-500 text-[11px]">
                        <Ed path={`workExperiences.${idx}.startDate`} value={exp.startDate} {...ed} />
                        {' - '}
                        {exp.current ? 'Present' : <Ed path={`workExperiences.${idx}.endDate`} value={exp.endDate} {...ed} />}
                      </span>
                    </div>
                    <div className="text-[11px] font-medium text-slate-600 mb-1">
                      <Ed path={`workExperiences.${idx}.company`} value={exp.company} {...ed} />
                      {' · '}
                      <Ed path={`workExperiences.${idx}.location`} value={exp.location} {...ed} />
                    </div>
                    <ul className="space-y-1 text-xs text-slate-700 list-disc list-outside ml-4">
                      {exp.bulletPoints.map((pt, pIdx) => (
                        <li key={pIdx}>
                          <Ed path={`workExperiences.${idx}.bulletPoints.${pIdx}`} value={pt} {...ed} />
                        </li>
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
                      <span className="font-bold text-slate-900">
                        <Ed path={`projects.${idx}.name`} value={p.name} {...ed} />
                        {': '}
                      </span>
                      <span className="text-slate-600">
                        <Ed path={`projects.${idx}.description`} value={p.description} {...ed} />
                      </span>
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
  if (template === 'executive') {
    return (
      <div id="printable-resume" className={`printable-resume ${fontClass} text-slate-900`} style={containerStyle}>
        <div className="text-center border-b-2 border-slate-900 pb-4 mb-6">
          <h1 className="text-3xl font-serif font-bold text-slate-900 tracking-wide uppercase">
            <Ed path="personalInfo.fullName" value={personalInfo.fullName} {...ed} />
          </h1>
          <p className="text-xs font-sans tracking-widest text-slate-600 uppercase mt-1">
            <Ed path="personalInfo.professionalTitle" value={personalInfo.professionalTitle} {...ed} />
          </p>
          <div className="flex justify-center items-center gap-3 text-xs text-slate-600 mt-2">
            <Ed path="personalInfo.location" value={personalInfo.location} {...ed} />
            <span>•</span>
            <Ed path="personalInfo.email" value={personalInfo.email} {...ed} />
            <span>•</span>
            <Ed path="personalInfo.phone" value={personalInfo.phone} {...ed} />
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-xs font-serif font-bold uppercase tracking-widest text-slate-900 border-b border-slate-300 pb-1 mb-2">
            Executive Summary
          </h2>
          <p className="text-xs font-serif text-slate-700 leading-relaxed text-justify">
            <Ed path="personalInfo.summary" value={personalInfo.summary} {...ed} />
          </p>
        </div>

        <div className="mb-6">
          <h2 className="text-xs font-serif font-bold uppercase tracking-widest text-slate-900 border-b border-slate-300 pb-1 mb-3">
            Leadership & Experience
          </h2>
          <div className="space-y-4">
            {workExperiences.map((exp, idx) => (
              <div key={idx}>
                <div className="flex justify-between items-baseline">
                  <h3 className="text-sm font-serif font-bold text-slate-900">
                    <Ed path={`workExperiences.${idx}.position`} value={exp.position} {...ed} />
                  </h3>
                  <span className="text-[11px] font-sans italic text-slate-500">
                    <Ed path={`workExperiences.${idx}.startDate`} value={exp.startDate} {...ed} />
                    {' – '}
                    {exp.current ? 'Present' : <Ed path={`workExperiences.${idx}.endDate`} value={exp.endDate} {...ed} />}
                  </span>
                </div>
                <div className="text-xs font-sans font-semibold text-slate-700 mb-1">
                  <Ed path={`workExperiences.${idx}.company`} value={exp.company} {...ed} />
                  {exp.location && `, `}
                  {exp.location && <Ed path={`workExperiences.${idx}.location`} value={exp.location} {...ed} />}
                </div>
                <ul className="space-y-1 text-xs font-serif text-slate-700 list-disc list-outside ml-5">
                  {exp.bulletPoints.map((pt, pIdx) => (
                    <li key={pIdx}>
                      <Ed path={`workExperiences.${idx}.bulletPoints.${pIdx}`} value={pt} {...ed} />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {(technicalSkills || []).length > 0 && (
          <div>
            <h2 className="text-xs font-serif font-bold uppercase tracking-widest text-slate-900 border-b border-slate-300 pb-1 mb-2">
              Areas of Expertise
            </h2>
            <div className="text-xs font-serif text-slate-700 space-y-1">
              {(technicalSkills || []).map((c, idx) => (
                <div key={idx}>
                  <strong>
                    <Ed path={`technicalSkills.${idx}.category`} value={c.category} {...ed} />:
                  </strong>{' '}
                  <Ed path={`technicalSkills.${idx}.skills`} value={c.skills.join(', ')} {...ed} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // ---------------- TEMPLATE 6: CREATIVE (accent banner + chips) ----------------
  if (template === 'creative') {
    return (
      <div id="printable-resume" className={`printable-resume ${fontClass} text-slate-900 leading-relaxed`} style={{ ...containerStyle, padding: '0px' }}>
        <div className="p-8 pb-6" style={{ backgroundColor: accentColor }}>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            <Ed path="personalInfo.fullName" value={personalInfo.fullName} {...ed} />
          </h1>
          <p className="text-sm font-semibold text-white/85 mt-1 uppercase tracking-wider">
            <Ed path="personalInfo.professionalTitle" value={personalInfo.professionalTitle} {...ed} />
          </p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3 text-xs text-white/80">
            <Ed path="personalInfo.email" value={personalInfo.email} {...ed} />
            <Ed path="personalInfo.phone" value={personalInfo.phone} {...ed} />
            <Ed path="personalInfo.location" value={personalInfo.location} {...ed} />
          </div>
        </div>

        <div className="p-8 pt-6">
          {personalInfo.summary && (
            <p className="text-xs text-slate-700 leading-relaxed text-justify mb-6 border-l-4 pl-4" style={{ borderColor: accentColor }}>
              <Ed path="personalInfo.summary" value={personalInfo.summary} {...ed} />
            </p>
          )}

          {skillsList.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: accentColor }}>
                Toolbox
              </h2>
              <div className="space-y-2">
                {skillsList.map((cat, idx) => (
                  <div key={idx}>
                    <div className="text-[11px] font-bold text-slate-800 mb-1">
                      <Ed path={`skills.${idx}.category`} value={cat.category} {...ed} />
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {cat.skills.map((s, sIdx) => (
                        <span
                          key={sIdx}
                          className="rounded-full px-2.5 py-0.5 text-[10px] font-medium"
                          style={{ backgroundColor: `${accentColor}18`, color: accentColor }}
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {workExperiences.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: accentColor }}>
                Experience
              </h2>
              <div className="space-y-4 border-l-2 pl-4" style={{ borderColor: `${accentColor}40` }}>
                {workExperiences.map((exp, idx) => (
                  <div key={idx} className="page-break-avoid">
                    <div className="flex items-baseline justify-between text-xs">
                      <span className="font-bold text-slate-900">
                        <Ed path={`workExperiences.${idx}.position`} value={exp.position} {...ed} />
                        <span className="font-medium text-slate-600"> @ <Ed path={`workExperiences.${idx}.company`} value={exp.company} {...ed} /></span>
                      </span>
                      <span className="text-[11px] font-mono text-slate-500">
                        <Ed path={`workExperiences.${idx}.startDate`} value={exp.startDate} {...ed} />
                        {' – '}
                        {exp.current ? 'Present' : <Ed path={`workExperiences.${idx}.endDate`} value={exp.endDate} {...ed} />}
                      </span>
                    </div>
                    <ul className="mt-1 space-y-1 text-xs text-slate-700 list-disc list-outside ml-4">
                      {exp.bulletPoints.map((pt, pIdx) => (
                        <li key={pIdx}>
                          <Ed path={`workExperiences.${idx}.bulletPoints.${pIdx}`} value={pt} {...ed} />
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {projects && projects.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: accentColor }}>
                Selected Work
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {projects.map((p, idx) => (
                  <div key={idx} className="rounded-lg border border-slate-200 p-3">
                    <div className="text-xs font-bold text-slate-900">
                      <Ed path={`projects.${idx}.name`} value={p.name} {...ed} />
                    </div>
                    <p className="text-[11px] text-slate-600 mt-0.5">
                      <Ed path={`projects.${idx}.description`} value={p.description} {...ed} />
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {education && education.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: accentColor }}>
                Education
              </h2>
              {education.map((e, idx) => (
                <div key={idx} className="text-xs mb-1.5">
                  <span className="font-bold text-slate-900">
                    <Ed path={`education.${idx}.degree`} value={e.degree} {...ed} />
                  </span>
                  <span className="text-slate-600"> — <Ed path={`education.${idx}.institution`} value={e.institution} {...ed} /></span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ---------------- TEMPLATE 7: COMPACT (dense one-pager) ----------------
  if (template === 'compact') {
    return (
      <div id="printable-resume" className={`printable-resume ${fontClass} text-slate-900 leading-tight`} style={{ ...containerStyle, padding: '24px 30px' }}>
        <div className="flex items-baseline justify-between border-b border-slate-800 pb-2 mb-3">
          <div>
            <h1 className="text-xl font-extrabold tracking-tight" style={{ color: accentColor }}>
              <Ed path="personalInfo.fullName" value={personalInfo.fullName} {...ed} />
            </h1>
            <span className="text-[11px] font-semibold text-slate-600">
              <Ed path="personalInfo.professionalTitle" value={personalInfo.professionalTitle} {...ed} />
            </span>
          </div>
          <div className="text-right text-[10px] text-slate-600 space-x-2">
            <Ed path="personalInfo.email" value={personalInfo.email} {...ed} />
            <span>·</span>
            <Ed path="personalInfo.phone" value={personalInfo.phone} {...ed} />
            <span>·</span>
            <Ed path="personalInfo.location" value={personalInfo.location} {...ed} />
          </div>
        </div>

        {personalInfo.summary && (
          <p className="text-[11px] text-slate-700 leading-snug text-justify mb-3">
            <Ed path="personalInfo.summary" value={personalInfo.summary} {...ed} />
          </p>
        )}

        {skillsList.length > 0 && (
          <div className="mb-3">
            <h2 className="text-[11px] font-bold uppercase tracking-wider mb-1" style={{ color: accentColor }}>
              Skills
            </h2>
            <div className="text-[10.5px] text-slate-700 space-y-0.5">
              {skillsList.map((cat, idx) => (
                <div key={idx}>
                  <strong>
                    <Ed path={`skills.${idx}.category`} value={cat.category} {...ed} />:
                  </strong>{' '}
                  <Ed path={`skills.${idx}.skills`} value={cat.skills.join(', ')} {...ed} />
                </div>
              ))}
            </div>
          </div>
        )}

        {workExperiences.length > 0 && (
          <div className="mb-3">
            <h2 className="text-[11px] font-bold uppercase tracking-wider mb-1.5" style={{ color: accentColor }}>
              Experience
            </h2>
            <div className="space-y-2.5">
              {workExperiences.map((exp, idx) => (
                <div key={idx}>
                  <div className="flex justify-between text-[11px]">
                    <span className="font-bold text-slate-900">
                      <Ed path={`workExperiences.${idx}.position`} value={exp.position} {...ed} />
                      <span className="font-normal text-slate-600">, <Ed path={`workExperiences.${idx}.company`} value={exp.company} {...ed} /></span>
                    </span>
                    <span className="text-slate-500 text-[10px]">
                      <Ed path={`workExperiences.${idx}.startDate`} value={exp.startDate} {...ed} />
                      {' – '}
                      {exp.current ? 'Present' : <Ed path={`workExperiences.${idx}.endDate`} value={exp.endDate} {...ed} />}
                    </span>
                  </div>
                  <ul className="mt-0.5 space-y-0.5 text-[10.5px] text-slate-700 list-disc list-outside ml-4">
                    {exp.bulletPoints.map((pt, pIdx) => (
                      <li key={pIdx}>
                        <Ed path={`workExperiences.${idx}.bulletPoints.${pIdx}`} value={pt} {...ed} />
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          {projects && projects.length > 0 && (
            <div>
              <h2 className="text-[11px] font-bold uppercase tracking-wider mb-1" style={{ color: accentColor }}>
                Projects
              </h2>
              <div className="space-y-1 text-[10.5px]">
                {projects.map((p, idx) => (
                  <div key={idx}>
                    <strong>
                      <Ed path={`projects.${idx}.name`} value={p.name} {...ed} />
                    </strong>{' '}
                    <span className="text-slate-600">
                      — <Ed path={`projects.${idx}.description`} value={p.description} {...ed} />
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {education && education.length > 0 && (
            <div>
              <h2 className="text-[11px] font-bold uppercase tracking-wider mb-1" style={{ color: accentColor }}>
                Education
              </h2>
              <div className="space-y-1 text-[10.5px]">
                {education.map((e, idx) => (
                  <div key={idx}>
                    <strong>
                      <Ed path={`education.${idx}.degree`} value={e.degree} {...ed} />
                    </strong>
                    <span className="text-slate-600">, <Ed path={`education.${idx}.institution`} value={e.institution} {...ed} /></span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ---------------- TEMPLATE 8: CLASSIC (traditional centered serif) ----------------
  if (template === 'classic') {
    return (
      <div id="printable-resume" className={`printable-resume font-serif text-slate-900 leading-normal`} style={containerStyle}>
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold tracking-wide">
            <Ed path="personalInfo.fullName" value={personalInfo.fullName} {...ed} />
          </h1>
          <p className="text-sm text-slate-600 italic mt-0.5">
            <Ed path="personalInfo.professionalTitle" value={personalInfo.professionalTitle} {...ed} />
          </p>
          <p className="text-[11px] text-slate-500 mt-1.5">
            <Ed path="personalInfo.email" value={personalInfo.email} {...ed} />
            {' | '}
            <Ed path="personalInfo.phone" value={personalInfo.phone} {...ed} />
            {' | '}
            <Ed path="personalInfo.location" value={personalInfo.location} {...ed} />
          </p>
          <div className="mx-auto mt-4 h-px w-24" style={{ backgroundColor: accentColor }} />
        </div>

        {personalInfo.summary && (
          <div className="mb-5">
            <h2 className="text-center text-xs font-bold uppercase tracking-[0.2em] mb-2">Summary</h2>
            <p className="text-xs text-slate-700 leading-relaxed text-justify">
              <Ed path="personalInfo.summary" value={personalInfo.summary} {...ed} />
            </p>
          </div>
        )}

        {workExperiences.length > 0 && (
          <div className="mb-5">
            <h2 className="text-center text-xs font-bold uppercase tracking-[0.2em] mb-3">Professional Experience</h2>
            <div className="space-y-4">
              {workExperiences.map((exp, idx) => (
                <div key={idx}>
                  <div className="text-center">
                    <span className="text-sm font-bold">
                      <Ed path={`workExperiences.${idx}.position`} value={exp.position} {...ed} />
                    </span>
                    <div className="text-xs text-slate-600 italic">
                      <Ed path={`workExperiences.${idx}.company`} value={exp.company} {...ed} />
                      {exp.location && `, ${exp.location}`} {' — '}
                      <Ed path={`workExperiences.${idx}.startDate`} value={exp.startDate} {...ed} />
                      {' to '}
                      {exp.current ? 'Present' : <Ed path={`workExperiences.${idx}.endDate`} value={exp.endDate} {...ed} />}
                    </div>
                  </div>
                  <ul className="mt-1.5 space-y-1 text-xs text-slate-700 list-disc list-outside ml-6">
                    {exp.bulletPoints.map((pt, pIdx) => (
                      <li key={pIdx}>
                        <Ed path={`workExperiences.${idx}.bulletPoints.${pIdx}`} value={pt} {...ed} />
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {skillsList.length > 0 && (
          <div className="mb-5">
            <h2 className="text-center text-xs font-bold uppercase tracking-[0.2em] mb-2">Technical Proficiencies</h2>
            <div className="text-xs text-slate-700 space-y-1 text-center">
              {skillsList.map((cat, idx) => (
                <div key={idx}>
                  <strong>
                    <Ed path={`skills.${idx}.category`} value={cat.category} {...ed} />
                  </strong>
                  {' — '}
                  <Ed path={`skills.${idx}.skills`} value={cat.skills.join(', ')} {...ed} />
                </div>
              ))}
            </div>
          </div>
        )}

        {education && education.length > 0 && (
          <div>
            <h2 className="text-center text-xs font-bold uppercase tracking-[0.2em] mb-2">Education</h2>
            <div className="text-xs text-center space-y-1">
              {education.map((e, idx) => (
                <div key={idx}>
                  <span className="font-bold">
                    <Ed path={`education.${idx}.degree`} value={e.degree} {...ed} />
                  </span>
                  <span className="text-slate-600">, <Ed path={`education.${idx}.institution`} value={e.institution} {...ed} /></span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Fallback
  return null;
}
