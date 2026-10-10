"use client";

import { useState } from "react";
import Link from "next/link";
import { Iconify } from "@/components/iconify";
import { useAppSelector } from "@/redux/hooks";
import { paths } from "@/routes/paths";

// ----------------------------------------------------------------------

const SECTIONS = [
    { id: "acceptance", title: "1. Acceptance of Terms", icon: "solar:check-circle-bold-duotone" },
    { id: "accounts", title: "2. User Accounts & Registration", icon: "solar:user-circle-bold-duotone" },
    { id: "products", title: "3. Products & Pricing", icon: "solar:tag-price-bold-duotone" },
    { id: "orders", title: "4. Orders & Payment Methods", icon: "solar:card-bold-duotone" },
    { id: "shipping", title: "5. Shipping & Delivery", icon: "solar:delivery-bold-duotone" },
    { id: "returns", title: "6. Returns & Refunds", icon: "solar:restart-bold-duotone" },
    { id: "conduct", title: "7. User Conduct & Usage", icon: "solar:shield-warning-bold-duotone" },
    { id: "ip", title: "8. Intellectual Property", icon: "solar:copyright-bold-duotone" },
    { id: "liability", title: "9. Limitation of Liability", icon: "solar:danger-triangle-bold-duotone" },
    { id: "governing", title: "10. Governing Law & Jurisdiction", icon: "solar:scale-bold-duotone" },
    { id: "contact", title: "11. Contact & Legal Notices", icon: "solar:letter-bold-duotone" },
];

