// import { useBoolean } from "minimal-shared/hooks";
// import { useState, useEffect } from "react";

// import Grid from "@mui/material/Grid2";
// import { Stack, Box, Button, Tooltip, Card, Typography, InputAdornment, IconButton, Backdrop, CircularProgress } from "@mui/material";

// import { useAppDispatch, useAppSelector } from "@/redux/hooks";
// import {
//   changeActiveStep,
//   setProfileAddresses,
//   resetCart,
//   setShippingCharge,
// } from "@/redux/actions";

// import { paths } from "@/routes/paths";
// import { useRouter } from "@/routes/hooks";
// import { Iconify } from "@/components/iconify";
// import { toast } from "@/components/snackbar";
// import { EmptyContent } from "@/components/empty-content";
// import zod from "zod";
// import { CartSummary } from "./cart-summary";
// import { AddressItem, AddressNewForm } from "../address";

// import {
//   useGetStates,
//   removeAddress,
//   createOrder,
//   getLogisticCharge,
// } from "@/api";
// import { Field, Form } from "@/components/hook-form";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";

// // ----------------------------------------------------------------------
// export const SignUpSchema = zod
//   .object({
//     name: zod.string().min(1, { message: "Name is required!" }),

//     phone_number: zod
//       .string()
//       .min(1, { message: "Phone number is required!" })
//       .regex(/^\d{10}$/, {
//         message: "Phone number must be exactly 10 digits!",
//       }),

//     email: zod
//       .string()
//       .min(1, { message: "Email is required!" })
//       .email({ message: "Email must be a valid email address!" }),

//     password: zod
//       .string()
//       .min(1, { message: "Password is required!" })
//       .min(8, { message: "Password must be at least 8 characters!" }),

//     password_confirmation: zod
//       .string()
//       .min(1, { message: "Confirm password is required!" })
//       .min(8, { message: "Confirm password must be at least 8 characters!" }),
//   })
//   .refine((data) => data.password === data.password_confirmation, {
//     message: "Passwords don't match!",
//     path: ["password_confirmation"],
//   });

// export function CartBillingAddress() {
//   const dispatch = useAppDispatch();

//   const router = useRouter();

//   const [selectedAddress, setSelectedAddress] = useState("");
//   const [guestAddress, setGuestAddress] = useState(() => {
//     try {
//       return JSON.parse(localStorage.getItem("guestAddress"))
//     } catch {
//       return null
//     }
//   });
//   const [isEditingGuest, setIsEditingGuest] = useState(false);
//   const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
//   const WHATSAPP_ORDER_PHONE = "9779851212477";
//   const { addresses } = useAppSelector((state) => state.profile);
//   const { discount, items: cartItems, total, subtotal, shipping } = useAppSelector((state) => state.cart);
//   const { isLogin, user } = useAppSelector((state) => state.auth);

//   const addressForm = useBoolean();
//   const { states } = useGetStates();

//   // Auto-select address or open form if no address exists
//   useEffect(() => {
//     if (isLogin) {
//       // For logged-in users
//       if (addresses && addresses.length > 0 && !selectedAddress) {
//         handleSelect(addresses[0]);
//       } else if (!addresses || addresses.length === 0) {
//         addressForm.onTrue();
//       }
//     } else {
//       // For guest users
//       if (guestAddress && !selectedAddress) {
//         handleGuestSelect(guestAddress);
//       }
//       // Don't auto-open form for guests - it's always visible
//     }
//   }, [addresses, guestAddress, isLogin]);

//   const handleBack = () => {
//     dispatch(changeActiveStep(0));
//   };

//   const renderNoAddress = () => (
//     <EmptyContent
//       title="Address not found"
//       description="Please, add your address to proceed the checkout process!"
//       sx={{ py: 2 }}
//     />
//   );

//   const handleSelect = async (address) => {
//     const { address_id, district } = address;
//     try {
//       setSelectedAddress(address_id);

//       const logisticCharge = await getLogisticCharge(district.district_id);

//       dispatch(setShippingCharge(logisticCharge.charge_amount));
//     } catch (error) {
//       toast.error("Couldn't select address! Try again.");
//     }
//   };

//   const handleGuestSelect = async (address) => {
//     try {
//       setSelectedAddress("guest-address");
//       setGuestAddress(address);
//       localStorage.setItem("guestAddress", JSON.stringify(address));

