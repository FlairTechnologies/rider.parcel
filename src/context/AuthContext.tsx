"use client";
import { useRouter, usePathname } from "next/navigation";
import React, { createContext, useContext, useEffect, useState } from "react";

export interface IVehicle {
  type: string;
  color: string;
  plateNo: string;
  modl?: string;
}

export interface ICard {
  authorizationCode?: string;
  signature?: string;
  bin?: string;
  num?: string;
  expMonth?: string;
  expYear?: string;
  cardType?: string;
  bank?: string;
  brand?: string;
  accountName?: string;
}

export interface IUser {
  email: string;
  phone: string;
  username: string;
  loginType: string;
  role: string;
  isEmailVerified: boolean;
  referredBy?: string;
  card?: ICard;
  vehicle?: IVehicle;
  firstname?: string;
  lastname?: string;

  nin?: string;
  balance?: any;
}

interface IAuthContext {
  user: IUser | null;
  login: (userData: IUser, accessToken: string, refreshToken: string) => void;
  logout: () => void;
  accessToken: string | undefined;
  refreshToken: string | undefined;
  isAuthenticated: boolean;
}

const AuthContext = createContext<IAuthContext | undefined>(undefined);

const isValidUserData = (
  data: any
): data is { user: IUser; accessToken: string; refreshToken: string } => {
  return (
    data &&
    typeof data === "object" &&
    "user" in data &&
    "accessToken" in data &&
    "refreshToken" in data
  );
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | undefined>(undefined);
  const [refreshToken, setRefreshToken] = useState<string | undefined>(
    undefined
  );

  const router = useRouter();
  const pathname = usePathname();
  const AUTH_PAGES = [
    "/authentication/signin",
    "/authentication/signup/rider",
    "/authentication/signup",
    "/authentication/forget-password",
    "/authentication/forget-password/verify",
    "/authentication/create-password",
    "/authentication/verify",
    "/authentication/signup/rider/verify",
    "/authentication/signup/rider/verify-bike",
    "/",
  ];

  useEffect(() => {
    const checkAuth = async () => {
      if (AUTH_PAGES.includes(pathname)) {
        // Skip authentication check on auth pages
        return;
      }

      const data = localStorage.getItem("user_data");
      if (!data) {
        router.replace("/authentication/signin");
        return;
      }

      try {
        const parsedData = JSON.parse(data);
        if (!isValidUserData(parsedData))
          throw new Error("Invalid user data format");

        const { user, accessToken, refreshToken } = parsedData;

        if (!accessToken) {
          router.replace("/authentication/signin");
          return;
        }

        // Validate session from the API
        const response = await fetch("/api/users/session", {
          method: "GET",
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        const session = await response.json();

        if (response.ok) {
          if (session.tokenValid === false) {
            console.warn("Token has expired. Redirecting to sign-in...");
            logout();
            return;
          }

          // Update user data from session
          setUser(session.user || user);
          setAccessToken(session.accessToken || accessToken);
          setRefreshToken(session.refreshToken || refreshToken);
        } else {
          console.error("Failed to validate session. Logging out...");
          logout();
        }
      } catch (error) {
        console.error("Error validating session:", error);
        logout();
      }
    };

    checkAuth();
  }, [router, pathname]);

  const login = (
    userData: IUser,
    accessToken: string,
    refreshToken: string
  ) => {
    setUser(userData);
    setAccessToken(accessToken);
    setRefreshToken(refreshToken);

    localStorage.setItem(
      "user_data",
      JSON.stringify({ user: userData, accessToken, refreshToken })
    );

    if (userData.role === "rider") {
      router.replace("/rider/home");
    } else if (userData.role === "user") {
      router.replace("/user/home");
    }
  };

  const logout = async () => {
    try {
      await fetch("/api/users/logout", {
        method: "POST",
        body: JSON.stringify({ refreshToken }),
      });
    } catch (error: any) {
      console.error("Failed to log out:", error);
    } finally {
      setUser(null);
      setAccessToken(undefined);
      setRefreshToken(undefined);
      localStorage.removeItem("user_data");
      router.replace("/authentication/signin");
    }
  };

  const value = {
    user,
    accessToken,
    refreshToken,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
