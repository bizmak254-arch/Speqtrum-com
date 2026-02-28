
import React, { useState } from 'react';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetUser: string;
}

const ReportModal: React.FC<ReportModalProps> = ({ isOpen, onClose, targetUser }) => {
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDone, setIsDone] = useState(false);

  if (!isOpen) return null;

  const reasons = [
    "Harassment or Abuse",
    "Suspected Underage",
    "Inappropriate Content",
    "Fake Profile / Scam",
    "Hate Speech"
  ];

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Simulate API call to admin dashboard
    await new Promise(r => setTimeout(r, 1500));
    setIsSubmitting(false);
    setIsDone(true);
  };

  if (isDone) {
    return (
      <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
        <div className="bg-zinc-900 border border-white/10 rounded-[2.5rem] p-10 text-center space-y-6 max-w-sm animate-in zoom-in-95">
          <div className="w-16 h-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto text-3xl">
            <i className="fa-solid fa-circle-check"></i>
          </div>
          <h2 className="text-2xl font-black">Report Received</h2>
          <p className="text-gray-400 text-sm">Our 24/7 moderation team is reviewing the content. Thank you for keeping Speqtrum safe.</p>
          <button onClick={onClose} className="w-full bg-white text-black font-black py-4 rounded-2xl">CLOSE</button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-zinc-900 border border-white/10 rounded-[2.5rem] overflow-hidden w-full max-w-md shadow-2xl animate-in slide-in-from-bottom-8">
        <header className="p-6 bg-red-600/10 border-b border-red-500/20 flex items-center justify-between">
           <h2 className="text-lg font-black text-red-500 uppercase tracking-tighter">Report @{targetUser}</h2>
           <button onClick={onClose} className="text-gray-600 hover:text-white transition-colors">
             <i className="fa-solid fa-xmark"></i>
           </button>
        </header>

        <div className="p-8 space-y-6">
          <p className="text-xs text-gray-400 leading-relaxed">
            Your safety is our priority. Reports are strictly confidential and handled within 60 minutes by our dedicated Trust & Safety team.
          </p>

          <div className="space-y-3">
             <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Select Reason</label>
             {reasons.map(r => (
               <button 
                 key={r}
                 onClick={() => setReason(r)}
                 className={`w-full text-left p-4 rounded-2xl border text-sm font-bold transition-all ${
                   reason === r ? 'bg-white text-black border-white' : 'bg-white/5 border-white/5 text-gray-300 hover:bg-white/10'
                 }`}
               >
                 {r}
               </button>
             ))}
          </div>

          <button 
            onClick={handleSubmit}
            disabled={!reason || isSubmitting}
            className="w-full bg-red-600 text-white font-black py-5 rounded-3xl shadow-xl shadow-red-500/20 disabled:opacity-50 transition-all hover:scale-[1.02] flex items-center justify-center space-x-3"
          >
            {isSubmitting ? <i className="fa-solid fa-spinner fa-spin"></i> : <span>SUBMIT REPORT</span>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportModal;
