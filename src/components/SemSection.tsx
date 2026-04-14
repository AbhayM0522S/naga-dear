import { useState } from 'react';
import Toast from './Toast';

const SemSection = () => {
  const semValues = ['5 Sem', '10 Sem', '30 Sem', '50 Sem', '100 Sem'];
  const [selectedSem, setSelectedSem] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' } | null>(null);

  const handleSemSelect = (value: string) => {
    // Save selected SEM to localStorage (background)
    localStorage.setItem('selectedSem', value);
    setSelectedSem(value);
    
    // Show toast notification
    setToast({ message: `${value} selected! Click "Book Ticket" to proceed.`, type: 'success' });
    
    // Auto-dismiss toast
    setTimeout(() => {
      setToast(null);
    }, 2000);
  };

  return (
    <div className="w-full">
      <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-x-28">
        {semValues.map((value) => (
          <button
            key={value}
            onClick={() => handleSemSelect(value)}
            className={`px-6 py-3 text-white text-sm sm:text-base rounded-lg font-semibold transition-all shadow-md hover:shadow-lg active:scale-95 whitespace-nowrap cursor-pointer ${
              selectedSem === value
                ? 'bg-linear-to-r from-red-600 to-red-700 ring-4 ring-red-300'
                : 'bg-linear-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800'
            }`}
          >
            {value}
          </button>
        ))}
      </div>

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
          duration={2000}
        />
      )}
    </div>
  );
};

export default SemSection;