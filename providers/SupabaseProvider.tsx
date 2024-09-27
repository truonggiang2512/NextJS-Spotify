"use client";

import { Database } from "@/types_db";
import React, { useState } from "react";

interface SupabaseProviderProps {
  children: React.ReactNode;
}
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
const SupabaseProvider: React.FC<SupabaseProviderProps> = ({ children }) => {
  const [supabaseClient] = useState(() => {
    return createClientComponentClient<Database>();
  });

  return (
    <SessionContextProvider supabaseClient={supabaseClient}>
      {children}
    </SessionContextProvider>
  );
};
export default SupabaseProvider;
