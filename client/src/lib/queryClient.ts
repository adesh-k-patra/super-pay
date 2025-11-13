import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  const res = await fetch(url, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    // Handle query parameters: if the last element is an object, treat it as query params
    let url: string;
    let hasQueryParams = false;
    
    if (queryKey.length > 1) {
      const lastElement = queryKey[queryKey.length - 1];
      
      // If last element is an object, treat as query parameters
      if (typeof lastElement === 'object' && lastElement !== null && !Array.isArray(lastElement)) {
        // Join all non-object elements as path segments
        url = queryKey.slice(0, -1).filter(k => k !== undefined && k !== null && k !== '').join("/") as string;
        
        // Append query parameters
        const params = new URLSearchParams();
        Object.entries(lastElement as Record<string, any>).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            params.append(key, String(value));
          }
        });
        const queryString = params.toString();
        if (queryString) {
          url += '?' + queryString;
          hasQueryParams = true;
        }
      } else {
        // Otherwise join all elements as path segments
        url = queryKey.filter(k => k !== undefined && k !== null && k !== '').join("/") as string;
      }
    } else {
      url = queryKey[0] as string;
    }
    
    const res = await fetch(url, {
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
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 60,
      retry: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
    },
    mutations: {
      retry: false,
    },
  },
});
