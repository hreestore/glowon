"use client";

import { TermsHero } from "../terms-hero";
import { TermsConditions } from "../terms-conditions";

// ----------------------------------------------------------------------

export function TermsView() {
  return (
    <div className="relative bg-gradient-to-b from-gray-50/40 via-white to-gray-50/60 min-h-screen">
      <TermsHero />
      <TermsConditions />
    </div>
  );
}

export default TermsView;