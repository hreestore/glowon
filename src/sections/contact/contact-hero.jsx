
"use client";

import { useState } from "react";
import { m } from "framer-motion";

import {
  varFade,
  AnimateText,
  MotionContainer,
} from "@/components/animate";

import { useAppSelector } from "@/redux/hooks";
import { Iconify } from "@/components/iconify";
import { toast } from "@/components/snackbar";

// ----------------------------------------------------------------------

export function ContactHero({
  className = "",
  ...other
}) {
  const vendor = useAppSelector(
    (state) => state.vendor.vendor
  );

  const [copiedKey, setCopiedKey] = useState(null);

  const primaryColor = vendor?.primary_color || "#2563eb";
  const secondaryColor = vendor?.secondary_color || "#7c3aed";

  const handleCopy = (text, key, label) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    toast.success(`${label} copied to clipboard!`);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  return (
    <section
      className={[
        "relative overflow-hidden pt-12 pb-16 md:pt-16 md:pb-24 lg:py-24",
        className,
      ].join(" ")}
      style={{
        background: `linear-gradient(135deg, ${primaryColor} 0%, #1e1b4b 60%, ${secondaryColor} 100%)`,
      }}
      {...other}
    >
      {/* Decorative Grid Pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)
          `,
          backgroundSize: "36px 36px",
        }}
      />

      {/* Radial Glow Circles */}
      <div
        className="pointer-events-none absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full blur-3xl opacity-30"
        style={{ background: primaryColor }}
      />
      <div
        className="pointer-events-none absolute -right-32 bottom-0 h-[450px] w-[450px] rounded-full blur-3xl opacity-30"
        style={{ background: secondaryColor }}
      />

      {/* Floating Animated Icons */}
      <div className="pointer-events-none absolute left-[8%] top-[20%] animate-float opacity-20 hidden sm:block">
        <Iconify icon="solar:chat-round-call-bold-duotone" width={68} className="text-white" />
      </div>
      <div className="pointer-events-none absolute right-[22%] top-[12%] animate-float-delay opacity-15 hidden sm:block">
        <Iconify icon="solar:letter-opened-bold-duotone" width={56} className="text-white" />
      </div>
      <div className="pointer-events-none absolute left-[45%] bottom-[15%] animate-float-slow opacity-15 hidden sm:block">
        <Iconify icon="solar:stars-minimalistic-bold-duotone" width={48} className="text-white" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <MotionContainer className="flex flex-col">

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">

            {/* Left Content: Title, Subtitle, Highlights */}
            <div className="lg:col-span-7 flex flex-col items-start text-left">

              {/* Live Status Badge */}
              <m.div variants={varFade("inUp", { distance: 20 })}>
                <div className="inline-flex items-center gap-2.5 px-4 py-2 mb-6 rounded-full bg-white/10 backdrop-blur-xl border border-white/25 shadow-[0_8px_16px_rgba(0,0,0,0.15)]">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                    Live Support • We're Here For You
                  </span>
                </div>
              </m.div>

              {/* Main Heading */}
              <AnimateText
                component="h1"
                variant="h1"
                textContent={[
                  "Let's Connect &",
                  "Start a Conversation",
                ]}
                variants={varFade("inUp", { distance: 28 })}
                className="text-white text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight drop-shadow-lg leading-tight"
              />

              {/* Subheading */}
              <m.p
                variants={varFade("inUp", { distance: 24 })}
                className="text-white/85 mt-6 text-base sm:text-lg lg:text-xl font-normal max-w-xl leading-relaxed"
              >
                Have questions about our products, need help with an order, or looking for special partnerships? Reach out anytime and our team will get back to you promptly.
              </m.p>

              {/* Value Proposition Pills */}
              <m.div
                variants={varFade("inUp", { distance: 24 })}
                className="mt-8 flex flex-wrap gap-3"
              >
                <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-white/90 text-xs sm:text-sm font-medium transition-all hover:bg-white/15">
                  <Iconify icon="solar:bolt-circle-bold-duotone" className="text-amber-400" width={18} />
                  <span>&lt; 2 Hr Rapid Response</span>
                </div>
                <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-white/90 text-xs sm:text-sm font-medium transition-all hover:bg-white/15">
                  <Iconify icon="solar:shield-check-bold-duotone" className="text-emerald-400" width={18} />
                  <span>100% Dedicated Care</span>
                </div>
                <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-white/90 text-xs sm:text-sm font-medium transition-all hover:bg-white/15">
                  <Iconify icon="solar:chat-round-dots-bold-duotone" className="text-sky-300" width={18} />
                  <span>24/7 Inquiry Portal</span>
                </div>
              </m.div>

            </div>

            {/* Right Content: Premium Frosted Contact Card */}
            <div className="lg:col-span-5 w-full">
              <m.div
                variants={varFade("inUp", { distance: 28 })}
                className="relative overflow-hidden rounded-[2.2rem] bg-white/[0.12] backdrop-blur-2xl border border-white/25 p-7 sm:p-9 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.35)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_30px_60px_-10px_rgba(0,0,0,0.45)] hover:border-white/35"
              >
                {/* Decorative corner ambient glow */}
                <div className="pointer-events-none absolute -right-16 -top-16 h-36 w-36 rounded-full bg-white/15 blur-2xl" />

                {/* Card Header */}
                <div className="flex items-center gap-4 mb-7 pb-6 border-b border-white/15">
                  <div className="flex items-center justify-center w-13 h-13 rounded-2xl bg-white/20 border border-white/30 text-white shadow-inner">
                    <Iconify icon="solar:buildings-3-bold-duotone" width={28} />
                  </div>
                  <div>
                    <span className="text-xs uppercase tracking-wider font-semibold text-white/70">
                      Store Headquarters
                    </span>
                    <h2 className="text-white text-xl font-bold tracking-tight">
                      {vendor?.vendor_name || "Glow On Support"}
                    </h2>
                  </div>
                </div>

                {/* Contact Rows */}
                <div className="space-y-4">

                  {/* Address */}
                  <div
                    onClick={() => handleCopy(vendor?.address, "address", "Address")}
                    className="group relative flex items-start gap-3.5 p-3.5 rounded-2xl bg-white/5 border border-white/10 transition-all duration-300 hover:bg-white/15 hover:border-white/30 cursor-pointer"
                  >
                    <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-white/15 text-white shrink-0 mt-0.5">
                      <Iconify icon="solar:map-point-wave-bold-duotone" width={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] uppercase tracking-wider font-bold text-white/60">
                        Visit Us
                      </p>
                      <p className="text-white text-sm font-semibold leading-snug mt-0.5 break-words">
                        {vendor?.address || "Main Street, Kathmandu, Nepal"}
                      </p>
                    </div>
                    <button
                      type="button"
                      aria-label="Copy Address"
                      className="text-white/60 opacity-0 group-hover:opacity-100 transition-opacity self-center p-1 rounded-lg hover:text-white hover:bg-white/20"
                    >
                      <Iconify
                        icon={copiedKey === "address" ? "solar:check-circle-bold" : "solar:copy-bold-duotone"}
                        width={18}
                        className={copiedKey === "address" ? "text-emerald-400" : ""}
                      />
                    </button>
                  </div>

                  {/* Phone / Contact Info */}
                  <div
                    onClick={() => handleCopy(vendor?.contact_info, "phone", "Phone number")}
                    className="group relative flex items-center gap-3.5 p-3.5 rounded-2xl bg-white/5 border border-white/10 transition-all duration-300 hover:bg-white/15 hover:border-white/30 cursor-pointer"
                  >
                    <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-white/15 text-white shrink-0">
                      <Iconify icon="solar:phone-calling-rounded-bold-duotone" width={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] uppercase tracking-wider font-bold text-white/60">
                        Direct Line
                      </p>
                      <p className="text-white text-sm font-semibold mt-0.5 truncate">
                        {vendor?.contact_info || "+977-9800000000"}
                      </p>
                    </div>
                    <button
                      type="button"
                      aria-label="Copy Phone"
                      className="text-white/60 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-lg hover:text-white hover:bg-white/20"
                    >
                      <Iconify
                        icon={copiedKey === "phone" ? "solar:check-circle-bold" : "solar:copy-bold-duotone"}
                        width={18}
                        className={copiedKey === "phone" ? "text-emerald-400" : ""}
                      />
                    </button>
                  </div>

                  {/* Support Hours Card */}
                  <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-white/5 border border-white/10">
                    <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-white/15 text-white shrink-0">
                      <Iconify icon="solar:clock-circle-bold-duotone" width={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] uppercase tracking-wider font-bold text-white/60">
                        Operating Hours
                      </p>
                      <p className="text-white text-sm font-semibold mt-0.5">
                        Open Everyday
                        24 hours
                      </p>
                    </div>
                  </div>

                </div>

              </m.div>
            </div>

          </div>

        </MotionContainer>
      </div>

      <style jsx>{`
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-delay {
          animation: float 5s ease-in-out infinite 1s;
        }
        .animate-float-slow {
          animation: float 7s ease-in-out infinite 0.5s;
        }
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-16px) rotate(6deg);
          }
        }
      `}</style>
    </section>
  );
}
