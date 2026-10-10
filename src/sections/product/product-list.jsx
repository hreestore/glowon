// import Box from "@mui/material/Box";
// import Pagination, { paginationClasses } from "@mui/material/Pagination";

// import { paths } from "@/routes/paths";

// import { ProductItem } from "./product-item";
// import { ProductItemSkeleton } from "./product-skeleton";

// // ----------------------------------------------------------------------

// export function ProductList({ products = [], loading, pagination, onPageChange, sx, ...other }) {
//   const handlePageChange = (event, value) => {
//     onPageChange(value);
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   };

//   const renderLoading = () => <ProductItemSkeleton />;

//   const renderList = () => {
//     if (!Array.isArray(products) || products.length === 0) {
//       return null;
//     }
//     return products.map((product) => (
//       <ProductItem
//         key={product.product_id}
//         product={product}
//         detailsHref={paths.product.details(product.slug)}
//       />
//     ));
//   };

//   return (
//     <>
//       <Box
//         sx={[
//           () => ({
//             gap: 3,
//             display: "grid",
//             gridTemplateColumns: {
//               xs: "repeat(2, 1fr)",
//               sm: "repeat(3, 1fr)",
//               md: "repeat(4, 1fr)",
//               lg: "repeat(5, 1fr)",
//             },
//           }),
//           ...(Array.isArray(sx) ? sx : [sx]),
//         ]}
//         {...other}
//       >
//         {loading ? renderLoading() : renderList()}
//       </Box>

//       {pagination && pagination.last_page > 1 && (
//         <Pagination
//           count={pagination.last_page}
//           page={pagination.current_page}
//           onChange={handlePageChange}
//           sx={{
//             mt: { xs: 5, md: 8 },
//             [`& .${paginationClasses.ul}`]: { justifyContent: "center" },
//           }}
//         />
//       )}
//     </>
//   );
// }
import { paths } from "@/routes/paths";

import { ProductItem } from "./product-item";
import { ProductItemSkeleton } from "./product-skeleton";

// ----------------------------------------------------------------------

export function ProductList({ products = [], loading, pagination, onPageChange, className, ...other }) {
  const handlePageChange = (value) => {
    onPageChange(value);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderLoading = () => <ProductItemSkeleton />;

  const renderList = () => {
    if (!Array.isArray(products) || products.length === 0) {
      return null;
    }
    return products.map((product) => (
      <ProductItem
        key={product.product_id}
        product={product}
        detailsHref={paths.product.details(product.slug)}
      />
    ));
  };

  return (
    <>
      <div
        className={`grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 ${className || ""}`}
        {...other}
      >
        {loading ? renderLoading() : renderList()}
      </div>

      {pagination && pagination.last_page > 1 && (
        <div className="mt-3 md:mt-3 flex justify-center">
          {Array.from({ length: pagination.last_page }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`mx-1 w-5 h-5 rounded-full text-sm font-medium transition-colors
                ${page === pagination.current_page
                  ? "bg-gray-900 text-white"
                  : "text-gray-600 hover:bg-gray-100"
                }`}
            >
              {page}
            </button>
          ))}
        </div>
      )}
    </>
  );
}