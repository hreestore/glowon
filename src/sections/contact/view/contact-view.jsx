"use client";

import Link from "next/link";
import { ContactHero } from "../contact-hero";
import { ContactForm } from "../contact-form";
import { ContactMap } from "../contact-map";
import { Iconify } from "@/components/iconify";
import { paths } from "@/routes/paths";

// ----------------------------------------------------------------------

export function ContactView() {
  return (
    <div className="relative bg-gradient-to-b from-gray-50/40 via-white to-gray-50/60 min-h-screen">

      {/* Hero Banner Section */}
      <ContactHero />

      {/* Main Interactive Form & Map Grid */}
      <section className="py-12 sm:py-16 md:py-20 relative z-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">

            {/* Contact Form Column */}
            <div className="lg:col-span-6 flex flex-col">
              <ContactForm className="h-full" />
            </div>

            {/* Map Column */}
            <div className="lg:col-span-6 flex flex-col">
              <ContactMap className="h-full" />
            </div>

          </div>

        </div>
      </section>

    </div>
  );
}
