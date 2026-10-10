
"use client";

import { useState } from "react";
import { useAppSelector } from "@/redux/hooks";
import { toast } from "@/components/snackbar";

// ----------------------------------------------------------------------

const DEFAULT_PRIMARY = "#1976d2";
const DEFAULT_SECONDARY = "#9c27b0";

// ----------------------------------------------------------------------
// Inline SVGs (replaces Iconify)
// ----------------------------------------------------------------------

function LetterIcon({ size = 40, className = "" }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path opacity={0.5} d="M2 12c0-4.714 0-7.071 1.464-8.536C4.93 2 7.286 2 12 2s7.071 0 8.535 1.464C22 4.93 22 7.286 22 12s0 7.071-1.465 8.535C19.072 22 16.714 22 12 22s-7.071 0-8.536-1.465C2 19.072 2 16.714 2 12z" />
      <path d="M7 9.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm1.5 3a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1H9a.5.5 0 0 1-.5-.5zm2 3a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5z" />
    </svg>
  );
}

function MailboxIcon({ size = 20, className = "" }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path opacity={0.5} d="M2 13c0-2.828 0-4.243.879-5.121C3.757 7 5.172 7 8 7h8c2.828 0 4.243 0 5.121.879C22 8.757 22 10.172 22 13v2c0 2.828 0 4.243-.879 5.121C20.243 21 18.828 21 16 21H8c-2.828 0-4.243 0-5.121-.879C2 19.243 2 17.828 2 15v-2z" />
      <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M2 11l5.5 3L13 11M22 11l-5.5 3L11 11" />
    </svg>
  );
}

function ArrowRightIcon({ size = 20, className = "" }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path fillRule="evenodd" d="M12.97 3.97a.75.75 0 0 1 1.06 0l7 7a.75.75 0 0 1 0 1.06l-7 7a.75.75 0 1 1-1.06-1.06l5.72-5.72H4a.75.75 0 0 1 0-1.5h14.69l-5.72-5.72a.75.75 0 0 1 0-1.06z" clipRule="evenodd" />
    </svg>
  );
}

function SpinnerIcon({ size = 20, className = "" }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={`animate-spin ${className}`}>
      <path opacity={0.3} d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z" />
      <path d="M20 12h2A10 10 0 0 0 12 2v2a8 8 0 0 1 8 8z" />
    </svg>
  );
}

// ----------------------------------------------------------------------

export function HomeNewsletter() {
  const { vendor } = useAppSelector((state) => state.vendor);

  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const primaryColor = vendor?.primary_color || DEFAULT_PRIMARY;
  const secondaryColor = vendor?.secondary_color || DEFAULT_SECONDARY;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    toast.success("Thank you for subscribing!");
    setEmail("");
    setIsLoading(false);
  };

  return (
    <section
      className="relative overflow-hidden rounded-[32px] py-16 lg:my-6 my-2 lg:mb-20! mb-10"
      style={{
        background: `linear-gradient(135deg, ${secondaryColor} 0%, ${secondaryColor} 50%, ${primaryColor}ee 100%)`,
      }}
    >
      {/* Grid overlay */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Content */}
      <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center gap-4 px-4 text-center">

        {/* Icon */}
        <div
          className="rounded-3xl p-4 backdrop-blur-md"
          style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
        >
          <LetterIcon size={40} className="text-white" />
        </div>

        {/* Text */}
        <div>
          <h2 className="mb-1 text-2xl font-bold text-white md:text-4xl">
            Stay Updated with{" "}
            {vendor?.vendor_name || "Glow On Cosmetic"} News
          </h2>
          <p className="mx-auto max-w-[480px] text-sm text-white/80 md:text-base">
            Subscribe to our newsletter and be the first to know about new products and exclusive deals.
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="flex w-full max-w-[500px] flex-col gap-2 sm:flex-row"
        >
          {/* Input */}
          <div className="relative w-full">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <MailboxIcon size={20} />
            </div>
            <input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-[56px] w-full rounded-2xl border-0 bg-white pl-12 pr-4 text-sm outline-none placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-white/40"
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="flex h-[56px] items-center justify-center gap-2 whitespace-nowrap rounded-2xl bg-white px-6 font-bold shadow-[0_8px_24px_rgba(0,0,0,0.15)] transition-all duration-300 ease-in-out hover:-translate-y-[2px] hover:shadow-[0_12px_32px_rgba(0,0,0,0.2)] disabled:cursor-not-allowed disabled:opacity-70"
            style={{ color: primaryColor }}
          >
            Subscribe
            {isLoading ? <SpinnerIcon size={20} /> : <ArrowRightIcon size={20} />}
          </button>
        </form>

        {/* Footer note */}
        <p className="text-xs text-white/60">
          By subscribing, you agree to our Privacy Policy. Unsubscribe anytime.
        </p>
      </div>
    </section>
  );
}