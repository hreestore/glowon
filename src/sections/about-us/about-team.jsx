
"use client";

import { useAppSelector } from "@/redux/hooks";

import { Iconify } from "@/components/iconify";
import { useGetAboutData } from "@/api/about";

// ----------------------------------------------------------------------

const TEAM_COLORS = [
  {
    bg: "rgba(33,150,243,0.12)",
    color: "#2196f3",
    shadow: "rgba(33,150,243,0.4)",
  },
  {
    bg: "rgba(156,39,176,0.12)",
    color: "#9c27b0",
    shadow: "rgba(156,39,176,0.4)",
  },
  {
    bg: "rgba(3,169,244,0.12)",
    color: "#03a9f4",
    shadow: "rgba(3,169,244,0.4)",
  },
  {
    bg: "rgba(76,175,80,0.12)",
    color: "#4caf50",
    shadow: "rgba(76,175,80,0.4)",
  },
  {
    bg: "rgba(255,152,0,0.12)",
    color: "#ff9800",
    shadow: "rgba(255,152,0,0.4)",
  },
  {
    bg: "rgba(244,67,54,0.12)",
    color: "#f44336",
    shadow: "rgba(244,67,54,0.4)",
  },
];

const getInitials = (name) => {
  if (!name) return "??";

  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

export function AboutTeam() {
  const { vendor } = useAppSelector(
    (state) => state.vendor
  );

  const { aboutData } = useGetAboutData();

  const teams = aboutData?.teams || [];

  const primaryColor =
    vendor?.primary_color || "#2563eb";

  return (
    <section className="bg-gray-50 py-6 md:py-10">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex flex-col gap-6">
          {/* Header */}
          <div className="flex flex-col items-center gap-2 text-center">
            <span
              className="text-sm font-bold uppercase tracking-[2px]"
              style={{
                color: primaryColor,
              }}
            >
              Our Team
            </span>

            <h2 className="max-w-[500px] text-3xl font-extrabold text-gray-900 md:text-5xl">
              Meet the

              <span
                className="ml-2"
                style={{
                  color: primaryColor,
                }}
              >
                People
              </span>{" "}
              Behind{" "}
              {vendor?.name ||
                "Glow On Cosmetic"}
            </h2>

            <p className="max-w-[500px] leading-7 text-gray-500">
              A passionate team dedicated
              to delivering the best
              ecommerce experience for
              you.
            </p>
          </div>

          {/* Team Grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
            {teams.map(
              (
                {
                  id,
                  name,
                  designation,
                  featured_image,
                },
                index
              ) => {
                const color =
                  TEAM_COLORS[
                  index %
                  TEAM_COLORS.length
                  ];

                const initials =
                  getInitials(name);

                return (
                  <div
                    key={id}
                    className="group rounded-3xl border border-gray-200 bg-white p-4 text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
                  >
                    <div className="flex flex-col items-center gap-3">
                      {/* Avatar */}
                      {featured_image ? (
                        <img
                          src={featured_image}
                          alt={name}
                          className="team-avatar h-[100px] w-[100px] rounded-full object-cover transition-all duration-300"
                          style={{
                            boxShadow:
                              "none",
                          }}
                          onMouseEnter={(
                            e
                          ) => {
                            e.currentTarget.style.transform =
                              "scale(1.1)";
                            e.currentTarget.style.boxShadow = `0 8px 24px ${color.shadow}`;
                          }}
                          onMouseLeave={(
                            e
                          ) => {
                            e.currentTarget.style.transform =
                              "scale(1)";
                            e.currentTarget.style.boxShadow =
                              "none";
                          }}
                        />
                      ) : (
                        <div
                          className="team-avatar flex h-[100px] w-[100px] items-center justify-center rounded-full text-[1.75rem] font-bold transition-all duration-300"
                          style={{
                            backgroundColor:
                              color.bg,
                            color:
                              color.color,
                          }}
                        >
                          {initials}
                        </div>
                      )}

                      {/* Name */}
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">
                          {name}
                        </h3>

                        <p className="text-sm text-gray-500">
                          {
                            designation
                          }
                        </p>
                      </div>

                      {/* Social Icons */}
                      <div className="social-buttons flex translate-y-[5px] gap-2 opacity-70 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                        <button
                          type="button"
                          className="rounded-full bg-gray-100 p-2 transition-all duration-300 hover:bg-blue-600 hover:text-white"
                        >
                          <Iconify
                            icon="mdi:linkedin"
                            width={18}
                          />
                        </button>

                        <button
                          type="button"
                          className="rounded-full bg-gray-100 p-2 transition-all duration-300 hover:bg-sky-500 hover:text-white"
                        >
                          <Iconify
                            icon="mdi:twitter"
                            width={18}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              }
            )}
          </div>
        </div>
      </div>
    </section>
  );
}