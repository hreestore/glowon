import Autoplay from "embla-carousel-autoplay";

import { useAppDispatch } from "@/redux/hooks";
import { setCategory } from "@/redux/actions";

import { paths } from "@/routes/paths";
import { RouterLink } from "@/routes/components";
import { useRouter } from "@/routes/hooks";

import { Carousel, useCarousel } from "@/components/carousel";
import { Iconify } from "@/components/iconify";
import Image from "next/image";

// Soft pastel background colors for the cards
const ACCENT_COLORS = [
  { blob: "#d1fae5" }, // emerald-100
  { blob: "#ede9fe" }, // violet-100
  { blob: "#e0f2fe" }, // sky-100
  { blob: "#fef9c3" }, // yellow-100
  { blob: "#fee2e2" }, // red-100
  { blob: "#dbeafe" }, // blue-100
];

export function HomeFeaturedCategories({ categories }) {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const carousel = useCarousel(
    {
      loop: true,
      align: "center",
      justifyContent: "center",
      slideSpacing: "16px",
      slidesToShow: { xs: 2, sm: 3, md: 4, lg: 5 },
      duration: 18000,
    },
    [Autoplay({ playOnInit: true, delay: 0, stopOnInteraction: true, stopOnMouseEnter: true })]
  );

  const handleClick = (id) => {
    dispatch(setCategory(id));
    router.push(paths.product.root);
  };

  const visibleCategories = categories?.filter((c) => c.show_in_home === true) ?? [];

  return (
    <section className="container mx-auto px-4 lg:px-0 lg:my-12 my-8">
      {/* Sleek Minimalist Header */}
      <div className="mb-8 flex flex-col md:flex-row items-start md:items-end justify-between gap-4 px-2">
        <div>
          <h2 className="text-2xl md:text-[2rem] font-extrabold tracking-tight text-gray-900 leading-tight">
            Shop by Category
          </h2>
          <p className="mt-2 text-sm md:text-base text-gray-500">
            Curated collections for your beauty routine
          </p>
        </div>

        <RouterLink
          href={paths.category}
          className="group flex items-center gap-2 rounded-full border border-gray-200 bg-white px-6 py-2.5 text-sm font-bold text-gray-800 shadow-sm transition-all duration-300 hover:border-gray-900 hover:bg-gray-900 hover:text-white"
        >
          View All <span className="transition-transform duration-300 ease-out group-hover:translate-x-1">→</span>
        </RouterLink>
      </div>

      {/* Carousel */}
      <Carousel carousel={carousel} className="p-4 -m-4">
        {visibleCategories.map((category, index) => (
          <FeaturedCategoriesItem
            key={category.category_id}
            category={category}
            index={index}
            onClick={() => handleClick(category.category_id)}
          />
        ))}
      </Carousel>
    </section>
  );
}

function FeaturedCategoriesItem({ category, index, onClick }) {
  const { name, web_image } = category;

  return (
    <div
      onClick={onClick}
      className="group relative h-full w-full cursor-pointer p-2"
    >
      <div className="relative flex h-[180px] md:h-[220px] w-full flex-col justify-end overflow-hidden rounded-[2rem] p-5 md:p-6 transition-all duration-500 ease-out hover:-translate-y-2 hover:shadow-[0_16px_32px_-12px_rgba(0,0,0,0.25)] bg-gray-100">
        
        {/* Crisp inner ring for premium feel */}
        <div className="absolute inset-0 z-30 rounded-[2rem] ring-1 ring-inset ring-white/20 pointer-events-none transition-all duration-500 group-hover:ring-white/40" />

        {/* Background Image */}
        <Image
            alt={name}
            src={web_image}
            width={400}
            height={400}
            className="absolute inset-0 z-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />

        {/* Dark Gradient Overlay for Text Readability */}
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-70 transition-opacity duration-500 group-hover:opacity-90" />
        
        {/* Content */}
        <div className="relative z-20 flex w-full items-end justify-between gap-4 transition-transform duration-500 group-hover:-translate-y-1">
            <h3 className="text-base md:text-xl font-bold leading-tight tracking-tight text-white line-clamp-2">
              {name}
            </h3>

            {/* Interactive Action Button */}
            <div className="flex h-8 w-8 md:h-10 md:w-10 shrink-0 items-center justify-center rounded-full bg-white/20 backdrop-blur-md shadow-sm transition-all duration-500 group-hover:bg-white group-hover:shadow-lg">
                <Iconify icon="solar:arrow-right-linear" className="text-white transition-all duration-500 group-hover:-rotate-45 group-hover:text-gray-900" width={20} />
            </div>
        </div>
      </div>
    </div>
  );
}