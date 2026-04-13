import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

interface SpinDigitProps {
  value: number;
  isSpinning: boolean;
  delay: number;
  onComplete?: () => void;
}

const SpinDigit: React.FC<SpinDigitProps> = ({ value, isSpinning, delay, onComplete }) => {
  const [displayValue, setDisplayValue] = useState(value);
  const animationRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const valueRef = useRef(value);
  const onCompleteRef = useRef(onComplete);

  // Keep refs in sync
  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  const stopAnimation = () => {
    if (animationRef.current) {
      clearTimeout(animationRef.current);
      animationRef.current = null;
    }
  };

  const startSpin = () => {
    stopAnimation();

    let elapsed = 0;
    const duration = 2000 + delay;
    const interval = 50;

    const animate = () => {
      elapsed += interval;
      const newRandom = Math.floor(Math.random() * 10);
      setDisplayValue(newRandom);

      if (elapsed < duration) {
        animationRef.current = setTimeout(animate, interval);
      } else {
        // Animation complete - show the final value from the ref
        setDisplayValue(valueRef.current);
        // Notify parent that this digit is done
        onCompleteRef.current?.();
      }
    };

    animationRef.current = setTimeout(animate, delay);
  };

  const reset = () => {
    stopAnimation();
    setDisplayValue(valueRef.current);
  };

  useEffect(() => {
    if (isSpinning) {
      startSpin();
    } else {
      reset();
    }

    // Cleanup on unmount or when isSpinning changes
    return stopAnimation;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSpinning]);

  return (
    <div className="relative w-10 h-12 sm:w-12 sm:h-14 rounded-md overflow-hidden border-2 border-gray-600 shadow-lg flex items-center justify-center" style={{background: 'linear-gradient(135deg, #2a2a3e 0%, #1a1a2e 100%)'}}>
      {/* Digit display */}
      <span
        className="text-2xl sm:text-3xl font-bold"
        style={{
          color: '#d4af37',
          fontFamily: "'Courier New', monospace",
        }}
      >
        {String(displayValue).padStart(1, '0')}
      </span>

      {/* Shine effect */}
      <div className="absolute inset-0 bg-linear-to-b from-white/10 via-transparent to-transparent pointer-events-none" />
    </div>
  );
};

const TicketSpinner = () => {
  const navigate = useNavigate();
  const [digits, setDigits] = useState([0, 0, 0, 0, 0]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [ticketNumber, setTicketNumber] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [copyFeedback, setCopyFeedback] = useState(false);
  const [inputError, setInputError] = useState('');
  const spinCountRef = useRef(0);
  const completedCountRef = useRef(0);

  const handleDigitComplete = () => {
    completedCountRef.current += 1;
    // When all 5 digits have completed, reset the spinning state
    if (completedCountRef.current >= 5) {
      setIsSpinning(false);
      completedCountRef.current = 0;
    }
  };

  const handleSpin = () => {
    if (!inputValue.trim()) {
      setInputError('Please enter a ticket number');
      return;
    }

    setInputError('');

    if (isSpinning) return;

    completedCountRef.current = 0;
    spinCountRef.current += 1;
    // Convert the input value to digits array, padding with zeros if needed
    const inputDigits = inputValue
      .padEnd(5, '0')
      .split('')
      .slice(0, 5)
      .map(d => parseInt(d, 10));
    setDigits(inputDigits);
    setIsSpinning(true);
  };


  const handleBookTicket = () => {
    if (!ticketNumber) {
      setInputError('Please spin first to get a ticket number');
      return;
    }
    navigate(`/booking?ticket=${ticketNumber}`);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(ticketNumber);
    setCopyFeedback(true);
    setTimeout(() => setCopyFeedback(false), 2000);
  };

  useEffect(() => {
    if (!isSpinning && digits.some(d => d !== 0)) {
      const num = digits.join('');
      setTicketNumber(num);
    }
  }, [isSpinning, digits]);

  return (
    <div className="w-full">
      {/* Header */}
      <div style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}} className="rounded-2xl p-8 text-white text-center mb-8 shadow-xl">
        <h1 className="text-3xl font-bold mb-2">Lucky Draw</h1>
        <p className="text-sm opacity-90">Enter your ticket number and spin to win</p>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-lg w-full">
        {/* Input Section */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-600 mb-2">Your ticket number</label>
          {inputError && (
            <div className="mb-2 px-3 py-2 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
              <svg className="w-4 h-4 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span className="text-sm text-red-600">{inputError}</span>
            </div>
          )}
          <input
            type="text"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value.replace(/[^0-9]/g, '').slice(0, 5));
              if (inputError) setInputError('');
            }}
            placeholder="Enter your ticket no"
            maxLength={5}
            required
            className={`w-full px-4 py-3 text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition ${
              inputError ? 'border-red-400 bg-red-50' : 'border-gray-300'
            }`}
          />
        </div>

        {/* Spinner Container */}
        <div className="rounded-xl p-8 mb-8 text-center shadow-inner bg-gray-300">
          <div className="mb-4 text-gray-500 text-xs uppercase tracking-widest font-semibold">Your winning code</div>
          
          {/* Digits */}
          <div className="flex items-center justify-center gap-3 perspective">
            {digits.map((digit, index) => (
              <SpinDigit
                key={`${spinCountRef.current}-${index}`}
                value={digit}
                isSpinning={isSpinning}
                delay={index * 300}
                onComplete={handleDigitComplete}
              />
            ))}
          </div>

          {/* Result Display */}
          {ticketNumber && !isSpinning && (
            <div className="mt-6 text-sm text-gray-600">
              Your code: <span className="text-yellow-500 font-bold text-2xl">{ticketNumber}</span>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row justify-center gap-3 mb-6">
          <button
            onClick={handleSpin}
            disabled={isSpinning}
            className={`py-3 px-6 rounded-lg font-semibold text-white transition-all shadow-lg flex items-center justify-center gap-2 text-base ${
              isSpinning
                ? 'bg-gray-500 cursor-not-allowed'
                : 'bg-linear-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 hover:shadow-xl active:scale-95'
            }`}
          >
            <span>🎡</span>
            SPIN
          </button>

          <button
            onClick={handleBookTicket}
            disabled={isSpinning || !ticketNumber}
            className={`py-3 px-6 rounded-lg font-semibold transition-all shadow-lg text-base ${
              isSpinning || !ticketNumber
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-linear-to-r from-teal-600 to-teal-700 text-white hover:from-teal-700 hover:to-teal-800 hover:shadow-xl active:scale-95'
            }`}
          >
            📖 Book Ticket
          </button>
        </div>

        {/* Copy Button - Enhanced */}
        {ticketNumber && !isSpinning && (
          <button
            onClick={handleCopy}
            className={`w-full py-3 text-base font-semibold rounded-lg border-2 transition-all duration-300 flex items-center justify-center gap-2 ${
              copyFeedback
                ? 'bg-green-50 border-green-400 text-green-700'
                : 'bg-linear-to-r from-blue-50 to-indigo-50 border-blue-300 text-blue-700 hover:border-blue-500 hover:shadow-md'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            {copyFeedback ? '✓ Copied to clipboard!' : 'Copy result to clipboard'}
          </button>
        )}
      </div>
    </div>
  );
};

export default TicketSpinner;