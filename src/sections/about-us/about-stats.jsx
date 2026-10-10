// "use client";

// import { useState, useEffect, useRef } from "react";
// import { Box, Container, Typography, Stack, useTheme, Grid } from "@mui/material";
// import { varAlpha } from "minimal-shared/utils";

// import { useAppSelector } from "@/redux/hooks";

// import { Iconify } from "@/components/iconify";
// import { useGetAboutData } from "@/api/about";

// // ----------------------------------------------------------------------

// // Animated Counter Component
// function AnimatedCounter({ value, duration = 2000, symbol = "" }) {
//   const [count, setCount] = useState(0);
//   const [hasAnimated, setHasAnimated] = useState(false);
//   const ref = useRef(null);

//   // Parse the numeric value
//   const numericValue = parseFloat(String(value).replace(/[^0-9.]/g, "")) || 0;
//   const isDecimal = numericValue % 1 !== 0;

//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       (entries) => {
//         entries.forEach((entry) => {
//           if (entry.isIntersecting && !hasAnimated) {
//             setHasAnimated(true);
//             animateCounter();
//           }
//         });
//       },
//       { threshold: 0.3 }
//     );

//     if (ref.current) {
//       observer.observe(ref.current);
//     }

//     return () => observer.disconnect();
//   }, [hasAnimated, numericValue]);

//   const animateCounter = () => {
//     const startTime = Date.now();
//     const endValue = numericValue;

//     const updateCounter = () => {
//       const elapsed = Date.now() - startTime;
//       const progress = Math.min(elapsed / duration, 1);

//       // Easing function for smooth animation
//       const easeOutQuart = 1 - Math.pow(1 - progress, 4);

//       const currentValue = easeOutQuart * endValue;
//       setCount(isDecimal ? currentValue : Math.floor(currentValue));

//       if (progress < 1) {
//         requestAnimationFrame(updateCounter);
//       } else {
//         setCount(endValue);
//       }
//     };

//     requestAnimationFrame(updateCounter);
//   };

//   const formatNumber = (num) => {
//     if (isDecimal) {
//       return num.toFixed(1);
//     }
//     // Add thousand separators
//     return Math.floor(num).toLocaleString();
//   };

//   return (
//     <Box ref={ref} component="span">
//       {formatNumber(count)}{symbol}
//     </Box>
//   );
// }

// // ----------------------------------------------------------------------

// // const STATS = [
// //   {
// //     icon: "solar:user-check-rounded-bold-duotone",
// //     value: "50K+",
// //     label: "Happy Customers",
// //     color: "primary",
// //   },
// //   {
// //     icon: "solar:box-bold-duotone",
// //     value: "10K+",
// //     label: "Products Available",
// //     color: "secondary",
// //   },
// //   {
// //     icon: "solar:verified-check-bold-duotone",
// //     value: "99.9%",
// //     label: "Satisfaction Rate",
// //     color: "success",
// //   },
// //   {
// //     icon: "solar:clock-circle-bold-duotone",
// //     value: "24/7",
// //     label: "Customer Support",
// //     color: "info",
// //   },
// // ];

// export function AboutStats() {
//   const theme = useTheme();
//   const { vendor } = useAppSelector((state) => state.vendor);
//   const { aboutData, aboutLoading } = useGetAboutData();
//   const primaryColor = vendor?.primary_color || theme.palette.primary.main;
//   const secondaryColor = vendor?.secondary_color || theme.palette.secondary.main;
//   // Get mission_visions from API response with fallback to empty array
//   const counters = aboutData?.counters || [];

//   // Don't render if loading or no data
//   if (aboutLoading || !counters.length) return null;

//   return (
//     <Box
//       component="section"
//       sx={{
//         py: { xs: 6, md: 10 },
//         position: "relative",
//         overflow: "hidden",
//         background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`,
//         borderRadius: 4,
//         // Grid pattern
//         "&::before": {
//           content: '""',
//           position: "absolute",
//           inset: 0,
//           backgroundImage: `
//             linear-gradient(${varAlpha(theme.vars.palette.common.whiteChannel, 0.03)} 1px, transparent 1px),
//             linear-gradient(90deg, ${varAlpha(theme.vars.palette.common.whiteChannel, 0.03)} 1px, transparent 1px)
//           `,
//           backgroundSize: "50px 50px",
//           pointerEvents: "none",

//         },
//       }}
//     >
//       <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
//         <Stack spacing={6}>
//           {/* Section Header */}
//           <Stack spacing={2} alignItems="center" textAlign="center">
//             <Typography
//               variant="h3"
//               sx={{
//                 fontWeight: 800,
//                 color: "common.white",
//                 textShadow: "0 4px 20px rgba(0,0,0,0.2)",
//               }}
//             >
//               Trusted by Thousands
//             </Typography>
//             <Typography
//               variant="body1"
//               sx={{
//                 maxWidth: 500,
//                 color: varAlpha(theme.vars.palette.common.whiteChannel, 0.85),
//                 lineHeight: 1.7,
//               }}
//             >
//               Our numbers speak for themselves. Join our growing community of
//               satisfied customers and experience excellence.
//             </Typography>
//           </Stack>

