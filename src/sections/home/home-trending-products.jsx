// "use client";

// import { Box, Stack, Typography, Button, Card, Chip, useTheme } from "@mui/material";
// import { varAlpha } from "minimal-shared/utils";

// import { paths } from "@/routes/paths";
// import { RouterLink } from "@/routes/components";

// import { Iconify } from "@/components/iconify";

// import { ProductItem } from "../product/product-item";

// // ----------------------------------------------------------------------

// export function HomeTrendingProducts({ products }) {
//   const theme = useTheme();

//   if (!products?.length) return null;

//   return (
//     <Stack component="section" spacing={4}>
//       <Box
//         sx={{
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "space-between",
//           flexWrap: "wrap",
//           gap: 2,
//         }}
//       >
//         <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
//           <Box
//             sx={{
//               p: 1.5,
//               borderRadius: 2,
//               background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//             }}
//           >
//             <Iconify icon="solar:fire-bold-duotone" width={28} sx={{ color: "common.white" }} />
//           </Box>
//           <Box>
//             <Typography
//               variant="h4"
//               sx={{
//                 fontWeight: 700,
//                 fontSize: { xs: "1.25rem", md: "1.5rem" },
//               }}
//             >
//               Trending Now
//             </Typography>
//             <Typography variant="body2" color="text.secondary">
//               Most popular products this week
//             </Typography>
//           </Box>
//         </Box>

//         <Button
//           component={RouterLink}
//           href={paths.product.root}
//           endIcon={<Iconify icon="solar:arrow-right-bold" />}
//           sx={{
//             fontWeight: 600,
//             transition: "all 0.3s ease",
//             "&:hover": {
//               transform: "translateX(4px)",
//             },
//           }}
//         >
//           View All Products
//         </Button>
//       </Box>

//       <Box
//         sx={{
//           display: "grid",
//           gap: { xs: 2, sm: 2.5, md: 3 },
//           gridTemplateColumns: {
//             xs: "repeat(2, minmax(0, 1fr))",
//             sm: "repeat(3, minmax(0, 1fr))",
//             md: "repeat(4, minmax(0, 1fr))",
//             lg: "repeat(5, minmax(0, 1fr))",
//           },
//         }}
//       >
//         {products?.slice(0, 10)?.map((product, index) => (
//           <Box
//             key={product.product_id}
//             sx={{
//               animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`,
//             }}
//           >
//             <ProductItem
//               product={product}
//               detailsHref={paths.product.details(product.slug)}
//               isTrending={index < 3}
//             />
//           </Box>
//         ))}
//       </Box>
//     </Stack>
//   );
// }
"use client";

import { paths } from "@/routes/paths";
import { RouterLink } from "@/routes/components";

import { Iconify } from "@/components/iconify";
import { ProductItem } from "../product/product-item";

import { useAppSelector } from "@/redux/hooks";

// ----------------------------------------------------------------------

export function HomeTrendingProducts({ products }) {
  const { vendor } = useAppSelector((state) => state.vendor);

  const primaryColor = vendor?.primary_color || "#FF5630";
  const secondaryColor = vendor?.secondary_color || "#FFAB00";

  if (!products?.length) return null;

  return (
    <section className="flex flex-col gap-8 lg:mb-12 mb-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div
            className="p-3 rounded-xl flex items-center justify-center"
            style={{
              background: `linear-gradient(135deg, ${secondaryColor} 0%, ${primaryColor} 100%)`,
            }}
          >
            <Iconify icon="solar:fire-bold-duotone" width={24} className="text-white" />
          </div>
          <div>
            <h4 className="font-bold text-xl md:text-2xl">Trending Now</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Most popular products this week
            </p>
          </div>
        </div>

        <RouterLink
          href={paths.product.root}
          className="inline-flex items-center gap-1 font-semibold text-sm transition-transform duration-300 hover:translate-x-1"
        >
          View All Products
          <Iconify icon="solar:arrow-right-bold" width={18} />
        </RouterLink>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5 md:gap-6">
        {products?.slice(0, 10)?.map((product, index) => (
          <div
            key={product.product_id}
            className="animate-fade-in-up"
            style={{ animationDelay: `${index * 0.1}s`, animationFillMode: "both" }}
          >
            <ProductItem
              product={product}
              detailsHref={paths.product.details(product.slug)}
              isTrending={index < 3}
            />
          </div>
        ))}
      </div>
    </section>
  );
}