//       const logisticCharge = await getLogisticCharge(address.district.district_id);
//       dispatch(setShippingCharge(logisticCharge.charge_amount));
//     } catch (error) {
//       toast.error("Couldn't select address! Try again.");
//     }
//   };

//   const handleDelete = async (id) => {
//     try {
//       await removeAddress(id);

//       setSelectedAddress("");

//       const updatedAddresses = addresses.filter(
//         (address) => address.address_id !== id
//       );

//       dispatch(setProfileAddresses(updatedAddresses));

//       toast.success("Address deleted!");
//     } catch (error) {
//       toast.error("Couldn't remove address! Try again.");
//     }
//   };

//   const formatAmount = (amount) => Number(amount || 0).toFixed(2);

//   const getAddressText = (addressObj) => {
//     if (!addressObj) return "N/A";

//     const districtName =
//       addressObj?.district?.district_name ||
//       addressObj?.district_name ||
//       "";
//     const stateName =
//       addressObj?.state?.state_name ||
//       addressObj?.state_name ||
//       "";

//     const segments = [addressObj?.address, districtName, stateName].filter(Boolean);
//     return segments.length ? segments.join(", ") : "N/A";
//   };

//   const buildWhatsAppMessage = (addressObj) => {
//     let message = "*NEW ORDER CONFIRMED - HREE CREATE*\n\n";
//     message += `*Customer:* ${user?.name || "Customer"}\n`;
//     message += `*Phone:* ${user?.phone_number || user?.phone || "N/A"}\n`;
//     message += `*Address:* ${getAddressText(addressObj)}\n\n`;
//     message += "*Items:*\n";

//     cartItems?.forEach((item, index) => {
//       const productName = item?.item_name || item?.product_name || item?.name || "Product";
//       const quantity = Number(item?.quantity || 0);
//       const unitPrice = Number(item?.price ?? item?.regular_price ?? 0);
//       const itemSize = item?.size || item?.size_name || item?.variant_size;
//       const itemColor = item?.color?.name || item?.color_name || item?.variant_color || item?.colour?.name;
//       const frontDesign = item?.frontDesign?.name || item?.front_design?.name || item?.front_design_name;
//       const backDesign = item?.backDesign?.name || item?.back_design?.name || item?.back_design_name;

//       message += `${index + 1}. ${productName} (${quantity}x)\n`;
//       if (itemSize) message += `   - Size: ${itemSize}\n`;
//       if (itemColor) message += `   - Color: ${itemColor}\n`;
//       if (frontDesign) message += `   - Front: ${frontDesign}\n`;
//       if (backDesign) message += `   - Back: ${backDesign}\n`;
//       message += `   - Price: Rs.${formatAmount(unitPrice * quantity)}\n\n`;
//     });

//     const totalAmount = Number(total || subtotal + shipping || 0);
//     message += `*Total Amount: Rs.${formatAmount(totalAmount)}*`;

//     return message;
//   };

//   const openWhatsAppOrder = (addressObj) => {
//     const message = buildWhatsAppMessage(addressObj);
//     const encodedMessage = encodeURIComponent(message);
//     const whatsappUrl = `https://wa.me/${WHATSAPP_ORDER_PHONE}?text=${encodedMessage}`;

//     const whatsappWindow = window.open(whatsappUrl, "_blank");

//     if (!whatsappWindow || whatsappWindow.closed || typeof whatsappWindow.closed === "undefined") {
//       window.location.href = whatsappUrl;
//       return false;
//     }

//     return true;
//   };

//   const handleCheckout = async () => {
//     setIsCheckoutLoading(true);
//     try {
//       // Ensure discount_code is always a string or undefined
//       // Handle both string format and object format (from old state or API response)
//       let safeDiscountCode;
//       if (typeof discount.code === 'string' && discount.code.trim()) {
//         safeDiscountCode = discount.code.trim();
//       } else if (typeof discount.code === 'object' && discount.code?.code) {
//         safeDiscountCode = String(discount.code.code).trim();
//       } else {
//         safeDiscountCode = undefined;
//       }

//       let checkoutData;

