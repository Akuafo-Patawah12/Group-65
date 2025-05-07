import { useNavigate } from "react-router-dom";
import { useCallback } from "react";
import {toast} from "react-toastify"

export const useLogout = () => {
  const navigate = useNavigate();

  const logout = useCallback(async () => {
    try {
      const res = await fetch("http://localhost:4000/api/auth/logout", {
        method: "POST",
        credentials: "include", // important if using cookies
      });

      if (!res.ok) throw new Error("Failed to logout");

      // Optional: Clear localStorage or context
      
      toast.success("Logout successful");
      // Redirect to login
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  }, [navigate]);

  return logout;
};
