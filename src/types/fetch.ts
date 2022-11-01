export type Fetch = typeof fetch;

export interface FetchOptions {
  headers?: {
    [key: string]: string;
  };
  noResolveJson?: boolean;
}

export interface FetchParameters {
  signal?: AbortSignal;
}

export type RequestMethodType = 'GET' | 'POST' | 'PUT' | 'DELETE';
