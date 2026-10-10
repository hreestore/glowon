import { getAppName } from "@/api";
import { PolicyView } from "@/sections/policy";

// ----------------------------------------------------------------------

export async function generateMetadata() {
  const { appName } = await getAppName();

  return {
    metadataBase: new URL("https://glowon.com.np"),
    title: `${appName} | Privacy Policy`,
    description:
      "Understand how Glowon collects, secures, and protects your personal data, payment information, and privacy.",
    keywords: [
      "privacy policy",
      "data protection",
      "security",
      "GDPR",
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
      canonical: "/policy",
    },
    openGraph: {
      title: `${appName} | Privacy Policy`,
      description: "Privacy policy and data protection standards for Glowon.",
      url: "/policy",
      siteName: appName,
      locale: "en_US",
      type: "website",
    },
  };
}

// ----------------------------------------------------------------------

export default function PolicyPage() {
  return <PolicyView />;
}