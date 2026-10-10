// "use client";

// import { Box, Container, Typography, Stack, useTheme, Card, Grid2 } from "@mui/material";
// import { varAlpha } from "minimal-shared/utils";

// import { useAppSelector } from "@/redux/hooks";

// import { Iconify } from "@/components/iconify";
// import { useGetAboutData } from "@/api/about";

// // ----------------------------------------------------------------------
// // const fallbackMissionVisions = [
// //   {
// //     id: 1,
// //     type: "mission",
// //     title: "Our Mission",
// //     icon: "solar:target-bold-duotone",
// //     description:
// //       "To market, supply, and partner with leading global healthcare brands by delivering superior-quality products, innovative formulations, and strategic marketing solutions that meet evolving healthcare needs.",
// //   },
// //   {
// //     id: 2,
// //     type: "vision",
// //     title: "Our Vision",
// //     icon: "solar:eye-bold-duotone",
// //     description:
// //       "To be a trusted healthcare marketing and trading partner, recognized for bringing innovative, high-quality nutraceutical, wellness, and medical products that improve lives globally.",
// //   },
// // ];

// // Map FA icons to Solar icons and assign colors based on type
// const getIconAndColor = (type, index) => {
//   const typeMap = {
//     mission: { icon: "solar:target-bold-duotone", color: "primary" },
//     vision: { icon: "solar:eye-bold-duotone", color: "secondary" },
//     values: { icon: "solar:heart-pulse-bold-duotone", color: "success" },
//     goal: { icon: "solar:flag-bold-duotone", color: "info" },
//   };

//   const fallbackColors = ["primary", "secondary", "success", "info", "warning"];
//   const fallbackIcons = [
//     "solar:target-bold-duotone",
//     "solar:eye-bold-duotone",
//     "solar:heart-pulse-bold-duotone",
//     "solar:flag-bold-duotone",
//     "solar:star-bold-duotone",
//   ];

//   if (type && typeMap[type.toLowerCase()]) {
//     return typeMap[type.toLowerCase()];
//   }

//   return {
//     icon: fallbackIcons[index % fallbackIcons.length],
//     color: fallbackColors[index % fallbackColors.length],
//   };
// };

// export function AboutMission() {
//   const theme = useTheme();
//   const { vendor } = useAppSelector((state) => state.vendor);
//   const { aboutData, aboutLoading } = useGetAboutData();

//   const primaryColor = vendor?.primary_color || theme.palette.primary.main;

//   // Get mission_visions from API response with fallback to empty array
//   const missionVisions = aboutData?.mission_visions || [];

//   // Don't render if loading or no data
//   // if (aboutLoading || !missionVisions.length) return null;

//   return (
//     <Box component="section" sx={{ py: { xs: 6, md: 10 } }}>
//       <Container maxWidth="lg">
//         <Grid2 container spacing={4} justifyContent="center">
//           {missionVisions.map((item, index) => {
//             const { icon, color } = getIconAndColor(item.type, index);

//             return (
//               <Grid2 key={item.id || index} size={{ xs: 12, md: 4 }}>
//                 <Card
//                   sx={{
//                     p: 4,
//                     height: "100%",
//                     borderRadius: 3,
//                     textAlign: "center",
//                     bgcolor: "background.paper",
//                     border: `1px solid ${varAlpha(theme.vars.palette.grey["500Channel"], 0.12)}`,
//                     boxShadow: "none",
//                     transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
//                     "&:hover": {
//                       transform: "translateY(-8px)",
//                       boxShadow: `0 20px 40px ${varAlpha(theme.vars.palette[color].mainChannel, 0.2)}`,
//                       borderColor: `${color}.main`,
//                       "& .mission-icon": {
//                         transform: "scale(1.1) rotate(5deg)",
//                         bgcolor: `${color}.main`,
//                         color: "common.white",
//                       },
//                     },
//                   }}
//                 >
//                   <Stack spacing={3} alignItems="center">
//                     <Box
//                       className="mission-icon"
//                       sx={{
//                         p: 2.5,
//                         borderRadius: 3,
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "center",
//                         bgcolor: varAlpha(theme.vars.palette[color].mainChannel, 0.12),
//                         color: `${color}.main`,
//                         transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
//                       }}
//                     >
//                       <Iconify icon={icon} width={40} />
//                     </Box>

//                     <Typography
//                       variant="h2"
//                       sx={{
//                         fontWeight: 700,
//                         fontSize: { xs: "1rem", md: "1.3rem" },
//                         color: "text.primary",
//                       }}
//                     >
//                       {item.title}
//                     </Typography>