//       if (isLogin) {
//         // Logged-in user checkout
//         checkoutData = {
//           customer_address_id: selectedAddress,
//           order_from: "web",
//           ...(safeDiscountCode && { discount_code: safeDiscountCode }),
//         };
//       } else {
//         // Guest checkout
//         checkoutData = {
//           guest_address: guestAddress,
//           order_from: "web",
//           ...(safeDiscountCode && { discount_code: safeDiscountCode }),
//         };
//       }

//       const response = await createOrder(checkoutData);

//       // Extract order ID from response before dispatching reset
//       const orderId = response?.data?.order_id || response?.data?.data?.order_id;

//       if (orderId) {
//         const selectedAddressObj = isLogin
//           ? addresses?.find((address) => String(address.address_id) === String(selectedAddress))
//           : guestAddress;
//         const openedInNewTab = openWhatsAppOrder(selectedAddressObj);

//         // Perform cleanup operations
//         dispatch(resetCart());
//         try {
//           localStorage.removeItem("guestAddress");
//         } catch { }

//         if (openedInNewTab) {
//           router.push(paths.order.details(orderId));
//         }

//         toast.success(response?.data?.message || "Order created successfully!");
//       } else {
//         console.error("Order creation response:", response);
//         throw new Error("Order ID not found in response");
//       }
//     } catch (error) {
//       console.error("Checkout error:", error);
//       toast.error(error?.message || "Couldn't create order! Try again.");
//     } finally {
//       setIsCheckoutLoading(false);
//     }
//   };

//   const defaultValues = {
//     name: "",
//     phone_number: "",
//     email: "",
//     password: "",
//     password_confirmation: "",
//   };

//   const methods = useForm({
//     resolver: zodResolver(SignUpSchema),
//     defaultValues,
//   });

//   const showPassword = useBoolean();

//   const showConfirmPassword = useBoolean();

//   return (
//     <>
//       <Grid container spacing={3}>
//         <Grid size={{ xs: 12, md: 8 }}>
//           <Stack spacing={2}>
//             <Box sx={{ display: "flex", justifyContent: "space-between" }}>
//               <Button
//                 size="small"
//                 color="inherit"
//                 startIcon={<Iconify icon="eva:arrow-ios-back-fill" />}
//                 onClick={handleBack}
//               >
//                 Back
//               </Button>

//               {isLogin && (
//                 <Button
//                   size="small"
//                   variant="outlined"
//                   color="primary"
//                   onClick={addressForm.onTrue}
//                   startIcon={<Iconify icon="mingcute:add-line" />}
//                 >
//                   New address
//                 </Button>
//               )}
//             </Box>

//             {isLogin ? (
//               !!addresses?.length ? (
//                 addresses.map((address) => (
//                   <AddressItem
//                     key={address.address_id}
//                     addressItem={address}
//                     selectedAddress={selectedAddress}
//                     action={
//                       <Box
//                         sx={{
//                           flexShrink: 0,
//                           display: "flex",
//                           gap: 1,
//                           flexWrap: "wrap",
//                         }}
//                       >
//                         <Button
//                           size="small"
//                           color="error"
//                           onClick={() => handleDelete(address.address_id)}
//                         >
//                           Delete
//                         </Button>

//                         {selectedAddress !== address.address_id && (
//                           <Button
//                             variant="outlined"
//                             size="small"
//                             onClick={() => handleSelect(address)}
//                           >
//                             Select
//                           </Button>
//                         )}
//                       </Box>
//                     }
//                     sx={[
//                       (theme) => ({
//                         p: 3,
//                         mb: 3,
//                         borderRadius: 2,
//                         boxShadow: theme.vars.customShadows.card,
//                       }),
//                     ]}
//                   />
//                 ))
//               ) : (
//                 renderNoAddress()
//               )
//             ) : (
//               <Card sx={{ p: 3, mx: 2, boxShadow: (theme) => theme.vars.customShadows.card }}>
//                 <Box>
//                   <Box>


//                     {/* {!!errorMessage && (
//                       <Alert severity="error" sx={{ mb: 3 }}>
//                         {errorMessage}
//                       </Alert>
//                     )} */}
//                     <Typography variant="h6" sx={{ mb: 4 }}>Order Details</Typography>
//                     <Form methods={methods}>
//                       <Box sx={{ gap: 3, display: "flex", flexDirection: "column" }}>

