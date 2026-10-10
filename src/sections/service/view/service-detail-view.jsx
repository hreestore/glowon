// "use client";

// import {
//   Box,
//   Container,
//   Typography,
//   Stack,
//   useTheme,
//   Card,
//   Button,
//   Chip,
//   Skeleton,
// } from "@mui/material";
// import Grid from "@mui/material/Grid2";
// import { varAlpha } from "minimal-shared/utils";

// import { useAppSelector } from "@/redux/hooks";

// import { paths } from "@/routes/paths";
// import { RouterLink } from "@/routes/components";

// import { Iconify } from "@/components/iconify";
// import { Markdown } from "@/components/markdown";
// import { EmptyContent } from "@/components/empty-content";

// import { ServiceInquiryForm } from "../service-inquiry-form";
// import { useGetServiceDetail, useGetServiceData } from "@/api/service";

// // Map FontAwesome icons to Solar icons
// const FA_TO_SOLAR_ICON_MAP = {
//   "fa-star": "solar:star-bold-duotone",
//   "fa-lightbulb": "solar:lightbulb-bolt-bold-duotone",
//   "fa-headset": "solar:headphones-round-sound-bold-duotone",
//   "fa-users-cog": "solar:users-group-rounded-bold-duotone",
//   "fa-shield": "solar:shield-check-bold-duotone",
//   "fa-rocket": "solar:rocket-bold-duotone",
//   "fa-cog": "solar:settings-bold-duotone",
//   "fa-check": "solar:verified-check-bold-duotone",
//   "fa-heart": "solar:heart-bold-duotone",
//   "fa-clock": "solar:clock-circle-bold-duotone",
//   "fa-truck": "solar:delivery-bold-duotone",
//   "fa-dollar-sign": "solar:tag-price-bold-duotone",
//   "fa-box": "solar:box-bold-duotone",
//   "fa-shopping-cart": "solar:cart-bold-duotone",
//   "fa-credit-card": "solar:card-bold-duotone",
//   "fa-globe": "solar:global-bold-duotone",
//   "fa-phone": "solar:phone-bold-duotone",
//   "fa-envelope": "solar:letter-bold-duotone",
//   "fa-code": "solar:code-bold-duotone",
//   "fa-paint-brush": "solar:pallete-2-bold-duotone",
//   "fa-chart-line": "solar:chart-bold-duotone",
//   "fa-search": "solar:magnifer-bold-duotone",
// };

// // Helper to convert FA icon to Solar icon
// const getSolarIcon = (faIcon) =>
//   FA_TO_SOLAR_ICON_MAP[faIcon] || faIcon || "solar:star-bold-duotone";

// // Rotate through colors for visual variety
// const SERVICE_COLORS = [
//   "primary",
//   "info",
//   "success",
//   "warning",
//   "secondary",
//   "error",
// ];

// // Loading skeleton component
// function ServiceDetailSkeleton() {
//   return (
//     <Box>
//       <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: "grey.200" }}>
//         <Container maxWidth="lg">
//           <Stack spacing={3}>
//             <Skeleton variant="rounded" width={120} height={32} />
//             <Skeleton variant="text" width="60%" height={60} />
//             <Skeleton variant="text" width="80%" height={24} />
//             <Skeleton variant="text" width="70%" height={24} />
//           </Stack>
//         </Container>
//       </Box>
//       <Container maxWidth="lg" sx={{ py: 6 }}>
//         <Grid container spacing={4}>
//           <Grid size={{ xs: 12, md: 8 }}>
//             <Skeleton variant="rounded" height={400} />
//           </Grid>
//           <Grid size={{ xs: 12, md: 4 }}>
//             <Skeleton variant="rounded" height={300} />
//           </Grid>
//         </Grid>
//       </Container>
//     </Box>
//   );
// }

// export function ServiceDetailView({ slug }) {
//   const theme = useTheme();
//   const { vendor } = useAppSelector((state) => state.vendor);

//   const primaryColor = vendor?.primary_color || theme.palette.primary.main;
//   const secondaryColor =
//     vendor?.secondary_color || theme.palette.secondary.main;

