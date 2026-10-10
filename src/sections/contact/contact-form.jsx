
"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { toast } from '@/components/snackbar';
import { sendContactForm } from '@/api/contact';
import { Iconify } from "@/components/iconify";
import { useAppSelector } from '@/redux/hooks';

// ---------------- Validation Schema ----------------
const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Please enter a valid email address"),
  subject: z.string().min(3, "Subject must be at least 3 characters").max(200),
  message: z.string().min(10, "Message must be at least 10 characters").max(1000),
});

// Quick Inquiry Topics
const TOPIC_SUGGESTIONS = [
  { id: 'order', label: 'Orders & Tracking', icon: 'solar:bag-check-bold-duotone', defaultSubject: 'Order & Delivery Assistance' },
  { id: 'product', label: 'Product Inquiry', icon: 'solar:magic-stick-3-bold-duotone', defaultSubject: 'Product Details & Recommendations' },
  { id: 'business', label: 'Wholesale / B2B', icon: 'solar:shop-2-bold-duotone', defaultSubject: 'Business & Wholesale Inquiry' },
  { id: 'general', label: 'General Help', icon: 'solar:question-circle-bold-duotone', defaultSubject: 'General Inquiry' },
];

// ---------------- Reusable Field Component ----------------
function FormField({ label, error, children, required = false }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold uppercase tracking-wider text-gray-700 ml-0.5">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      </div>
      {children}
      {error && (
        <p className="text-xs text-red-500 font-semibold flex items-center gap-1.5 mt-0.5 ml-1 animate-fade-in">
          <Iconify icon="solar:danger-circle-bold" width={14} className="shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}

// ---------------- Spinner ----------------
function Spinner() {
  return (
    <svg
      className="animate-spin h-5 w-5 text-white"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12" cy="12" r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      />
    </svg>
  );
}

// ---------------- Base input classes ----------------
const inputBase = [
  'w-full rounded-2xl border border-gray-200/90 pl-11 pr-4 py-3.5 text-sm transition-all duration-300 outline-none',
  'bg-gray-50/70 text-gray-900 placeholder-gray-400 font-medium',
  'focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/10 hover:border-gray-300 hover:bg-gray-50',
  'disabled:cursor-not-allowed disabled:opacity-50 shadow-[0_2px_4px_rgba(0,0,0,0.02)]',
].join(' ');

const inputError = 'border-red-400 bg-red-50/20 focus:border-red-500 focus:ring-red-500/15 hover:border-red-400';

// ----------------------------------------------------------------------

export function ContactForm({ className = '', ...other }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState(null);

  const vendor = useAppSelector((state) => state.vendor?.vendor);
  const primaryColor = vendor?.primary_color || "#2563eb";
  const secondaryColor = vendor?.secondary_color || "#7c3aed";

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const messageText = watch("message") || "";

  const handleSelectTopic = (topic) => {
    setSelectedTopic(topic.id);
    setValue("subject", topic.defaultSubject, { shouldValidate: true });
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await sendContactForm(data);
      toast.success("Message sent successfully! We'll get back to you shortly.");
      reset();
      setSelectedTopic(null);
    } catch (err) {
      toast.error(err?.message || "Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`relative ${className}`} {...other}>
      
      {/* Form Container Card */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-white p-7 sm:p-9 md:p-10 border border-gray-100/80 shadow-[0_20px_50px_rgba(0,0,0,0.06)]">
        
        {/* Decorative subtle ambient gradient accent */}
        <div
          className="pointer-events-none absolute top-0 right-0 h-44 w-44 rounded-full blur-3xl opacity-10"
          style={{ background: primaryColor }}
        />
        <div
          className="pointer-events-none absolute bottom-0 left-0 h-44 w-44 rounded-full blur-3xl opacity-10"
          style={{ background: secondaryColor }}
        />

        {/* Section Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-3">
            <Iconify icon="solar:chat-line-bold-duotone" width={16} />
            Direct Message
          </div>
          
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 leading-tight">
            Send us a message
          </h2>
          <p className="text-gray-500 text-sm sm:text-base mt-2 leading-relaxed max-w-lg">
            Whether you have an order question, partnership inquiry, or product question, fill out the details below.
          </p>
        </div>

        {/* Topic Selector Chips */}
        <div className="mb-7">
          <p className="text-xs font-bold uppercase tracking-wider text-gray-600 mb-2.5">
            What can we assist you with?
          </p>
          <div className="flex flex-wrap gap-2">
            {TOPIC_SUGGESTIONS.map((topic) => {
              const isSelected = selectedTopic === topic.id;
              return (
                <button
                  key={topic.id}
                  type="button"
                  onClick={() => handleSelectTopic(topic)}
                  className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 ${
                    isSelected
                      ? 'bg-gray-900 text-white shadow-md scale-[1.02]'
                      : 'bg-gray-100/80 text-gray-700 hover:bg-gray-200/70'
                  }`}
                >
                  <Iconify icon={topic.icon} width={16} className={isSelected ? 'text-white' : 'text-gray-500'} />
                  {topic.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* The Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-5"
        >
          {/* Name & Email Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            
            {/* Full Name */}
            <FormField label="Full Name" error={errors.name?.message} required>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-400">
                  <Iconify icon="solar:user-bold-duotone" width={18} />
                </span>
                <input
                  type="text"
                  placeholder="e.g. Maya Shrestha"
                  {...register("name")}
                  disabled={isSubmitting}
                  className={`${inputBase} ${errors.name ? inputError : ''}`}
                />
              </div>
            </FormField>

            {/* Email Address */}
            <FormField label="Email Address" error={errors.email?.message} required>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-400">
                  <Iconify icon="solar:letter-bold-duotone" width={18} />
                </span>
                <input
                  type="email"
                  placeholder="maya@example.com"
                  {...register("email")}
                  disabled={isSubmitting}
                  className={`${inputBase} ${errors.email ? inputError : ''}`}
                />
              </div>
            </FormField>

          </div>

          {/* Subject */}
          <FormField label="Subject" error={errors.subject?.message} required>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-400">
                <Iconify icon="solar:pen-new-square-bold-duotone" width={18} />
              </span>
              <input
                type="text"
                placeholder="Brief summary of your inquiry..."
                {...register("subject")}
                disabled={isSubmitting}
                className={`${inputBase} ${errors.subject ? inputError : ''}`}
              />
            </div>
          </FormField>

          {/* Message */}
          <FormField label="Your Message" error={errors.message?.message} required>
            <div className="relative">
              <span className="absolute top-4 left-4 pointer-events-none text-gray-400">
                <Iconify icon="solar:chat-round-line-bold-duotone" width={18} />
              </span>
              <textarea
                rows={5}
                placeholder="Provide as much detail as possible so we can assist you quickly..."
                {...register("message")}
                disabled={isSubmitting}
                className={`${inputBase} pl-11 resize-none ${errors.message ? inputError : ''}`}
              />
            </div>
            
            {/* Character counter */}
            <div className="flex justify-end pr-1">
              <span className="text-[11px] font-medium text-gray-400">
                {messageText.length} / 1000 characters
              </span>
            </div>
          </FormField>

          {/* Submit Button & Security Reassurance */}
          <div className="mt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            
            <button
              type="submit"
              disabled={isSubmitting}
              className={[
                'group relative flex items-center justify-center gap-2.5 overflow-hidden',
                'w-full sm:w-auto px-9 py-4 rounded-2xl text-sm font-bold text-white',
                'shadow-[0_10px_25px_rgba(0,0,0,0.18)] cursor-pointer',
                'transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_16px_32px_rgba(0,0,0,0.25)] active:translate-y-0',
                'disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:shadow-none',
              ].join(' ')}
              style={{
                background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`,
              }}
            >
              {/* Button light sweep effect */}
              <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

              {isSubmitting ? (
                <>
                  <Spinner />
                  <span>Sending Message...</span>
                </>
              ) : (
                <>
                  <span>Send Message</span>
                  <Iconify
                    icon="solar:plain-bold-duotone"
                    className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                    width={18}
                  />
                </>
              )}
            </button>

            {/* Privacy reassurance badge */}
            <div className="flex items-center gap-2 text-xs text-gray-500 justify-center sm:justify-end">
              <Iconify icon="solar:shield-check-bold" className="text-emerald-500 shrink-0" width={16} />
              <span>100% confidential. No spam ever.</span>
            </div>

          </div>

        </form>

      </div>
    </div>
  );
}