//                         <Box
//                           sx={{
//                             display: "flex",
//                             gap: { xs: 3, sm: 2 },
//                             flexDirection: { xs: "column", sm: "row" },
//                           }}
//                         >
//                           <Field.Text
//                             name="name"
//                             label="Name"
//                             slotProps={{ inputLabel: { shrink: true } }}
//                           />

//                           <Field.Text
//                             name="phone_number"
//                             label="Phone Number"
//                             slotProps={{ inputLabel: { shrink: true } }}
//                           />
//                           <Field.Text
//                             name="email"
//                             label="Email address"
//                             slotProps={{ inputLabel: { shrink: true } }}
//                           />
//                         </Box>
//                         <Box
//                           sx={{
//                             display: "flex",
//                             gap: { xs: 3, sm: 2 },
//                             flexDirection: { xs: "column", sm: "row" },
//                           }}
//                         >

//                           <Field.Text
//                             name="password"
//                             label="Password"
//                             type={showPassword.value ? "text" : "password"}
//                             slotProps={{
//                               inputLabel: { shrink: true },
//                               input: {
//                                 endAdornment: (
//                                   <InputAdornment position="end">
//                                     <IconButton onClick={showPassword.onToggle} edge="end">
//                                       {showPassword.value ? (
//                                         <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                                           <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
//                                           <circle cx="12" cy="12" r="3"></circle>
//                                         </svg>
//                                       ) : (
//                                         <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                                           <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
//                                           <line x1="1" y1="1" x2="23" y2="23"></line>
//                                         </svg>
//                                       )}
//                                     </IconButton>
//                                   </InputAdornment>
//                                 ),
//                               },
//                             }}
//                           />

//                           <Field.Text
//                             name="password_confirmation"
//                             label="Confirm Password"
//                             type={showConfirmPassword.value ? "text" : "password"}
//                             slotProps={{
//                               inputLabel: { shrink: true },
//                               input: {
//                                 endAdornment: (
//                                   <InputAdornment position="end">
//                                     <IconButton onClick={showConfirmPassword.onToggle} edge="end">
//                                       {showConfirmPassword.value ? (
//                                         <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                                           <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
//                                           <circle cx="12" cy="12" r="3"></circle>
//                                         </svg>
//                                       ) : (
//                                         <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                                           <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
//                                           <line x1="1" y1="1" x2="23" y2="23"></line>
//                                         </svg>
//                                       )}
//                                     </IconButton>
//                                   </InputAdornment>
//                                 ),
//                               },
//                             }}
//                           />


//                         </Box>
//                       </Box>
//                     </Form>
//                     <AddressNewForm
//                       key={guestAddress ? JSON.stringify(guestAddress) : 'new-address'}
//                       open={true}
//                       onClose={() => { }}
//                       states={states}
//                       isLogin={false}
//                       isInline={true}
//                       initialData={guestAddress}
//                       onAddressAddSuccess={(address) => {
//                         handleGuestSelect(address);
//                       }}
//                     />
//                   </Box>
//                 </Box>
//               </Card>
//             )}
//           </Stack>
//         </Grid>

//         <Grid size={{ xs: 12, md: 4 }}>
//           <CartSummary
//             isAddressSelected={selectedAddress !== ""}
//             selectedAddressId={selectedAddress}
//           />

//           <Tooltip
//             title={
//               selectedAddress === ""
//                 ? "Please select address to checkout"
//                 : null
//             }
//           >
//             <Box>
//               <Button
//                 fullWidth
//                 size="large"
//                 type="submit"
//                 variant="contained"
//                 disabled={selectedAddress === "" || isCheckoutLoading}
//                 onClick={handleCheckout}
//                 loading={isCheckoutLoading}
//               >
//                 {isCheckoutLoading ? "Processing..." : "Checkout"}
//               </Button>
//             </Box>
//           </Tooltip>
//         </Grid>
//       </Grid>

//       {isLogin && (
//         <AddressNewForm
//           open={addressForm.value}
//           onClose={addressForm.onFalse}
//           //
//           states={states}
//           isLogin={isLogin}
//           onAddressAddSuccess={handleSelect}
//         />
//       )}