//   // Fetch service detail from API
//   const { serviceDetail, isLoading, error } = useGetServiceDetail(slug);

//   // Fetch all services for related services
//   const { serviceData: allServices } = useGetServiceData();

//   // Get related services (exclude current)
//   const relatedServices = (allServices || [])
//     .filter((s) => s.slug !== slug)
//     .slice(0, 3)
//     .map((s, index) => ({
//       ...s,
//       color: SERVICE_COLORS[index % SERVICE_COLORS.length],
//     }));

//   // Show loading state
//   if (isLoading) {
//     return <ServiceDetailSkeleton />;
//   }

//   // Show error/not found state
//   if (error || !serviceDetail?.title) {
//     return (
//       <Container maxWidth="lg" sx={{ py: 10 }}>
//         <EmptyContent
//           title="Service Not Found"
//           description="Oops! The service you're looking for isn't available."
//           action={
//             <Button
//               component={RouterLink}
//               href={paths.service.root}
//               startIcon={<Iconify icon="eva:arrow-ios-back-fill" width={16} />}
//               sx={{ mt: 3 }}
//             >
//               Back to Services
//             </Button>
//           }
//         />
//       </Container>
//     );
//   }

//   // Destructure service detail properties
//   const { title, short_description, description, icon } = serviceDetail;

//   return (
//     <Box component="main">
//       {/* Hero Section */}
//       <Box
//         sx={{
//           position: "relative",
//           py: { xs: 8, md: 12 },
//           overflow: "hidden",
//           background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`,
//           "&::before": {
//             content: '""',
//             position: "absolute",
//             inset: 0,
//             backgroundImage: `
//               linear-gradient(${varAlpha(
//               theme.vars.palette.common.whiteChannel,
//               0.03
//             )} 1px, transparent 1px),
//               linear-gradient(90deg, ${varAlpha(
//               theme.vars.palette.common.whiteChannel,
//               0.03
//             )} 1px, transparent 1px)
//             `,
//             backgroundSize: "40px 40px",
//             pointerEvents: "none",
//           },
//         }}
//       >
//         {/* Floating Icon */}
//         <Box
//           sx={{
//             position: "absolute",
//             top: "20%",
//             right: "10%",
//             opacity: 0.15,
//             animation: "floatService 6s ease-in-out infinite",
//             "@keyframes floatService": {
//               "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
//               "50%": { transform: "translateY(-20px) rotate(10deg)" },
//             },
//           }}
//         >
//           <Iconify
//             icon={getSolarIcon(icon)}
//             width={150}
//             sx={{ color: "common.white" }}
//           />
//         </Box>

//         <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
//           {/* Breadcrumb */}
//           <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 4 }}>
//             <Button
//               component={RouterLink}
//               href={paths.service.root}
//               startIcon={<Iconify icon="solar:arrow-left-bold" />}
//               sx={{
//                 color: "common.white",
//                 opacity: 0.9,
//                 "&:hover": {
//                   opacity: 1,
//                   bgcolor: varAlpha(
//                     theme.vars.palette.common.whiteChannel,
//                     0.1
//                   ),
//                 },
//               }}
//             >
//               Back to Services
//             </Button>
//           </Stack>

//           <Grid container spacing={4} alignItems="center">
//             <Grid size={{ xs: 12, md: 8 }}>
//               <Stack spacing={3} sx={{ color: "common.white" }}>
//                 <Chip
//                   label="Our Service"
//                   sx={{
//                     alignSelf: "flex-start",
//                     bgcolor: varAlpha(
//                       theme.vars.palette.common.whiteChannel,
//                       0.15
//                     ),
//                     color: "common.white",
//                     fontWeight: 600,
//                   }}
//                 />

//                 <Typography
//                   variant="h1"
//                   sx={{
//                     fontWeight: 800,
//                     fontSize: { xs: "2rem", md: "3rem" },
//                     textShadow: "0 4px 20px rgba(0,0,0,0.2)",
//                   }}
//                 >
//                   {title}
//                 </Typography>

