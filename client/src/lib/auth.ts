import { apiRequest } from "./queryClient";
import type { OtpVerification } from "@shared/schema";

export async function verifyOtp(data: OtpVerification) {
  const response = await apiRequest("POST", "/api/auth/verify-otp", data);
  return response.json();
}

export function getAuthHeaders(): Record<string, string> {
  // No need to manually add auth headers anymore - JWT tokens are handled via httpOnly cookies
  // The browser will automatically include the authentication cookie in requests
  return {};
}
