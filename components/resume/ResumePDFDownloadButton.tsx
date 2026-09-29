import React, { useState } from 'react';
import { Download, Printer, Check } from 'lucide-react';

interface ResumePDFDownloadButtonProps {
  resumeTitle?: string;
}

export default function ResumePDFDownloadButton({ resumeTitle = 'Shivam_Shukla_Resume' }: ResumePDFDownloadButtonProps) {
  const [downloading, setDownloading] = useState(false);

  const handlePrint = () => {
    setDownloading(true);

    // Save previous document title
    const prevTitle = document.title;
    document.title = resumeTitle;

    // Trigger analytics
    fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'resume_download', path: window.location.pathname }),
    }).catch(() => {});

    setTimeout(() => {
      window.print();
      document.title = prevTitle;
      setDownloading(false);
    }, 250);
  };

  return (
    <button
      onClick={handlePrint}
      disabled={downloading}
      className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow hover:bg-blue-500 transition-colors focus:ring-2 focus:ring-blue-400 focus:outline-none"
    >
      {downloading ? (
        <>
          <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
          <span>Preparing PDF...</span>
        </>
      ) : (
        <>
          <Download className="h-4 w-4" />
          <span>Download PDF / Print</span>
        </>
      )}
    </button>
  );
}
