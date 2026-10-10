
"use client";

import { useAppSelector } from "@/redux/hooks";

import { Iconify } from "@/components/iconify";
import { useGetAboutData } from "@/api/about";
import { Markdown } from "@/components/markdown";

// ----------------------------------------------------------------------

// Helper to get initials from name
const getInitials = (name) => {
  if (!name) return "??";

  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

export function AboutOwner() {
  const { aboutData } = useGetAboutData();

  const messages = aboutData?.message || [];

  const { vendor } = useAppSelector(
    (state) => state.vendor
  );

  const primaryColor =
    vendor?.primary_color || "#2563eb";

  const secondaryColor =
    vendor?.secondary_color || "#7c3aed";

  // If no messages, don't render the section
  if (!messages.length) return null;

  return (
    <section className="relative mb-6 overflow-hidden py-6 md:py-8">
      {/* Background Decoration */}
      <div
        className="pointer-events-none absolute right-[-10%] top-1/2 h-[400px] w-[400px] -translate-y-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(37,99,235,0.08) 0%, transparent 70%)",
        }}
      />

      <div className="mx-auto max-w-6xl px-4">
        <div className="space-y-10">
          {messages.map((person, index) => {
            const isReversed = index % 2 !== 0;

            return (
              <div
                key={person.id}
                className={`grid items-center gap-8 md:grid-cols-12 ${isReversed ? "md:[direction:rtl]" : ""
                  }`}
              >
                {/* Image Section */}
                <div className="md:col-span-5">
                  <div className="relative flex justify-center">
                    {/* Main Avatar */}
                    <div
                      className="relative rounded-full p-1"
                      style={{
                        background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`,
                      }}
                    >
                      {person.featured_image ? (
                        <img
                          src={person.featured_image}
                          alt={person.name}
                          className="h-[220px] w-[220px] rounded-full border-4 border-white object-cover md:h-[280px] md:w-[280px]"
                        />
                      ) : (
                        <div
                          className="flex h-[220px] w-[220px] items-center justify-center rounded-full border-4 border-white bg-white text-5xl font-extrabold md:h-[280px] md:w-[280px] md:text-7xl"
                          style={{
                            color: primaryColor,
                          }}
                        >
                          {getInitials(person.name)}
                        </div>
                      )}
                    </div>

                    {/* Floating Icon 1 */}
                    <div
                      className={`absolute top-[10%] animate-float rounded-xl bg-white p-3 shadow-xl ${isReversed
                        ? "right-[10%]"
                        : "left-[10%]"
                        }`}
                    >
                      <Iconify
                        icon="solar:star-bold-duotone"
                        width={24}
                        className="text-amber-500"
                      />
                    </div>

                    {/* Floating Icon 2 */}
                    <div
                      className={`absolute bottom-[15%] animate-float-delay rounded-xl bg-white p-3 shadow-xl ${isReversed
                        ? "left-[5%]"
                        : "right-[5%]"
                        }`}
                    >
                      <Iconify
                        icon="solar:verified-check-bold-duotone"
                        width={24}
                        className="text-green-500"
                      />
                    </div>

                    {/* Floating Icon 3 */}
                    <div
                      className={`absolute top-[60%] animate-float-slow rounded-xl bg-white p-3 shadow-xl ${isReversed
                        ? "right-[5%]"
                        : "left-[5%]"
                        }`}
                    >
                      <Iconify
                        icon="solar:cup-star-bold-duotone"
                        width={24}
                        className="text-sky-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Content Section */}
                <div className="md:col-span-7 md:[direction:ltr]">
                  <div className="space-y-4">
                    {/* Section Label */}
                    <div>
                      <p
                        className="text-sm font-bold uppercase tracking-[2px]"
                        style={{
                          color: primaryColor,
                        }}
                      >
                        {index === 0
                          ? "Meet Our Founder"
                          : "Leadership Team"}
                      </p>

                      <h2 className="mt-1 text-3xl font-extrabold leading-tight text-gray-900 md:text-5xl">
                        {index === 0
                          ? "The Visionary Behind"
                          : "Driving Excellence at"}

                        <span
                          className="block"
                          style={{
                            background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`,
                            WebkitBackgroundClip:
                              "text",
                            WebkitTextFillColor:
                              "transparent",
                            backgroundClip: "text",
                          }}
                        >
                          {vendor?.name ||
                            "Glow On Cosmetic"}
                        </span>
                      </h2>
                    </div>

                    {/* Name & Designation */}
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">
                        {person.name ||
                          "Team Member"}
                      </h3>

                      <p
                        className="font-semibold"
                        style={{
                          color: primaryColor,
                        }}
                      >
                        {person.designation ||
                          "Leadership"}
                      </p>
                    </div>

                    {/* Message */}
                    <Markdown
                      className="border-l-4 pl-4 text-[1.05rem] italic leading-[1.9] text-gray-600"
                      style={{
                        borderColor: primaryColor,
                      }}
                    >
                      {person.message ||
                        person.description ||
                        "Leading with passion and dedication."}
                    </Markdown>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }

        .animate-float-delay {
          animation: float 5s ease-in-out infinite
            0.5s;
        }

        .animate-float-slow {
          animation: float 6s ease-in-out infinite
            1s;
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(-10px);
          }
        }
      `}</style>
    </section>
  );
}