//                 <Markdown
//                   sx={{
//                     fontWeight: 400,
//                     opacity: 0.9,
//                     lineHeight: 1.7,
//                     maxWidth: 600,
//                   }}
//                   children={short_description}
//                 />
//               </Stack>
//             </Grid>

//             <Grid size={{ xs: 12, md: 4 }}>
//               <Box
//                 sx={{
//                   p: 4,
//                   borderRadius: 3,
//                   bgcolor: varAlpha(
//                     theme.vars.palette.common.whiteChannel,
//                     0.1
//                   ),
//                   backdropFilter: "blur(10px)",
//                   border: `1px solid ${varAlpha(
//                     theme.vars.palette.common.whiteChannel,
//                     0.2
//                   )}`,
//                 }}
//               >
//                 <Stack spacing={2} alignItems="center">
//                   <Box
//                     sx={{
//                       p: 3,
//                       borderRadius: "50%",
//                       bgcolor: varAlpha(
//                         theme.vars.palette.common.whiteChannel,
//                         0.2
//                       ),
//                     }}
//                   >
//                     <Iconify
//                       icon={getSolarIcon(serviceDetail?.icon)}
//                       width={64}
//                       sx={{ color: "common.white" }}
//                     />
//                   </Box>
//                   <Typography
//                     variant="body2"
//                     sx={{
//                       color: "common.white",
//                       opacity: 0.9,
//                       textAlign: "center",
//                     }}
//                   >
//                     Premium service designed for your convenience
//                   </Typography>
//                 </Stack>
//               </Box>
//             </Grid>
//           </Grid>
//         </Container>
//       </Box>

//       {/* Content Section */}
//       <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
//         <Grid container spacing={{ xs: 4, md: 8 }}>
//           {/* Main Content */}
//           <Grid size={{ xs: 12, md: 8 }}>
//             <Stack spacing={5}>
//               {/* Full Description */}
//               <Box>
//                 <Typography variant="h2" sx={{ fontWeight: 700, mb: 3, fontSize: { xs: "1rem", md: "1.5rem" } }}>
//                   About This Service
//                 </Typography>
//                 <Box
//                   sx={{
//                     "& p": {
//                       color: "text.secondary",
//                       lineHeight: 1.9,
//                       mb: 2,
//                     },
//                     "& strong": {
//                       color: "text.primary",
//                     },
//                     "& ul, & ol": {
//                       pl: 2,
//                       "& li": {
//                         color: "text.secondary",
//                         mb: 1,
//                       },
//                     },
//                   }}
//                 >
//                   <Markdown children={description} />
//                 </Box>
//               </Box>

//               {/* CTA Section */}
//               <Card
//                 sx={{
//                   p: 4,
//                   borderRadius: 3,
//                   background: `linear-gradient(135deg, ${primaryColor}15 0%, ${secondaryColor}15 100%)`,
//                   border: `1px solid ${varAlpha(
//                     theme.vars.palette.primary.mainChannel,
//                     0.2
//                   )}`,
//                 }}
//               >
//                 <Stack
//                   direction={{ xs: "column", sm: "row" }}
//                   spacing={3}
//                   alignItems={{ xs: "stretch", sm: "center" }}
//                   justifyContent="space-between"
//                 >
//                   <Box>
//                     <Typography variant="body1" sx={{ fontWeight: 700, mb: 1 }}>
//                       Ready to Get Started?
//                     </Typography>
//                     <Typography
//                       variant="body2"
//                       sx={{ color: "text.secondary" }}
//                     >
//                       Experience the benefits of this service today.
//                     </Typography>
//                   </Box>
//                   <Button
//                     component={RouterLink}
//                     href={paths.category}
//                     variant="contained"
//                     size="large"
//                     sx={{
//                       px: 4,
//                       py: 1.5,
//                       borderRadius: 2,
//                       fontWeight: 700,
//                       background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`,
//                       boxShadow: `0 8px 24px ${varAlpha(
//                         theme.vars.palette.primary.mainChannel,
//                         0.3
//                       )}`,
//                       "&:hover": {
//                         background: `linear-gradient(135deg, ${primaryColor} 20%, ${secondaryColor} 100%)`,
//                       },
//                     }}
//                     endIcon={<Iconify icon="solar:arrow-right-bold" />}
//                   >
//                     Start Shopping
//                   </Button>
//                 </Stack>
//               </Card>

