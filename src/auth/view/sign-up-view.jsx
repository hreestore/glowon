"use client";

import { z as zod } from "zod";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useBoolean } from "minimal-shared/hooks";
import { zodResolver } from "@hookform/resolvers/zod";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setUser } from "@/redux/actions";

import { paths } from "@/routes/paths";
import { useRouter } from "@/routes/hooks";
import { RouterLink } from "@/routes/components";

import { Iconify } from "@/components/iconify";
import { Form, Field } from "@/components/hook-form";
import { AnimateLogoRotate } from "@/components/animate";
import { toast } from "@/components/snackbar";

import { FormHead } from "../components/form-head";
import { SignUpTerms } from "../components/sign-up-terms";
import { GoogleAuth } from "../components/google-auth";

import { AddressNewForm } from "@/sections/address";

import { addProductToCart, signUp, useGetStates } from "@/api";

// ----------------------------------------------------------------------

export const SignUpSchema = zod
  .object({
    name: zod.string().min(1, { message: "Name is required!" }),

    phone_number: zod
      .string()
      .min(1, { message: "Phone number is required!" })
      .regex(/^\d{10}$/, {
        message: "Phone number must be exactly 10 digits!",
      }),

    email: zod
      .string()
      .min(1, { message: "Email is required!" })
      .email({ message: "Email must be a valid email address!" }),

    password: zod
      .string()
      .min(1, { message: "Password is required!" })
      .min(8, { message: "Password must be at least 8 characters!" }),

    password_confirmation: zod
      .string()
      .min(1, { message: "Confirm password is required!" })
      .min(8, { message: "Confirm password must be at least 8 characters!" }),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords don't match!",
    path: ["password_confirmation"],
  });

// ----------------------------------------------------------------------

