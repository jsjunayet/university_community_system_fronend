"use client";

import { getCurrentUser } from "@/services/authSeverice";
import { User } from "@/types";
import React, { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => void;
  refreshUser: () => Promise<void>;
  setUser: (user: User | null) => void;
}
// export const saveFcmToken = async () => {
//   try {
//     const fcmToken = await requestForToken(); // Get token
//     if (fcmToken) {
//       const saveToken = httpsCallable(functions, "saveToken");
//       await saveToken({ token: fcmToken });
//       console.log("FCM token saved successfully");
//     }
//   } catch (error) {
//     console.error("Error saving FCM token:", error);
//   }
// };
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUserState] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    setLoading(true);
    try {
      const currentUser = await getCurrentUser();
      console.log("Fetched current user:", currentUser);
      // saveFcmToken();
      setUserState(currentUser as User | null);
    } catch (error) {
      console.error("Error fetching user:", error);
      setUserState(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
    // saveFcmToken();
  }, []);

  const logoutUser = () => {
    setUserState(null);
    logout(); // your server logout function to delete cookie
  };

  const setUser = (newUser: User | null) => {
    setUserState(newUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        logout: logoutUser,
        refreshUser: fetchUser,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
