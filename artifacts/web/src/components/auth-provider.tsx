import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useGetMe, useLogin, useLogout, type LoginInput, type User } from "@workspace/api-client-react";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (data: LoginInput) => Promise<void>;
  logout: () => Promise<void>;
  setToken: (token: string) => void;
  getAuthHeaders: () => HeadersInit;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setTokenState] = useState<string | null>(() => localStorage.getItem("agentbazaar_token"));

  const setToken = (newToken: string | null) => {
    if (newToken) {
      localStorage.setItem("agentbazaar_token", newToken);
    } else {
      localStorage.removeItem("agentbazaar_token");
    }
    setTokenState(newToken);
  };

  const getAuthHeaders = (): HeadersInit => {
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const { data: user, isLoading, isError, refetch } = useGetMe({
    request: { headers: getAuthHeaders() },
    query: {
      enabled: !!token,
      retry: false,
    }
  });

  useEffect(() => {
    if (isError) {
      setToken(null);
    }
  }, [isError]);

  const loginMutation = useLogin();
  const logoutMutation = useLogout();

  const handleLogin = async (data: LoginInput) => {
    const res = await loginMutation.mutateAsync({ data });
    if (res.token) {
      setToken(res.token);
      await refetch();
    }
  };

  const handleLogout = async () => {
    try {
      if (token) {
        await logoutMutation.mutateAsync({ request: { headers: getAuthHeaders() } });
      }
    } finally {
      setToken(null);
    }
  };

  return (
    <AuthContext.Provider value={{
      user: user || null,
      token,
      isLoading,
      login: handleLogin,
      logout: handleLogout,
      setToken,
      getAuthHeaders
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
