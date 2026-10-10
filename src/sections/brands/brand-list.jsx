
"use client";

import { useEffect, useState } from "react";

import { useAppDispatch } from "@/redux/hooks";
import { setBrand } from "@/redux/actions";

import { paths } from "@/routes/paths";
import { useRouter } from "@/routes/hooks";

import { Iconify } from "@/components/iconify";

import { ProductItem } from "../product/product-item";

import { useGetProducts } from "@/api";

// ----------------------------------------------------------------------

export function BrandList({ brands, className = "", ...other }) {

    const dispatch = useAppDispatch();
    const router = useRouter();

    const [selectedBrand, setSelectedBrand] = useState(null);
    const [selectedBrands, setSelectedBrands] = useState([]);

    const productFilterQuery = generateQueryParams();

    const { products } = useGetProducts(productFilterQuery);

    useEffect(() => {
        setSelectedBrands(brands);
    }, [brands]);

    function generateQueryParams() {
        const params = new URLSearchParams();

        if (selectedBrand?.brand_id) {
            params.append("brand", selectedBrand.brand_id);
        }

        return params;
    }

    const handleBack = () => {
        setSelectedBrand(null);
        setSelectedBrands(brands);
    };

    const handleClick = (brand) => {
        const { brand_id } = brand;

        dispatch(setBrand([brand_id]));
        router.push(paths.product.root);

    };

    return (
        <div className={`space-y-6 ${className}`} {...other}>
            {selectedBrand && (
                <button
                    onClick={handleBack}
                    className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                >
                    <Iconify icon="eva:arrow-ios-back-fill" />
                    Back to Main Brands
                </button>
            )}

            {/* Brands Grid */}
            <div
                className="
          grid gap-6
          grid-cols-2
          sm:grid-cols-3
          md:grid-cols-5
          lg:grid-cols-7
        "
            >
                {selectedBrands?.map((brand, index) => (
                    <BrandItem
                        key={brand.brand_id}
                        index={index}
                        brand={brand}
                        onClick={() => handleClick(brand)}
                    />
                ))}
            </div>

            {/* Products */}
            {selectedBrand && !!products?.length && (
                <>
                    <h2 className="text-xl font-bold text-gray-900">
                        {selectedBrand.brand_name} Products
                    </h2>

                    <div
                        className="
              grid gap-6
              grid-cols-2
              sm:grid-cols-3
              md:grid-cols-4
              lg:grid-cols-5
            "
                    >
                        {products?.map((product) => (
                            <ProductItem
                                key={product.product_id}
                                product={product}
                                detailsHref={paths.product.details(product.slug)}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}

function BrandItem({ brand, onClick }) {
    const { brand_name, brand_image } = brand;

    return (
        <div
            onClick={onClick}
            className="group relative aspect-square cursor-pointer overflow-hidden rounded-3xl bg-gray-100 shadow-sm ring-1 ring-gray-950/5 transition-all duration-500 ease-out hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-gray-900/20 hover:ring-gray-950/10"
        >
            {/* Brand image */}
            <img
                alt={brand_name}
                title={brand_name}
                src={brand_image}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
            />

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100" />

            {/* Diagonal shine sweep */}
            <div className="pointer-events-none absolute inset-0 -translate-x-full skew-x-12 bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" />

            {/* Inner glow ring on hover */}
            <div className="pointer-events-none absolute inset-0 rounded-3xl ring-2 ring-inset ring-white/0 transition-all duration-500 ease-out group-hover:ring-white/40" />

            {/* Name + CTA reveal */}
            <div className="absolute inset-x-0 bottom-0 flex translate-y-4 flex-col items-center gap-1 p-4 opacity-0 transition-all duration-500 ease-out group-hover:translate-y-0 group-hover:opacity-100">
                <p className="line-clamp-2 text-center text-sm font-semibold leading-snug text-white">
                    {brand_name}
                </p>
                <span className="flex items-center gap-1 text-[11px] font-medium uppercase tracking-wider text-white/80">
                    Shop Now
                    <Iconify icon="eva:arrow-ios-forward-fill" width={14} />
                </span>
            </div>
        </div>
    );
}