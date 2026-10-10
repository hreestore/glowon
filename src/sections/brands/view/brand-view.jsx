
"use client";


import { useGetBrands } from "@/api";
import { paths } from "@/routes/paths";
import { CustomBreadcrumbs } from "@/components/custom-breadcrumbs";
import { BrandList } from "../brand-list";

export function BrandView() {
    const { brands } = useGetBrands();

    return (
        <div className="mx-auto w-full container px-4 sm:px-6 lg:px-8 mb-10">
            {/* Breadcrumb */}
            <div className="mt-2 mb-3">
                <CustomBreadcrumbs
                    links={[
                        { name: "Home", href: paths.home },
                        { name: "Brands" },
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
          md:text-[1.3rem] hidden
        "
            >
                Brands
            </h1>

            {/* Brand List */}
            <BrandList brands={brands} />
        </div>
    );
}