import { getAppName } from "@/api";
import { TermsView } from "@/sections/terms";

// ----------------------------------------------------------------------

export async function generateMetadata() {
    const { appName } = await getAppName();

    return {
        metadataBase: new URL("https://glowon.com.np"),
        title: `${appName} | Terms & Conditions`,
        description:
            "Review the Terms and Conditions governing your use of the Glowon ecommerce platform, orders, and purchases.",
        keywords: [
            "terms and conditions",
            "terms of service",
            "legal agreement",
            "privacy policy",
            appName,
        ],
        authors: [{ name: appName }],
        creator: appName,
        publisher: appName,
        formatDetection: {
            email: false,
            address: false,
            telephone: false,
        },
        robots: {
            index: true,
            follow: true,
        },
        alternates: {
            canonical: "/terms",
        },
        openGraph: {
            title: `${appName} | Terms & Conditions`,
            description: "Terms and conditions of use for Glowon store.",
            url: "/terms",
            siteName: appName,
            locale: "en_US",
            type: "website",
        },
    };
}

// ----------------------------------------------------------------------

export default function TermsPage() {
    return <TermsView />;
}