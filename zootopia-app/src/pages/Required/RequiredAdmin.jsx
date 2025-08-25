import { useLocation, Navigate } from "react-router-dom";
import { useLoginContext } from "../../context/LoginContextProvider";

export default function RequireAdmin({ children }) {
  const { isLogin, roles, isLoading } = useLoginContext();
  const loc = useLocation();

  if (isLoading) return null;

  if (!isLogin) {
    return <Navigate to="/login" state={{ from: loc }} replace />;
  }
  if (!roles?.isAdmin) {
    return <Navigate to="/403" replace />; // 403 페이지 없으면 "/"로 바꿔도 됨
  }
  return children;
}
