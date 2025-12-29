'use client';

import { useState } from 'react';

interface CreateDatePopupProps {
  conversationId?: string;
  onClose: () => void;
  onConfirm: (name: string) => void;
}

export default function CreateDatePopup({ conversationId, onClose, onConfirm }: CreateDatePopupProps) {
  const [dateName, setDateName] = useState('');

  const handleConfirm = () => {
    if (!dateName.trim()) {
      alert('Please enter a name for the date');
      return;
    }
    onConfirm(dateName.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-[#e2c0d7] to-white bg-opacity-95 z-50 flex items-center justify-center px-4">
      <div className="bg-white border-4 border-black max-w-md w-full p-8 space-y-6">
        <h2 className="text-2xl font-bold font-mono uppercase text-center">Create Date</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-mono uppercase mb-2">Date Name *</label>
            <input
              type="text"
              value={dateName}
              onChange={(e) => setDateName(e.target.value)}
              className="w-full px-4 py-2 border-4 border-black font-mono"
              placeholder="date at the aquarium"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleConfirm();
                } else if (e.key === 'Escape') {
                  onClose();
                }
              }}
            />
          </div>


        </div>

        <div className="flex gap-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-3 bg-white text-black border-4 border-black hover:bg-gray-100 transition-colors font-mono font-bold uppercase"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="flex-1 px-4 py-3 bg-black text-white border-4 border-black hover:bg-white hover:text-black transition-colors font-mono font-bold uppercase"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}