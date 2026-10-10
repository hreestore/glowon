// "use client";

// import { useEffect, useState } from "react";
// import { useBoolean, useSetState } from "minimal-shared/hooks";
// import { useSearchParams } from "next/navigation";

// import { Box, Stack, Container, Typography } from "@mui/material";

// import { EmptyContent } from "@/components/empty-content";

// import { ProductList } from "../product-list";
// import { ProductSort } from "../product-sort";
// import { ProductSearch } from "../product-search";
// import { ProductFiltersDrawer } from "../product-filters-drawer";
// import { ProductFiltersResult } from "../product-filters-result";
// import { ProductBrandList } from "../product-brand-list";

// import { useAppSelector } from "@/redux/hooks";

// import { useGetCategories, useGetProducts, useGetBrands, buildProductFilterQuery } from "@/api";
// import { CustomBreadcrumbs } from "@/components/custom-breadcrumbs";
// import { paths } from "@/routes/paths";

// // ----------------------------------------------------------------------

// export const PRODUCT_SORT_OPTIONS = [
//   { value: "created_at", label: "Newest", sortBy: "created_at", sortOrder: "desc" },
//   { value: "name-asc", label: "Name: A - Z", sortBy: "name", sortOrder: "asc" },
//   { value: "name-desc", label: "Name: Z - A", sortBy: "name", sortOrder: "desc" },
//   { value: "price-desc", label: "Price: High - Low", sortBy: "price", sortOrder: "desc" },
//   { value: "price-asc", label: "Price: Low - High", sortBy: "price", sortOrder: "asc" },
// ];

// // ----------------------------------------------------------------------

// export function ProductView() {
//   const openFilters = useBoolean();

//   const searchParams = useSearchParams();

//   const { categories } = useGetCategories();

//   const { brands } = useGetBrands();

//   const { products: productList = [] } = useGetProducts("");

//   const [sortBy, setSortBy] = useState("created_at");

//   const [currentPage, setCurrentPage] = useState(1);

//   const filters = useSetState({
//     name: "",
//     brand: [],
//     category: "",
//     priceRange: [0, 10000],
//   });

//   const { category, brand, name } = useAppSelector(
//     (state) => state.productFilter
//   );

//   // Get search query from URL params (priority) or Redux state
//   const urlName = searchParams.get("name");

//   const { state: currentFilters, setState: updateFilters } = filters;

//   // Find the current sort option to get sortBy and sortOrder
//   const currentSortOption = PRODUCT_SORT_OPTIONS.find(opt => opt.value === sortBy) || PRODUCT_SORT_OPTIONS[0];

//   // Define default price limits (will be updated from API response)
//   const DEFAULT_MIN_PRICE = 0;
//   const DEFAULT_MAX_PRICE = 10000000;

//   // Helper function to find category and build breadcrumb path
//   const findCategoryPath = (categoryId, categoriesList) => {
//     if (!categoryId || !categoriesList) return [];

//     const findPath = (cats, targetId, path = []) => {
//       for (const cat of cats) {
//         const currentPath = [...path, { name: cat.name, href: paths.product.root }];

//         if (cat.category_id === targetId) {
//           return currentPath;
//         }

//         if (cat.subCategories && cat.subCategories.length > 0) {
//           const found = findPath(cat.subCategories, targetId, currentPath);
//           if (found.length > 0) return found;
//         }
//       }
//       return [];
//     };

//     return findPath(categoriesList, categoryId);
//   };

//   // Build breadcrumb links based on selected category
//   const breadcrumbLinks = [
//     { name: "Home", href: paths.home },
//     ...findCategoryPath(currentFilters.category, categories),
//     { name: "Products" }
//   ];

