import packageJson from "../package.json";

import { paths } from "./routes/paths";

// ----------------------------------------------------------------------

export const CONFIG = {
  appName: "Glow On Cosmetic ",

  appVersion: packageJson.version,

  serverUrl:
    process.env.NEXT_PUBLIC_SERVER_URL ??
    "https://venturekartapi.walkershive.com.np/api/frontend/",

  assetsDir:
    process.env.NEXT_PUBLIC_ASSETS_DIR ??
    "https://venturekartapi.walkershive.com.np/",

  vendorToken: "NAHX2ORdvnrxDqWIW13yxvXyWoERNtXcvynPNPYYnYSMoXPEAWQEdziInBbA",

  vendorId: process.env.NEXT_PUBLIC_VENDOR_ID ?? "1",

  // Store-specific redux-persist key so storefronts on the same origin don't share login/cart
  persistKey: `glowon-${process.env.NEXT_PUBLIC_VENDOR_ID ?? "1"}`,

  auth: {
    redirectPath: paths.home,
  },

  genericErrorMessage: "Oops! Something went wrong. Please try again.",

  pusher: {
    key: "c35c0621c3312fb4fe89",
    cluster: "ap2",
  },
};
