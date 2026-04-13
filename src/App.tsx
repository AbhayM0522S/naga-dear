import { useRef } from 'react';
import NavBar from './components/NavBar';
import ImageSlider from './components/ImageSlider';
import SemSection from './components/SemSection';
import TicketSpinner from './components/TicketSpinner';

function App() {
  const semRef = useRef<HTMLDivElement>(null);
  const ticketsRef = useRef<HTMLDivElement>(null);

  const scrollToSection = (section: string) => {
    const refs: Record<string, React.RefObject<HTMLDivElement | null>> = {
      sem: semRef,
      tickets: ticketsRef,
    };

    const ref = refs[section];
    if (ref?.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    // ✅ Changed here
    <div className="min-h-screen bg-gray-300">
      
      {/* Navigation Bar */}
      <div className="bg-red-600 sticky top-0 z-50">
        <NavBar onSectionChange={scrollToSection} />
      </div>

      {/* Main Content */}
      <main className="px-4 sm:px-6 py-6">
        <div className="max-w-6xl mx-auto space-y-8">
          
          {/* Image Slider */}
          <div className="w-full">
            <ImageSlider />
          </div>

          {/* SEM Section */}
          <div ref={semRef} id="sem" className="scroll-mt-24 w-full">
            <div className="text-xl sm:text-2xl font-bold text-red-500 text-center flex items-center justify-center mb-4 underline">
              SEM
            </div>
            <div className="bg-red-50 rounded-lg p-6 sm:p-8 shadow-lg w-full">
              <SemSection />
            </div>
          </div>

          {/* Tickets Section */}
          <div ref={ticketsRef} id="tickets" className="scroll-mt-24 w-full">
            <div className="text-xl sm:text-2xl font-bold text-red-500 text-center flex items-center justify-center mb-4 underline">
              TICKETS
            </div>
            <TicketSpinner />
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="bg-red-300 shadow-inner mt-8">
        <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-white text-sm">
          <p>© 2026 Nagaland Lottery. All rights reserved.</p>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <span className="font-semibold">Toll Free: 1800-XXX-XXXX</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;