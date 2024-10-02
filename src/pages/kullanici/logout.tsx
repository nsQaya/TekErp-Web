import { useNavigate } from "react-router-dom";
import { useUserStore } from "../../store/userStore";
import { useEffect } from "react";

const Logout = () => {
  const resetUser = useUserStore((state) => state.reset);
  const navigate = useNavigate();

  useEffect(() => {
    resetUser();  // Kullanıcıyı resetle
    navigate("/");  // İşlemden sonra ana sayfaya yönlendir
  }, [resetUser, navigate]);

  return <div>Logging out...</div>;  // İsteğe bağlı, bir yükleniyor mesajı gösterebilirsiniz
};

export default Logout;