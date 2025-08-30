// src/components/ui/dialog.tsx
import React from 'react';
import { X } from 'lucide-react';

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

interface DialogComponentProps {
  children: React.ReactNode;
  className?: string;
}

interface DialogCloseProps {
  onClick: () => void;
}

export const Dialog: React.FC<DialogProps> = ({ open, onOpenChange, children }) => {
  if (!open) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={() => onOpenChange(false)} />
      <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {children}
      </div>
    </div>
  );
};

export const DialogContent: React.FC<DialogComponentProps> = ({ children, className = '' }) => {
  return <div className={`p-6 ${className}`}>{children}</div>;
};

export const DialogHeader: React.FC<DialogComponentProps> = ({ children, className = '' }) => {
  return <div className={`flex items-center justify-between mb-4 ${className}`}>{children}</div>;
};

export const DialogTitle: React.FC<DialogComponentProps> = ({ children, className = '' }) => {
  return <h2 className={`text-lg font-semibold ${className}`}>{children}</h2>;
};

export const DialogClose: React.FC<DialogCloseProps> = ({ onClick }) => {
  return (
    <button 
      onClick={onClick} 
      className="text-gray-400 hover:text-gray-600 transition-colors"
      type="button"
      aria-label="Close dialog"
    >
      <X size={20} />
    </button>
  );
};