//   // Build query using the helper function
//   const productFilterQuery = buildProductFilterQuery({
//     name: currentFilters.name,
//     brand_id: currentFilters.brand?.length > 0 ? currentFilters.brand : undefined,
//     category_id: currentFilters.category || undefined,
//     price_min: currentFilters.priceRange[0] !== DEFAULT_MIN_PRICE ? currentFilters.priceRange[0] : undefined,
//     price_max: currentFilters.priceRange[1] !== DEFAULT_MAX_PRICE ? currentFilters.priceRange[1] : undefined,
//     sort_by: currentSortOption.sortBy,
//     sort_order: currentSortOption.sortOrder,
//     page: currentPage,
//     per_page: 20,
//   });

//   const { products, isLoading, pagination, appliedFilters, filterValues } = useGetProducts(productFilterQuery);

//   // Get price range from API response filter_values
//   const minPrice = filterValues?.price_range?.min ? parseFloat(filterValues.price_range.min) : DEFAULT_MIN_PRICE;
//   const maxPrice = filterValues?.price_range?.max ? parseFloat(filterValues.price_range.max) : DEFAULT_MAX_PRICE;

//   useEffect(() => {
//     updateFilters({ brand: brand });

//     updateFilters({ category: category });

//     // Use URL param if available, otherwise use Redux state
//     const searchName = urlName || name;
//     updateFilters({ name: searchName });

//     // Reset to page 1 when filters change
//     setCurrentPage(1);
//   }, [brand, category, name, urlName]);

//   // Update price range when filterValues are loaded from API
//   useEffect(() => {
//     if (filterValues?.price_range) {
//       const apiMinPrice = parseFloat(filterValues.price_range.min) || 0;
//       const apiMaxPrice = parseFloat(filterValues.price_range.max) || 10000000;

//       // Only update if current filter is still at default values
//       if (currentFilters.priceRange[0] === 0 && currentFilters.priceRange[1] === 10000) {
//         updateFilters({ priceRange: [apiMinPrice, apiMaxPrice] });
//       }
//     }
//   }, [filterValues]);

//   const canReset =
//     currentFilters.brand.length > 0 ||
//     currentFilters.name !== "" ||
//     currentFilters.category !== "" ||
//     currentFilters.priceRange[0] !== minPrice ||
//     currentFilters.priceRange[1] !== maxPrice;

//   const notFound = !products?.length && canReset;

//   const productsEmpty = !isLoading && !products?.length;

//   const renderFilters = () => (
//     <Box
//       sx={{
//         gap: 3,
//         display: "flex",
//         justifyContent: "space-between",
//         flexDirection: { xs: "column", sm: "row" },
//         alignItems: { xs: "flex-end", sm: "center" },
//       }}
//     >
//       <ProductSearch
//         productsLoading={isLoading}
//         products={products}
//         filters={filters}
//       //
//       />

//       <Box sx={{ gap: 1, flexShrink: 0, display: "flex" }}>
//         <ProductFiltersDrawer
//           filters={filters}
//           canReset={canReset}
//           open={openFilters.value}
//           onOpen={openFilters.onTrue}
//           onClose={openFilters.onFalse}
//           //
//           brands={brands}
//           priceLimit={{
//             min: minPrice,
//             max: maxPrice,
//           }}
//           options={{
//             categories: categories,
//             brands: brands,
//           }}
//         />

//         <ProductSort
//           sort={sortBy}
//           onSort={(newValue) => setSortBy(newValue)}
//           sortOptions={PRODUCT_SORT_OPTIONS}
//         />
//       </Box>
//     </Box>
//   );

//   const renderResults = () => (
//     <ProductFiltersResult
//       filters={filters}
//       totalResults={pagination?.total || products?.length}
//       //
//       options={{
//         categories: categories,
//         brands: brands,
//       }}
//       //
//       priceLimit={{
//         min: minPrice,
//         max: maxPrice,
//       }}
//     />
//   );

//   const renderNotFound = () => <EmptyContent filled sx={{ py: 10 }} />;

