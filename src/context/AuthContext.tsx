import { getCurrentAccount } from "@/lib/api";
import { IUser } from "@/types";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const INITIAL_USER = {
  id: "",
  name: "",
  username: "",
  email: "",
  imageUrl: "",
  bio: "",
};

const INITIAL_STATE = {
  user: INITIAL_USER,
  isPending: false,
  isAuthenticated: false,
  setUser: () => {},
  setIsAuthenticatedUser: () => {},
  checkAuthUser: async () => false as boolean,
};

const AuthContext = createContext(INITIAL_STATE);

const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState<IUser>(INITIAL_USER);
  const [isPending, setIsPending] = useState<Boolean>(false);
  const [isAuthenticated, setIsAuthenticatedUser] = useState<Boolean>(false);

  const navigate = useNavigate();

  const checkAuthUser = async () => {
    try {
      const currentAccount = await getCurrentAccount();

      if (currentAccount) {
        setUser({
          id: currentAccount?.$id,
          name: currentAccount.name,
          username: currentAccount.username,
          email: currentAccount.email,
          imageUrl: currentAccount.imageUrl,
          bio: currentAccount.bio,
        });
        setIsAuthenticatedUser(true);
        return true;
      }
      return false;
    } catch (err) {
      console.log(err);
      return false;
    } finally {
      setIsPending(false);
    }
  };

  useEffect(() => {
    if (
      localStorage.getItem("cookieFallback") === "[]" ||
      localStorage.getItem("cookieFallback") === "null"
    )
      navigate("/sign-in");
    checkAuthUser();
  }, []);

  const value = {
    user,
    setUser,
    isPending,
    isAuthenticated,
    setIsAuthenticatedUser,
    checkAuthUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;

export const useUserContext = () => useContext(AuthContext);
