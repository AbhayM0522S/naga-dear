import { useNavigate } from 'react-router-dom';
import BookingHistorySection from '../components/BookingHistorySection';

const HistoryPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-200 to-red-100">
      {/* Navigation Bar */}
      <div className="bg-red-400 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-2 flex items-center justify-between">
          <h1 className="text-xl sm:text-2xl font-bold text-white">Nagaland Lottery</h1>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-white text-red-600 rounded-lg font-semibold text-sm hover:bg-gray-100 transition"
          >
            ← Back to Home
          </button>
        </div>
      </div>

      {/* Full Page Booking History */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <BookingHistorySection />
      </div>
    </div>
  );
};

export default HistoryPage;
