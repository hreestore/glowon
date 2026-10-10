// import { varAlpha } from "minimal-shared/utils";

// import { Link, Card, CardContent, Typography, Box, Stack, Chip, useTheme } from "@mui/material";

// import { CONFIG } from "@/global-config";

// import { useAppSelector } from "@/redux/hooks";

// import { RouterLink } from "@/routes/components";

// import { fDate } from "@/utils/format-time";

// import { Image } from "@/components/image";
// import { Iconify } from "@/components/iconify";

// // ----------------------------------------------------------------------

// export function BlogItem({ blog, detailsHref }) {
//   const theme = useTheme();
//   const { vendor } = useAppSelector((state) => state.vendor);
//   const { title, featured_image, created_at, short_description, category, reading_time } = blog || {};

//   const primaryColor = vendor?.primary_color || theme.palette.primary.main;

//   return (
//     <Card
//       sx={{
//         position: "relative",
//         borderRadius: 3,
//         overflow: "hidden",
//         transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
//         border: `1px solid ${varAlpha(theme.vars.palette.grey["500Channel"], 0.08)}`,
//         "&:hover": {
//           transform: "translateY(-8px)",
//           boxShadow: `0 20px 40px ${varAlpha(theme.vars.palette.grey["500Channel"], 0.2)}`,
//           "& .blog-image": {
//             transform: "scale(1.08)",
//           },
//           "& .blog-overlay": {
//             opacity: 0.5,
//           },
//           "& .read-more-btn": {
//             opacity: 1,
//             transform: "translateY(0)",
//           },
//         },
//       }}
//     >
//       {/* Image Container */}
//       <Box sx={{ position: "relative", overflow: "hidden" }}>
//         <Image
//           className="blog-image"
//           alt={title}
//           title={title}
//           src={`${featured_image}`}
//           ratio="16/10"
//           sx={{
//             transition: "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
//           }}
//         />

//         {/* Gradient Overlay */}
//         <Box
//           className="blog-overlay"
//           sx={{
//             position: "absolute",
//             inset: 0,
//             background: `linear-gradient(180deg, transparent 0%, ${varAlpha(theme.vars.palette.grey["900Channel"], 0.9)} 100%)`,
//             opacity: 0.7,
//             transition: "opacity 0.4s ease",
//           }}
//         />

//         {/* Category Badge */}
//         {category && (
//           <Chip
//             label={category.name || category}
//             size="small"
//             sx={{
//               position: "absolute",
//               top: 16,
//               left: 16,
//               bgcolor: primaryColor,
//               color: "common.white",
//               fontWeight: 600,
//               fontSize: "0.7rem",
//               height: 26,
//               boxShadow: `0 4px 12px ${varAlpha(theme.vars.palette.common.blackChannel, 0.3)}`,
//             }}
//           />
//         )}

//         {/* Reading Time Badge */}
//         {reading_time && (
//           <Box
//             sx={{
//               position: "absolute",
//               top: 16,
//               right: 16,
//               display: "flex",
//               alignItems: "center",
//               gap: 0.5,
//               px: 1.5,
//               py: 0.5,
//               borderRadius: 2,
//               bgcolor: varAlpha(theme.vars.palette.common.whiteChannel, 0.15),
//               backdropFilter: "blur(8px)",
//               color: "common.white",
//             }}
//           >
//             <Iconify icon="solar:clock-circle-bold" width={14} />
//             <Typography variant="caption" sx={{ fontWeight: 600 }}>
//               {reading_time} min
//             </Typography>
//           </Box>
//         )}

//         {/* Bottom Content Overlay */}
//         <CardContent
//           sx={{
//             position: "absolute",
//             bottom: 0,
//             left: 0,
//             right: 0,
//             zIndex: 9,
//             color: "common.white",
//             p: 3,
//           }}
//         >
//           {/* Date */}
//           <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
//             <Iconify icon="solar:calendar-bold" width={16} sx={{ opacity: 0.8 }} />
//             <Typography variant="caption" sx={{ opacity: 0.8, fontWeight: 500 }}>
//               {fDate(created_at)}
//             </Typography>
//           </Stack>

//           {/* Title */}
//           <Link
//             component={RouterLink}
//             href={detailsHref}
//             color="inherit"
//             underline="none"
//           >
//             <Typography
//               variant="h4"
//               sx={{
//                 fontWeight: 700,
//                 lineHeight: 1.4,
//                 display: "-webkit-box",
//                 WebkitLineClamp: 2,
//                 WebkitBoxOrient: "vertical",
//                 overflow: "hidden",
//                 transition: "color 0.3s ease",
//                 "&:hover": {
//                   color: primaryColor,
//                 },
//               }}
//             >
//               {title}
//             </Typography>
//           </Link>
//         </CardContent>
//       </Box>

