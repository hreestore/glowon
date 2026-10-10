"use client";

import { PrivacyHero } from "../privacy-hero";
import { PrivacyPolicy } from "../privacy-policy";

// ----------------------------------------------------------------------

export function PolicyView() {
  return (
    <div className="relative bg-gradient-to-b from-gray-50/40 via-white to-gray-50/60 min-h-screen">
      <PrivacyHero />
      <PrivacyPolicy />
    </div>
  );
}

export default PolicyView;