//   return (
//     <Container maxWidth="xl" sx={{ mt: 0, mb: 10, pt: 2 }}>
//       <CustomBreadcrumbs
//         links={breadcrumbLinks}
//         sx={{ mb: 5 }}
//       />
//       <h1 className="text-base md:text-xl my-3 md:my-2 font-[800]">
//         Shop
//       </h1>

//       <ProductBrandList brands={brands} filters={filters} />

//       <Stack spacing={2.5} sx={{ mb: { xs: 3, md: 5 } }}>
//         {renderFilters()}

//         {canReset && renderResults()}
//       </Stack>

//       {(notFound || productsEmpty) && renderNotFound()}
//       <Typography variant="h2" sx={{ my: { xs: 3, md: 4 }, fontSize: { xs: "1rem", md: "1.2rem" } }}>
//         Filtered Products
//       </Typography>
//       <ProductList
//         products={products}
//         loading={isLoading}
//         pagination={pagination}
//         onPageChange={setCurrentPage}
//       />
//     </Container>
//   );
// }
"use client";

import { useEffect, useState } from "react";
import { useBoolean, useSetState } from "minimal-shared/hooks";
import { useSearchParams } from "next/navigation";

import { EmptyContent } from "@/components/empty-content";

import { ProductList } from "../product-list";
import { ProductSort } from "../product-sort";
import { ProductSearch } from "../product-search";
import { ProductFiltersDrawer } from "../product-filters-drawer";
import { ProductFiltersResult } from "../product-filters-result";
import { ProductBrandList } from "../product-brand-list";

import { useAppSelector } from "@/redux/hooks";

import { useGetCategories, useGetProducts, useGetBrands, buildProductFilterQuery } from "@/api";
import { CustomBreadcrumbs } from "@/components/custom-breadcrumbs";
import { paths } from "@/routes/paths";

// ----------------------------------------------------------------------

export const PRODUCT_SORT_OPTIONS = [
  { value: "created_at", label: "Newest", sortBy: "created_at", sortOrder: "desc" },
  { value: "name-asc", label: "Name: A - Z", sortBy: "name", sortOrder: "asc" },
  { value: "name-desc", label: "Name: Z - A", sortBy: "name", sortOrder: "desc" },
  { value: "price-desc", label: "Price: High - Low", sortBy: "price", sortOrder: "desc" },
  { value: "price-asc", label: "Price: Low - High", sortBy: "price", sortOrder: "asc" },
];

// ----------------------------------------------------------------------

