"use client";

import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";

import { useAppDispatch } from "@/redux/hooks";
import { setBrand, setCategory } from "@/redux/actions";

import { paths } from "@/routes/paths";
import { useRouter } from "@/routes/hooks";
import { Iconify } from "@/components/iconify";

export function HomeFeaturedBrands({ brands }) {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const autoplay =
    brands?.length > 6
      ? [Autoplay({ delay: 2500, stopOnInteraction: true })]
      : [];

  const [emblaRef] = useEmblaCarousel(
    {
      watchResize: false,
      loop: brands?.length > 6, align: "start"
    },
    autoplay
  );

  if (!brands?.length) return null;

  const handleView = (id) => {
    dispatch(setBrand([id]));
    dispatch(setCategory(""));
    router.push(paths.product.root);
  };

  return (
    <section className="container mx-auto px-4 lg:px-0 my-8 lg:my-12">
      <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#d4a983]/30 to-[#d4a983]/5 p-6 md:p-10 shadow-[0_8px_30px_rgba(0,0,0,0.02)] border border-[#d4a983]/20">

        {/* Decorative background glows for a premium feel */}
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-white/60 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-white/40 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-10">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-[1.25rem] bg-white shadow-sm text-[blue] border border-white/60">
              <Iconify icon="solar:verified-check-bold" width={28} />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
                Trusted Brands
              </h2>
              <p className="text-sm md:text-base text-gray-700 mt-1 font-medium">
                We only stock the finest beauty & skincare
              </p>
            </div>
          </div>
        </div>

        {/* Carousel */}
        <div className="overflow-hidden cursor-grab active:cursor-grabbing" ref={emblaRef}>
          <div className="flex gap-4 md:gap-6 py-4 px-1">
            {brands.map((brand) => (
              <HomeFeaturedBrandItem
                key={brand.brand_id}
                item={brand}
                onView={() => handleView(brand.brand_id)}
              />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}

function HomeFeaturedBrandItem({ item, onView }) {
  const { brand_name, brand_image } = item || {};

  return (
    <div
      onClick={onView}
      className="group relative flex flex-none min-w-[40%] sm:min-w-[35%] md:min-w-[25%] lg:min-w-[12%] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-[1.5rem] bg-white/70 backdrop-blur-md p-2 transition-all duration-500 ease-out hover:-translate-y-2 hover:bg-white hover:shadow-[0_20px_40px_-12px_rgba(212,169,131,0.4)] border border-white"
    >
      <div className="flex h-16 md:h-20 w-[50] items-center justify-center">
        <img
          alt={brand_name}
          title={brand_name}
          src={brand_image}
          className="h-full w-full object-contain transition-all duration-500 ease-out group-hover:scale-110  "
        />
      </div>
    </div>
  );
}