// import {
//   Box,
//   Link,
//   Avatar,
//   TableRow,
//   TableCell,
//   IconButton,
//   Button,
//   Typography,
// } from "@mui/material";

// import { CONFIG } from "@/global-config";

// import { RouterLink } from "@/routes/components";
// import { paths } from "@/routes/paths";

// import { fCurrency } from "@/utils/format-number";

// import { Iconify } from "@/components/iconify";

// // ----------------------------------------------------------------------

// export function WishlistProduct({ row, onMoveToCart, onDelete }) {
//   const { wishlist_id, product_name, slug, product_image, price, variant_id, variant_name } = row;

//   const { regularPrice, flashSalePrice } = price || {};

//   // const shouldUseFlashSalePrice = Number(flashSalePrice) < Number(regularPrice);

//   return (
//     <TableRow>
//       <TableCell>
//         <Box sx={{ gap: 2, display: "flex", alignItems: "center" }}>
//           <Avatar
//             variant="rounded"
//             alt={product_name}
//             src={`${product_image}`}
//             sx={{ width: 64, height: 64 }}
//           />

//           <Link
//             component={RouterLink}
//             href={paths.product.details(slug)}
//             sx={{ color: "inherit", typography: "subtitle2", maxWidth: 240 }}
//           >
//             {product_name}
//           </Link>
//         </Box>
//       </TableCell>

//       <TableCell>
//         {/* {shouldUseFlashSalePrice ? ( */}
//         {/* <Box
//             sx={{
//               gap: 0.5,
//               display: "flex",
//               typography: "body2",
//             }}
//           >
//             <Box
//               component="span"
//               sx={{ color: "text.disabled", textDecoration: "line-through" }}
//             >
//               {fCurrency(regularPrice)}
//             </Box>

//             <Box component="span">{fCurrency(flashSalePrice)}</Box>
//           </Box>
//         ) : ( */}
//         <Typography variant="body2">{fCurrency(price)}</Typography>
//         {/* )} */}
//       </TableCell>

//       <TableCell align="right">
//         <Button
//           variant="outlined"
//           color="primary"
//           onClick={() => onMoveToCart(row)}
//         >
//           Add to Cart
//         </Button>
//       </TableCell>

//       <TableCell align="right" sx={{ px: 1 }}>
//         <IconButton color="error" onClick={() => onDelete(wishlist_id)}>
//           <Iconify icon="solar:trash-bin-trash-bold" />
//         </IconButton>
//       </TableCell>
//     </TableRow>
//   );
// }
import { CONFIG } from "@/global-config";

import { RouterLink } from "@/routes/components";
import { paths } from "@/routes/paths";

import { fCurrency } from "@/utils/format-number";
import { getItemNames } from "@/utils/item-display";

import { Iconify } from "@/components/iconify";

// ----------------------------------------------------------------------

export function WishlistProduct({ row, onMoveToCart, onDelete }) {
  const { wishlist_id, slug, product_image, price } = row;

  const { productName, variantName } = getItemNames(row);

  return (
    <tr className="align-middle">
      {/* Product */}
      <td className="p-4">
        <div className="flex items-center gap-2">
          <img
            alt={productName}
            src={`${product_image}`}
            className="w-16 h-16 rounded-lg object-cover flex-shrink-0 bg-gray-100"
          />

          <div className="flex flex-col gap-1">
            <RouterLink
              href={paths.product.details(slug)}
              className="text-sm font-semibold text-gray-900 hover:underline line-clamp-2 max-w-[240px]"
            >
              {productName}
            </RouterLink>

            {variantName && (
              <span className="text-xs text-gray-500">
                Variant: <span className="font-medium text-gray-700">{variantName}</span>
              </span>
            )}
          </div>
        </div>
      </td>

      {/* Price */}
      <td className="px-4 py-2">
        <span className="text-sm text-gray-800">{fCurrency(price)}</span>
      </td>

      {/* Add to Cart */}
      <td className="px-4 py-2 text-right">
        <button
          onClick={() => onMoveToCart(row)}
          className="inline-flex items-center justify-center px-2 py-1 text-sm font-medium border border-black-400 text-black-600 rounded-lg hover:bg-blue-50 transition-colors"
        >
          Add to Cart
        </button>
      </td>

      {/* Delete */}
      <td className="px-1 py-2 text-right last:pr-6">
        <button
          onClick={() => onDelete(wishlist_id)}
          className="inline-flex items-center justify-center w-9 h-9 rounded-full text-red-500 hover:bg-red-50 transition-colors"
        >
          <Iconify icon="solar:trash-bin-trash-bold" className="w-5 h-5" />
        </button>
      </td>
    </tr>
  );
}