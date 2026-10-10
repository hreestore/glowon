import React from "react";

import { paths } from "@/routes/paths";
import { RouterLink } from "@/routes/components";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setBrand, setCategory } from "@/redux/actions";

import { FacebookIcon, LinkedinIcon, InstagramIcon, TikTokIcon, WhatsAppIcon } from "@/assets/icons";

import { Logo } from "@/components/logo";
import { Iconify } from "@/components/iconify";

import { useGetBrands, useGetHomeRecentProducts } from "@/api";
import { useGetSocialMediaData } from "@/api/social-media";
import Link from "next/link";

// ----------------------------------------------------------------------

const LEGAL_SECTIONS = [
  { name: "Terms and condition", href: paths.terms },
  { name: "Privacy policy", href: paths.policy },
];

// ----------------------------------------------------------------------

export function Footer({ className = "", layoutQuery = "md", pages, categories, ...other }) {
  const dispatch = useAppDispatch();
  const { vendor } = useAppSelector((state) => state.vendor);
  const { brands } = useGetBrands();
  const { recentProducts } = useGetHomeRecentProducts();
  const { socialMediaData } = useGetSocialMediaData();
  const email = "info@glowon.com.np"


  const handleClickBrand = (brandId) => {
    dispatch(setBrand([brandId]));
    dispatch(setCategory(""));
  };

  const handleClickCategory = (categoryId) => {
    dispatch(setCategory(categoryId));
  };

  const footerBg =
    vendor?.secondary_color && vendor?.primary_color
      ? `linear-gradient(135deg, ${vendor.secondary_color} 0%, ${vendor.primary_color} 100%)`
      : vendor?.secondary_color
        ? `linear-gradient(135deg, ${vendor.secondary_color} 0%, ${vendor.secondary_color}dd 100%)`
        : `linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)`;

  // Shared footer link style (arrow hover animation)
  const footerLinkClass =
    "group relative inline-block max-w-full break-words text-sm text-white/90 no-underline transition-all duration-200 hover:text-white lg:hover:pl-6";

  const footerLinkArrow = (
    <span className="absolute left-0 hidden lg:block opacity-0 transition-all duration-200 group-hover:opacity-100 group-hover:left-1">
      →
    </span>
  );

  // Shared section heading style
  const headingClass =
    "self-center lg:self-start font-bold text-white pb-1 border-b-2 border-white/30 inline-block text-[0.95rem] sm:text-[1rem] lg:text-[1.15rem] xl:text-[1.2rem]";

  return (
    <footer
      className={`relative overflow-hidden pt-6 pb-[calc(1.5rem+var(--layout-nav-mobile-bottom-height,0px))] md:py-10 ${className}`}
      style={{ background: footerBg, color: "white" }}
      {...other}
    >
      {/* ::before overlay */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.08) 0%, transparent 50%)",
        }}
      />
      {/* ::after overlay */}
      <div
        className="pointer-events-none absolute top-0 right-0 h-full w-[40%]"
        style={{
          background:
            "radial-gradient(circle at 80% 50%, rgba(255, 255, 255, 0.05) 0%, transparent 50%)",
        }}
      />

      {/* Container */}
      <div className="mx-auto container px-4 sm:px-6 lg:px-8 py-6 relative z-10 flex flex-col gap-5 text-center lg:text-left">

        {/* ── Row 1: Logo col + Links col ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 pb-7">

          {/* Logo + description + socials — col span 4 */}
          <div className="lg:col-span-4 md:col-span-6 flex flex-col gap-3 items-center lg:items-start">
            {/* Logo box */}
            <div
              className="inline-block p-2.5 rounded-2xl border border-white/20"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                backdropFilter: "blur(10px)",
              }}
            >
              <Logo />
            </div>

            {/* Description */}
            <p
              className="mx-auto lg:mx-0 max-w-[420px] lg:max-w-[320px] text-sm leading-[1.8] text-center lg:text-justify"
              style={{ color: "rgba(255, 255, 255, 0.95)" }}
            >
              We're dedicated to providing a smooth and reliable shopping
              experience with a wide selection of quality products, fast
              delivery, and customer service you can count on. Shop with
              confidence and convenience.
            </p>

            {/* Social icons */}
            <p className="font-semibold font-md">Follow us on:</p>
            <div className="flex flex-row gap-2 flex-wrap justify-center lg:justify-start">

              {socialMediaData?.map((social) => (
                <a
                  key={social.id}
                  href={social.url}
                  title={social.platform}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-full text-white border border-white/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_16px_rgba(0,0,0,0.2)]"
                  style={{ backgroundColor: "rgba(255, 255, 255, 0.15)" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.3)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.15)")
                  }
                >
                  {social.platform === "Facebook" && <FacebookIcon />}
                  {social.platform === "Instagram" && <InstagramIcon />}
                  {social.platform === "Linkedin" && <LinkedinIcon />}
                  {social.platform === "TikTok" && <TikTokIcon />}
                  {social.platform === "WhatsApp" && <WhatsAppIcon />}
                  {social.platform === "YouTube" && <Iconify icon="mdi:youtube" width={24} />}
                  {social.platform === "Threads" && <Iconify icon="ri:threads-fill" width={24} />}
                </a>
              ))}
            </div>
          </div>

          {/* Links — col span 8 */}
          {/* <div className="lg:col-span-8 w-full min-w-0 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-[1fr_1fr_1fr_1.4fr] gap-x-4 gap-y-8 sm:gap-x-6">
            <div className="container-fluid">
              <div className="grid lg:grid-cols-12 gap-10 lg:gap-8 pb-7"> */}
          <div className="lg:col-span-2 md:col-span-6 ">

            {/* Brands */}
            <div className="flex flex-col gap-5">
              <h2 className={headingClass}>Top Brands</h2>
              <div className="flex flex-col gap-3 items-center lg:items-start">
                {brands?.slice(0, 5)?.map((brand) => (
                  <RouterLink
                    key={brand.brand_id}
                    href={paths.product.root}
                    title={brand.brand_name}
                    onClick={() => handleClickBrand(brand.brand_id)}
                    className={footerLinkClass}
                  >
                    {footerLinkArrow}
                    {brand.brand_name}
                  </RouterLink>
                ))}
              </div>
            </div>
          </div>
          <div className="lg:col-span-2 md:col-span-6 ">

            {/* Company */}
            <div className="flex flex-col gap-5">
              <h2 className={headingClass}>Company</h2>
              <div className="flex flex-col gap-3 items-center lg:items-start">
                <RouterLink
                  href={paths.blog.root}
                  title="Blogs"
                  className={footerLinkClass}
                >
                  {footerLinkArrow}
                  Blogs
                </RouterLink>
                <RouterLink
                  href={paths.about}
                  title="About"
                  className={footerLinkClass}
                >
                  {footerLinkArrow}
                  About
                </RouterLink>
                <RouterLink
                  href={paths.contact}
                  title="Contact"
                  className={footerLinkClass}
                >
                  {footerLinkArrow}
                  Contact
                </RouterLink>

                {pages?.map((link) => {
                  if (link.show_in_footer === "0" || !link.path) return null;
                  return (
                    <RouterLink
                      key={link.title}
                      href={link.path}
                      className={footerLinkClass}
                    >
                      {footerLinkArrow}
                      {link.title}
                    </RouterLink>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="lg:col-span-2 md:col-span-6 ">

            {/* Categories */}
            <div className="flex flex-col gap-5">
              <h2 className={headingClass}>Categories</h2>
              <div className="flex flex-col gap-3 items-center lg:items-start">
                {categories
                  ?.filter((category) => category.show_in_home)
                  ?.slice(0, 5)
                  ?.map((category) => (
                    <RouterLink
                      key={category.category_id}
                      href={paths.product.root}
                      onClick={() => handleClickCategory(category.category_id)}
                      className={footerLinkClass}
                    >
                      {footerLinkArrow}
                      {category.name}
                    </RouterLink>
                  ))}
              </div>
            </div>
          </div>
          <div className="lg:col-span-2 md:col-span-6 ">

            {/* Contact */}
            <div className="col-span-2 md:col-span-4 lg:col-span-1 flex flex-col gap-5 min-w-0">
              <h2 className={headingClass}>Contact Us</h2>
              <div className="flex flex-col gap-3 lg:items-start items-center">
                {/* Phone */}
                {vendor?.contact_info && (
                  <Link
                    href={`tel:${vendor.contact_info}`}
                    className="inline-flex items-center gap-2.5 text-sm text-white/90 hover:text-white transition-colors"
                  >
                    <Iconify icon="solar:phone-calling-rounded-bold-duotone" width={18} className="text-white/80 shrink-0" />
                    <span>{vendor.contact_info}</span>
                  </Link>
                )}

                {/* Address */}
                {vendor?.address && (
                  <div className="flex items-start gap-2.5 text-sm text-white/90 text-left max-w-[320px]">
                    <Iconify icon="solar:map-point-wave-bold-duotone" width={18} className="text-white/80 shrink-0 mt-0.5" />
                    <span className="leading-snug">{vendor.address}</span>
                  </div>
                )}

                {/* Email */}
                {email && (
                  <a
                    href={`mailto:${email}`}
                    className="inline-flex items-center gap-2.5 text-sm text-white/90 hover:text-white transition-colors"
                  >
                    <Iconify icon="solar:letter-bold-duotone" width={18} className="text-white/80 shrink-0" />
                    <span className="break-all">{email}</span>
                  </a>
                )}

                {/* Wholesale & Partnership Inquiry */}
                <div className="pt-3 border-t border-white/20 flex flex-col gap-1.5 items-center lg:items-start">
                  <p className="text-xs font-semibold text-white/80">
                    For partnership & wholesale:
                  </p>
                  <a
                    href="mailto:pr@glowon.com.np"
                    className="inline-flex items-center gap-2.5 text-sm font-semibold text-white hover:underline underline-offset-4 transition-all"
                  >
                    <Iconify icon="solar:letter-bold-duotone" width={18} className="text-white/80 shrink-0" />
                    <span className="break-all">pr@glowon.com.np</span>
                  </a>
                  <a
                    href="mailto:wholesale@glowon.com.np"
                    className="inline-flex items-center gap-2.5 text-sm font-semibold text-white hover:underline underline-offset-4 transition-all"
                  >
                    <Iconify icon="solar:letter-bold-duotone" width={18} className="text-white/80 shrink-0" />
                    <span className="break-all">wholesale@glowon.com.np</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
          {/* 
        </div>
      </div>
    </div> */}

        </div >
        {/* </div > */}

        {/* ── Row 2: Latest Products ── */}
        {/* {recentProducts && recentProducts.length > 0 && (
          <div
            className="rounded-3xl p-3.5 border border-white/15"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(10px)",
            }}
          >
            <h2 className="font-bold text-white mb-3 text-[0.9rem] sm:text-[1rem] md:text-[1.2rem]">
              Latest Products
            </h2>

            <div className="flex flex-wrap gap-2">
              {recentProducts?.slice(0, 8)?.map((product) => (
                <RouterLink
                  key={product.product_id}
                  href={paths.product.details(product.slug)}
                  className="px-3 py-2 rounded-2xl text-white no-underline text-sm font-medium border border-white/20 transition-all duration-300 hover:-translate-y-[3px] hover:shadow-[0_6px_12px_rgba(0,0,0,0.15)]"
                  style={{ backgroundColor: "rgba(255, 255, 255, 0.15)" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.25)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.15)")
                  }
                >
                  {product.name}
                </RouterLink>
              ))}
            </div>
          </div>
        )} */}

        {/* ── Row 3: Bottom bar ── */}
        <div>
          <hr className="border-white/20 mb-4" />

          <div className="flex flex-col md:flex-row justify-between items-center gap-3 md:gap-4 text-center md:text-left">
            <p className="text-sm" style={{ color: "rgba(255, 255, 255, 0.85)" }}>
              © {new Date().getFullYear()} {vendor?.vendor_name}. All rights reserved.
            </p>

            <div className="flex flex-row flex-wrap items-center justify-center gap-x-4 gap-y-2">
              {LEGAL_SECTIONS.map((link, index) => (
                <React.Fragment key={link.name}>
                  <RouterLink
                    href={link.href}
                    className="text-sm no-underline transition-colors duration-200 hover:text-white"
                    style={{ color: "rgba(255, 255, 255, 0.85)" }}
                  >
                    {link.name}
                  </RouterLink>

                  {index < LEGAL_SECTIONS.length - 1 && (
                    <span
                      className="inline-block w-px border-l border-white/30"
                      style={{ height: "16px" }}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

      </div >
    </footer >
  );
}