//       {/* Full page loader during checkout */}
//       <Backdrop
//         open={isCheckoutLoading}
//         sx={{
//           color: '#fff',
//           zIndex: (theme) => theme.zIndex.drawer + 1,
//           display: 'flex',
//           flexDirection: 'column',
//           gap: 2,
//         }}
//       >
//         <CircularProgress color="inherit" size={60} />
//         <Typography variant="h6">Creating your order...</Typography>
//       </Backdrop>
//     </>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import { useBoolean } from "minimal-shared/hooks";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import zod from "zod";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  changeActiveStep,
  setProfileAddresses,
  resetCart,
  clearCartItems,
  getCartDataRequest,
  setShippingCharge,
} from "@/redux/actions";

import { paths } from "@/routes/paths";
import { useRouter } from "@/routes/hooks";

import { toast } from "@/components/snackbar";
import { EmptyContent } from "@/components/empty-content";
import { CartSummary } from "./cart-summary";
import { AddressItem, AddressNewForm } from "../address";
import { FonepayQrDialog } from "../payment/fonepay-qr-dialog";

import {
  useGetStates,
  removeAddress,
  createOrder,
  getLogisticCharge,
  initiateEsewaPayment,
  initiateFonepayPayment,
} from "@/api";

import {
  rememberEsewaAttempt,
  submitEsewaCheckoutForm,
  rememberFonepayAttempt,
  getErrorMessage,
} from "@/utils";

import { Field, Form } from "@/components/hook-form";

/* ---------------- Schema ---------------- */

export const SignUpSchema = zod
  .object({
    name: zod.string().min(1),
    phone_number: zod.string().regex(/^\d{10}$/),
    email: zod.string().email(),
    password: zod.string().min(8),
    password_confirmation: zod.string().min(8),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords don't match!",
    path: ["password_confirmation"],
  });

function getCheckoutButtonLabel({ isLogin, paymentMethod, isCheckoutLoading }) {
  if (isCheckoutLoading) {
    if (paymentMethod === "esewa") return "Redirecting to eSewa...";
    if (paymentMethod === "fonepay") return "Generating QR...";
    return "Processing...";
  }

  if (isLogin && paymentMethod === "esewa") return "Pay with eSewa";
  if (isLogin && paymentMethod === "fonepay") return "Pay with Fonepay";
  return "Checkout";
}

/* ---------------- Component ---------------- */

