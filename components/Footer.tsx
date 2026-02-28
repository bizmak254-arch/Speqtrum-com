import React from 'react';
import Logo from './Logo';

const Footer: React.FC = () => {
  return (
    <footer className="text-center py-12 bg-[#1e1e1e] mt-10 border-t border-white/5 text-gray-500 text-sm flex flex-col items-center">
      <div className="mb-8 opacity-50 hover:opacity-100 transition-opacity">
        <Logo className="w-12 h-12" textClassName="text-2xl" />
      </div>
      <div className="flex justify-center space-x-6 mb-4">
        <a href="#" className="hover:text-[#ff4da6] transition-colors">Privacy</a>
        <a href="#" className="hover:text-[#ff4da6] transition-colors">Safety</a>
        <a href="#" className="hover:text-[#ff4da6] transition-colors">Terms</a>
        <a href="#" className="hover:text-[#ff4da6] transition-colors">Guidelines</a>
      </div>
      <p>© 2025 SPEQTRUM. A private adult social platform.</p>
    </footer>
  );
};

export default Footer;