export function TermsConditions({ className = "", ...other }) {
    const vendor = useAppSelector((state) => state.vendor?.vendor);
    const [activeSection, setActiveSection] = useState("acceptance");

    const vendorName = vendor?.vendor_name || "Glowon";
    const vendorEmail = "info@glowon.com.np";
    const prEmail = "pr@glowon.com.np";
    const vendorPhone = vendor?.contact_info || "+977-9800000000";
    const vendorAddress = vendor?.address || "Kathmandu, Nepal";

    const scrollToSection = (id) => {
        setActiveSection(id);
        const element = document.getElementById(id);
        if (element) {
            const yOffset = -100;
            const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: "smooth" });
        }
    };

    const handlePrint = () => {
        if (typeof window !== "undefined") {
            window.print();
        }
    };

    return (
        <section className={`py-12 sm:py-16 md:py-20 relative z-10 ${className}`} {...other}>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

                    {/* Left Sticky Sidebar (Table of Contents) */}
                    <aside className="lg:col-span-4 sticky top-28 space-y-5">

                        {/* TOC Card */}
                        <div className="p-6 rounded-3xl bg-white border border-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.04)]">

                            <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-100">
                                <div className="flex items-center gap-2">
                                    <Iconify icon="solar:list-check-bold-duotone" width={20} className="text-indigo-600" />
                                    <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                                        Table of Contents
                                    </h2>
                                </div>
                                {/* <button
                  type="button"
                  onClick={handlePrint}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold text-gray-600 bg-gray-50 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                  title="Print terms"
                >
                  <Iconify icon="solar:printer-minimalistic-bold-duotone" width={15} />
                  <span>Print</span>
                </button> */}
                            </div>

                            <nav className="space-y-1 max-h-[480px] overflow-y-auto pr-1">
                                {SECTIONS.map((sec) => {
                                    const isActive = activeSection === sec.id;
                                    return (
                                        <button
                                            key={sec.id}
                                            type="button"
                                            onClick={() => scrollToSection(sec.id)}
                                            className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-left text-xs sm:text-sm font-medium transition-all duration-200 ${isActive
                                                ? "bg-gray-900 text-white font-semibold shadow-sm translate-x-1"
                                                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                                                }`}
                                        >
                                            <Iconify
                                                icon={sec.icon}
                                                width={16}
                                                className={isActive ? "text-white" : "text-gray-400"}
                                            />
                                            <span className="truncate">{sec.title}</span>
                                        </button>
                                    );
                                })}
                            </nav>

                        </div>

                        {/* Quick Contact / Support Callout */}
                        <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-50/70 via-indigo-50/30 to-purple-50/50 border border-indigo-100/70 shadow-sm">
                            <div className="flex items-center gap-2.5 mb-2">
                                <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-indigo-600 text-white shadow-sm">
                                    <Iconify icon="solar:chat-round-call-bold-duotone" width={18} />
                                </div>
                                <h3 className="text-sm font-bold text-gray-900">
                                    Questions about Terms?
                                </h3>
                            </div>
                            <p className="text-xs text-gray-600 leading-relaxed mb-4">
                                Our support and legal assistance desk is ready to clarify any inquiries.
                            </p>
                            <div className="space-y-2">
                                <Link
                                    href={paths.contact}
                                    className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-gray-900 text-white text-xs font-bold shadow-sm hover:bg-gray-800 transition-all"
                                >
                                    <Iconify icon="solar:letter-bold" width={14} />
                                    <span>Contact Support</span>
                                </Link>
                            </div>
                        </div>

                    </aside>

                    {/* Right Main Content */}
                    <main className="lg:col-span-8 space-y-8">

                        {/* Introductory Notice Banner */}
                        <div className="p-6 sm:p-7 rounded-3xl bg-white border border-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.03)] flex flex-col sm:flex-row items-start gap-4">
                            <div className="flex items-center justify-center w-11 h-11 rounded-2xl bg-amber-50 text-amber-600 shrink-0 border border-amber-200/50">
                                <Iconify icon="solar:info-circle-bold-duotone" width={24} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="text-base font-bold text-gray-900">
                                    Important Notice Before You Begin
                                </h3>
                                <p className="text-xs sm:text-sm text-gray-600 mt-1 leading-relaxed">
                                    By accessing or purchasing from <strong>{vendorName}</strong>, you agree to be bound by the terms outlined below. If you do not agree with any part of these terms, please discontinue use of our site.
                                </p>
                            </div>
                        </div>

                        {/* Section 1 */}
                        <article id="acceptance" className="p-7 sm:p-9 rounded-[2rem] bg-white border border-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.03)] space-y-4">
                            <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
                                <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600">
                                    <Iconify icon="solar:check-circle-bold-duotone" width={20} />
                                </div>
                                <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">
                                    1. Acceptance of Terms
                                </h2>
                            </div>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                These Terms and Conditions constitute a legally binding agreement between you and <strong>{vendorName}</strong> governing your access to and use of our website, mobile interface, APIs, and online retail store.
                            </p>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                We reserve the right to revise or update these terms at any time. Your continued use of the website following the posting of updated terms signifies your agreement and acceptance of such changes.
                            </p>
                        </article>

                        {/* Section 2 */}
                        <article id="accounts" className="p-7 sm:p-9 rounded-[2rem] bg-white border border-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.03)] space-y-4">
                            <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
                                <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600">
                                    <Iconify icon="solar:user-circle-bold-duotone" width={20} />
                                </div>
                                <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">
                                    2. User Accounts & Security
                                </h2>
                            </div>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                When you create an account on our platform, you agree to:
                            </p>
                            <ul className="space-y-2 text-sm text-gray-600 list-disc list-inside pl-2">
                                <li>Provide accurate, current, and complete registration information.</li>
                                <li>Maintain the confidentiality of your login credentials and passwords.</li>
                                <li>Promptly notify us of any unauthorized use or security breach of your account.</li>
                                <li>Accept responsibility for all activities that occur under your authenticated account.</li>
                            </ul>
                        </article>

                        {/* Section 3 */}
                        <article id="products" className="p-7 sm:p-9 rounded-[2rem] bg-white border border-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.03)] space-y-4">
                            <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
                                <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600">
                                    <Iconify icon="solar:tag-price-bold-duotone" width={20} />
                                </div>
                                <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">
                                    3. Product Descriptions & Pricing
                                </h2>
                            </div>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                We make every effort to display the colors, features, and specifications of our cosmetics and products as accurately as possible. However, we cannot guarantee that your device display will accurately reflect actual colors.
                            </p>
                            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200/70 text-xs sm:text-sm text-gray-700 space-y-1">
                                <p className="font-semibold text-gray-900">Pricing & Availability:</p>
                                <p>All prices are quoted in Nepalese Rupees (NPR) unless specified otherwise. Prices and availability are subject to change without prior notice.</p>
                            </div>
                        </article>

                        {/* Section 4 */}
                        <article id="orders" className="p-7 sm:p-9 rounded-[2rem] bg-white border border-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.03)] space-y-4">
                            <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
                                <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600">
                                    <Iconify icon="solar:card-bold-duotone" width={20} />
                                </div>
                                <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">
                                    4. Orders & Payment Methods
                                </h2>
                            </div>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                When you place an order, you agree that your order represents an offer to purchase the specified items. We reserve the right to accept, reject, or cancel any order for reasons including inventory shortages, pricing inaccuracies, or suspected fraud.
                            </p>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                We support secure electronic payment methods (e.g. digital wallets, cards, online banking) as well as Cash on Delivery (COD) for eligible areas.
                            </p>
                        </article>

                        {/* Section 5 */}
                        <article id="shipping" className="p-7 sm:p-9 rounded-[2rem] bg-white border border-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.03)] space-y-4">
                            <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
                                <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600">
                                    <Iconify icon="solar:delivery-bold-duotone" width={20} />
                                </div>
                                <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">
                                    5. Shipping & Delivery
                                </h2>
                            </div>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                Delivery estimates are provided at checkout. While we strive to meet all delivery timelines, transit times may vary depending on destination location, weather, and logistics partners.
                            </p>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                Risk of loss and title for products pass to you upon delivery by the carrier to your designated delivery address.
                            </p>
                        </article>

                        {/* Section 6 */}
                        <article id="returns" className="p-7 sm:p-9 rounded-[2rem] bg-white border border-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.03)] space-y-4">
                            <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
                                <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600">
                                    <Iconify icon="solar:restart-bold-duotone" width={20} />
                                </div>
                                <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">
                                    6. Returns, Replacements & Refunds
                                </h2>
                            </div>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                Eligible unopened, sealed, and undamaged cosmetic products can be requested for replacement or return within our specified return window (typically within 7 days of delivery).
                            </p>
                            <div className="p-4 rounded-2xl bg-rose-50/60 border border-rose-100 text-xs sm:text-sm text-rose-900 space-y-1">
                                <p className="font-semibold text-rose-900">Hygiene & Safety Policy:</p>
                                <p>For hygiene and health safety reasons, opened, unsealed, or used cosmetics and personal care products cannot be returned unless verified as defective or damaged upon arrival.</p>
                            </div>
                        </article>

                        {/* Section 7 */}
                        <article id="conduct" className="p-7 sm:p-9 rounded-[2rem] bg-white border border-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.03)] space-y-4">
                            <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
                                <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600">
                                    <Iconify icon="solar:shield-warning-bold-duotone" width={20} />
                                </div>
                                <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">
                                    7. Prohibited User Conduct
                                </h2>
                            </div>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                You agree not to engage in any prohibited activities, including:
                            </p>
                            <ul className="space-y-2 text-sm text-gray-600 list-disc list-inside pl-2">
                                <li>Using our platform for any unlawful, fraudulent, or malicious purpose.</li>
                                <li>Attempting to interfere with, disrupt, or compromise the system security or integrity.</li>
                                <li>Using automated data scraping, crawling, or extracting tools without written consent.</li>
                                <li>Impersonating another individual or providing false contact/billing information.</li>
                            </ul>
                        </article>

                        {/* Section 8 */}
                        <article id="ip" className="p-7 sm:p-9 rounded-[2rem] bg-white border border-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.03)] space-y-4">
                            <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
                                <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600">
                                    <Iconify icon="solar:copyright-bold-duotone" width={20} />
                                </div>
                                <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">
                                    8. Intellectual Property
                                </h2>
                            </div>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                All content on this site—including text, brand graphics, product photography, logos, icons, user interfaces, code, and design—is the intellectual property of <strong>{vendorName}</strong> or its brand partners and is protected by applicable copyright and trademark laws.
                            </p>
                        </article>

                        {/* Section 9 */}
                        <article id="liability" className="p-7 sm:p-9 rounded-[2rem] bg-white border border-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.03)] space-y-4">
                            <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
                                <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600">
                                    <Iconify icon="solar:danger-triangle-bold-duotone" width={20} />
                                </div>
                                <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">
                                    9. Limitation of Liability
                                </h2>
                            </div>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                To the fullest extent permitted by law, <strong>{vendorName}</strong> and its affiliates shall not be liable for any indirect, incidental, special, or consequential damages resulting from the use of, or inability to use, our services or purchased items.
                            </p>
                        </article>

                        {/* Section 10 */}
                        <article id="governing" className="p-7 sm:p-9 rounded-[2rem] bg-white border border-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.03)] space-y-4">
                            <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
                                <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600">
                                    <Iconify icon="solar:scale-bold-duotone" width={20} />
                                </div>
                                <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">
                                    10. Governing Law & Jurisdiction
                                </h2>
                            </div>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                These Terms shall be governed by and construed in accordance with the laws of Nepal. Any legal dispute or claim arising out of or related to these terms shall be subject to the exclusive jurisdiction of the competent courts in Kathmandu, Nepal.
                            </p>
                        </article>

                        {/* Section 11 */}
                        <article id="contact" className="p-7 sm:p-9 rounded-[2rem] bg-gradient-to-br from-gray-900 via-gray-900 to-indigo-950 text-white shadow-xl space-y-4">
                            <div className="flex items-center gap-3 pb-3 border-b border-white/15">
                                <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-white/15 text-white">
                                    <Iconify icon="solar:letter-bold-duotone" width={20} />
                                </div>
                                <h2 className="text-xl font-extrabold text-white tracking-tight">
                                    11. Contact & Legal Notices
                                </h2>
                            </div>
                            <p className="text-sm text-white/85 leading-relaxed">
                                For questions, legal notices, or feedback regarding these terms, please contact our administrative team:
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                                <div className="p-3.5 rounded-2xl bg-white/10 border border-white/15">
                                    <p className="text-[11px] font-bold uppercase tracking-wider text-white/60">General Legal Inquiries</p>
                                    <a href={`mailto:${vendorEmail}`} className="text-sm font-semibold text-white hover:underline mt-0.5 block">
                                        {vendorEmail}
                                    </a>
                                </div>
                                <div className="p-3.5 rounded-2xl bg-white/10 border border-white/15">
                                    <p className="text-[11px] font-bold uppercase tracking-wider text-white/60">Wholesale & PR</p>
                                    <a href={`mailto:${prEmail}`} className="text-sm font-semibold text-white hover:underline mt-0.5 block">
                                        {prEmail}
                                    </a>
                                </div>
                            </div>
                            <p className="text-xs text-white/60 pt-2">
                                Address: {vendorAddress} • Phone: {vendorPhone}
                            </p>
                        </article>

                    </main>

                </div>

            </div>
        </section>
    );
}