export function CartBillingAddress() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [selectedAddress, setSelectedAddress] = useState("");
  const [guestAddress, setGuestAddress] = useState(null);
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cod"); // 'cod' | 'esewa' | 'fonepay'
  const [fonepayCheckout, setFonepayCheckout] = useState(null); // { orderId, prn, amount, qr_message }

  const addressForm = useBoolean();
  const showPassword = useBoolean();
  const showConfirmPassword = useBoolean();

  const { addresses } = useAppSelector((state) => state.profile);
  const { discount, items: cartItems, total, subtotal, shipping } =
    useAppSelector((state) => state.cart);
  const { isLogin, user } = useAppSelector((state) => state.auth);
  const { vendor } = useAppSelector((state) => state.vendor);

  const { states } = useGetStates();

  /* ---------------- Auto select ---------------- */

  useEffect(() => {
    if (isLogin) {
      if (addresses?.length && !selectedAddress) {
        handleSelect(addresses[0]);
      } else if (!addresses?.length) {
        addressForm.onTrue();
      }
    }
  }, [addresses, isLogin]);

  /* ---------------- Helpers ---------------- */

  const handleBack = () => {
    dispatch(changeActiveStep(0));
  };

  const handleSelect = async (address) => {
    try {
      setSelectedAddress(address.address_id);

      const logisticCharge = await getLogisticCharge(
        address.district.district_id
      );

      dispatch(setShippingCharge(logisticCharge.charge_amount));
    } catch {
      toast.error("Couldn't select address!");
    }
  };

  const handleGuestSelect = async (address) => {
    try {
      setSelectedAddress("guest-address");
      setGuestAddress(address);

      localStorage.setItem("guestAddress", JSON.stringify(address));

      const logisticCharge = await getLogisticCharge(
        address.district.district_id
      );

      dispatch(setShippingCharge(logisticCharge.charge_amount));
    } catch {
      toast.error("Couldn't select address!");
    }
  };

  const handleDelete = async (id) => {
    try {
      await removeAddress(id);

      const updated = addresses.filter((a) => a.address_id !== id);
      dispatch(setProfileAddresses(updated));

      toast.success("Address deleted!");
    } catch {
      toast.error("Delete failed!");
    }
  };

  /* ---------------- Checkout ---------------- */

  const handleCheckout = async () => {
    setIsCheckoutLoading(true);

    try {
      const safeDiscount =
        typeof discount?.code === "string"
          ? discount.code
          : discount?.code?.code;

      const payload = isLogin
        ? {
          customer_address_id: selectedAddress,
          order_from: "web",
          ...(safeDiscount && { discount_code: safeDiscount }),
        }
        : {
          guest_address: guestAddress,
          order_from: "web",
          ...(safeDiscount && { discount_code: safeDiscount }),
        };

      const response = await createOrder(payload);

      const orderId =
        response?.data?.order_id || response?.data?.data?.order_id;

      if (!orderId) throw new Error("Order ID missing");

      // The cart order endpoint only saves the order — it never initiates
      // Fonepay, so a separate authenticated call requests the QR. Guarded
      // again here in case the vendor config changed after selection.
      if (isLogin && paymentMethod === "fonepay" && vendor?.has_fonepay_checkout) {
        // The order has consumed the server cart, so empty the persisted one now —
        // otherwise leaving without closing the dialog (refresh, back, tab close)
        // keeps stale items and the next checkout fails with "Cart is empty".
        // Don't resetCart() yet: it sets activeStep back to 0, which unmounts
        // this component (and the QR dialog with it).
        dispatch(clearCartItems());
        localStorage.removeItem("guestAddress");

        try {
          const fonepayResponse = await initiateFonepayPayment(orderId);
          const data = fonepayResponse?.data;

          if (!data?.qr_message || !data?.prn) {
            throw new Error("Couldn't get a Fonepay QR code.");
          }

          rememberFonepayAttempt({ orderId, prn: data.prn });

          // Stay on this page — the QR dialog tracks payment via polling.
          setFonepayCheckout({
            orderId,
            prn: data.prn,
            amount: data.amount,
            qr_message: data.qr_message,
            thirdparty_qr_websocket_url: data.thirdparty_qr_websocket_url,
          });
        } catch (fonepayError) {
          dispatch(resetCart());
          toast.error(
            fonepayError?.message ||
            "Order saved, but the Fonepay QR couldn't be generated. You can retry payment from your order page."
          );

          router.push(paths.order.details(orderId));
        }

        return;
      }

      // The cart order endpoint only saves the order — it never initiates
      // eSewa, so a separate authenticated call starts the gateway attempt.
      // Guarded again here in case the vendor config changed after selection.
      if (isLogin && paymentMethod === "esewa" && vendor?.has_esewa_checkout) {
        try {
          const esewaResponse = await initiateEsewaPayment(orderId);
          const { payment_url, payload: esewaPayload } =
            esewaResponse?.data || {};

          if (!payment_url || !esewaPayload) {
            throw new Error("Couldn't start eSewa payment.");
          }

          rememberEsewaAttempt({
            orderId,
            transactionUuid: esewaPayload.transaction_uuid,
          });

          dispatch(resetCart());
          localStorage.removeItem("guestAddress");

          toast.success("Order created! Redirecting to eSewa...");

          // Submits a real browser form POST and navigates away — do not
          // fetch this as JSON or regenerate the signature client-side.
          submitEsewaCheckoutForm({ payment_url, payload: esewaPayload });
          return;
        } catch (esewaError) {
          dispatch(resetCart());
          localStorage.removeItem("guestAddress");

          toast.error(
            esewaError?.message ||
            "Order saved, but eSewa payment couldn't start. You can retry payment from your order page."
          );

          router.push(paths.order.details(orderId));
          return;
        }
      }

      dispatch(resetCart());
      localStorage.removeItem("guestAddress");

      toast.success("Order created!");

      router.push(paths.order.details(orderId));
    } catch (err) {
      toast.error(getErrorMessage(err, "Checkout failed!"));
      // The local cart may be stale (e.g. already ordered) — resync with the server
      if (isLogin) dispatch(getCartDataRequest());
    } finally {
      setIsCheckoutLoading(false);
    }
  };

  /* ---------------- Fonepay dialog ---------------- */

  const handleFonepaySuccess = () => {
    const orderId = fonepayCheckout?.orderId;
    setFonepayCheckout(null);
    dispatch(resetCart());
    toast.success("Payment successful!");
    if (orderId) router.push(paths.order.details(orderId));
  };

  const handleFonepayClose = () => {
    // Closing the dialog doesn't cancel the attempt — the order is already
    // saved and remains checkable from the order details page.
    const orderId = fonepayCheckout?.orderId;
    setFonepayCheckout(null);
    dispatch(resetCart());
    if (orderId) router.push(paths.order.details(orderId));
  };

  /* ---------------- UI ---------------- */

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* LEFT */}
        <div className="md:col-span-8">
          <div className="flex flex-col gap-4">

            {/* Header */}
            <div className="flex justify-between items-center">
              <button
                onClick={handleBack}
                className="text-sm text-gray-700 hover:text-black"
              >
                ← Back
              </button>

              {isLogin && (
                <button
                  onClick={addressForm.onTrue}
                  className="px-3 py-1.5 border rounded-md text-sm hover:bg-gray-50"
                >
                  + New address
                </button>
              )}
            </div>

            {/* LOGIN ADDRESS */}
            {isLogin ? (
              addresses?.length ? (
                addresses.map((address) => (
                  <AddressItem
                    key={address.address_id}
                    addressItem={address}
                    selectedAddress={selectedAddress}
                    className="p-4 border rounded-lg shadow-sm"
                    action={
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleDelete(address.address_id)}
                          className="text-sm text-red-600 border px-3 py-1 rounded"
                        >
                          Delete
                        </button>

                        {selectedAddress !== address.address_id && (
                          <button
                            onClick={() => handleSelect(address)}
                            className="text-sm border px-3 py-1 rounded"
                          >
                            Select
                          </button>
                        )}
                      </div>
                    }
                  />
                ))
              ) : (
                <EmptyContent
                  title="No Address Found"
                  description="Add address to continue"
                />
              )
            ) : (
              /* GUEST */
              <div className="p-4 border rounded-lg">
                <h2 className="text-lg font-semibold mb-4">
                  Order Details
                </h2>

                <Form>
                  <div className="flex flex-col gap-4">

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <Field.Text name="name" label="Name" />
                      <Field.Text name="phone_number" label="Phone" />
                      <Field.Text name="email" label="Email" />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <Field.Text
                        name="password"
                        label="Password"
                        type={showPassword.value ? "text" : "password"}
                      />

                      <Field.Text
                        name="password_confirmation"
                        label="Confirm"
                        type={
                          showConfirmPassword.value ? "text" : "password"
                        }
                      />
                    </div>
                  </div>
                </Form>

                <AddressNewForm
                  open
                  isInline
                  states={states}
                  isLogin={false}
                  initialData={guestAddress}
                  onAddressAddSuccess={handleGuestSelect}
                />
              </div>
            )}
          </div>
        </div>

        {/* RIGHT */}
        <div className="md:col-span-4 space-y-4">
          <CartSummary
            isAddressSelected={selectedAddress !== ""}
            selectedAddressId={selectedAddress}
            paymentMethod={paymentMethod}
            onPaymentMethodChange={setPaymentMethod}
          />

          <button
            onClick={handleCheckout}
            disabled={!selectedAddress || isCheckoutLoading}
            className="w-full bg-black text-white py-3 rounded-md disabled:opacity-50"
          >
            {getCheckoutButtonLabel({ isLogin, paymentMethod, isCheckoutLoading })}
          </button>
        </div>
      </div>

      {/* ADDRESS MODAL */}
      {isLogin && (
        <AddressNewForm
          open={addressForm.value}
          onClose={addressForm.onFalse}
          states={states}
          isLogin={true}
          onAddressAddSuccess={handleSelect}
        />
      )}

      {/* LOADING */}
      {isCheckoutLoading && (
        <div className="fixed inset-0 bg-black/50 flex flex-col items-center justify-center z-50">
          <div className="h-12 w-12 border-4 border-white border-t-transparent rounded-full animate-spin" />
          <p className="text-white mt-3">Creating your order...</p>
        </div>
      )}

      {/* FONEPAY QR */}
      <FonepayQrDialog
        open={Boolean(fonepayCheckout)}
        orderId={fonepayCheckout?.orderId}
        initialData={fonepayCheckout}
        onClose={handleFonepayClose}
        onSuccess={handleFonepaySuccess}
      />
    </>
  );
}