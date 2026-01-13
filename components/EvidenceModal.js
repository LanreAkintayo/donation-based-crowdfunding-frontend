import { FaTimes, FaFilePdf, FaExternalLinkAlt, FaImage } from "react-icons/fa";

export default function EvidenceModal({ isOpen, onClose, campaign }) {
  if (!isOpen || !campaign) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative w-full max-w-3xl rounded-xl bg-white shadow-2xl ring-1 ring-slate-900/5 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-slate-50">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Proof of Need</h3>
            <p className="text-sm text-slate-500">
              Reviewing evidence for <span className="text-orange-600 font-medium">{campaign.title}</span>
            </p>
          </div>
          <button onClick={onClose} className="rounded-full p-2 hover:bg-slate-200 transition-colors">
            <FaTimes className="text-slate-500" />
          </button>
        </div>

        {/* Body (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
          
          {/* Creator Info Snippet */}
          <div className="mb-6 rounded-lg border border-slate-200 bg-white p-4 flex gap-4 items-center">
             <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-xl">
                {campaign.user?.fullName?.charAt(0) || "U"}
             </div>
             <div>
                <p className="text-sm font-medium text-slate-900">Creator: {campaign.user?.fullName || "Unknown"}</p>
                <p className="text-xs text-slate-500">Email: {campaign.user?.email || "N/A"}</p>
             </div>
          </div>

          {/* Evidence Grid */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {campaign.evidence && campaign.evidence.length > 0 ? (
              campaign.evidence.map((file, index) => (
                <div key={index} className="group relative rounded-lg border border-slate-200 bg-white p-2 shadow-sm hover:shadow-md transition-all">
                  
                  {/* Visual Preview */}
                  <div className="aspect-w-16 aspect-h-9 w-full overflow-hidden rounded-md bg-slate-100 mb-3 relative flex items-center justify-center">
                    {file.type?.includes("image") ? (
                      <img 
                        src={file.url} 
                        alt={file.name} 
                        className="h-48 w-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                    ) : (
                      <FaFilePdf className="text-5xl text-red-500" />
                    )}
                  </div>

                  {/* File Details */}
                  <div className="px-2 pb-2">
                    <p className="truncate text-sm font-medium text-slate-900">{file.name}</p>
                    <p className="text-xs text-slate-500 uppercase tracking-wider">{file.type?.split('/')[1] || "FILE"}</p>
                    
                    <a 
                      href={file.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="mt-3 flex items-center justify-center gap-2 w-full rounded-md bg-slate-900 px-3 py-2 text-xs font-semibold text-white shadow-sm hover:bg-orange-600 transition-colors"
                    >
                      <FaExternalLinkAlt /> View Original
                    </a>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-2 text-center py-10 text-slate-500">
                <p>No evidence documents attached to this campaign.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}