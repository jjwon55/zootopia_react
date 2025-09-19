import React, { useContext } from "react";
import useScrollToTop from "../../hooks/useScrollToTop";
import { CircleChevronUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { LoginContext } from "../../context/LoginContextProvider";

export default function ScrollToTopButton() {
  const { isVisible, scrollToTop } = useScrollToTop();
  const { roles, isLogin } = useContext(LoginContext);
  const navigate = useNavigate();
  
  if (!isVisible) return null;

  const moveAdmin = () => {
    navigate("/admin/post");
  };

  return (
    <div>
    <button
      onClick={scrollToTop}
      className="tw:fixed tw:bottom-5 tw:right-5 tw:bg-[#ff4b4b] tw:text-[#ffffff] tw:px-4 tw:py-2 tw:rounded-full tw:shadow-md tw:hover:bg-[#ff1100] tw:transition tw:z-[9999]"
    >
     <CircleChevronUp />
    </button>
    {roles.isAdmin && isLogin && (
          <button
            onClick={moveAdmin}
            className="tw:fixed tw:bottom-2 tw:right-28 tw:bg-[#74b9ff] tw:text-white tw:px-4 tw:py-2 tw:rounded hover:tw:bg-[#0984e3] tw:mb-3 md:tw:mb-0 tw:cursor-pointer tw:hover:bg-[#389bff]"
          >
            Admin
          </button>
        )}
    </div>
  );
}
