'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HeroSearch() {
  const router = useRouter();
  
  const [location, setLocation] = useState('Lombok');
  const [locOpen, setLocOpen] = useState(false);
  
  const [type, setType] = useState('Lepas Kunci');
  const [typeOpen, setTypeOpen] = useState(false);

  const locRef = useRef<HTMLDivElement>(null);
  const typeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (locRef.current && !locRef.current.contains(event.target as Node)) {
        setLocOpen(false);
      }
      if (typeRef.current && !typeRef.current.contains(event.target as Node)) {
        setTypeOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/armada?location=${location.toLowerCase()}&type=${type.toLowerCase().replace(' ', '_')}`);
  };

  return (
    <div className="bg-[#0a0a0a]/90 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-white/10 max-w-xl">
      <p className="text-sm font-semibold text-white/60 mb-4 uppercase tracking-wide">Cari Armada</p>
      <form onSubmit={handleSearch} className="grid sm:grid-cols-3 gap-4 relative">
        
        {/* Custom Location Dropdown */}
        <div ref={locRef} className="relative">
          <label className="block text-xs font-medium text-white/70 mb-1">Lokasi</label>
          <div 
            onClick={() => { setLocOpen(!locOpen); setTypeOpen(false); }}
            className={`w-full cursor-pointer flex justify-between items-center rounded-lg border ${locOpen ? 'border-gold' : 'border-white/20'} bg-[#040404] px-4 py-3 text-sm text-white transition-all`}
          >
            {location}
            <svg className={`w-4 h-4 text-white/50 transition-transform ${locOpen ? 'rotate-180 text-gold' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          
          {locOpen && (
            <div className="absolute z-50 w-full mt-2 bg-[#111111] border border-white/10 rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
              {['Lombok', 'Bali'].map(opt => (
                <div 
                  key={opt}
                  onClick={() => { setLocation(opt); setLocOpen(false); }}
                  className="px-4 py-3 text-sm text-white/80 hover:bg-gold/10 hover:text-gold cursor-pointer transition-colors"
                >
                  {opt}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Custom Type Dropdown */}
        <div ref={typeRef} className="relative">
          <label className="block text-xs font-medium text-white/70 mb-1">Tipe Sewa</label>
          <div 
            onClick={() => { setTypeOpen(!typeOpen); setLocOpen(false); }}
            className={`w-full cursor-pointer flex justify-between items-center rounded-lg border ${typeOpen ? 'border-gold' : 'border-white/20'} bg-[#040404] px-4 py-3 text-sm text-white transition-all`}
          >
            {type}
            <svg className={`w-4 h-4 text-white/50 transition-transform ${typeOpen ? 'rotate-180 text-gold' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          
          {typeOpen && (
            <div className="absolute z-50 w-full mt-2 bg-[#111111] border border-white/10 rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
              {['Lepas Kunci', 'Dengan Sopir'].map(opt => (
                <div 
                  key={opt}
                  onClick={() => { setType(opt); setTypeOpen(false); }}
                  className="px-4 py-3 text-sm text-white/80 hover:bg-gold/10 hover:text-gold cursor-pointer transition-colors"
                >
                  {opt}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex items-end">
          <button type="submit" className="w-full bg-gold text-white rounded-lg px-4 py-3 text-sm font-semibold hover:bg-gold/90 hover:shadow-lg transition-all active:scale-95 shadow-sm">
            Cari Mobil
          </button>
        </div>

      </form>
    </div>
  );
}
