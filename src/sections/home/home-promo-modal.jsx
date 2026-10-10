"use client";

import { useEffect, useState } from "react";

// ----------------------------------------------------------------------

function CloseIcon({ className = "" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M18 6 6 18" />
      <path d="M6 6l12 12" />
    </svg>
  );
}

// ----------------------------------------------------------------------

export function HomePromoModal({
  open,
  onClose,
  popupDialogData,
}) {
  const popups = Array.isArray(popupDialogData)
    ? popupDialogData.filter((popup) => popup?.is_active == 1)
    : [];

  const [currentIndex, setCurrentIndex] = useState(0);

  const currentPopup = popups[currentIndex];

  const isOpen = open && !!currentPopup;

  const goToNext = () => {
    if (currentIndex < popups.length - 1) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    } else {
      setCurrentIndex(0);
      onClose();
    }
  };

  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") goToNext();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, currentIndex]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[1300] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
      onClick={goToNext}
    >
      <div
        className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={goToNext}
          aria-label="Close"
          className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-gray-700 shadow-md transition hover:bg-white hover:text-gray-900"
        >
          <CloseIcon className="h-5 w-5" />
        </button>

        {popups.length > 1 && (
          <div className="absolute left-3 top-3 z-10 rounded-full bg-white/90 px-2.5 py-1 text-xs font-medium text-gray-700 shadow-md">
            {currentIndex + 1}/{popups.length}
          </div>
        )}

        <div className="relative aspect-square w-full">
          <img
            src={currentPopup?.image || "/assets/placeholder.png"}
            alt={currentPopup?.title || "Promotion"}
            title={currentPopup?.title || "Promotion"}
            sizes="(max-width: 640px) 100vw, 512px"
            className="h-full w-full object-cover"
          />

        {currentPopup?.link && (
          <div className="absolute inset-x-0 bottom-0 flex justify-center bg-gradient-to-t from-black/50 via-black/20 to-transparent px-5 pb-5 pt-16 sm:pb-6">
            <a
              href={currentPopup.link}
              onClick={onClose}
              className="group flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#D4A983] to-[#B98A5E] px-6 py-3.5 text-sm font-semibold uppercase tracking-[0.15em] text-white shadow-lg shadow-[#B98A5E]/30 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#B98A5E]/40 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#D4A983]/50 active:translate-y-0"
            >
              {currentPopup?.button_text || "Learn More"}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1"
              >
                <path d="M5 12h14" />
                <path d="m13 6 6 6-6 6" />
              </svg>
            </a>
          </div>
        )}
        </div>

        {/* {(currentPopup?.title || currentPopup?.description || currentPopup?.link) && (
          <div className="flex flex-col gap-3 p-6 text-center">
            {currentPopup?.title && (
              <h3 className="text-xl font-semibold text-gray-900">
                {currentPopup.title}
              </h3>
            )}

            {currentPopup?.description && (
              <div
                className="text-sm leading-relaxed text-gray-600 [&_p]:m-0"
                dangerouslySetInnerHTML={{ __html: currentPopup.description }}
              />
            )}

            {currentPopup?.link && (
              <a
                href={currentPopup.link}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 inline-flex items-center justify-center self-center rounded-full bg-gray-900 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-gray-700"
              >
                Learn More
              </a>
            )}
          </div>
        )} */}
      </div>
    </div>
  );
}
