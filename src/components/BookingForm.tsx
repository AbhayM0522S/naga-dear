import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Toast from './Toast';

interface BookingFormProps {
  initialTicketNumber?: string;
  initialSem?: string;
  onBookingComplete?: () => void;
}

const timeSlots = ['1:00 PM', '6:00 PM', '8:00 PM'];

const BookingForm: React.FC<BookingFormProps> = ({ initialTicketNumber = '', initialSem = '', onBookingComplete }) => {
  const navigate = useNavigate();
  
  // Read SEM from localStorage if not provided via props
  const storedSem = !initialSem ? (localStorage.getItem('selectedSem') || '5 Sem') : initialSem;

  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    sem: storedSem,
    time: '1:00 PM',
    date: '',
    ticketNumber: initialTicketNumber,
    city: '',
    state: '',
    pincode: '',
    addressLine1: '',
    agree: false,
  });

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.name.trim()) {
      setToastMessage('Please enter your name');
      setShowToast(true);
      return;
    }

    if (!formData.phoneNumber.trim()) {
      setToastMessage('Please enter your phone number');
      setShowToast(true);
      return;
    }

    if (!/^\d{10}$/.test(formData.phoneNumber)) {
      setToastMessage('Please enter a valid 10-digit phone number');
      setShowToast(true);
      return;
    }

    if (!formData.agree) {
      setToastMessage('Please agree to the terms and conditions');
      setShowToast(true);
      return;
    }

    // Generate random booking ID
    const randomId = `BK${Math.floor(100000 + Math.random() * 900000)}`;

    // Save booking to localStorage
    const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    const newBooking = {
      ...formData,
      id: randomId,
      createdAt: new Date().toISOString(),
      status: 'Confirmed',
    };
    bookings.push(newBooking);
    localStorage.setItem('bookings', JSON.stringify(bookings));
    
    // Clear selected SEM from localStorage
    localStorage.removeItem('selectedSem');

    // Show success toast
    setToastMessage('Ticket booked successfully!');
    setShowToast(true);

    // Reset form
    setFormData({
      name: '',
      phoneNumber: '',
      sem: '5 Sem',
      time: '1:00 PM',
      date: '',
      ticketNumber: '',
      city: '',
      state: '',
      pincode: '',
      addressLine1: '',
      agree: false,
    });

    // Notify parent
    onBookingComplete?.();

    // Navigate to booking history
    setTimeout(() => {
      navigate('/history');
    }, 1500);
  };

  return (
    <div className="w-full">
      {/* Header */}
        {/* <div className="bg-linear-to-r from-indigo-600 to-blue-600 rounded-2xl p-6 sm:p-8 text-white mb-6 shadow-xl">
          <h2 className="text-2xl sm:text-3xl font-bold mb-2">Book Your Ticket</h2>
          <p className="text-indigo-100 text-sm">Fill in your details to complete the booking</p>
        </div> */}

      {/* Form Card */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-lg">
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-200 transition bg-white text-gray-900 placeholder-gray-500"
                required
              />
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value.replace(/[^0-9]/g, '').slice(0, 10) })}
                placeholder="10-digit phone number"
                maxLength={10}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-200 transition bg-white text-gray-900 placeholder-gray-500"
                required
              />
            </div>

            {/* SEM */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Select SEM <span className="text-red-500">*</span>
              </label>
              <select
                name="sem"
                value={formData.sem}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-200 transition bg-white text-gray-900"
                required
              >
                <option value="5 Sem">5 Sem</option>
                <option value="10 Sem">10 Sem</option>
                <option value="30 Sem">30 Sem</option>
                <option value="50 Sem">50 Sem</option>
                <option value="100 Sem">100 Sem</option>
              </select>
            </div>

            {/* Time Slot */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Time Slot <span className="text-red-500">*</span>
              </label>
              <select
                name="time"
                value={formData.time}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-200 transition bg-white text-gray-900"
                required
              >
                {timeSlots.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Booking Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-200 transition bg-white text-gray-900"
                required
              />
            </div>

            {/* Ticket Number */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Ticket Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="ticketNumber"
                value={formData.ticketNumber}
                onChange={handleChange}
                placeholder="Enter ticket number"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-200 transition bg-white text-gray-900 placeholder-gray-500"
                required
              />
            </div>

            {/* City */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                City <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Enter city name"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-200 transition bg-white text-gray-900 placeholder-gray-500"
                required
              />
            </div>

            {/* State */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                State <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="Enter state name"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-200 transition bg-white text-gray-900 placeholder-gray-500"
                required
              />
            </div>

            {/* Pincode */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Pincode <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="pincode"
                value={formData.pincode}
                onChange={(e) => setFormData({ ...formData, pincode: e.target.value.replace(/[^0-9]/g, '').slice(0, 6) })}
                placeholder="6-digit pincode"
                maxLength={6}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-200 transition bg-white text-gray-900 placeholder-gray-500"
                required
              />
            </div>
          </div>

          {/* Address Line 1 - Full Width */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              Address Line 1 <span className="text-red-500">*</span>
            </label>
            <textarea
              name="addressLine1"
              value={formData.addressLine1}
              onChange={handleChange}
              placeholder="Enter your complete address"
              rows={3}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-200 transition bg-white text-gray-900 placeholder-gray-500 resize-none"
              required
            />
          </div>

          {/* Agree Checkbox */}
          <div className="flex items-start gap-3 bg-blue-50 p-4 rounded-xl border-2 border-blue-200">
            <input
              type="checkbox"
              name="agree"
              checked={formData.agree}
              onChange={handleChange}
              className="mt-1 w-5 h-5 text-indigo-600 border-2 border-gray-300 rounded focus:ring-2 focus:ring-indigo-200 cursor-pointer"
            />
            <label className="text-sm text-gray-700 cursor-pointer">
              I agree to the <span className="font-semibold text-indigo-600">terms and conditions</span> and confirm that all the information provided is correct.
            </label>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              className="w-full px-6 py-4 bg-linear-to-r from-indigo-600 to-blue-600 text-white rounded-xl font-bold text-lg hover:from-indigo-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl active:scale-95 duration-200 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Book Now
            </button>
          </div>
        </form>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <Toast
          message={toastMessage}
          type={toastMessage.includes('successfully') ? 'success' : 'error'}
          onClose={() => setShowToast(false)}
          duration={3000}
        />
      )}
    </div>
  );
};

export default BookingForm;
