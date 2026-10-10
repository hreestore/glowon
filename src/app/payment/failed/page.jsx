import { PaymentResultView } from "@/sections/payment/view";

// ----------------------------------------------------------------------

export const metadata = {
    title: "Payment Failed",
    robots: {
        index: false,
        follow: false,
        nocache: true,
    },
};

export default function Page() {
    return <PaymentResultView resultType="failed" />;
}
