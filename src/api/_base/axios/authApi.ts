import axios from "axios";
import { getBaseURL } from "./getBaseURL";

const authApi = axios.create({
  baseURL: getBaseURL(),
  withCredentials: true,
  timeout: 5000,
});

authApi.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    // 서버환경에서 실행했을때 에러라는 것을 알려줌
    if (typeof window === "undefined" || !originalRequest) {
      return Promise.reject(error);
    }

    const isAuthError = [401].includes(error.response?.status);
    const isAlreadyRetried = originalRequest._retry;
    const isRefreshRequest = originalRequest.url?.includes("auth/refresh");

    const isLoginAttempt = originalRequest.url?.includes("auth/login");

    if (isRefreshRequest || isLoginAttempt) {
      return Promise.reject(error);
    }

    if (isAuthError && !isAlreadyRetried) {
      originalRequest._retry = true;

      try {
        await authApi.post("/auth/refresh");

        // 토큰 재발급 성공 시 커스텀 이벤트 발생
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("tokenRefreshed"));
        }

        return authApi(originalRequest);
      } catch (refreshError) {
        // 세션이 만료되면 로그인 화면으로 보내고, 로그인 후 원래 화면으로 돌아오게 한다.
        const currentPath = window.location.pathname;
        if (!currentPath.startsWith("/login"))
          window.location.replace(
            "/login?reason=session-expired&callbackUrl=" +
              encodeURIComponent(currentPath + window.location.search)
          );
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default authApi;
