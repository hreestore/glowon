
'use client';

import { useState } from 'react';
import { useAppSelector } from '@/redux/hooks';
import { Iconify } from '@/components/iconify';
import { toast } from '@/components/snackbar';

// ----------------------------------------------------------------------

export function ContactMap({ className = '', ...other }) {
  const { vendor } = useAppSelector((state) => state.vendor);
  const [copied, setCopied] = useState(false);

  const map_link = vendor?.map_link;
  const address = vendor?.address || 'Main Street, Kathmandu, Nepal';
  const phone = vendor?.contact_info || '+977-9800000000';
  const email = vendor?.email;
  const primaryColor = vendor?.primary_color || '#2563eb';
  const secondaryColor = vendor?.secondary_color || '#7c3aed';

  const handleCopyAddress = () => {
    if (!address) return;
    navigator.clipboard.writeText(address);
    setCopied(true);
    toast.success('Address copied to clipboard!');
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div
      className={`flex flex-col h-full rounded-[2.5rem] bg-white p-7 sm:p-9 md:p-10 border border-gray-100/80 shadow-[0_20px_50px_rgba(0,0,0,0.06)] relative overflow-hidden ${className}`}
      {...other}
    >
      {/* Decorative ambient background glow */}
      <div
        className="pointer-events-none absolute top-0 left-0 h-44 w-44 rounded-full blur-3xl opacity-10"
        style={{ background: primaryColor }}
      />
      <div
        className="pointer-events-none absolute bottom-0 right-0 h-44 w-44 rounded-full blur-3xl opacity-10"
        style={{ background: secondaryColor }}
      />

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-gray-100">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Location & Directions
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight text-gray-900">
            Visit Our Store
          </h2>
          <p className="text-gray-500 text-xs sm:text-sm mt-1 truncate max-w-sm">
            {address}
          </p>
        </div>

        {/* Open in Maps external button */}
        {map_link && (
          <a
            href={map_link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-100/90 text-gray-800 text-xs font-bold transition-all duration-300 hover:bg-gray-900 hover:text-white shrink-0 shadow-sm group"
          >
            <span>Google Maps</span>
            <Iconify
              icon="solar:arrow-right-up-linear"
              width={16}
              className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </a>
        )}
      </div>

      {/* Map Viewport Card */}
      <div className="group relative w-full flex-1 min-h-[320px] rounded-2xl overflow-hidden shadow-inner border border-gray-200/80 bg-gray-100">
        {map_link ? (
          <>
            {/* Loading background */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-100 via-gray-200 to-gray-100 animate-pulse z-0" />
            
            <iframe
              src={map_link}
              width="100%"
              height="100%"
              className="absolute inset-0 z-10 border-0 w-full h-full grayscale-[0.25] contrast-[1.05] transition-all duration-500 group-hover:grayscale-0"
              loading="lazy"
              title="Location Map"
              allowFullScreen
            />
          </>
        ) : (
          /* Fallback visual when no iframe map link is provided */
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-gradient-to-b from-gray-50 to-gray-100">
            <div
              className="flex items-center justify-center w-16 h-16 rounded-2xl text-white shadow-lg mb-4"
              style={{
                background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`,
              }}
            >
              <Iconify icon="solar:map-point-wave-bold-duotone" width={34} />
            </div>
            <h3 className="text-gray-900 text-base font-bold">
              {vendor?.vendor_name || 'Store Location'}
            </h3>
            <p className="text-gray-500 text-sm max-w-xs mt-1">
              {address}
            </p>
          </div>
        )}

        {/* Floating badge inside map */}
        <div className="absolute top-3.5 left-3.5 z-20 pointer-events-none">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/90 backdrop-blur-md shadow-md border border-white/60 text-gray-800 text-xs font-bold">
            <Iconify icon="solar:map-point-bold-duotone" className="text-indigo-600" width={16} />
            <span>Storefront</span>
          </div>
        </div>
      </div>

      {/* Quick Action Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6 pt-6 border-t border-gray-100">
        
        {/* Call Action */}
        <a
          href={`tel:${phone}`}
          className="flex items-center justify-center gap-2 py-3 px-3 rounded-2xl bg-gray-50 border border-gray-200/70 text-gray-700 text-xs font-bold transition-all duration-300 hover:bg-gray-100 hover:text-gray-900 hover:-translate-y-0.5"
        >
          <Iconify icon="solar:phone-calling-rounded-bold-duotone" className="text-indigo-600" width={17} />
          <span>Call Us</span>
        </a>

        {/* Email Action */}
        <a
          href={`mailto:${email || 'support@glowon.com'}`}
          className="flex items-center justify-center gap-2 py-3 px-3 rounded-2xl bg-gray-50 border border-gray-200/70 text-gray-700 text-xs font-bold transition-all duration-300 hover:bg-gray-100 hover:text-gray-900 hover:-translate-y-0.5"
        >
          <Iconify icon="solar:letter-bold-duotone" className="text-indigo-600" width={17} />
          <span>Email Us</span>
        </a>

        {/* Copy Address */}
        <button
          type="button"
          onClick={handleCopyAddress}
          className="flex items-center justify-center gap-2 py-3 px-3 rounded-2xl bg-gray-50 border border-gray-200/70 text-gray-700 text-xs font-bold transition-all duration-300 hover:bg-gray-100 hover:text-gray-900 hover:-translate-y-0.5 cursor-pointer"
        >
          <Iconify
            icon={copied ? 'solar:check-circle-bold' : 'solar:copy-bold-duotone'}
            className={copied ? 'text-emerald-500' : 'text-indigo-600'}
            width={17}
          />
          <span>{copied ? 'Copied!' : 'Copy Address'}</span>
        </button>

      </div>
    </div>
  );
}