export function ProductView() {
  const openFilters = useBoolean();

  const searchParams = useSearchParams();

  const { categories } = useGetCategories();
  const { brands } = useGetBrands();
  const { products: productList = [] } = useGetProducts("");

  const [sortBy, setSortBy] = useState("created_at");
  const [currentPage, setCurrentPage] = useState(1);

  const filters = useSetState({
    name: "",
    brand: [],
    category: "",
    priceRange: [0, 10000],
  });

  const { category, brand, name } = useAppSelector((state) => state.productFilter);

  const urlName = searchParams.get("name");

  const { state: currentFilters, setState: updateFilters } = filters;

  const currentSortOption = PRODUCT_SORT_OPTIONS.find(opt => opt.value === sortBy) || PRODUCT_SORT_OPTIONS[0];

  const DEFAULT_MIN_PRICE = 0;
  const DEFAULT_MAX_PRICE = 10000000;

  const findCategoryPath = (categoryId, categoriesList) => {
    if (!categoryId || !categoriesList) return [];

    const findPath = (cats, targetId, path = []) => {
      for (const cat of cats) {
        const currentPath = [...path, { name: cat.name, href: paths.product.root }];
        if (cat.category_id === targetId) return currentPath;
        if (cat.subCategories?.length > 0) {
          const found = findPath(cat.subCategories, targetId, currentPath);
          if (found.length > 0) return found;
        }
      }
      return [];
    };

    return findPath(categoriesList, categoryId);
  };

  const breadcrumbLinks = [
    { name: "Home", href: paths.home },
    ...findCategoryPath(currentFilters.category, categories),
    { name: "Products" },
  ];

  const productFilterQuery = buildProductFilterQuery({
    name: currentFilters.name,
    brand_id: currentFilters.brand?.length > 0 ? currentFilters.brand : undefined,
    category_id: currentFilters.category || undefined,
    price_min: currentFilters.priceRange[0] !== DEFAULT_MIN_PRICE ? currentFilters.priceRange[0] : undefined,
    price_max: currentFilters.priceRange[1] !== DEFAULT_MAX_PRICE ? currentFilters.priceRange[1] : undefined,
    sort_by: currentSortOption.sortBy,
    sort_order: currentSortOption.sortOrder,
    page: currentPage,
    per_page: 20,
  });

  const { products, isLoading, pagination, appliedFilters, filterValues } = useGetProducts(productFilterQuery);

  const minPrice = filterValues?.price_range?.min ? parseFloat(filterValues.price_range.min) : DEFAULT_MIN_PRICE;
  const maxPrice = filterValues?.price_range?.max ? parseFloat(filterValues.price_range.max) : DEFAULT_MAX_PRICE;

  useEffect(() => {
    updateFilters({ brand });
    updateFilters({ category });
    updateFilters({ name: urlName || name });
    setCurrentPage(1);
  }, [brand, category, name, urlName]);

  useEffect(() => {
    if (filterValues?.price_range) {
      const apiMinPrice = parseFloat(filterValues.price_range.min) || 0;
      const apiMaxPrice = parseFloat(filterValues.price_range.max) || 10000000;
      if (currentFilters.priceRange[0] === 0 && currentFilters.priceRange[1] === 10000) {
        updateFilters({ priceRange: [apiMinPrice, apiMaxPrice] });
      }
    }
  }, [filterValues]);

  const canReset =
    currentFilters.brand.length > 0 ||
    currentFilters.name !== "" ||
    currentFilters.category !== "" ||
    currentFilters.priceRange[0] !== minPrice ||
    currentFilters.priceRange[1] !== maxPrice;

  const notFound = !products?.length && canReset;
  const productsEmpty = !isLoading && !products?.length;

  const renderFilters = () => (
    <div className="flex flex-col sm:flex-row items-end sm:items-center justify-between gap-6">
      <ProductSearch
        productsLoading={isLoading}
        products={products}
        filters={filters}
      />

      <div className="flex items-center gap-2 shrink-0">
        <ProductFiltersDrawer
          filters={filters}
          canReset={canReset}
          open={openFilters.value}
          onOpen={openFilters.onTrue}
          onClose={openFilters.onFalse}
          brands={brands}
          priceLimit={{ min: minPrice, max: maxPrice }}
          options={{ categories, brands }}
        />

        <ProductSort
          sort={sortBy}
          onSort={(newValue) => setSortBy(newValue)}
          sortOptions={PRODUCT_SORT_OPTIONS}
        />
      </div>
    </div>
  );

  const renderResults = () => (
    <ProductFiltersResult
      filters={filters}
      totalResults={pagination?.total || products?.length}
      options={{ categories, brands }}
      priceLimit={{ min: minPrice, max: maxPrice }}
    />
  );

  const renderNotFound = () => <EmptyContent filled className="py-10" />;

  return (
    <div className="container mx-auto px-4 mt-0 mb-5 pb-3">
      <CustomBreadcrumbs links={breadcrumbLinks} className="mb-0" />

      <h1 className="text-base md:text-xl  font-[800] mb-1">Shop</h1>

      <ProductBrandList brands={brands} filters={filters} />

      <div className="flex flex-col gap-6 mb-4 md:mb-5 my-2">
        {renderFilters()}
        {canReset && renderResults()}
      </div>

      {(notFound || productsEmpty) && renderNotFound()}

      <h2 className="text-base md:text-xl my-1 md:my-2 font-[800]">Filtered Products</h2>

      <ProductList
        products={products}
        loading={isLoading}
        pagination={pagination}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}