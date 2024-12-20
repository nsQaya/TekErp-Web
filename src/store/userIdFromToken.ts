import { jwtDecode } from "jwt-decode";
import { useUserStore } from "./userStore";

interface TokenPayload {
  nameidentifier?: string;
  sub?: string;
  [key: string]: any;
}

export const getUserIdFromToken = (): string | undefined => {
  const token = useUserStore.getState().token;
  if (!token) {
    console.log("Token bulunamadı");
    return undefined;
  }

  try {
    const decoded: TokenPayload = jwtDecode(token);
    return decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"]
  } catch (error) {
    console.error("Token çözümleme hatası:", error);
    return undefined;
  }
};
