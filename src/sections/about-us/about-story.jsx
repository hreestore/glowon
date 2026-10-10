"use client";

import Link from "next/link";
import { useAppSelector } from "@/redux/hooks";
import { paths } from "@/routes/paths";
import { Iconify } from "@/components/iconify";
import { useGetOurStoryData } from "@/api/about";
import { Markdown } from "@/components/markdown";

export function AboutStory() {
  const { vendor } = useAppSelector((state) => state.vendor);
  const { ourStoryData } = useGetOurStoryData();

  const { title, subtitle, description, featured_image } = ourStoryData;

  const primaryColor = vendor?.primary_color || "#2563eb";
  const secondaryColor = vendor?.secondary_color || "#7c3aed";

  return (
    <section className="bg-gray-50/50 py-12 md:py-20 rounded-[32px] overflow-hidden my-6">
      <div className="mx-auto container px-4 sm:px-6 lg:px-16">
        <div className="grid items-center gap-10 md:grid-cols-12 md:gap-16">
          {/* Image/Illustration Side */}
          <div className="md:col-span-6">
            <div className="md:col-span-6">
              {featured_image ? (
                <div className="relative rounded-[32px] overflow-hidden h-[300px] md:h-[450px]">
                  <img
                    src={featured_image}
                    alt={title || "Featured image"}
                    title={title || "Featured image"}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div
                  className="relative rounded-[32px] overflow-hidden h-[300px] md:h-[450px] border"
                  style={{
                    background: `linear-gradient(135deg, ${primaryColor}20 0%, ${secondaryColor}20 100%)`,
                    borderColor: `${primaryColor}15`,
                  }}
                >
                  {/* Abstract Tech Pattern */}
                  <div
                    className="absolute inset-0 pointer-events-none opacity-40"
                    style={{
                      backgroundImage: `
                    linear-gradient(${primaryColor}10 1px, transparent 1px),
                    linear-gradient(90deg, ${primaryColor}10 1px, transparent 1px)
                  `,
                      backgroundSize: "30px 30px",
                    }}
                  />

                  {/* Central Icon */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div
                      className="p-8 rounded-[50%] bg-white shadow-2xl flex items-center justify-center"
                      style={{
                        boxShadow: `0 20px 60px ${primaryColor}30`,
                      }}
                    >
                      <Iconify
                        icon="solar:shop-2-bold-duotone"
                        width={80}
                        style={{ color: primaryColor }}
                      />
                    </div>
                  </div>

                  {/* Floating Elements */}
                  <div
                    className="animate-float absolute top-[20%] left-[15%] p-3 rounded-2xl bg-white shadow-lg flex items-center justify-center"
                    style={{ animationDelay: "0s" }}
                  >
                    <Iconify icon="solar:cart-check-bold-duotone" width={32} className="text-emerald-500" />
                  </div>

                  <div
                    className="animate-float absolute bottom-[25%] right-[20%] p-3 rounded-2xl bg-white shadow-lg flex items-center justify-center"
                    style={{ animationDelay: "1s" }}
                  >
                    <Iconify icon="solar:shield-check-bold-duotone" width={32} className="text-sky-500" />
                  </div>

                  <div
                    className="animate-float absolute top-[55%] left-[20%] p-3 rounded-2xl bg-white shadow-lg flex items-center justify-center"
                    style={{ animationDelay: "2s" }}
                  >
                    <Iconify icon="solar:star-bold-duotone" width={32} className="text-amber-500" />
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* Content Side */}
          <div className="md:col-span-6">
            <div className="flex flex-col gap-6">
              <div>
                <p
                  className="text-sm font-bold uppercase tracking-[0.2em] mb-2"
                  style={{ color: primaryColor }}
                >
                  {subtitle}
                </p>

                <h2 className="text-3xl font-extrabold leading-tight text-gray-900 md:text-5xl">
                  {title?.split(" ").slice(0, -2).join(" ")}{" "}
                  <span
                    className="inline-block"
                    style={{
                      background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`,
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    {title?.split(" ").slice(-2).join(" ")}
                  </span>
                </h2>
              </div>


              <Markdown className="text-base text-justify leading-8 text-gray-600 md:text-lg" children={description || ""} />


              <div className="pt-2">
                <Link
                  href={paths.category}
                  className="group inline-flex items-center gap-2 rounded-2xl px-6 py-3.5 text-sm font-bold text-white transition-all duration-300 shadow-md hover:-translate-y-0.5"
                  style={{
                    background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`,
                    boxShadow: `0 8px 24px ${primaryColor}40`,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = `0 12px 32px ${primaryColor}60`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = `0 8px 24px ${primaryColor}40`;
                  }}
                >
                  Explore Products
                  <Iconify
                    icon="solar:arrow-right-bold"
                    width={18}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .animate-float {
          animation: float 5s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
      `}</style>
    </section>
  );
}