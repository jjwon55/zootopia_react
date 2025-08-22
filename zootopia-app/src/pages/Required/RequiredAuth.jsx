import { useLocation, Navigate } from "react-router-dom";
import { useLoginContext } from "../../context/LoginContextProvider";

export default function RequireAuth({ children }) {
  const { isLogin, isLoading } = useLoginContext();
  const loc = useLocation();
    
  // 자동로그인 진행 중이면 잠깐 아무것도 안 보여줌(깜빡임 방지)
  if (isLoading) return null;

  if (!isLogin) {
    return <Navigate to="/login" state={{ from: loc }} replace />;
  }
  return children;
}
