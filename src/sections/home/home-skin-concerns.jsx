// "use client";

// import { useRouter } from "next/navigation";
// import { Box, Stack, Typography, useTheme, alpha } from "@mui/material";

// import { useAppDispatch, useAppSelector } from "@/redux/hooks";

// import { useGetCategories, useGetHomeCommitments } from "@/api";
// import { paths } from "@/routes/paths";
// import { setCategory } from "@/redux/actions";

// // ----------------------------------------------------------------------

// export function HomeSkinConcerns() {
//     const router = useRouter();
//     const dispatch = useAppDispatch();
//     const theme = useTheme();
//     const { vendor } = useAppSelector((state) => state.vendor)
//     const { commitments } = useGetHomeCommitments()
//     const { categories, isLoading: categoriesLoading } = useGetCategories()
//     const secondaryColor = vendor?.secondary_color || theme.palette.secondary.main;

//     const handleClick = (id) => {
//         dispatch(setCategory(id));
//         router.push(paths.product.root);
//     };

//     if (categoriesLoading) {
//         return (
//             <Stack component="section" spacing={8} sx={{ py: { xs: 2, md: 2 } }}>
//                 <HomeViewSkeleton />
//             </Stack>
//         );
//     }

//     return (

//         <Stack component="section" spacing={8} sx={{ py: { xs: 2, md: 2 } }}>
//             {/* Skin Concerns Section */}

//             {!!categories?.filter((cat) => cat.show_in_footer === true)?.length > 0 && (
//                 <Stack spacing={5}>
//                     {/* Section Header */}
//                     <Box sx={{ textAlign: "center" }}>
//                         <Typography
//                             variant="h3"
//                             sx={{
//                                 fontWeight: 800,
//                                 mb: 2,
//                                 background: `linear-gradient(135deg, ${secondaryColor} 0%, ${secondaryColor} 100%)`,
//                                 backgroundClip: "text",
//                                 WebkitBackgroundClip: "text",
//                                 WebkitTextFillColor: "transparent",
//                                 fontSize: { xs: "1.75rem", md: "2.5rem" },
//                             }}
//                         >
//                             Target Your Skin Concerns
//                         </Typography>
//                         <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: "auto" }}>
//                             Specialized solutions for every skin type and concern
//                         </Typography>
//                     </Box>

//                     {/* Skin Concerns Grid */}
//                     <Box
//                         sx={{
//                             display: "grid",
//                             gridTemplateColumns: {
//                                 xs: "repeat(2, 1fr)",
//                                 sm: "repeat(3, 1fr)",
//                                 md: "repeat(6, 1fr)",
//                             },
//                             gap: { xs: 3, md: 4 },
//                             px: { xs: 2, md: 0 },
//                         }}
//                     >
//                         {categories.filter((cat) => cat.show_in_footer === true)?.map((concern, index) => (
//                             <SkinConcernCard
//                                 key={concern.category_id}
//                                 concern={concern.name}
//                                 image={concern.web_image}
//                                 secondaryColor={secondaryColor}
//                                 index={index}
//                                 onClick={() => handleClick(concern.category_id)}
//                             />
//                         ))}
//                     </Box>
//                 </Stack>
//             )}

//             {/* Certifications Section */}
//             {!!commitments && commitments?.length > 0 && (
//                 <Stack
//                     spacing={4}
//                     sx={{
//                         py: 6,
//                         px: { xs: 3, md: 6 },
//                         borderRadius: 4,
//                         bgcolor: alpha(theme.palette.grey[500], 0.04),
//                         border: `1px solid ${alpha(theme.palette.grey[500], 0.08)}`,
//                     }}
//                 >
//                     {/* Section Header */}
//                     <Box sx={{ textAlign: "center" }}>
//                         <Typography
//                             variant="h4"
//                             sx={{
//                                 fontWeight: 700,
//                                 mb: 1,
//                                 fontSize: { xs: "1.5rem", md: "2rem" },
//                             }}
//                         >
//                             Our Commitments
//                         </Typography>
//                         <Typography variant="body2" color="text.secondary">
//                             Quality you can trust, ethics you can believe in
//                         </Typography>
//                     </Box>

