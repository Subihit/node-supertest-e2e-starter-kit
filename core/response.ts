import { Response } from 'superagent';

export interface ApiDiagnostics {
  method: string;
  url: string;
  requestHeaders?: Record<string, unknown>;
  requestBody?: unknown;
  status: number;
  responseHeaders: Record<string, unknown>;
  responseBody: unknown;
}

export class ApiResponse<T = unknown> {
  constructor(private readonly res: Response) {}

  /** HTTP status code */
  get status(): number {
    return this.res.status;
  }

  /** Parsed response body */
  get body(): T {
    return this.res.body as T;
  }

  /** Response headers */
  get headers(): Record<string, unknown> {
    return this.res.headers;
  }

  /**
   * Full diagnostics snapshot.
   * Logged ONLY when a test fails.
   */
  get diagnostics(): ApiDiagnostics {
    const req: any = this.res.request;

    return {
      method: req?.method,
      url: req?.url,
      requestHeaders: req?.header,
      requestBody: req?._data,
      status: this.res.status,
      responseHeaders: this.res.headers,
      responseBody: this.res.body
    };
  }
}