export function SignUpView() {
  const vendor = useAppSelector((state) => state.vendor.vendor);
  const router = useRouter();

  const showPassword = useBoolean();
  const showConfirmPassword = useBoolean();
  const showAddressForm = useBoolean();

  const [isEmailVerificationPending, setIsEmailVerificationPending] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");

  const dispatch = useAppDispatch();

  const { items } = useAppSelector((state) => state.cart);
  const { user, userToken } = useAppSelector((state) => state.auth);

  const [errorMessage, setErrorMessage] = useState("");

  // Redirect to profile if user is already logged in
  useEffect(() => {
    if (user?.customer?.id || userToken) {
      router.push(paths.profile.root);
    }
  }, [user, userToken, router]);

  const { states } = useGetStates();

  const defaultValues = {
    name: "",
    phone_number: "",
    email: "",
    password: "",
    password_confirmation: "",
  };

  const methods = useForm({
    resolver: zodResolver(SignUpSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      setErrorMessage("");

      const response = await signUp(data);

      if (response.success && response.customer && response.token) {
        dispatch(
          setUser({
            customer: response.customer,
            token: response.token,
            token_type: response.token_type,
          })
        );

        if (items?.length > 0) {
          await addProductToCart(items, response.token);
        }

        reset();

        toast.success(
          response.message ||
          "Registration successful! Please verify your email to access full features."
        );

        setRegisteredEmail(data.email);
        setIsEmailVerificationPending(true);

        setTimeout(() => {
          router.push(paths.home);
        }, 2000);
      }
    } catch (error) {
      if (error?.email) {
        setErrorMessage(error.email[0]);
      } else if (error?.phone_number) {
        setErrorMessage(error.phone_number[0]);
      } else if (error?.password) {
        setErrorMessage(error.password[0]);
      } else if (error?.message) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("Oops! Something went wrong. Please try again");
      }
    }
  });

  const renderPasswordToggle = (toggle) => (
    <button
      type="button"
      onClick={toggle.onToggle}
      aria-label={toggle.value ? "Hide password" : "Show password"}
      className="flex items-center p-1 rounded text-gray-500 hover:text-gray-700 focus:outline-none"
    >
      <Iconify icon={toggle.value ? "solar:eye-bold" : "solar:eye-closed-bold"} />
    </button>
  );

  const renderForm = () => (
    <div className="flex flex-col gap-3">
      {/* Name + Phone row */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <Field.Text name="name" label="Name" autoComplete="name" />
        <Field.Text
          name="phone_number"
          label="Phone Number"
          type="tel"
          inputMode="numeric"
          maxLength={10}
          autoComplete="tel"
        />
      </div>

      <Field.Text name="email" label="Email address" type="email" autoComplete="email" />

      <Field.Text
        name="password"
        label="Password"
        type={showPassword.value ? "text" : "password"}
        autoComplete="new-password"
        slotProps={{ input: { endAdornment: renderPasswordToggle(showPassword) } }}
      />

      <Field.Text
        name="password_confirmation"
        label="Confirm Password"
        type={showConfirmPassword.value ? "text" : "password"}
        autoComplete="new-password"
        slotProps={{ input: { endAdornment: renderPasswordToggle(showConfirmPassword) } }}
      />

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full mt-1 py-2.5 px-3 bg-gray-900 text-white text-sm font-semibold rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center gap-2"
      >
        {isSubmitting ? (
          <>
            <Iconify icon="svg-spinners:8-dots-rotate" className="w-4 h-4" />
            Creating account...
          </>
        ) : (
          "Create account"
        )}
      </button>
    </div>
  );

  const renderEmailVerificationPending = () => (
    <div className="text-center pt-4">
      <Iconify
        icon="eva:email-outline"
        className="mx-auto mb-6 w-16 h-16 text-primary-600"
      />

      <h2 className="text-2xl font-bold text-gray-900 mb-3">
        Verify your email
      </h2>

      <p className="text-sm text-gray-500 mb-1">
        We've sent a verification link to
      </p>

      <p className="text-base font-semibold text-gray-800 mb-4">
        {registeredEmail}
      </p>

      <p className="text-sm text-gray-500 mb-6">
        Please check your email and click on the verification link to activate
        your account.
      </p>

      <div className="flex flex-col gap-3">
        <RouterLink
          href={paths.auth.signIn}
          className="w-full py-2.5 px-4 bg-gray-900 text-white text-sm font-semibold rounded-lg hover:bg-gray-700 text-center transition-colors duration-200"
        >
          Go to Login
        </RouterLink>

        <p className="text-xs text-gray-400">
          Didn't receive the email? Check your spam folder.
        </p>
      </div>
    </div>
  );

  return (
    <>
      <div className="container mx-auto max-w-screen-xl my-12 sm:my-20 px-4">
        <main className="flex justify-center items-center">
          {isEmailVerificationPending ? (
            <div className="w-full max-w-[420px]">
              <AnimateLogoRotate className="mx-auto" />
              {renderEmailVerificationPending()}
            </div>
          ) : (
            <div className="flex flex-col gap-4 w-full max-w-[420px]">
              <AnimateLogoRotate className="mx-auto" />

              <FormHead
                title="Create new account"
                description={
                  <>
                    {`Already have an account? `}
                    <RouterLink
                      href={paths.auth.signIn}
                      className="font-semibold text-gray-900 hover:underline"
                    >
                      Sign in
                    </RouterLink>
                  </>
                }
                className="md:text-left"
              />

              {!!errorMessage && (
                <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
                  <Iconify
                    icon="mdi:alert-circle-outline"
                    className="w-5 h-5 mt-0.5 shrink-0"
                  />
                  <span>{errorMessage}</span>
                </div>
              )}

              <Form methods={methods} onSubmit={onSubmit}>
                {renderForm()}
              </Form>

              {vendor?.has_oauth && (
                <>
                  {/* Divider */}
                  <div className="flex items-center gap-3">
                    <div className="flex-1 border-t border-dashed border-gray-300" />
                    <span className="text-xs text-gray-400">or</span>
                    <div className="flex-1 border-t border-dashed border-gray-300" />
                  </div>

                  <GoogleAuth type="Sign up" />
                </>
              )}

              <SignUpTerms />
            </div>
          )}
        </main>
      </div>

      <AddressNewForm
        open={showAddressForm.value}
        onClose={() => {
          showAddressForm.onFalse();
          router.push(paths.home);
        }}
        states={states}
      />
    </>
  );
}