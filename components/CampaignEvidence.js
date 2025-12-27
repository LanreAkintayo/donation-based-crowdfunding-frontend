import { useRef } from "react";
import { FaFilePdf, FaImage, FaTrash, FaFileAlt, FaCloudUploadAlt } from "react-icons/fa";

export default function CampaignEvidence({ evidenceFiles, setEvidenceFiles }) {
  const fileInputRef = useRef(null);

  // 1. Handle File Selection
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);

    // Basic Validation (Optional: Limit to 5 files max)
    if (evidenceFiles.length + selectedFiles.length > 5) {
      alert("Oga, you can only upload a maximum of 5 documents.");
      return;
    }

    // Filter for size (e.g., max 5MB)
    const validFiles = selectedFiles.filter(file => {
        const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB
        if (!isValidSize) alert(`${file.name} is too heavy! Max 5MB allowed.`);
        return isValidSize;
    });

    setEvidenceFiles((prev) => [...prev, ...validFiles]);
  };

  // 2. Remove a specific file from the list
  const removeFile = (indexToRemove) => {
    setEvidenceFiles((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  // 3. Helper to get the right icon
  const getFileIcon = (file) => {
    const type = file.type;
    if (type.includes("pdf")) return <FaFilePdf className="text-red-500 text-xl" />;
    if (type.includes("image")) return <FaImage className="text-blue-500 text-xl" />;
    return <FaFileAlt className="text-zinc-400 text-xl" />;
  };

  return (
    <div className="grid grid-cols-1 gap-x-8 gap-y-10 rounded-lg bg-white p-8 shadow-sm ring-1 ring-slate-900/5 md:grid-cols-3">
      
      {/* --- LEFT SIDE: Instructions --- */}
      <div className="md:col-span-1">
        <h2 className="text-lg font-semibold leading-7 text-slate-900">
          Proof of Need (Evidence)
        </h2>
        <p className="mt-1 text-sm leading-6 text-slate-500">
          Upload documents that back up your story. This builds trust with donors.
        </p>

        {/* Native "Naija" Context Box */}
        <div className="mt-4 rounded-md bg-orange-50 p-4 text-xs text-orange-800 border border-orange-100">
          <strong className="block mb-2 font-bold">Valid Examples:</strong>
          <ul className="list-disc list-inside space-y-1 opacity-90">
            <li>Medical Reports / Doctor&apos;s Note</li>
            <li>School Admission Letter</li>
            <li>Police Report (for accidents)</li>
            <li>Government ID / NIN Slip</li>
            <li>Pictures of the incident</li>
          </ul>
        </div>
      </div>

      {/* --- RIGHT SIDE: Upload Area --- */}
      <div className="md:col-span-2">
        <div 
            className="mt-2 flex justify-center rounded-lg border border-dashed border-slate-900/25 px-6 py-10 transition-colors hover:bg-slate-50 cursor-pointer"
            onClick={() => fileInputRef.current.click()}
        >
          <div className="text-center">
            <FaCloudUploadAlt className="mx-auto h-12 w-12 text-slate-300" />
            
            <div className="mt-4 flex text-sm leading-6 text-slate-600 justify-center">
              <label
                htmlFor="file-upload"
                className="relative cursor-pointer rounded-md font-semibold text-orange-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-orange-600 focus-within:ring-offset-2 hover:text-orange-500"
              >
                <span>Upload documents</span>
                <input
                  id="file-upload"
                  name="file-upload"
                  type="file"
                  multiple // Allows multiple files
                  accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
                  className="sr-only"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                />
              </label>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs leading-5 text-slate-500">
              PDF, DOC, Images up to 5MB each
            </p>
          </div>
        </div>

        {/* --- FILE PREVIEW LIST --- */}
        {evidenceFiles.length > 0 && (
          <div className="mt-6">
            <h4 className="text-sm font-medium text-slate-900 mb-3">
              Attached Documents ({evidenceFiles.length})
            </h4>
            <ul className="grid grid-cols-1 gap-3">
              {evidenceFiles.map((file, index) => (
                <li
                  key={index}
                  className="relative flex items-center justify-between py-3 pl-3 pr-4 text-sm bg-slate-50 border border-slate-200 rounded-md group hover:border-orange-200 transition-all"
                >
                  <div className="flex w-0 flex-1 items-center gap-3">
                    {/* Icon */}
                    <div className="h-10 w-10 flex-shrink-0 bg-white rounded-lg border border-slate-200 flex items-center justify-center">
                        {getFileIcon(file)}
                    </div>
                    {/* File Info */}
                    <div className="min-w-0 flex-1">
                        <p className="truncate font-medium text-slate-900">{file.name}</p>
                        <p className="text-xs text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  </div>
                  
                  {/* Delete Button */}
                  <div className="ml-4 flex-shrink-0">
                    <button
                      type="button"
                      onClick={(e) => {
                          e.stopPropagation(); // Stop bubbling
                          removeFile(index);
                      }}
                      className="font-medium text-slate-400 hover:text-red-600 transition-colors p-2"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}