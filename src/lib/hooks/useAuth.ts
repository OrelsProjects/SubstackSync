"use client";

import { signIn, signOut as signOutAuth } from "next-auth/react";
import { useCallback, useState } from "react";
import { clearUser, setError } from "@/lib/features/auth/authSlice";
import { useAppDispatch } from "@/lib/hooks/redux";
import axiosInstance from "@/lib/axios-instance";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

const useAuth = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [loading, setLoading] = useState(false);
  const redirect = searchParams.get("redirect") || undefined;

  const signInWithGoogle = useCallback(async (redirectTo?: string) => {
    try {
      const redirectDefault = "/updates";
      let redirectPath = new URL(`${window.location.origin}`);
      try {
        let newRedirect = redirectTo || redirect || redirectDefault;
        if (newRedirect.includes(window.location.origin)) {
          newRedirect = newRedirect.replace(window.location.origin, "");
        }

        if (!newRedirect.startsWith("/")) {
          newRedirect = `/${newRedirect}`;
        }

        redirectPath = new URL(`${window.location.origin}${newRedirect}`);
      } catch (error: any) {
        console.error("Error parsing redirect path", {
          error,
          redirectTo,
          redirect,
          redirectDefault,
        });
      }

      // preserve query params
      searchParams.forEach((val, key) => {
        if (!redirectPath.searchParams.has(key)) {
          redirectPath.searchParams.append(key, val);
        }
      });

      console.info("Redirect path", { redirectPath: redirectPath.toString() });

      setLoading(true);

      await signIn("google", {
        redirect: true,
        callbackUrl: redirectPath.toString(),
      });
    } catch (error: any) {
      if (error?.name === "UserAlreadyAuthenticatedException") {
        console.info("User already authenticated");
        await signOutAuth({ redirect: true, callbackUrl: "/" });
        return;
      }
      console.error("Error signing in with Google", { error });
      dispatch(setError("Failed to sign in"));
      throw error;
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      await signOutAuth({ callbackUrl: "/" });
      dispatch(clearUser());
      // localStorage.clear();
    } catch (error: any) {
      console.error("Error signing out", { error });
      dispatch(setError("Failed to sign out"));
      throw error;
    } finally {
      router.push("/");
    }
  }, []);

  const deleteUser = useCallback(async () => {
    try {
      console.info("delete_user");
      await axiosInstance.delete("/api/user");
      await signOutAuth({ callbackUrl: "/" });
      dispatch(clearUser());
      localStorage.clear();
      router.push("/");
    } catch (error: any) {
      console.error("Error deleting user", { error });
      dispatch(setError("Failed to delete user"));
      throw error;
    }
  }, []);

  const refreshUserMetadata = useCallback(async () => {
    try {
      await axiosInstance.post("/api/user/data/refresh");
    } catch (error: any) {
      console.error("Error refreshing user metadata", { error });
    }
  }, []);

  return {
    refreshUserMetadata,
    signInWithGoogle,
    deleteUser,
    signOut,
    loading,
  };
};

export default useAuth;
