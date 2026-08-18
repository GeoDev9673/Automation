import React, { useState } from 'react';

interface AdminLoginProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const MASTER_ACCESS_KEY = '88BQWTUT9GCG16UVWQ09';

export const AdminLogin: React.FC<AdminLoginProps> = ({ onSuccess, onCancel }) => {
  const [accessKey, setAccessKey] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (accessKey.trim() === MASTER_ACCESS_KEY) {
      localStorage.setItem('paralife_admin_auth', 'true');
      onSuccess();
    } else {
      setError(true);
      setAccessKey('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0d0e11]/95 backdrop-blur-md px-4 animate-fade-in">
      <div className="w-full max-w-sm bg-[#141519] border border-[#F2EEE8]/12 p-8 rounded-xl shadow-2xl flex flex-col items-center text-center space-y-6">
        
        {/* Signal Key Icon */}
        <div className="w-12 h-12 rounded-full bg-[#1e2027] border border-[#FF2D85]/40 flex items-center justify-center text-[#FF2D85]">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>

        <div>
          <h3 className="text-lg font-medium tracking-wider uppercase text-white">
            PARALIFE ACCESS
          </h3>
          <p className="text-[12px] text-[#F2EEE8]/50 mt-1">
            Enter Master Access Key
          </p>
        </div>

        <form onSubmit={handleSubmit} className="w-full space-y-4">
          <input
            type="password"
            autoFocus
            value={accessKey}
            onChange={(e) => {
              setAccessKey(e.target.value);
              if (error) setError(false);
            }}
            placeholder="ACCESS KEY"
            className="w-full bg-[#0e0f12] border border-[#F2EEE8]/15 focus:border-[#FF2D85] text-center text-white py-3 px-4 rounded text-[14px] tracking-[0.15em] focus:outline-none transition-colors"
          />

          {error && (
            <p className="text-[12px] text-[#FF4565] animate-fade-in">
              Access Denied. Invalid key.
            </p>
          )}

          <div className="flex space-x-3 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="w-1/2 py-2.5 text-[12px] uppercase tracking-wider text-[#F2EEE8]/60 hover:text-white bg-[#1a1b22] rounded transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-1/2 py-2.5 text-[12px] uppercase tracking-wider text-white font-semibold bg-[#FF2D85] hover:bg-[#ff1275] rounded transition-colors"
            >
              Unlock →
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
