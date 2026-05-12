'use client';

import React from 'react';
import { X } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
  isLoading?: boolean;
}

export default function ConfirmationModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText = 'Confirm', 
  cancelText = 'Cancel',
  isDestructive = true,
  isLoading = false
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={!isLoading ? onClose : undefined}
    >
      <div 
        className="relative w-full max-w-md bg-surface bg-glass-panel backdrop-blur-md rounded-3xl border border-white/50 shadow-glass overflow-hidden animate-in fade-in zoom-in duration-200 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          disabled={isLoading}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 transition-colors disabled:opacity-50"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-bold text-slate-800 mb-2">{title}</h2>
        <p className="text-slate-600 mb-8">{message}</p>

        <div className="flex gap-4">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 py-2.5 bg-white/50 text-slate-700 font-bold rounded-full hover:bg-white/80 transition-all border border-slate-200 disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`flex-1 py-2.5 text-white font-bold rounded-full transition-all shadow-md border border-white/20 disabled:opacity-50 flex items-center justify-center ${
              isDestructive ? 'bg-red-500 hover:bg-red-600' : 'bg-accent hover:bg-accent-hover'
            }`}
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
