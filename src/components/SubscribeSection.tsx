import React, { useState, useEffect, useRef } from 'react';
import { SUBSCRIBE_DATA } from '../data/paralifeData';
import { SubscribeState } from '../types';
import { subscribeEmail, validateEmail } from '../utils/supabase';

export const SubscribeSection: React.FC = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<SubscribeState>('idle');
  const [message, setMessage] = useState('');
  const [isConfirming, setIsConfirming] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isEmailValid = validateEmail(email);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  // Step 1: User clicks subscribe -> triggers confirmation step
  const handleInitiateSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setStatus('error');
      setMessage(SUBSCRIBE_DATA.invalidEmailText);
      setIsConfirming(false);
      return;
    }

    setStatus('idle');
    setMessage('');
    setIsConfirming(true);
  };

  // Step 2: User clicks "Confirm & Send" -> saves to Supabase and sends email
  const handleFinalSubmit = async () => {
    setIsConfirming(false);
    setStatus('loading');
    setMessage(SUBSCRIBE_DATA.loadingText);

    const result = await subscribeEmail(email);

    if (result.success) {
      if (result.isDuplicate) {
        setStatus('error');
        setMessage(SUBSCRIBE_DATA.alreadySubscribedText);
      } else {
        setStatus('success');
        setMessage(SUBSCRIBE_DATA.successText);
        setEmail('');
      }
    } else {
      setStatus('error');
      setMessage(result.message || SUBSCRIBE_DATA.errorText);
    }
  };


  return (
    <section
      id="subscribe"
      className="w-full py-28 md:py-40 px-6 md:px-12 bg-[#121316]"
      aria-label="Subscribe"
    >
      <div className="max-w-[560px] mx-auto text-center flex flex-col items-center space-y-10">
        {/* Section Label / Headline */}
        <div className="flex flex-col items-center">
          <h3 className="type-h2 text-[#F2EEE8] font-normal leading-[1.08]">
            Follow the Signal
          </h3>
        </div>

        {/* Minimal Editorial Form */}
        <div className="w-full flex flex-col items-center space-y-6">
          {isConfirming ? (
            /* Minimal Editorial Confirmation View */
            <div className="w-full flex flex-col items-center space-y-4 animate-fade-in">
              <div className="w-full relative flex items-center justify-between border-b border-[#FF2D85]/60 py-3">
                <div className="flex flex-col text-left overflow-hidden mr-4">
                  <span className="text-[10px] tracking-[0.15em] uppercase text-[#FF2D85] font-medium mb-0.5">
                    Confirm Email
                  </span>
                  <span className="text-[15px] md:text-[16px] text-[#F2EEE8] tracking-[0.02em] truncate">
                    {email}
                  </span>
                </div>

                <div className="flex items-center space-x-4 shrink-0">
                  <button
                    type="button"
                    onClick={handleFinalSubmit}
                    className="py-2 text-[13px] tracking-[0.1em] uppercase text-[#FF2D85] hover:text-[#F2EEE8] font-medium cursor-pointer transition-colors duration-200"
                  >
                    +confirm
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsConfirming(false)}
                    className="py-2 text-[13px] tracking-[0.1em] uppercase text-[#F2EEE8]/40 hover:text-[#F2EEE8] cursor-pointer transition-colors duration-200"
                  >
                    edit
                  </button>
                </div>
              </div>

              <p className="text-[12px] tracking-[0.04em] text-[#F2EEE8]/52">
                Click +confirm to send the welcome signal.
              </p>
            </div>
          ) : (
            /* Standard Input Form */
            <form onSubmit={handleInitiateSubmit} className="w-full flex flex-col items-center space-y-6">
              <div className="w-full relative flex items-center border-b border-[#F2EEE8]/30 focus-within:border-[#FF2D85] transition-colors duration-200">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (status !== 'idle') setStatus('idle');
                  }}
                  placeholder={SUBSCRIBE_DATA.inputPlaceholder}
                  disabled={status === 'loading'}
                  className="w-full bg-transparent py-4 text-[15px] md:text-[16px] text-[#F2EEE8] placeholder-[#F2EEE8]/40 focus:outline-none tracking-[0.02em]"
                  required
                  aria-label="Email address"
                />

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="ml-4 py-4 px-2 text-[13px] tracking-[0.1em] uppercase text-[#F2EEE8]/76 hover:text-[#FF2D85] disabled:opacity-50 transition-colors duration-200 min-h-[44px] cursor-pointer whitespace-nowrap font-medium"
                >
                  {status === 'loading' ? SUBSCRIBE_DATA.loadingText : SUBSCRIBE_DATA.buttonText}
                </button>
              </div>

              {/* Feedback Messages */}
              <div aria-live="polite">
                {status === 'success' && (
                  <p className="text-[13px] tracking-[0.06em] text-[#B8C1B0] animate-fade-in">
                    {message}
                  </p>
                )}

                {status === 'error' && (
                  <p className="text-[13px] tracking-[0.06em] text-[#C99B9B] animate-fade-in">
                    {message}
                  </p>
                )}
              </div>

              {/* Quiet Privacy Note */}
              <p className="text-[12px] tracking-[0.04em] text-[#F2EEE8]/52">
                {SUBSCRIBE_DATA.privacyNote}
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};