//               {/* Inquiry Form */}
//               <Box>
//                 <Typography variant="h3" sx={{ fontWeight: 700, mb: 3, fontSize: { xs: "1rem", md: "1.5rem" } }}>
//                   Have Any Questions?
//                 </Typography>
//                 <ServiceInquiryForm serviceTitle={title} serviceSlug={slug} />
//               </Box>
//             </Stack>
//           </Grid>

//           {/* Sidebar */}
//           <Grid size={{ xs: 12, md: 4 }}>
//             <Stack spacing={4} sx={{ position: { md: "sticky" }, top: 100 }}>
//               {/* Contact Card */}
//               <Card
//                 sx={{
//                   p: 3,
//                   borderRadius: 3,
//                   background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`,
//                 }}
//               >
//                 <Stack spacing={2} sx={{ color: "common.white" }}>
//                   <Iconify
//                     icon="solar:chat-round-call-bold-duotone"
//                     width={40}
//                   />
//                   <Typography variant="body1" sx={{ fontWeight: 700 }}>
//                     Need Help?
//                   </Typography>
//                   <Typography variant="body2" sx={{ opacity: 0.9 }}>
//                     Our support team is here to assist you with any questions.
//                   </Typography>
//                   <Button
//                     variant="contained"
//                     sx={{
//                       bgcolor: "common.white",
//                       color: primaryColor,
//                       "&:hover": {
//                         bgcolor: "common.white",
//                         opacity: 0.9,
//                       },
//                     }}
//                   >
//                     Contact Support
//                   </Button>
//                 </Stack>
//               </Card>
//             </Stack>
//           </Grid>
//         </Grid>
//       </Container>

//       {/* Related Services */}
//       <Box
//         sx={{
//           py: { xs: 6, md: 10 },
//           bgcolor: varAlpha(theme.vars.palette.grey["500Channel"], 0.04),
//         }}
//       >
//         <Container maxWidth="lg">
//           <Stack spacing={4}>
//             <Stack spacing={1}>
//               <Typography variant="h3" sx={{ fontWeight: 800, fontSize: { xs: "1rem", md: "1.5rem" } }}>
//                 Related Services
//               </Typography>
//               <Typography variant="body1" sx={{ color: "text.secondary" }}>
//                 Explore other services we offer
//               </Typography>
//             </Stack>

//             <Grid container spacing={3}>
//               {relatedServices.map((relatedService) => (
//                 <Grid key={relatedService.slug} size={{ xs: 12, sm: 6, md: 4 }}>
//                   <Card
//                     component={RouterLink}
//                     href={paths.service.details(relatedService.slug)}
//                     sx={{
//                       textDecoration: "none",
//                       // border: `1px solid ${varAlpha(
//                       //   theme.vars.palette.grey["500Channel"],
//                       //   0.12
//                       // )}`,
//                       // p: 3,
//                       boxShadow: "none",
//                       borderRadius: 3,
//                       transition: "all 0.3s ease",
//                       "&:hover": {
//                         transform: "translateY(-4px)",
//                         // borderColor: `${relatedService.color}.main`,
//                         "& .related-icon": {
//                           bgcolor: `${relatedService.color}.main`,
//                           color: "common.white",
//                         },
//                       },
//                     }}
//                   >
//                     <Stack spacing={2}>
//                       <Box
//                         className="related-icon"
//                         sx={{
//                           width: 48,
//                           height: 48,
//                           borderRadius: 2,
//                           display: "flex",
//                           alignItems: "center",
//                           justifyContent: "center",
//                           bgcolor: varAlpha(
//                             theme.vars.palette[relatedService.color]
//                               .mainChannel,
//                             0.12
//                           ),
//                           color: `${relatedService.color}.main`,
//                           transition: "all 0.3s ease",
//                         }}
//                       >
//                         <Iconify
//                           icon={getSolarIcon(relatedService.icon)}
//                           width={24}
//                         />
//                       </Box>
//                       <Typography
//                         variant="h4"
//                         sx={{ fontWeight: 700, color: "text.primary", fontSize: { xs: "1rem", md: "1.1rem" } }}
//                       >
//                         {relatedService.title}
//                       </Typography>
//                       <Typography
//                         variant="body2"
//                         sx={{
//                           color: "text.secondary",
//                           lineHeight: 1.6,
//                           display: "-webkit-box",
//                           WebkitLineClamp: 2,
//                           WebkitBoxOrient: "vertical",
//                           overflow: "hidden",
//                         }}
//                       >
//                         {relatedService.short_description}
//                       </Typography>
//                     </Stack>
//                   </Card>
//                 </Grid>
//               ))}
//             </Grid>
//           </Stack>
//         </Container>
//       </Box>
//     </Box>
//   );
// }
"use client";

