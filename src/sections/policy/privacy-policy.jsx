"use client";

import { useState } from "react";
import Link from "next/link";
import { Iconify } from "@/components/iconify";
import { useAppSelector } from "@/redux/hooks";
import { paths } from "@/routes/paths";

// ----------------------------------------------------------------------

const POLICY_SECTIONS = [
  { id: "overview", title: "1. Overview & Scope", icon: "solar:shield-check-bold-duotone" },
  { id: "collection", title: "2. Information We Collect", icon: "solar:user-id-bold-duotone" },
  { id: "usage", title: "3. How We Use Information", icon: "solar:tuning-square-2-bold-duotone" },
  { id: "cookies", title: "4. Cookies & Tracking", icon: "solar:database-bold-duotone" },
  { id: "sharing", title: "5. Third-Party Sharing", icon: "solar:users-group-two-rounded-bold-duotone" },
  { id: "security", title: "6. Data Security & Storage", icon: "solar:lock-keyhole-bold-duotone" },
  { id: "retention", title: "7. Data Retention & Deletion", icon: "solar:trash-bin-trash-bold-duotone" },
  { id: "rights", title: "8. Your Privacy Rights", icon: "solar:key-bold-duotone" },
  { id: "children", title: "9. Children's Privacy", icon: "solar:user-heart-bold-duotone" },
  { id: "updates", title: "10. Policy Updates", icon: "solar:refresh-circle-bold-duotone" },
  { id: "contact", title: "11. Contact Privacy Officer", icon: "solar:letter-bold-duotone" },
];

