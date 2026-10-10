"use client";

import { useAppSelector } from "@/redux/hooks";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import Link from "next/link";
import { paths } from "@/routes/paths";

export function HomeHeroBanner({ sliders }) {
  const { vendor } = useAppSelector((state) => state.vendor);

  const primaryColor = vendor?.primary_color;
  const secondaryColor = vendor?.secondary_color;

  const slidesData = sliders?.length > 0 ? sliders : [];
  if (!slidesData.length) return null;

  return (
    <section className="container-fluid lg:my-6 my-2">
      <Swiper
        observer={false}
        observeParents={false}
        resizeObserver={false}
        modules={[Autoplay]}
        loop
        speed={1000}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        className="w-full"
      >
        {sliders?.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className="relative flex flex-col lg:flex-row items-stretch rounded-[2.5rem] bg-[#fcfaf8] min-h-auto lg:min-h-[500px] shadow-sm">

              {/* Text Section (Left) */}
              <div className="w-full lg:w-5/12 hidden lg:flex flex-col justify-center p-8 md:p-12 lg:p-20 relative z-10">
                <span className="inline-block text-xs md:text-sm font-semibold tracking-[0.25em] uppercase mb-6 text-gray-500">
                  Glow On
                </span>

                <h2
                  className="text-4xl md:text-5xl lg:text-5xl font-bold tracking-tight leading-[1.15] mb-6 text-gray-900"
                  dangerouslySetInnerHTML={{ __html: slide.title }}
                />

                <p
                  className="text-base md:text-lg font-light mb-10 text-gray-600 leading-relaxed max-w-md"
                  dangerouslySetInnerHTML={{ __html: slide.description }}
                />

                <div className="flex flex-wrap items-center gap-4">
                  <Link
                    href={slide.product_url}
                    style={{ backgroundColor: primaryColor || '#000' }}
                    className="px-8 py-4 rounded-full text-sm font-medium tracking-wide text-white hover:opacity-90 transition-all duration-300 shadow-xl shadow-black/10 hover:-translate-y-0.5"
                  >
                    Shop Collection
                  </Link>
                  <Link
                    href={paths.category}
                    className="group px-6 py-4 rounded-full text-sm font-medium tracking-wide text-gray-900 transition-all duration-300 flex items-center"
                  >
                    <span className="border-b border-gray-300 pb-1 group-hover:border-gray-900 transition-colors">
                      Explore All
                    </span>
                  </Link>
                </div>

                {/* Trust/Social Proof Section */}
                {/* <div className="mt-12 flex items-center gap-4 pt-8 border-t border-gray-200/60 hidden md:flex">
                  <div className="flex -space-x-3">
                    <img src="https://i.pravatar.cc/100?img=1" alt="user" className="w-10 h-10 rounded-full border-2 border-[#fcfaf8] object-cover" />
                    <img src="https://i.pravatar.cc/100?img=5" alt="user" className="w-10 h-10 rounded-full border-2 border-[#fcfaf8] object-cover" />
                    <img src="https://i.pravatar.cc/100?img=9" alt="user" className="w-10 h-10 rounded-full border-2 border-[#fcfaf8] object-cover" />
                  </div>
                  <p className="text-xs text-gray-500 font-medium leading-relaxed">
                    Loved by<br />
                    <span className="text-gray-900 font-bold">10,000+</span> Customers
                  </p>
                </div> */}
              </div>

              {/* Main Image Section (Right) */}
              <div className="w-full lg:w-7/12 relative flex flex-col min-h-[300px] lg:min-h-[500px] p-4 lg:p-6 lg:pl-0 z-0">
                <div className="w-full flex-1 relative rounded-[2rem] overflow-hidden">
                  <img
                    src={slide.featured_image}
                    alt={slide.title}
                    title={slide.title}
                    fetchPriority={index === 0 ? "high" : "low"}
                    loading={index === 0 ? "eager" : "lazy"}
                    className="absolute inset-0 w-full h-full object-cover object-center"
                  />
                  {/* Subtle inner shadow for image */}
                  <div className="absolute inset-0 border border-black/5 rounded-[2rem] pointer-events-none"></div>
                </div>

              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}