import { useAppSelector } from "@/redux/hooks";
import { useGetServiceDetail, useGetServiceData } from "@/api/service";

import { Iconify } from "@/components/iconify";
import { Markdown } from "@/components/markdown";
import { EmptyContent } from "@/components/empty-content";

import { ServiceInquiryForm } from "../service-inquiry-form";
import { paths } from "@/routes/paths";
import { RouterLink } from "@/routes/components";

// ---------------- ICON MAP ----------------
const FA_TO_SOLAR_ICON_MAP = {
  "fa-star": "solar:star-bold-duotone",
  "fa-lightbulb": "solar:lightbulb-bolt-bold-duotone",
  "fa-headset": "solar:headphones-round-sound-bold-duotone",
  "fa-users-cog": "solar:users-group-rounded-bold-duotone",
  "fa-shield": "solar:shield-check-bold-duotone",
  "fa-rocket": "solar:rocket-bold-duotone",
  "fa-cog": "solar:settings-bold-duotone",
  "fa-check": "solar:verified-check-bold-duotone",
  "fa-heart": "solar:heart-bold-duotone",
  "fa-clock": "solar:clock-circle-bold-duotone",
  "fa-truck": "solar:delivery-bold-duotone",
  "fa-dollar-sign": "solar:tag-price-bold-duotone",
  "fa-box": "solar:box-bold-duotone",
  "fa-shopping-cart": "solar:cart-bold-duotone",
  "fa-credit-card": "solar:card-bold-duotone",
  "fa-globe": "solar:global-bold-duotone",
  "fa-phone": "solar:phone-bold-duotone",
  "fa-envelope": "solar:letter-bold-duotone",
};

const getSolarIcon = (icon) =>
  FA_TO_SOLAR_ICON_MAP[icon] || icon || "solar:star-bold-duotone";

const SERVICE_COLORS = ["primary", "info", "success", "warning", "secondary", "error"];

function SkeletonBox({ className }) {
  return <div className={`animate-pulse bg-gray-200 rounded ${className}`} />;
}

