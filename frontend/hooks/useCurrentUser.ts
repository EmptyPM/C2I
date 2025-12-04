import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";

type CurrentUser = {
  id: number;
  email: string;
  firstName: string | null;
  lastName: string | null;
  referralCode: string;
  role: string;
  status: string;
  tradingBalance: string;
  profitBalance: string;
  referralBalance: string;
  createdAt: string;
  updatedAt: string;
};

export function useCurrentUser() {
  // Read accessToken from localStorage on client
  const hasToken = typeof window !== "undefined" && !!localStorage.getItem("accessToken");

  const query = useQuery<CurrentUser>({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const res = await api.get("/users/me");
      return res.data as CurrentUser;
    },
    enabled: hasToken,
    retry: false,
    staleTime: 0,                    // never treat as fresh
    refetchOnMount: "always",        // refetch when you open page
    refetchOnWindowFocus: true,
  });

  return query; // returns { data, isLoading, isError, error, refetch, ... }
}
