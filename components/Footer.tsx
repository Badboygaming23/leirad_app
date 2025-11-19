import React from 'react';
import { Heart, Code2, Github, Twitter } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full mt-16 border-t border-gray-200 pt-10 pb-6 animate-slide-in opacity-0" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
      <div className="max-w-2xl mx-auto text-center space-y-6">
        
        {/* Brand & Developer */}
        <div className="flex flex-col items-center gap-3">
           <div className="flex items-center gap-2 text-indigo-600 font-bold text-lg tracking-tight">
              <div className="p-1.5 bg-indigo-100 rounded-lg">
                  <Code2 className="w-5 h-5" />
              </div>
              <span>TaskMaster</span>
           </div>
           
           <p className="text-slate-500 text-sm font-medium flex items-center gap-1.5">
              Crafted with 
              <Heart className="w-4 h-4 text-rose-500 fill-rose-500 animate-pulse" /> 
              by <span className="text-slate-800 font-bold">Leirad Noznag</span>
           </p>
        </div>

        {/* Decorative Separator */}
        <div className="w-12 h-1 bg-gray-100 rounded-full mx-auto"></div>

        {/* Links & Copyright */}
        <div className="space-y-4">
            <div className="flex items-center justify-center gap-6 text-sm font-medium text-slate-500">
                <a href="#" className="hover:text-indigo-600 transition-colors">About</a>
                <a href="#" className="hover:text-indigo-600 transition-colors">Features</a>
                <a href="#" className="hover:text-indigo-600 transition-colors">Privacy</a>
                <a href="#" className="hover:text-indigo-600 transition-colors">Contact</a>
            </div>
            
            <p className="text-xs text-slate-400">
              © {currentYear} TaskMaster Inc. All rights reserved.
            </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;