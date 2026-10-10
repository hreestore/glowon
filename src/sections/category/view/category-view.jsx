
"use client";


import { useGetCategories } from "@/api";
import { CategoryList } from "../category-list";
import { paths } from "@/routes/paths";
import { CustomBreadcrumbs } from "@/components/custom-breadcrumbs";

export function CategoryView() {
  const { categories } = useGetCategories();

  return (
    <div className="mx-auto w-full max-w-[1920px] px-4 sm:px-6 lg:px-8 mb-10">
      {/* Breadcrumb */}
      <div className="mt-2 mb-3">
        <CustomBreadcrumbs
          links={[
            { name: "Home", href: paths.home },
            { name: "Categories" },
          ]}
        />
      </div>

      {/* Title */}
      <h1
        className="
          my-3
          text-base
          font-bold
          text-gray-900
          md:my-5
          md:text-[1.3rem]
        "
      >
        Category
      </h1>

      {/* Category List */}
      <CategoryList categories={categories} />
    </div>
  );
}