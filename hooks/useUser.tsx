// provider for auth and supabase

import { User } from "@supabase/auth-helpers-nextjs";
import {
  useSessionContext,
  useUser as useSupaUser,
} from "@supabase/auth-helpers-react";
import { createContext, useContext, useEffect, useState } from "react";
import { Subscriptions, UserDetails } from "@/types";
//tạo context để quản lý thông tin người dùng
type UserContextType = {
  accessToken: string | null;
  user: User | null;
  userDetails: UserDetails | null;
  isLoading: boolean;
  subscription: Subscriptions | null;
};
export const UserContext = createContext<UserContextType | undefined>(
  undefined
);
export interface Props {
  [propName: string]: any;
}
//Tạo Provider cho context
export const MyUserContextProvider = (props: Props) => {
  const {
    session,
    isLoading: isLoadingUser,
    supabaseClient: supabase,
  } = useSessionContext();
  const user = useSupaUser();
  const accessToken = session?.access_token ?? null;
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [subscription, setSubscription] = useState<Subscriptions | null>(null);
  const getUserDetails = () => supabase.from("users").select("*").single();
  const getSubscription = () =>
    supabase
      .from("subscriptions")
      .select("*,prices(*,products(*))")
      .in("status", ["trialing", "active"])
      .single();
  //Sử dụng useEffect để tải dữ liệu khi cần
  useEffect(() => {
    if (user && !isLoadingData && !userDetails && !subscription) {
      setIsLoadingData(true);
      Promise.allSettled([getUserDetails(), getSubscription()]).then(
        (result) => {
          const userDetailsPromise = result[0];
          const subscriptionPromise = result[1];
          if (userDetailsPromise.status === "fulfilled") {
            setUserDetails(userDetailsPromise.value.data as UserDetails);
          }
          if (subscriptionPromise.status === "fulfilled") {
            setSubscription(subscriptionPromise.value.data as Subscriptions);
          }
          setIsLoadingData(false);
        }
      );
    } else if (!user && !isLoadingUser && !isLoadingData) {
      setUserDetails(null);
      setSubscription(null);
    }
  }, [user, isLoadingUser]);
  //useEffect: chạy khi người dùng (user) hoặc trạng thái tải của người dùng (isLoadingUser) thay đổi.

  //Cung cấp giá trị cho Context
  const value = {
    accessToken,
    user,
    userDetails,
    isLoading: isLoadingData || isLoadingUser,
    subscription,
  };
  return <UserContext.Provider value={value} {...props} />;
};
export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a MyUserContextProvider");
  }
  return context;
};
