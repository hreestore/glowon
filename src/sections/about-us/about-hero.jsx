"use client";

import { useAppSelector } from "@/redux/hooks";

import { Iconify } from "@/components/iconify";
import { useGetAboutData } from "@/api/about";
import { Markdown } from "@/components/markdown";

// ----------------------------------------------------------------------

export function AboutHero() {
    const { vendor } = useAppSelector(
        (state) => state.vendor
    );

    const { aboutData } = useGetAboutData();

    const { title, subtitle, description } =
        aboutData || {};

    const primaryColor =
        vendor?.primary_color || "#2563eb";

    const secondaryColor =
        vendor?.secondary_color || "#7c3aed";

    return (
        <section
            className="relative flex min-h-[350px] container mx-auto lg:px-4 items-center justify-center overflow-hidden rounded-[32px] md:min-h-[450px]"
            style={{
                background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`,
            }}
        >
            {/* Grid Pattern */}
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

            {/* Glow Effect */}
            <div
                className="pointer-events-none absolute -left-1/2 -top-1/2 h-[200%] w-[200%]"
                style={{
                    background:
                        "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.15) 0%, transparent 50%)",
                }}
            />

            {/* Floating Icons */}
            <div className="animate-float absolute right-[10%] top-[15%] opacity-15">
                <Iconify
                    icon="solar:buildings-3-bold-duotone"
                    width={100}
                    className="text-white"
                />
            </div>

            <div className="animate-float-delay absolute bottom-[20%] left-[8%] opacity-10">
                <Iconify
                    icon="solar:rocket-2-bold-duotone"
                    width={80}
                    className="text-white"
                />
            </div>

            <div className="animate-float-slow absolute left-[15%] top-[40%] opacity-10">
                <Iconify
                    icon="solar:star-bold-duotone"
                    width={50}
                    className="text-white"
                />
            </div>

            {/* Content */}
            <div className="relative z-10 mx-auto w-full max-w-4xl px-4">
                <div className="flex flex-col items-center gap-6 text-center text-white">
                    <span className="text-xs font-semibold uppercase tracking-[3px] opacity-90 md:text-sm">
                        {subtitle ||
                            "Innovative Healthcare Marketing & Trading Solutions"}
                    </span>

                    <h1 className="text-[2.5rem] font-extrabold leading-tight drop-shadow-[0_4px_30px_rgba(0,0,0,0.2)] sm:text-[3rem] md:text-[4rem]">
                        {title || "About Us"}
                    </h1>

                    <Markdown className="max-w-[600px] text-base leading-7 opacity-90 md:text-lg">
                        {description ||
                            "Glow On Cosmetic is a newly established company focused on introducing innovative and high-quality cosmetic products into the market."}
                    </Markdown>
                </div>
            </div>

            <style jsx>{`
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-float-delay {
          animation: float 5s ease-in-out infinite 0.5s;
        }

        .animate-float-slow {
          animation: float 7s ease-in-out infinite 1s;
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }

          50% {
            transform: translateY(-20px);
          }
        }
      `}</style>
        </section>
    );
}