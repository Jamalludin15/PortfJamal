import { QueryClient, QueryFunction } from "@tanstack/react-query";
import { authManager } from "./auth";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    if (res.status === 401) {
      authManager.clearAuth(); // Clear auth on unauthorized
      // Redirect to login page
      if (window.location.pathname !== '/admin') {
        window.location.href = '/admin';
      }
    }
    throw new Error(`${res.status}: ${text}`);
  }
}

export const apiRequest = async (
  method: string,
  url: string,
  data?: any
): Promise<Response> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...authManager.getAuthHeaders()
  };

  try {
    const response = await fetch(url, {
    method,
      headers,
    body: data ? JSON.stringify(data) : undefined,
      credentials: 'include'
    });

    if (!response.ok) {
      if (response.status === 401) {
        // Clear auth and redirect to login on unauthorized
        authManager.clearAuth();
        if (window.location.pathname !== '/admin') {
          window.location.href = '/admin';
        }
        throw new Error('Session expired. Please login again.');
      }

      const error = await response.json().catch(() => ({ message: 'An error occurred' }));
      throw new Error(error.message || `Request failed with status ${response.status}`);
    }

    return response;
  } catch (error: any) {
    if (error.message === 'Failed to fetch') {
      throw new Error('Network error. Please check your connection.');
    }
    throw error;
  }
};

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const res = await fetch(queryKey[0] as string, {
      headers: authManager.getAuthHeaders(),
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: (failureCount, error: any) => {
        // Don't retry on 401 unauthorized
        if (error?.message?.includes("401")) return false;
        return failureCount < 3;
      },
    },
    mutations: {
      retry: (failureCount, error: any) => {
        // Don't retry on 401 unauthorized
        if (error?.message?.includes("401")) return false;
        return failureCount < 3;
      },
    },
  },
});
