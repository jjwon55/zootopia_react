import React from "react";
import useScrollToTop from "../../hooks/useScrollToTop";
import { CircleChevronUp } from "lucide-react";

export default function ScrollToTopButton() {
  const { isVisible, scrollToTop } = useScrollToTop();

  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      className="tw:fixed tw:bottom-5 tw:right-5 tw:bg-[#ffb2b2] tw:text-[#8a8a8a] tw:px-4 tw:py-2 tw:rounded-full tw:shadow-md tw:hover:bg-[#ff6b61] tw:transition tw:z-50"
    >
     <CircleChevronUp />
    </button>
  );
}