export function ServiceDetailView({ slug }) {
  const { vendor } = useAppSelector((state) => state.vendor);

  const primaryColor = vendor?.primary_color || "#6366f1";
  const secondaryColor = vendor?.secondary_color || "#06b6d4";

  const { serviceDetail, isLoading, error } = useGetServiceDetail(slug);
  const { serviceData } = useGetServiceData();

  const relatedServices = (serviceData || [])
    .filter((s) => s.slug !== slug)
    .slice(0, 3)
    .map((s, i) => ({
      ...s,
      color: SERVICE_COLORS[i % SERVICE_COLORS.length],
    }));

  if (isLoading) {
    return (
      <div>
        <div className="py-20 bg-gray-100">
          <div className="max-w-6xl mx-auto px-4 space-y-3">
            <SkeletonBox className="h-6 w-32" />
            <SkeletonBox className="h-10 w-2/3" />
            <SkeletonBox className="h-4 w-3/4" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !serviceDetail) {
    return (
      <div className="max-w-6xl mx-auto py-20 text-center">
        <EmptyContent
          title="Service Not Found"
          description="The service you're looking for isn't available."
          action={
            <RouterLink
              href={paths.service.root}
              className="mt-4 inline-flex items-center gap-2 text-blue-600"
            >
              <Iconify icon="solar:arrow-left-bold" />
              Back to Services
            </RouterLink>
          }
        />
      </div>
    );
  }

  const { title, short_description, description, icon } = serviceDetail;

  return (
    <main className="w-full">
      {/* HERO */}
      <section
        className="relative py-20 text-white overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
        }}
      >
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(#fff1_1px,transparent_1px),linear-gradient(90deg,#fff1_1px,transparent_1px)] bg-[40px_40px]" />

        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <RouterLink
            href={paths.service.root}
            className="inline-flex items-center gap-2 mb-6 opacity-90"
          >
            <Iconify icon="solar:arrow-left-bold" />
            Back to Services
          </RouterLink>

          <div className="grid md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-8 space-y-4">
              <span className="px-3 py-1 bg-white/20 rounded-full text-sm">
                Our Service
              </span>

              <h1 className="text-3xl md:text-5xl font-bold">{title}</h1>

              <p className="opacity-90 max-w-xl">{short_description}</p>
            </div>

            <div className="md:col-span-4">
              <div className="p-6 rounded-xl bg-white/10 border border-white/20 text-center backdrop-blur">
                <Iconify icon={getSolarIcon(icon)} width={60} />
                <p className="mt-3 text-sm opacity-90">
                  Premium service for your convenience
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="max-w-6xl mx-auto px-4 py-16 grid md:grid-cols-12 gap-10">
        {/* LEFT */}
        <div className="md:col-span-8 space-y-10">
          <div>
            <h2 className="text-xl font-bold mb-4">About This Service</h2>
            <div className="text-gray-600 leading-relaxed">
              <Markdown>{description}</Markdown>
            </div>
          </div>

          {/* CTA */}
          <div
            className="p-6 rounded-xl border flex flex-col sm:flex-row justify-between items-center gap-4"
            style={{
              background: `${primaryColor}10`,
              borderColor: `${primaryColor}40`,
            }}
          >
            <div>
              <h3 className="font-semibold">Ready to get started?</h3>
              <p className="text-sm text-gray-500">
                Experience this service today
              </p>
            </div>

            <RouterLink
              href={paths.category}
              className="px-6 py-3 rounded-lg text-white font-semibold"
              style={{
                background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
              }}
            >
              Start Shopping
            </RouterLink>
          </div>

          {/* FORM */}
          <div>
            <h3 className="text-lg font-bold mb-4">Have Any Questions?</h3>
            <ServiceInquiryForm serviceTitle={title} serviceSlug={slug} />
          </div>
        </div>

        {/* RIGHT */}
        <div className="md:col-span-4">
          <div className="sticky top-24">
            <div
              className="p-5 rounded-xl text-white"
              style={{
                background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
              }}
            >
              <Iconify icon="solar:chat-round-call-bold-duotone" width={40} />
              <h4 className="font-bold mt-2">Need Help?</h4>
              <p className="text-sm opacity-90 mt-1">
                Our support team is here to help
              </p>

              <button className="mt-4 w-full bg-white text-black py-2 rounded-lg font-semibold">
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* RELATED */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 space-y-6">
          <h3 className="text-xl font-bold">Related Services</h3>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {relatedServices.map((item) => (
              <RouterLink
                key={item.slug}
                href={paths.service.details(item.slug)}
                className="p-5 bg-white border rounded-xl hover:-translate-y-1 transition block"
              >
                <div
                  className="w-10 h-10 flex items-center justify-center rounded-lg mb-3"
                  style={{ background: `${item.color}20` }}
                >
                  <Iconify icon={getSolarIcon(item.icon)} width={20} />
                </div>

                <h4 className="font-semibold">{item.title}</h4>
                <p className="text-sm text-gray-500 line-clamp-2 mt-1">
                  {item.short_description}
                </p>
              </RouterLink>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}