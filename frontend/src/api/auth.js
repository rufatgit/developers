import { useMutation } from "@tanstack/react-query";
import apiClient from "./client";
import { useAuthStore } from "../store/authStore";

// ==========================================================
// Raw API calls
// ==========================================================
export async function registerUser({ full_name, email, password }) {
  const { data } = await apiClient.post("/auth/register", {
    full_name,
    email,
    password,
  });
  return data;
}

export async function loginUser({ email, password }) {
  // FastAPI's OAuth2PasswordRequestForm expects form-encoded data,
  // with "username" as the field name (we treat it as email).
  const form = new URLSearchParams();
  form.append("username", email);
  form.append("password", password);

  const { data } = await apiClient.post("/auth/login", form, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });
  return data; // { access_token, token_type }
}

export async function fetchMe() {
  const { data } = await apiClient.get("/users/me");
  return data;
}

// ==========================================================
// React Query hooks
// ==========================================================
export function useRegister() {
  return useMutation({
    mutationFn: registerUser,
  });
}

export function useLogin() {
  const login = useAuthStore((s) => s.login);

  return useMutation({
    mutationFn: async (credentials) => {
      const tokenData = await loginUser(credentials);
      login(tokenData.access_token, null);
      const me = await fetchMe();
      login(tokenData.access_token, me);
      return me;
    },
  });
}
