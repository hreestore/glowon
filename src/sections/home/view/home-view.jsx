"use client";

import { useState } from "react";

import { useAppSelector } from "@/redux/hooks";

import {
  ScrollProgress,
  useScrollProgress,
} from "@/components/animate/scroll-progress";

import { HomePromoModal } from "../home-promo-modal";
import { HomeHeroBanner } from "../home-hero-banner";
import { HomeAbout } from "../home-about";
import { HomeTechFeatures } from "../home-tech-features";
import { HomeHighlightFeatures } from "../home-highlight-features";
import { HomeFeaturedCategories } from "../home-featured-categories";
import { HomeFeaturedBrands } from "../home-featured-brands";
import { HomeTrendingProducts } from "../home-trending-products";
import { HomeBestSellers } from "../home-best-sellers";
import { HomeFlashSale } from "../home-flash-sale";
import { HomeBlog } from "../home-blog";
import { HomeNewsletter } from "../home-newsletter";
import { HomeCustomerLogos } from "../home-customer-logos";
import { HomeVideoTestimonials } from "../home-video-testimonials";
import { HomeSkinConcerns } from "../home-skin-concerns";
import { HomeFaq } from "../home-faq";
import { HomeTestimonials } from "../home-testimonials";
import { HomeViewSkeleton } from "../home-skeleton";

import {
  useGetBrands,
  useGetCategories,
  useGetHomeSliders,
  useGetHomeRecentProducts,
  useGetHomeCategoryProducts,
  useGetHomeFlashSale,
  useGetBlogs,
} from "@/api";

import { useGetAboutData } from "@/api/about";
import { useGetPopupDialogData } from "@/api/popup-dialog";

// ----------------------------------------------------------------------

export function HomeView() {
  const vendor = useAppSelector((state) => state.vendor.vendor);

  const [promoModalOpen, setPromoModalOpen] = useState(true);

  const pageProgress = useScrollProgress();

  const { sliders, isLoading: slidersLoading } = useGetHomeSliders();

  const { aboutData } = useGetAboutData();

  const { categories, isLoading: categoriesLoading } =
    useGetCategories();

  const { brands, isLoading: brandsLoading } = useGetBrands();

  const { categoryProducts, isLoading: categoryProductsLoading } =
    useGetHomeCategoryProducts();

  const { recentProducts, isLoading: recentProductsLoading } =
    useGetHomeRecentProducts();

  const { flashSale, isLoading: flashSaleLoading } =
    useGetHomeFlashSale();

  const { blogs, isLoading: blogsLoading } = useGetBlogs();

  const { popupDialogData, isLoading: popupDialogLoading } = useGetPopupDialogData();

  console.log(popupDialogData, "popupDialogData");

  // Loading state
  const isLoading =
    slidersLoading ||
    categoriesLoading ||
    brandsLoading ||
    recentProductsLoading ||
    flashSaleLoading ||
    popupDialogLoading;

  const flashSaleLength = flashSale?.length || 0;

  // Skeleton
  if (isLoading) {
    return (
      <>
        <HomePromoModal
          open={promoModalOpen}
          onClose={() => setPromoModalOpen(false)}
        />

        <ScrollProgress
          variant="linear"
          progress={pageProgress.scrollYProgress}
          sx={[
            (theme) => ({
              position: "fixed",
              zIndex: theme.zIndex.appBar + 1,
            }),
          ]}
        />

        <HomeViewSkeleton />
      </>
    );
  }

  return (
    <>
      {/* Promo Modal */}
      <HomePromoModal
        popupDialogData={popupDialogData}
        open={promoModalOpen}
        onClose={() => setPromoModalOpen(false)}
      />

      {/* Scroll Progress */}
      <ScrollProgress
        variant="linear"
        progress={pageProgress.scrollYProgress}
        sx={[
          (theme) => ({
            position: "fixed",
            zIndex: theme.zIndex.appBar + 1,
          }),
        ]}
      />

      {/* Main Container */}
      <main className="container mx-auto px-2 lg:px-4">
        <section className="flex flex-col gap-6 lg:gap-5">
          {/* SEO */}
          <h1 className="hidden">
            {vendor?.vendor_name} - eCommerce Store
          </h1>

          {/* Hero Banner */}
          <HomeHeroBanner sliders={sliders} />

          {/* About */}
          {/* <HomeAbout aboutData={aboutData} /> */}

          {/* Flash Sale + Best Sellers */}
          <div className="grid grid-cols-1 gap-6">
            <div className="col-span-1">
              <HomeFlashSale flashSale={flashSale} />
            </div>

            {flashSaleLength > 0 && (
              <div className="col-span-1">
                <HomeBestSellers
                  products={recentProducts}
                />
              </div>
            )}
          </div>

          {/* Featured Categories */}
          {/* <HomeFeaturedCategories
            categories={categories?.slice(0, 8)}
          /> */}

          {/* Trending Products */}
          <HomeTrendingProducts
            products={recentProducts}
          />

          {/* Testimonials */}
          {/* <HomeTestimonials /> */}

          {/* Video Testimonials */}
          {/* <HomeVideoTestimonials /> */}

          {/* Featured Brands */}
          <HomeFeaturedBrands brands={brands} />

          {/* Skin Concerns */}
          <HomeSkinConcerns />

          {/* Highlight Features */}
          {/* <HomeHighlightFeatures sliders={sliders} /> */}

          {/* Category Products */}
          {/* <HomeCategoryProduct categoryProducts={categoryProducts} /> */}

          {/* Recently Added */}
          {/* <HomeRecentlyAddedProducts products={recentProducts} /> */}

          {/* Tech Features */}
          <HomeTechFeatures />

          {/* Customer Logos */}
          <HomeCustomerLogos logos={brands} />

          <HomeTestimonials />

          {/* Newsletter */}
          <HomeNewsletter />

          {/* FAQ */}
          {/* <HomeFaq /> */}

          {/* Blogs */}
          <HomeBlog
            blogs={blogs?.slice(0, 3)}
            isLoading={blogsLoading}
          />
        </section>
      </main>
    </>
  );
}