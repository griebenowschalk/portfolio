import apiClient from "./api-client";

interface LoginResponse {
  success: boolean;
  data: {
    user: {
      id: string;
      name: string;
      email: string;
      role: string;
    };
    accessToken: string;
    refreshToken: string;
  };
}

export const login = async (
  email: string,
  password: string,
): Promise<LoginResponse> => {
  const { data } = await apiClient.post("/auth/login", { email, password });
  return data;
};

export const logout = async (): Promise<void> => {
  await apiClient.post("/auth/logout");
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");
};

export const getCurrentUser = async () => {
  const { data } = await apiClient.get("/auth/me");
  return data.data;
};

export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem("accessToken");
};

export const getStoredUser = () => {
  const userStr = localStorage.getItem("user");
  return userStr ? JSON.parse(userStr) : null;
};
