// AbortController utility for request cancellation
export class ApiClient {
  private controller = new AbortController();
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  // Cancel any ongoing requests
  cancel() {
    this.controller.abort();
    this.controller = new AbortController();
  }

  // Generic fetch wrapper with error handling
  async fetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    try {
      const response = await fetch(url, {
        ...options,
        signal: this.controller.signal,
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        throw new Error("Request was cancelled");
      }
      throw error;
    }
  }

  // GET request
  get<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
    const searchParams = params ? `?${new URLSearchParams(params)}` : "";
    return this.fetch<T>(`${endpoint}${searchParams}`);
  }

  // POST request
  post<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.fetch<T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // DELETE request
  delete<T>(endpoint: string): Promise<T> {
    return this.fetch<T>(endpoint, {
      method: "DELETE",
    });
  }
}

// Singleton instance
export const apiClient = new ApiClient("https://api.roadsurfer.com");