export function PrivacyPolicy({ className = "", ...other }) {
  const vendor = useAppSelector((state) => state.vendor?.vendor);
  const [activeSection, setActiveSection] = useState("overview");

  const vendorName = vendor?.vendor_name || "Glowon";
  const privacyEmail = "info@glowon.com.np";
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
                  <Iconify icon="solar:shield-check-bold-duotone" width={20} className="text-emerald-600" />
                  <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                    Privacy Navigation
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={handlePrint}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold text-gray-600 bg-gray-50 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                  title="Print policy"
                >
                  <Iconify icon="solar:printer-minimalistic-bold-duotone" width={15} />
                  <span>Print</span>
                </button>
              </div>

              <nav className="space-y-1 max-h-[480px] overflow-y-auto pr-1">
                {POLICY_SECTIONS.map((sec) => {
                  const isActive = activeSection === sec.id;
                  return (
                    <button
                      key={sec.id}
                      type="button"
                      onClick={() => scrollToSection(sec.id)}
                      className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-left text-xs sm:text-sm font-medium transition-all duration-200 ${
                        isActive
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

            {/* Quick Contact Callout */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-50/70 via-emerald-50/30 to-teal-50/50 border border-emerald-100/70 shadow-sm">
              <div className="flex items-center gap-2.5 mb-2">
                <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-emerald-600 text-white shadow-sm">
                  <Iconify icon="solar:shield-user-bold-duotone" width={18} />
                </div>
                <h3 className="text-sm font-bold text-gray-900">
                  Data Privacy Questions?
                </h3>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed mb-4">
                Want to request your data or request deletion? Reach out anytime to our data officer.
              </p>
              <div className="space-y-2">
                <Link
                  href={paths.contact}
                  className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-gray-900 text-white text-xs font-bold shadow-sm hover:bg-gray-800 transition-all"
                >
                  <Iconify icon="solar:letter-bold" width={14} />
                  <span>Contact Data Officer</span>
                </Link>
              </div>
            </div>

          </aside>

          {/* Right Main Content */}
          <main className="lg:col-span-8 space-y-8">

            {/* Privacy Commitment Banner */}
            <div className="p-6 sm:p-7 rounded-3xl bg-white border border-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.03)] flex flex-col sm:flex-row items-start gap-4">
              <div className="flex items-center justify-center w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 shrink-0 border border-emerald-200/50">
                <Iconify icon="solar:shield-check-bold-duotone" width={24} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-bold text-gray-900">
                  Our Privacy Commitment
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 mt-1 leading-relaxed">
                  At <strong>{vendorName}</strong>, your privacy and trust are paramount. We do not sell your personal data to third-party advertisers. All customer data is secured with enterprise-grade encryption.
                </p>
              </div>
            </div>

            {/* Section 1 */}
            <article id="overview" className="p-7 sm:p-9 rounded-[2rem] bg-white border border-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.03)] space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
                <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600">
                  <Iconify icon="solar:shield-check-bold-duotone" width={20} />
                </div>
                <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">
                  1. Overview & Scope
                </h2>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                This Privacy Policy describes the policies and practices of <strong>{vendorName}</strong> regarding the collection, storage, processing, and protection of personal data gathered through our websites, mobile applications, checkouts, and customer services.
              </p>
            </article>

            {/* Section 2 */}
            <article id="collection" className="p-7 sm:p-9 rounded-[2rem] bg-white border border-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.03)] space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
                <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600">
                  <Iconify icon="solar:user-id-bold-duotone" width={20} />
                </div>
                <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">
                  2. Information We Collect
                </h2>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                We collect information you provide directly to us as well as automated diagnostic signals:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 text-xs text-gray-700 space-y-1">
                  <p className="font-bold text-gray-900 flex items-center gap-1.5">
                    <Iconify icon="solar:user-bold" width={14} className="text-emerald-600" />
                    Personal & Contact Info
                  </p>
                  <p>Full name, email address, phone number, delivery address, and account credentials.</p>
                </div>
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 text-xs text-gray-700 space-y-1">
                  <p className="font-bold text-gray-900 flex items-center gap-1.5">
                    <Iconify icon="solar:card-bold" width={14} className="text-emerald-600" />
                    Transaction & Order Data
                  </p>
                  <p>Order history, purchased cosmetic products, invoices, and payment confirmations.</p>
                </div>
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 text-xs text-gray-700 space-y-1">
                  <p className="font-bold text-gray-900 flex items-center gap-1.5">
                    <Iconify icon="solar:laptop-bold" width={14} className="text-emerald-600" />
                    Device & Log Details
                  </p>
                  <p>IP address, browser type, device identifiers, and pages visited on our store.</p>
                </div>
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 text-xs text-gray-700 space-y-1">
                  <p className="font-bold text-gray-900 flex items-center gap-1.5">
                    <Iconify icon="solar:chat-round-bold" width={14} className="text-emerald-600" />
                    Customer Support Messages
                  </p>
                  <p>Inquiries, feedback, reviews, and correspondence submitted via our contact forms.</p>
                </div>
              </div>
            </article>

            {/* Section 3 */}
            <article id="usage" className="p-7 sm:p-9 rounded-[2rem] bg-white border border-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.03)] space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
                <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600">
                  <Iconify icon="solar:tuning-square-2-bold-duotone" width={20} />
                </div>
                <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">
                  3. How We Use Your Information
                </h2>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                We use the information we collect strictly for legitimate commercial and customer fulfillment purposes:
              </p>
              <ul className="space-y-2 text-sm text-gray-600 list-disc list-inside pl-2">
                <li>Processing and fulfilling your orders, invoices, and shipment tracking.</li>
                <li>Providing seamless customer support and handling order inquiries.</li>
                <li>Personalizing product recommendations based on your preferences.</li>
                <li>Preventing fraudulent transactions and ensuring overall platform integrity.</li>
                <li>Sending transactional order updates and optional marketing communications (which you can opt-out from anytime).</li>
              </ul>
            </article>

            {/* Section 4 */}
            <article id="cookies" className="p-7 sm:p-9 rounded-[2rem] bg-white border border-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.03)] space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
                <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600">
                  <Iconify icon="solar:database-bold-duotone" width={20} />
                </div>
                <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">
                  4. Cookies & Tracking Technologies
                </h2>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                We use essential cookies to maintain your active shopping cart, remember your session authentication, and analyze site performance. You can manage or disable non-essential cookies via your browser settings.
              </p>
            </article>

            {/* Section 5 */}
            <article id="sharing" className="p-7 sm:p-9 rounded-[2rem] bg-white border border-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.03)] space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
                <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600">
                  <Iconify icon="solar:users-group-two-rounded-bold-duotone" width={20} />
                </div>
                <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">
                  5. Third-Party Service Providers
                </h2>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                We only disclose necessary data to verified operational partners strictly bound by confidentiality:
              </p>
              <ul className="space-y-2 text-sm text-gray-600 list-disc list-inside pl-2">
                <li><strong>Delivery & Logistics Partners:</strong> To transport and deliver orders to your shipping address.</li>
                <li><strong>Payment Processors:</strong> To securely process payments without storing sensitive raw card details on our servers.</li>
                <li><strong>Cloud Infrastructure & Hosting:</strong> Encrypted data storage and database management.</li>
              </ul>
            </article>

            {/* Section 6 */}
            <article id="security" className="p-7 sm:p-9 rounded-[2rem] bg-white border border-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.03)] space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
                <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600">
                  <Iconify icon="solar:lock-keyhole-bold-duotone" width={20} />
                </div>
                <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">
                  6. Data Security & Encryption
                </h2>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                We employ industry-standard administrative, technical, and physical safeguards—including SSL encryption, tokenization, and multi-layer firewalls—to protect against unauthorized access, loss, or alteration of your personal data.
              </p>
            </article>

            {/* Section 7 */}
            <article id="retention" className="p-7 sm:p-9 rounded-[2rem] bg-white border border-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.03)] space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
                <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600">
                  <Iconify icon="solar:trash-bin-trash-bold-duotone" width={20} />
                </div>
                <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">
                  7. Data Retention & Account Deletion
                </h2>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                We retain personal information only for as long as needed to fulfill orders, comply with tax and accounting laws, and resolve disputes. You may request account deletion or data anonymization at any time by contacting our support desk.
              </p>
            </article>

            {/* Section 8 */}
            <article id="rights" className="p-7 sm:p-9 rounded-[2rem] bg-white border border-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.03)] space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
                <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600">
                  <Iconify icon="solar:key-bold-duotone" width={20} />
                </div>
                <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">
                  8. Your Rights & Choices
                </h2>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                You possess full rights regarding your data:
              </p>
              <ul className="space-y-2 text-sm text-gray-600 list-disc list-inside pl-2">
                <li><strong>Access & Portability:</strong> Request a copy of the personal information we hold about you.</li>
                <li><strong>Correction:</strong> Update or rectify incomplete or inaccurate profile details.</li>
                <li><strong>Opt-Out:</strong> Unsubscribe from marketing promotions with a single click in any newsletter.</li>
              </ul>
            </article>

            {/* Section 9 */}
            <article id="children" className="p-7 sm:p-9 rounded-[2rem] bg-white border border-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.03)] space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
                <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600">
                  <Iconify icon="solar:user-heart-bold-duotone" width={20} />
                </div>
                <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">
                  9. Children's Privacy
                </h2>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                Our services and cosmetics store are not directed to individuals under the age of 16. We do not knowingly collect personal data from children without parental consent.
              </p>
            </article>

            {/* Section 10 */}
            <article id="updates" className="p-7 sm:p-9 rounded-[2rem] bg-white border border-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.03)] space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
                <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600">
                  <Iconify icon="solar:refresh-circle-bold-duotone" width={20} />
                </div>
                <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">
                  10. Changes to This Policy
                </h2>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                We may periodically update this Privacy Policy to reflect advancements in technology or changes in legal regulations. Any revisions will be published on this page with an updated revision date.
              </p>
            </article>

            {/* Section 11 */}
            <article id="contact" className="p-7 sm:p-9 rounded-[2rem] bg-gradient-to-br from-gray-900 via-gray-900 to-teal-950 text-white shadow-xl space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-white/15">
                <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-white/15 text-white">
                  <Iconify icon="solar:letter-bold-duotone" width={20} />
                </div>
                <h2 className="text-xl font-extrabold text-white tracking-tight">
                  11. Contact Our Data Protection Desk
                </h2>
              </div>
              <p className="text-sm text-white/85 leading-relaxed">
                If you have questions, data deletion requests, or concerns about your privacy, reach out to our team:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3.5 rounded-2xl bg-white/10 border border-white/15">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-white/60">Data Privacy Officer</p>
                  <a href={`mailto:${privacyEmail}`} className="text-sm font-semibold text-white hover:underline mt-0.5 block">
                    {privacyEmail}
                  </a>
                </div>
                <div className="p-3.5 rounded-2xl bg-white/10 border border-white/15">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-white/60">Corporate Inquiries</p>
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