//                     {/* Certifications Grid */}
//                     <Box
//                         sx={{
//                             display: "grid",
//                             gridTemplateColumns: {
//                                 xs: "repeat(2, 1fr)",
//                                 sm: "repeat(3, 1fr)",
//                                 md: "repeat(6, 1fr)",
//                             },
//                             gap: { xs: 3, md: 4 },
//                         }}
//                     >
//                         {commitments?.map((cert, index) => (
//                             <CertificationCard
//                                 key={cert.id}
//                                 certification={cert}
//                                 secondaryColor={secondaryColor}
//                                 index={index}
//                             />
//                         ))}
//                     </Box>
//                 </Stack>
//             )}
//         </Stack>
//     );
// }

// // ----------------------------------------------------------------------

// function SkinConcernCard({ concern, image, secondaryColor, index, onClick }) {
//     return (
//         <Stack
//             onClick={onClick}
//             spacing={2}
//             sx={{
//                 alignItems: "center",
//                 textAlign: "center",
//                 cursor: "pointer",
//                 transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
//                 animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`,
//                 "@keyframes fadeInUp": {
//                     from: {
//                         opacity: 0,
//                         transform: "translateY(30px)",
//                     },
//                     to: {
//                         opacity: 1,
//                         transform: "translateY(0)",
//                     },
//                 },
//                 "&:hover": {
//                     transform: "translateY(-12px)",
//                     "& .concern-image": {
//                         transform: "scale(1.1)",
//                         boxShadow: `0 20px 40px ${secondaryColor}40`,
//                         borderColor: secondaryColor,
//                     },
//                     "& .concern-title": {
//                         color: secondaryColor,
//                     },
//                 },
//             }}
//         >
//             {/* Circular Image Container */}
//             <Box
//                 className="concern-image"
//                 sx={{
//                     width: { xs: 120, sm: 140, md: 160 },
//                     height: { xs: 120, sm: 140, md: 160 },
//                     borderRadius: "50%",
//                     overflow: "hidden",
//                     position: "relative",
//                     border: "4px solid",
//                     borderColor: alpha(secondaryColor, 0.3),
//                     boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
//                     transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
//                     bgcolor: "grey.100",
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                 }}
//             >
//                 {/* Fallback Icon if image not available */}
//                 {/* <Iconify
//                     icon={concern.icon}
//                     width={64}
//                     sx={{
//                         color: secondaryColor,
//                         opacity: 0.8,
//                     }}
//                 /> */}
//                 <Box
//                     component="img"
//                     src={image}
//                     alt={concern}
//                     title={concern}
//                     sx={{
//                         width: '100%',
//                         height: '100%',
//                         objectFit: 'cover',
//                     }}
//                 />
//                 { /* Gradient Overlay */}
//                 <Box
//                     sx={{
//                         position: "absolute",
//                         inset: 0,
//                         background: `linear-gradient(135deg, ${secondaryColor}10 0%, transparent 100%)`,
//                     }}
//                 />
//             </Box>

//             {/* Title */}
//             <Typography
//                 className="concern-title"
//                 variant="subtitle2"
//                 sx={{
//                     fontWeight: 600,
//                     fontSize: { xs: "0.875rem", md: "1rem" },
//                     transition: "color 0.3s ease",
//                     color: "text.primary",
//                 }}
//             >
//                 {concern}
//             </Typography>
//         </Stack>
//     );
// }

// // ----------------------------------------------------------------------

// function CertificationCard({ certification, secondaryColor, index }) {
//     return (
//         <Stack
//             spacing={1.5}
//             sx={{
//                 alignItems: "center",
//                 textAlign: "center",
//                 cursor: "pointer",
//                 transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
//                 animation: `fadeInScale 0.6s ease-out ${index * 0.1}s both`,
//                 "@keyframes fadeInScale": {
//                     from: {
//                         opacity: 0,
//                         transform: "scale(0.8)",
//                     },
//                     to: {
//                         opacity: 1,
//                         transform: "scale(1)",
//                     },
//                 },
//                 "&:hover": {
//                     transform: "translateY(-8px)",
//                     "& .cert-icon": {
//                         transform: "rotate(10deg) scale(1.15)",
//                         bgcolor: `${secondaryColor}22`,
//                         color: "common.white",
//                     },
//                     "& .cert-title": {
//                         color: secondaryColor,
//                     },
//                 },
//             }}
//         >
//             {/* Circular Icon Container */}
//             <Box
//                 className="cert-icon"
//                 sx={{
//                     width: { xs: 80, sm: 90, md: 100 },
//                     height: { xs: 80, sm: 90, md: 100 },
//                     borderRadius: "50%",
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                     bgcolor: `${secondaryColor}02`,
//                     border: `2px solid ${secondaryColor}`,
//                     transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
//                     boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
//                 }}
//             >
//                 <Box
//                     component="img"
//                     src={certification.featured_image}
//                     alt={certification.title}
//                     title={certification.title}
//                     sx={{
//                         p: 1,
//                         width: '100%',
//                         height: '100%',
//                         objectFit: 'contain',
//                     }}
//                 />
//             </Box>