//           {/* Stats Grid */}
//           <Grid container spacing={3}>
//             {counters.map((stat, index) => (
//               <Grid key={index} size={{ xs: 6, md: 3 }}>
//                 <Stack
//                   spacing={2}
//                   alignItems="center"
//                   sx={{
//                     p: { xs: 3, md: 4 },
//                     borderRadius: 3,
//                     bgcolor: varAlpha(theme.vars.palette.common.whiteChannel, 0.1),
//                     backdropFilter: "blur(10px)",
//                     border: `1px solid ${varAlpha(theme.vars.palette.common.whiteChannel, 0.15)}`,
//                     transition: "all 0.3s ease",
//                     "&:hover": {
//                       bgcolor: varAlpha(theme.vars.palette.common.whiteChannel, 0.15),
//                       transform: "translateY(-4px)",
//                       "& .stat-icon": {
//                         transform: "scale(1.1) rotate(5deg)",
//                       },
//                     },
//                   }}
//                 >
//                   <Box
//                     className="stat-icon"
//                     sx={{
//                       p: 2,
//                       borderRadius: 2,
//                       bgcolor: varAlpha(theme.vars.palette.common.whiteChannel, 0.2),
//                       transition: "transform 0.3s ease",
//                     }}
//                   >
//                     <Iconify
//                       icon={stat.icon}
//                       width={32}
//                       sx={{ color: "common.white" }}
//                     />
//                   </Box>

//                   <Typography
//                     variant="h3"
//                     sx={{
//                       fontWeight: 800,
//                       color: "common.white",
//                       fontSize: { xs: "1.75rem", md: "2.5rem" },
//                     }}
//                   >
//                     <AnimatedCounter
//                       value={stat.count}
//                       duration={2500}
//                       symbol={stat.symbol || ""}
//                     />
//                   </Typography>

//                   <Typography
//                     variant="body2"
//                     sx={{
//                       color: varAlpha(theme.vars.palette.common.whiteChannel, 0.85),
//                       fontWeight: 500,
//                       textAlign: "center",
//                     }}
//                   >
//                     {stat.title}
//                   </Typography>
//                 </Stack>
//               </Grid>
//             ))}
//           </Grid>
//         </Stack>
//       </Container>
//     </Box>
//   );
// }
"use client";

import { useState, useEffect, useRef } from "react";

import { useAppSelector } from "@/redux/hooks";

import { Iconify } from "@/components/iconify";
import { useGetAboutData } from "@/api/about";

// ----------------------------------------------------------------------

function AnimatedCounter({
  value,
  duration = 2000,
  symbol = "",
}) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] =
    useState(false);

  const ref = useRef(null);

  const numericValue =
    parseFloat(
      String(value).replace(/[^0-9.]/g, "")
    ) || 0;

  const isDecimal = numericValue % 1 !== 0;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (
            entry.isIntersecting &&
            !hasAnimated
          ) {
            setHasAnimated(true);
            animateCounter();
          }
        });
      },
      { threshold: 0.3 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [hasAnimated, numericValue]);

  const animateCounter = () => {
    const startTime = Date.now();
    const endValue = numericValue;

    const updateCounter = () => {
      const elapsed =
        Date.now() - startTime;

      const progress = Math.min(
        elapsed / duration,
        1
      );

      const easeOutQuart =
        1 - Math.pow(1 - progress, 4);

      const currentValue =
        easeOutQuart * endValue;

      setCount(
        isDecimal
          ? currentValue
          : Math.floor(currentValue)
      );

      if (progress < 1) {
        requestAnimationFrame(
          updateCounter
        );
      } else {
        setCount(endValue);
      }
    };

    requestAnimationFrame(updateCounter);
  };

  const formatNumber = (num) => {
    if (isDecimal) {
      return num.toFixed(1);
    }

    return Math.floor(num).toLocaleString();
  };

  return (
    <span ref={ref}>
      {formatNumber(count)}
      {symbol}
    </span>
  );
}

// ----------------------------------------------------------------------

export function AboutStats() {
  const { vendor } = useAppSelector(
    (state) => state.vendor
  );

  const { aboutData, aboutLoading } =
    useGetAboutData();

  const counters =
    aboutData?.counters || [];

  const primaryColor =
    vendor?.primary_color || "#2563eb";

  const secondaryColor =
    vendor?.secondary_color || "#7c3aed";

  if (
    aboutLoading ||
    !counters.length
  )
    return null;

  return (
    <section
      className="relative overflow-hidden rounded-[32px] py-6 md:py-10"
      style={{
        background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`,
      }}
    >
      {/* Grid Pattern */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
        }}
      />

      <div className="relative z-10 mx-auto max-w-6xl px-4">
        <div className="flex flex-col gap-6">
          {/* Header */}
          <div className="flex flex-col items-center gap-2 text-center">
            <h2 className="text-3xl font-extrabold text-white drop-shadow-[0_4px_20px_rgba(0,0,0,0.2)] md:text-5xl">
              Trusted by Thousands
            </h2>

            <p className="max-w-[500px] leading-7 text-white/85">
              Our numbers speak for
              themselves. Join our
              growing community of
              satisfied customers and
              experience excellence.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {counters.map(
              (stat, index) => (
                <div
                  key={index}
                  className="group flex flex-col items-center gap-2 rounded-3xl border border-white/15 bg-white/10 p-3 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:bg-white/15"
                >
                  {/* Icon */}
                  <div className="stat-icon rounded-2xl bg-white/20 p-2 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                    <Iconify
                      icon={stat.icon}
                      width={32}
                      className="text-white"
                    />
                  </div>

                  {/* Counter */}
                  <h3 className="text-[1.75rem] font-extrabold text-white md:text-[2.5rem]">
                    <AnimatedCounter
                      value={stat.count}
                      duration={2500}
                      symbol={
                        stat.symbol ||
                        ""
                      }
                    />
                  </h3>

                  {/* Label */}
                  <p className="text-center text-sm font-medium text-white/85">
                    {stat.title}
                  </p>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </section>
  );
}