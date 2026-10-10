// "use client";

// import { Box, Container } from "@mui/material";

// import { ServiceHero } from "../service-hero";
// import { ServiceProcess } from "../service-process";
// import { ServiceBenefits } from "../service-benefits";
// import { ServiceFaq } from "../service-faq";
// import { ServiceCta } from "../service-cta";
// import { ServiceList } from "../service-list";

// // ----------------------------------------------------------------------

// export function ServiceView() {
//   return (
//     <Box component="main">
//       <Container maxWidth="xl" sx={{ pt: { xs: 2, md: 4 } }}>
//         {/* Hero Section */}
//         <ServiceHero />
//       </Container>

//       {/* Core Services */}
//       <ServiceList />

//       {/* How It Works */}
//       <ServiceProcess />

//       {/* Benefits */}
//       <ServiceBenefits />

//       {/* FAQ Section */}
//       <ServiceFaq />

//       {/* Call to Action */}
//       <ServiceCta />
//     </Box>
//   );
// }
"use client";

import { ServiceHero } from "../service-hero";
import { ServiceProcess } from "../service-process";
import { ServiceBenefits } from "../service-benefits";
import { ServiceFaq } from "../service-faq";
import { ServiceCta } from "../service-cta";
import { ServiceList } from "../service-list";

// ----------------------------------------------------------------------

export function ServiceView() {
  return (
    <main>
      {/* Hero Section */}
      <div className="mx-auto max-w-7xl px-4 pt-2 md:pt-4">
        <ServiceHero />
      </div>

      {/* Core Services */}
      <ServiceList />

      {/* How It Works */}
      <ServiceProcess />

      {/* Benefits */}
      <ServiceBenefits />

      {/* FAQ Section */}
      <ServiceFaq />

      {/* Call to Action */}
      <ServiceCta />
    </main>
  );
}