//             {/* Title */}
//             {/* <Box>
//                 <Typography
//                     className="cert-title"
//                     variant="caption"
//                     sx={{
//                         fontWeight: 700,
//                         fontSize: { xs: "0.75rem", md: "0.8125rem" },
//                         lineHeight: 1.4,
//                         transition: "color 0.3s ease",
//                         display: "block",
//                         color: "text.primary",
//                     }}
//                 >
//                     {certification.title}
//                 </Typography>
//                 <Typography
//                     variant="caption"
//                     sx={{
//                         fontSize: "0.6875rem",
//                         color: "text.secondary",
//                         display: "block",
//                         mt: 0.5,
//                     }}
//                 >
//                     {certification.subtitle}
//                 </Typography>
//             </Box> */}
//         </Stack>
//     );
// }

"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

import { Iconify } from "@/components/iconify";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useGetCategories, useGetHomeCommitments } from "@/api";
import { paths } from "@/routes/paths";
import { setCategory } from "@/redux/actions";

// ----------------------------------------------------------------------

const DEFAULT_SECONDARY = "#9c27b0";

// ----------------------------------------------------------------------

export function HomeSkinConcerns() {
    const router = useRouter();
    const dispatch = useAppDispatch();

    const { vendor } = useAppSelector((state) => state.vendor);

    const { commitments } = useGetHomeCommitments();
    const { categories, isLoading: categoriesLoading } = useGetCategories();

    const secondaryColor = vendor?.secondary_color || DEFAULT_SECONDARY;

    const handleClick = (id) => {
        dispatch(setCategory(id));
        router.push(paths.product.root);
    };

    if (categoriesLoading) {
        return (
            <section className="flex flex-col gap-8 py-2">
                <div className="h-[300px] animate-pulse rounded-3xl bg-gray-100" />
            </section>
        );
    }

    const footerCategories = categories?.filter((cat) => cat.show_in_footer === true);

    return (
        <section className="flex flex-col gap-8 lg:my-6 my-2">

            {/* ── Skin Concerns ── */}
            {!!footerCategories?.length && (
                <div className="flex flex-col gap-5 mb-6 lg:mb-12">
                    {/* Header */}
                    {/* <div className="text-center">
                        <h2
                            className="mb-1 text-[1.75rem] font-extrabold md:text-[2.5rem]"
                            style={{
                                background: `linear-gradient(135deg, ${secondaryColor} 0%, ${secondaryColor} 100%)`,
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                            }}
                        >
                            Target Your Skin Concerns
                        </h2>
                        <p className="mx-auto max-w-[600px] text-gray-500">
                            Specialized solutions for every skin type and concern
                        </p>
                    </div> */}

                    {/* Grid */}
                    <div className="grid grid-flow-row-dense grid-cols-2 md:grid-cols-5 auto-rows-[160px] md:auto-rows-[220px] gap-3 md:gap-4 px-2 md:px-0">
                        {footerCategories.map((concern, index) => (
                            <SkinConcernCard
                                key={concern.category_id}
                                concern={concern.name}
                                image={concern.web_image}
                                secondaryColor={secondaryColor}
                                index={index}
                                onClick={() => handleClick(concern.category_id)}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* ── Commitments ── */}
            {/* {!!commitments?.length && (
                <div
                    className="flex flex-col gap-4 rounded-[32px] border px-3 py-6 md:px-6"
                    style={{
                        backgroundColor: "rgba(145,158,171,0.04)",
                        borderColor: "rgba(145,158,171,0.08)",
                    }}
                >
                    <div className="text-center mb-2">
                        <h3 className="mb-0 text-[1.5rem] font-bold md:text-[2rem]">
                            Our Commitments
                        </h3>
                        <p className="text-sm text-gray-500">
                            Quality you can trust, ethics you can believe in
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6 md:gap-4">
                        {commitments.map((cert, index) => (
                            <CertificationCard
                                key={cert.id}
                                certification={cert}
                                secondaryColor={secondaryColor}
                                index={index}
                            />
                        ))}
                    </div>
                </div>
            )} */}

        </section>
    );
}

// ----------------------------------------------------------------------

function SkinConcernCard({ concern, image, secondaryColor, index, onClick }) {
    const getBentoClass = (idx) => {
        const i = idx % 5;
        if (i === 0) return "col-span-2 row-span-2";
        if (i === 1) return "col-span-2 row-span-1";
        if (i === 2) return "col-span-1 row-span-2";
        if (i === 3) return "col-span-1 row-span-1";
        if (i === 4) return "col-span-1 row-span-1";
        return "col-span-1 row-span-1";
    };

    const bentoClass = getBentoClass(index);

    return (
        <>
            <div
                onClick={onClick}
                className={`group relative overflow-hidden rounded-[24px] md:rounded-[32px] cursor-pointer transition-all duration-500 ease-out hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)] hover:-translate-y-2 ${bentoClass}`}
                style={{ animation: `fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.1}s both` }}
            >
                {/* Crisp Inner Ring (Apple-like Bento style) */}
                <div className="absolute inset-0 z-10 rounded-[24px] md:rounded-[32px] ring-1 ring-inset ring-white/20 pointer-events-none transition-all duration-500 group-hover:ring-white/40" />

                {/* Background Image */}
                <Image
                    src={image}
                    alt={concern}
                    title={concern}
                    width={600}
                    height={600}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />
                
                {/* Overlay: Richer bottom gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-60 transition-all duration-500 group-hover:opacity-80" />

                {/* Corner Glow Effect on Hover */}
                <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-white/20 blur-3xl rounded-full transition-all duration-700 opacity-0 group-hover:opacity-100 z-0 pointer-events-none" />

                {/* Title - Advanced Glassmorphism Pill */}
                <div className="absolute bottom-4 left-4 md:bottom-6 md:left-6 z-20">
                    <div className="backdrop-blur-xl bg-white/10 border border-white/20 shadow-[0_4px_16px_rgba(0,0,0,0.1)] rounded-full px-5 py-2.5 transition-all duration-500 ease-out group-hover:bg-white/20 group-hover:border-white/40 group-hover:pr-6 group-hover:shadow-[0_8px_24px_rgba(0,0,0,0.2)]">
                        <h4 className="text-sm md:text-lg font-bold text-white tracking-wide flex items-center gap-2">
                            {concern}
                            <Iconify icon="solar:arrow-right-linear" className="opacity-0 -ml-4 transition-all duration-500 ease-out group-hover:opacity-100 group-hover:ml-0" width={18} />
                        </h4>
                    </div>
                </div>
            </div>

            <style jsx>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(40px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
        </>
    );
}

// ----------------------------------------------------------------------

// function CertificationCard({ certification, secondaryColor, index }) {
//     return (
//         <>
//             <div
//                 className="group flex cursor-pointer flex-col items-center gap-2 text-center transition-all duration-300 ease-in-out hover:-translate-y-2"
//                 style={{ animation: `fadeInScale 0.6s ease-out ${index * 0.1}s both` }}
//             >
//                 <div
//                     className="flex items-center justify-center rounded-full border-2 shadow-md transition-all duration-300 ease-in-out group-hover:rotate-6 group-hover:scale-110"
//                     style={{
//                         width: 100,
//                         height: 100,
//                         borderColor: secondaryColor,
//                         backgroundColor: `${secondaryColor}08`,
//                     }}
//                 >
//                     <Image
//                         src={certification.featured_image}
//                         alt={certification.title}
//                         title={certification.title}
//                         width={64}
//                         height={64}
//                         className="h-full w-full object-contain p-2"
//                     />
//                 </div>
//             </div>

//             <style jsx>{`
//         @keyframes fadeInScale {
//           from { opacity: 0; transform: scale(0.8); }
//           to   { opacity: 1; transform: scale(1); }
//         }
//       `}</style>
//         </>
//     );
// }