"use client";

import { m } from "framer-motion";
import { varFade, MotionContainer } from "@/components/animate";
import { useAppSelector } from "@/redux/hooks";
import { Iconify } from "@/components/iconify";

// ----------------------------------------------------------------------

export function PrivacyHero({ className = "", ...other }) {
    const vendor = useAppSelector((state) => state.vendor?.vendor);

    const primaryColor = vendor?.primary_color || "#2563eb";
    const secondaryColor = vendor?.secondary_color || "#7c3aed";

    return (
        <section
            className={`relative overflow-hidden py-14 md:py-20 ${className}`}
            style={{
                background: `linear-gradient(135deg, ${primaryColor} 0%, #1e1b4b 60%, ${secondaryColor} 100%)`,
            }}
            {...other}
        >
            {/* Decorative Grid Pattern */}
            <div
                className="pointer-events-none absolute inset-0 opacity-15"
                style={{
                    backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
                    backgroundSize: "36px 36px",
                }}
            />

            {/* Radial Glow Lighting */}
            <div
                className="pointer-events-none absolute -left-32 -top-32 h-[450px] w-[450px] rounded-full blur-3xl opacity-25"
                style={{ background: primaryColor }}
            />
            <div
                className="pointer-events-none absolute -right-32 bottom-0 h-[400px] w-[400px] rounded-full blur-3xl opacity-25"
                style={{ background: secondaryColor }}
            />

            <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
                <MotionContainer className="flex flex-col items-center text-center">

                    {/* Badge */}
                    <m.div variants={varFade("inUp", { distance: 20 })}>
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-5 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-white text-xs font-bold uppercase tracking-wider shadow-sm">
                            <Iconify icon="solar:shield-check-bold-duotone" width={16} className="text-emerald-300" />
                            <span>Data Protection & Privacy</span>
                        </div>
                    </m.div>

                    {/* Title */}
                    <m.h1
                        variants={varFade("inUp", { distance: 24 })}
                        className="text-white text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight drop-shadow-md leading-tight"
                    >
                        Privacy Policy
                    </m.h1>

                    {/* Subtitle */}
                    <m.p
                        variants={varFade("inUp", { distance: 24 })}
                        className="text-white/85 mt-4 text-base sm:text-lg max-w-2xl leading-relaxed font-normal"
                    >
                        Learn how {vendor?.vendor_name || "Glowon"} collects, secures, uses, and respects your personal information when using our ecommerce services.
                    </m.p>

                    {/* Metadata Badges */}
                    {/* <m.div
            variants={varFade("inUp", { distance: 24 })}
            className="mt-8 flex flex-wrap items-center justify-center gap-3"
          >
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-white/90 text-xs font-medium">
              <Iconify icon="solar:calendar-bold-duotone" width={15} className="text-white/70" />
              <span>Effective: August 2026</span>
            </div>
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-white/90 text-xs font-medium">
              <Iconify icon="solar:lock-password-bold-duotone" width={15} className="text-emerald-400" />
              <span>256-Bit SSL Encryption</span>
            </div>
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-white/90 text-xs font-medium">
              <Iconify icon="solar:user-check-bold-duotone" width={15} className="text-sky-300" />
              <span>Zero Unauthorized Sharing</span>
            </div>
          </m.div> */}

                </MotionContainer>
            </div>
        </section>
    );
}
