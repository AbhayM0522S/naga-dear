import { useState, useEffect } from 'react';
import ConfirmModal from './ConfirmModal';
import Toast from './Toast';
import jsPDF from 'jspdf';

interface Booking {
  id: string;
  name: string;
  phoneNumber: string;
  sem: string;
  time: string;
  date: string;
  ticketNumber: string;
  city: string;
  state: string;
  pincode: string;
  addressLine1: string;
  status: string;
  createdAt: string;
  bookingType?: 'regular' | 'token';
}

const BookingHistorySection = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [bookingToDelete, setBookingToDelete] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    const storedBookings = localStorage.getItem('bookings');
    if (storedBookings) {
      try {
        const parsed = JSON.parse(storedBookings);
        setBookings(parsed);
      } catch (error) {
        console.error('Error parsing bookings:', error);
      }
    }
  }, []);

  const handleDelete = (id: string) => {
    setBookingToDelete(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (bookingToDelete) {
      const updatedBookings = bookings.filter((booking) => booking.id !== bookingToDelete);
      setBookings(updatedBookings);
      localStorage.setItem('bookings', JSON.stringify(updatedBookings));
      if (expandedId === bookingToDelete) {
        setExpandedId(null);
      }
      setToast({ message: 'Booking deleted successfully!', type: 'success' });
    }
    setDeleteModalOpen(false);
    setBookingToDelete(null);
  };

  const cancelDelete = () => {
    setDeleteModalOpen(false);
    setBookingToDelete(null);
  };

  const handleDownloadToken = (booking: Booking) => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    let y = 20;

    // ---- HEADER ----
    doc.setFillColor(220, 53, 69); // Red header for token
    doc.rect(0, 0, pageWidth, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('NAGALAND LOTTERY', pageWidth / 2, 18, { align: 'center' });
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('TOKEN', pageWidth / 2, 28, { align: 'center' });
    
    doc.setFontSize(9);
    doc.text(`Token ID: ${booking.id}`, pageWidth / 2, 35, { align: 'center' });
    
    doc.setTextColor(0, 0, 0);
    y = 50;

    // ---- STATUS BADGE ----
    doc.setFillColor(220, 53, 69); // Red
    doc.roundedRect(margin, y, 30, 8, 2, 2, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('ACTIVE', margin + 15, y + 5.5, { align: 'center' });
    doc.setTextColor(0, 0, 0);
    y += 15;

    // ---- TOKEN DETAILS ----
    doc.setFillColor(220, 53, 69);
    doc.rect(margin, y, pageWidth - 2 * margin, 10, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('TOKEN INFORMATION', margin + 5, y + 7);
    doc.setTextColor(0, 0, 0);
    y += 15;

    // Token box
    doc.setDrawColor(220, 53, 69);
    doc.setLineWidth(1);
    doc.roundedRect(margin, y, pageWidth - 2 * margin, 50, 3, 3);

    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(220, 53, 69);
    doc.text(booking.ticketNumber, pageWidth / 2, y + 25, { align: 'center' });
    
    doc.setTextColor(0, 0, 0);
    y += 60;

    // ---- HOLDER DETAILS ----
    doc.setFillColor(220, 53, 69);
    doc.rect(margin, y, pageWidth - 2 * margin, 10, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('HOLDER DETAILS', margin + 5, y + 7);
    doc.setTextColor(0, 0, 0);
    y += 15;

    doc.setDrawColor(180, 180, 180);
    doc.setLineWidth(0.5);
    doc.rect(margin, y, pageWidth - 2 * margin, 35);
    y += 8;

    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(100, 100, 100);
    doc.text('Name:', margin + 5, y);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    doc.text(booking.name, margin + 30, y);
    y += 10;

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(100, 100, 100);
    doc.text('Date:', margin + 5, y);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    doc.text(formatDate(booking.date), margin + 30, y);
    y += 15;

    // ---- ISSUED TIMESTAMP ----
    doc.setFillColor(220, 53, 69);
    doc.rect(margin, y, pageWidth - 2 * margin, 10, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('ISSUED', margin + 5, y + 7);
    doc.setTextColor(0, 0, 0);
    y += 15;

    doc.setDrawColor(180, 180, 180);
    doc.rect(margin, y, pageWidth - 2 * margin, 15);
    y += 8;
    doc.setFontSize(9);
    doc.text(`Issued On: ${formatDate(booking.createdAt)} at ${formatTime(booking.createdAt)}`, margin + 5, y);
    y += 15;

    // ---- FOOTER ----
    const footerY = doc.internal.pageSize.getHeight() - 20;
    doc.setDrawColor(220, 53, 69);
    doc.setLineWidth(0.5);
    doc.line(margin, footerY, pageWidth - margin, footerY);
    
    doc.setFontSize(9);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(100, 100, 100);
    doc.text('This token is valid for Nagaland Lottery services.', pageWidth / 2, footerY + 7, { align: 'center' });
    doc.text('Toll Free: 18003458598', pageWidth / 2, footerY + 12, { align: 'center' });

    // Save PDF
    doc.save(`token-${booking.ticketNumber}.pdf`);
    setToast({ message: 'Token downloaded successfully!', type: 'success' });
  };

  const handleDownloadReceipt = (booking: Booking) => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    let y = 20;

    // Helper to draw a bordered box
    const drawBox = (x: number, yPos: number, width: number, height: number) => {
      doc.setDrawColor(180, 180, 180);
      doc.setLineWidth(0.5);
      doc.rect(x, yPos, width, height);
    };

    // Helper to draw a section header
    const drawSectionHeader = (title: string, yPos: number) => {
      doc.setFillColor(220, 53, 69); // Red background
      doc.rect(margin, yPos, pageWidth - 2 * margin, 10, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text(title, margin + 5, yPos + 7);
      doc.setTextColor(0, 0, 0);
      return yPos + 10;
    };

    // Helper to draw a key-value pair
    const drawKeyValue = (key: string, value: string, x: number, yPos: number, keyWidth: number) => {
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(100, 100, 100);
      doc.text(key, x, yPos);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0, 0, 0);
      doc.text(value, x + keyWidth, yPos);
      return yPos + 7;
    };

    // ---- HEADER ----
    doc.setFillColor(220, 53, 69);
    doc.rect(0, 0, pageWidth, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('NAGALAND LOTTERY', pageWidth / 2, 18, { align: 'center' });
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('BOOKING RECEIPT', pageWidth / 2, 28, { align: 'center' });
    
    doc.setFontSize(9);
    doc.text(`Booking ID: ${booking.id}`, pageWidth / 2, 35, { align: 'center' });
    
    doc.setTextColor(0, 0, 0);
    y = 50;

    // ---- STATUS BADGE ----
    doc.setFillColor(40, 167, 69); // Green for Confirmed
    doc.roundedRect(margin, y, 30, 8, 2, 2, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('CONFIRMED', margin + 15, y + 5.5, { align: 'center' });
    doc.setTextColor(0, 0, 0);
    y += 15;

    // ---- PASSENGER DETAILS ----
    y = drawSectionHeader('PASSENGER DETAILS', y);
    drawBox(margin, y, pageWidth - 2 * margin, 25);
    y += 8;
    y = drawKeyValue('Name:', booking.name, margin + 5, y, 25);
    y = drawKeyValue('Phone:', booking.phoneNumber, margin + 5, y, 25);
    y += 5;

    // ---- BOOKING DETAILS ----
    y = drawSectionHeader('BOOKING DETAILS', y);
    drawBox(margin, y, pageWidth - 2 * margin, 35);
    y += 8;
    y = drawKeyValue('Ticket No:', booking.ticketNumber, margin + 5, y, 28);
    y = drawKeyValue('SEM Value:', booking.sem, margin + 5, y, 28);
    y = drawKeyValue('Time Slot:', booking.time === 'N/A' ? 'N/A (Token)' : booking.time, margin + 5, y, 28);
    y = drawKeyValue('Date:', formatDate(booking.date), margin + 5, y, 28);
    y += 5;

    // ---- ADDRESS DETAILS ----
    y = drawSectionHeader('ADDRESS DETAILS', y);
    const addressHeight = booking.addressLine1 && booking.addressLine1 !== 'N/A' ? 40 : 30;
    drawBox(margin, y, pageWidth - 2 * margin, addressHeight);
    y += 8;
    y = drawKeyValue('City:', booking.city, margin + 5, y, 25);
    y = drawKeyValue('State:', booking.state, margin + 5, y, 25);
    y = drawKeyValue('Pincode:', booking.pincode, margin + 5, y, 25);
    if (booking.addressLine1 && booking.addressLine1 !== 'N/A') {
      y = drawKeyValue('Address:', booking.addressLine1, margin + 5, y, 25);
    }
    y += 5;

    // ---- BOOKING TIMESTAMP ----
    y = drawSectionHeader('BOOKING TIMESTAMP', y);
    drawBox(margin, y, pageWidth - 2 * margin, 15);
    y += 8;
    drawKeyValue('Booked On:', formatDate(booking.createdAt), margin + 5, y, 30);
    drawKeyValue('Booked At:', formatTime(booking.createdAt), margin + 70, y, 30);
    y += 15;

    // ---- FOOTER ----
    const footerY = doc.internal.pageSize.getHeight() - 20;
    doc.setDrawColor(220, 53, 69);
    doc.setLineWidth(0.5);
    doc.line(margin, footerY, pageWidth - margin, footerY);
    
    doc.setFontSize(9);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(100, 100, 100);
    doc.text('Thank you for booking with Nagaland Lottery!', pageWidth / 2, footerY + 7, { align: 'center' });
    doc.text('Toll Free: 18003458598', pageWidth / 2, footerY + 12, { align: 'center' });

    // Save PDF
    doc.save(`receipt-${booking.id}.pdf`);
    setToast({ message: 'Receipt downloaded successfully!', type: 'success' });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Confirmed':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'Cancelled':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Confirmed':
        return '✓';
      case 'Pending':
        return '⏳';
      case 'Cancelled':
        return '✕';
      case 'In Progress':
        return '⟳';
      default:
        return '•';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (bookings.length === 0) {
    return (
      <div className="bg-linear-to-br from-blue-50 to-indigo-50 rounded-3xl shadow-lg p-8 sm:p-12 border-2 border-blue-200 text-center">
        <div className="flex justify-center mb-4">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
            <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">No Bookings Yet</h3>
        <p className="text-gray-600 text-lg">You haven't made any ticket bookings yet. Start by booking your first ticket!</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 flex items-center gap-3">
          <div className="w-10 h-10 bg-linear-to-r from-indigo-600 to-blue-600 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2.5" />
            </svg>
          </div>
          Booking History
        </h2>
        <p className="text-gray-600 mt-2">Total Bookings: <span className="font-semibold text-indigo-600">{bookings.length}</span></p>
      </div>

      {/* Bookings List */}
      <div className="space-y-4">
        {bookings.map((booking) => (
          booking.bookingType === 'token' ? (
            <div key={booking.id} className="bg-white rounded-2xl shadow-md border-2 border-gray-200 hover:border-red-300 transition-all overflow-hidden">
              <button
                onClick={() => setExpandedId(expandedId === booking.id ? null : booking.id)}
                className="w-full p-4 sm:p-6 flex items-center justify-between hover:bg-red-50 transition-colors text-left"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="text-lg font-bold text-gray-800">{booking.id}</h3>
                    <span className="px-3 py-1 rounded-full text-xs font-semibold border-2 flex items-center gap-1 bg-red-100 text-red-800 border-red-300">
                      <span>🎫</span>
                      Token
                    </span>
                  </div>
                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 font-semibold uppercase">Name</p>
                      <p className="text-sm font-medium text-gray-800">{booking.name}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-semibold uppercase">Token No</p>
                      <p className="text-sm font-medium text-gray-800 font-mono">{booking.ticketNumber}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-semibold uppercase">Date</p>
                      <p className="text-sm font-medium text-gray-800">{formatDate(booking.date)}</p>
                    </div>
                  </div>
                </div>
                <svg className={`w-5 h-5 text-gray-600 transition-transform ml-4 flex-shrink-0 ${expandedId === booking.id ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </button>
              {expandedId === booking.id && (
                <div className="border-t-2 border-gray-200 bg-linear-to-br from-red-50 to-indigo-50 p-4 sm:p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <p className="text-xs text-gray-500 font-semibold uppercase mb-1">Token Number</p>
                        <p className="text-sm text-gray-800 font-mono font-medium bg-white p-2 rounded-lg border border-red-200">{booking.ticketNumber}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-semibold uppercase mb-1">Date</p>
                        <p className="text-sm text-gray-800 font-medium">{formatDate(booking.date)}</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <p className="text-xs text-gray-500 font-semibold uppercase mb-1">Booked At</p>
                        <p className="text-sm text-gray-800 font-medium">{formatTime(booking.createdAt)}</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex gap-2 sm:gap-3">
                    <button
                      onClick={() => handleDownloadToken(booking)}
                      className="flex-1 px-4 py-2 bg-linear-to-r from-red-600 to-red-700 text-white rounded-lg font-medium hover:from-red-700 hover:to-red-800 transition-all text-sm flex items-center justify-center gap-2"
                    >
                      📥 Download Token
                    </button>
                    <button
                      onClick={() => handleDelete(booking.id)}
                      className="flex-1 px-4 py-2 bg-linear-to-r from-red-600 to-red-700 text-white rounded-lg font-medium hover:from-red-700 hover:to-red-800 transition-all text-sm flex items-center justify-center gap-2"
                    >
                      🗑️ Delete Token
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div key={booking.id} className="bg-white rounded-2xl shadow-md border-2 border-gray-200 hover:border-indigo-300 transition-all overflow-hidden">
              <button
                onClick={() => setExpandedId(expandedId === booking.id ? null : booking.id)}
                className="w-full p-4 sm:p-6 flex items-center justify-between hover:bg-indigo-50 transition-colors text-left"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="text-lg font-bold text-gray-800">{booking.id}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border-2 flex items-center gap-1 ${getStatusColor(booking.status)}`}>
                      <span>{getStatusIcon(booking.status)}</span>
                      {booking.status}
                    </span>
                  </div>
                  <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 font-semibold uppercase">Name</p>
                      <p className="text-sm font-medium text-gray-800">{booking.name}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-semibold uppercase">Ticket No</p>
                      <p className="text-sm font-medium text-gray-800">{booking.ticketNumber}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-semibold uppercase">Date</p>
                      <p className="text-sm font-medium text-gray-800">{formatDate(booking.date)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-semibold uppercase">Time</p>
                      <p className="text-sm font-medium text-gray-800">{booking.time}</p>
                    </div>
                  </div>
                </div>
                <svg className={`w-5 h-5 text-gray-600 transition-transform ml-4 flex-shrink-0 ${expandedId === booking.id ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </button>
              {expandedId === booking.id && (
                <div className="border-t-2 border-gray-200 bg-linear-to-br from-blue-50 to-indigo-50 p-4 sm:p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <p className="text-xs text-gray-500 font-semibold uppercase mb-1">Phone Number</p>
                        <p className="text-sm text-gray-800 font-medium">{booking.phoneNumber}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-semibold uppercase mb-1">SEM Value</p>
                        <p className="text-sm text-gray-800 font-medium">{booking.sem}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-semibold uppercase mb-1">City</p>
                        <p className="text-sm text-gray-800 font-medium">{booking.city}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-semibold uppercase mb-1">State</p>
                        <p className="text-sm text-gray-800 font-medium">{booking.state}</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <p className="text-xs text-gray-500 font-semibold uppercase mb-1">Pincode</p>
                        <p className="text-sm text-gray-800 font-medium">{booking.pincode}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-semibold uppercase mb-1">Booked On</p>
                        <p className="text-sm text-gray-800 font-medium">{formatDate(booking.createdAt)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-semibold uppercase mb-1">Booked At</p>
                        <p className="text-sm text-gray-800 font-medium">{formatTime(booking.createdAt)}</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-indigo-200">
                    <p className="text-xs text-gray-500 font-semibold uppercase mb-2">Address</p>
                    <p className="text-sm text-gray-800 font-medium leading-relaxed bg-white p-3 rounded-lg border border-indigo-200">{booking.addressLine1}</p>
                  </div>
                  <div className="mt-4 flex gap-2 sm:gap-3">
                    <button 
                      onClick={() => handleDownloadReceipt(booking)}
                      className="flex-1 px-4 py-2 bg-linear-to-r from-indigo-600 to-blue-600 text-white rounded-lg font-medium hover:from-indigo-700 hover:to-blue-700 transition-all text-sm flex items-center justify-center gap-2"
                    >
                      📥 Download Receipt
                    </button>
                    <button
                      onClick={() => handleDelete(booking.id)}
                      className="flex-1 px-4 py-2 bg-linear-to-r from-red-600 to-red-700 text-white rounded-lg font-medium hover:from-red-700 hover:to-red-800 transition-all text-sm flex items-center justify-center gap-2"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          )
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        title="Delete Booking"
        message="Are you sure you want to delete this booking? This action cannot be undone."
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        confirmLabel="Delete"
        cancelLabel="Cancel"
      />

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
          duration={3000}
        />
      )}
    </div>
  );
};

export default BookingHistorySection;