//       {/* Bottom Card Content */}
//       <CardContent sx={{ p: 3, pt: 2 }}>
//         {/* Description */}
//         {short_description && (
//           <Typography
//             variant="body2"
//             sx={{
//               color: "text.secondary",
//               lineHeight: 1.7,
//               display: "-webkit-box",
//               WebkitLineClamp: 2,
//               WebkitBoxOrient: "vertical",
//               overflow: "hidden",
//               mb: 2,
//             }}
//           >
//             {short_description}
//           </Typography>
//         )}

//         {/* Read More Link */}
//         <Link
//           component={RouterLink}
//           href={detailsHref}
//           underline="none"
//           className="read-more-btn"
//           sx={{
//             display: "inline-flex",
//             alignItems: "center",
//             gap: 0.5,
//             fontWeight: 700,
//             fontSize: "0.875rem",
//             color: primaryColor,
//             transition: "all 0.3s ease",
//             "&:hover": {
//               gap: 1,
//             },
//           }}
//         >
//           Read Article
//           <Iconify icon="solar:arrow-right-bold" width={18} />
//         </Link>
//       </CardContent>
//     </Card>
//   );
// }
import { CONFIG } from "@/global-config";

import { useAppSelector } from "@/redux/hooks";

import { RouterLink } from "@/routes/components";

import { fDate } from "@/utils/format-time";

import { Image } from "@/components/image";
import { Iconify } from "@/components/iconify";

// ----------------------------------------------------------------------

export function BlogItem({ blog, detailsHref }) {
  const { vendor } = useAppSelector((state) => state.vendor);
  const { title, featured_image, created_at, short_description, category, reading_time } = blog || {};

  const primaryColor = vendor?.primary_color || "#1976d2";

  return (
    <div
      className="group relative rounded-3xl overflow-hidden border border-black/[0.08] shadow-lg"
      style={{ transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)" }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-8px)";
        e.currentTarget.style.boxShadow = "0 20px 40px rgba(0,0,0,0.2)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {/* ── Image Container ── */}
      <div className="relative overflow-hidden">
        <img
          alt={title}
          title={title}
          src={`${featured_image}`}
          width="100%"
          height="350px"
          className="transition-transform h-[280px] duration-[600ms] [transition-timing-function:cubic-bezier(0.4,0,0.2,1)] group-hover:scale-[1.08]"
        />

        {/* Gradient Overlay */}
        <div
          className="absolute inset-0 transition-opacity duration-[400ms] ease-in-out group-hover:opacity-50"
          style={{
            background: "linear-gradient(180deg, transparent 0%, rgba(33,33,33,0.9) 100%)",
            opacity: 0.7,
          }}
        />

        {/* Category Badge */}
        {category && (
          <span
            className="absolute top-4 left-4 text-white text-[0.7rem] font-semibold h-[26px] px-2 inline-flex items-center rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.3)]"
            style={{ backgroundColor: primaryColor }}
          >
            {category.name || category}
          </span>
        )}

        {/* Reading Time Badge */}
        {/* {reading_time && (
          <div
            className="absolute top-4 right-4 flex items-center gap-1 px-3 py-1 rounded-xl text-white backdrop-blur-md"
            style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
          >
            <Iconify icon="solar:clock-circle-bold" width={14} />
            <span className="text-xs font-semibold">{reading_time} min</span>
          </div>
        )} */}

        {/* Bottom Content Overlay (date + title) */}
        <div className="absolute bottom-0 left-0 right-0 z-10 text-white p-3">
          {/* Date */}
          <div className="flex flex-row items-center gap-2 mb-1">
            <Iconify icon="solar:calendar-bold" width={16} className="opacity-80" />
            <span className="text-xs font-medium opacity-80">{fDate(created_at)}</span>
          </div>

          {/* Title */}
          <RouterLink href={detailsHref} className="no-underline text-white">
            <h4
              className="font-bold leading-[1.4] transition-colors duration-300"
              style={{
                fontSize: "1.25rem",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = primaryColor)}
              onMouseLeave={(e) => (e.currentTarget.style.color = "white")}
            >
              {title}
            </h4>
          </RouterLink>
        </div>
      </div>

      {/* ── Bottom Card Content ── */}
      <div className="p-3">
        {/* Description */}
        {short_description && (
          <p
            className="text-sm text-gray-500 leading-[1.7] mb-4"
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {short_description}
          </p>
        )}

        {/* Read More Link */}
        <RouterLink
          href={detailsHref}
          className="inline-flex items-center gap-1 text-sm font-bold no-underline transition-all duration-300 hover:gap-2"
          style={{ color: primaryColor }}
        >
          Read Article
          <Iconify icon="solar:arrow-right-bold" width={18} />
        </RouterLink>
      </div>
    </div>
  );
}