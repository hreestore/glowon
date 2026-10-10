

"use client";

import { Iconify } from "@/components/iconify";

// ----------------------------------------------------------------------

const FEATURES = [
  {
    icon: "solar:delivery-linear",
    title: "Free Shipping",
    description: "On order above NPR 2500",
  },
  {
    icon: "solar:wallet-money-linear",
    title: "Cash on Delivery",
    description: "Pay when your order arrives",
  },
  {
    icon: "solar:shield-check-linear",
    title: "Secure Payment",
    description: "Pay safely via eSewa & Fonepay",
  },
  {
    icon: "solar:headphones-round-sound-linear",
    title: "Online Support",
    description: "We're here to help you",
  },
];

// ----------------------------------------------------------------------

export function HomeTechFeatures() {
  return (
    <section className="lg:my-6 my-2 px-3 md:px-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {FEATURES.map((feature, index) => (
          <div
            key={index}
            className="flex flex-row items-center gap-4 rounded-2xl border border-gray-200 bg-white p-5 transition-all duration-300 hover:shadow-md"
          >
            {/* Icon */}
            <div className="flex items-center justify-center text-gray-900">
              <Iconify icon={feature.icon} width={36} />
            </div>

            {/* Content */}
            <div className="flex flex-col justify-center">
              <h3 className="text-[0.95rem] font-bold text-gray-900">
                {feature.title}
              </h3>

              {/* Pink Divider */}
              <div className="my-1.5 h-[1px] w-6 bg-pink-500" />

              <p className="text-[0.8rem] text-gray-500">
                {feature.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}