//                     <Typography
//                       variant="body1"
//                       sx={{
//                         color: "text.secondary",
//                         lineHeight: 1.8,
//                       }}
//                     >
//                       {item.description}
//                     </Typography>
//                   </Stack>
//                 </Card>
//               </Grid2>
//             );
//           })}
//         </Grid2>
//       </Container>
//     </Box>
//   );
// }
"use client";

import { Iconify } from "@/components/iconify";
import { useGetAboutData } from "@/api/about";

// ----------------------------------------------------------------------

// Map FA icons to Solar icons and assign colors based on type
const getIconAndColor = (type, index) => {
  const typeMap = {
    mission: {
      icon: "solar:target-bold-duotone",
      color: "primary",
    },
    vision: {
      icon: "solar:eye-bold-duotone",
      color: "secondary",
    },
    values: {
      icon: "solar:heart-pulse-bold-duotone",
      color: "success",
    },
    goal: {
      icon: "solar:flag-bold-duotone",
      color: "info",
    },
  };

  const fallbackColors = [
    "primary",
    "secondary",
    "success",
    "info",
    "warning",
  ];

  const fallbackIcons = [
    "solar:target-bold-duotone",
    "solar:eye-bold-duotone",
    "solar:heart-pulse-bold-duotone",
    "solar:flag-bold-duotone",
    "solar:star-bold-duotone",
  ];

  if (type && typeMap[type.toLowerCase()]) {
    return typeMap[type.toLowerCase()];
  }

  return {
    icon: fallbackIcons[index % fallbackIcons.length],
    color: fallbackColors[index % fallbackColors.length],
  };
};

const colorMap = {
  primary: {
    bg: "rgba(33, 150, 243, 0.12)",
    color: "#2196f3",
    shadow: "rgba(33, 150, 243, 0.2)",
    border: "#2196f3",
  },
  secondary: {
    bg: "rgba(156, 39, 176, 0.12)",
    color: "#9c27b0",
    shadow: "rgba(156, 39, 176, 0.2)",
    border: "#9c27b0",
  },
  success: {
    bg: "rgba(76, 175, 80, 0.12)",
    color: "#4caf50",
    shadow: "rgba(76, 175, 80, 0.2)",
    border: "#4caf50",
  },
  info: {
    bg: "rgba(3, 169, 244, 0.12)",
    color: "#03a9f4",
    shadow: "rgba(3, 169, 244, 0.2)",
    border: "#03a9f4",
  },
  warning: {
    bg: "rgba(255, 152, 0, 0.12)",
    color: "#ff9800",
    shadow: "rgba(255, 152, 0, 0.2)",
    border: "#ff9800",
  },
};

export function AboutMission() {
  const { aboutData } = useGetAboutData();

  const missionVisions =
    aboutData?.mission_visions || [];

  return (
    <section className="py-6 md:py-10">
      <div className="mx-auto max-w-3xl px-4">
        <div className="grid grid-cols-1 justify-center gap-5 md:grid-cols-2">
          {missionVisions.map((item, index) => {
            const { icon, color } =
              getIconAndColor(
                item.type,
                index
              );

            const currentColor =
              colorMap[color] || colorMap.primary;

            return (
              <div
                key={item.id || index}
                className="group h-full rounded-3xl border bg-white p-4 text-center transition-all duration-500"
                style={{
                  borderColor:
                    "rgba(145, 158, 171, 0.12)",
                  boxShadow: "none",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform =
                    "translateY(-8px)";
                  e.currentTarget.style.boxShadow = `0 20px 40px ${currentColor.shadow}`;
                  e.currentTarget.style.borderColor =
                    currentColor.border;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform =
                    "translateY(0px)";
                  e.currentTarget.style.boxShadow =
                    "none";
                  e.currentTarget.style.borderColor =
                    "rgba(145, 158, 171, 0.12)";
                }}
              >
                <div className="flex flex-col items-center gap-2">
                  <div
                    className="mission-icon flex items-center justify-center rounded-2xl p-2 transition-all duration-500"
                    style={{
                      backgroundColor:
                        currentColor.bg,
                      color:
                        currentColor.color,
                    }}
                  >
                    <Iconify
                      icon={icon}
                      width={25}
                    />
                  </div>

                  <h2 className="text-[1rem] font-bold text-gray-900 md:text-[1.3rem]">
                    {item.title}
                  </h2>

                  <p className="leading-[1.8] text-gray-600">
                    {item.description}
                  </p>
                </div>

                <style jsx>{`
                  .group:hover .mission-icon {
                    transform: scale(1.1)
                      rotate(5deg);
                    background-color: ${currentColor.color};
                    color: white;
                  }
                `}</style>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}