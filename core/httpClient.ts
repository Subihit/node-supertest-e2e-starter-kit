import request, { SuperTest, Test } from 'supertest';
import { ENV } from '../config/env';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export class HttpClient {
  private readonly client: SuperTest<Test>;

  constructor() {
    this.client = request(ENV.baseUrl);
  }

  /* 
     Public HTTP methods 
  */

  get(url: string, headers: Record<string, string> = {}) {
    return this.request('GET', url, { headers });
  }

  post(
    url: string,
    body?: string | object,
    headers: Record<string, string> = {}
  ) {
    return this.request('POST', url, { headers, body });
  }

  put(
    url: string,
    body?: string | object,
    headers: Record<string, string> = {}
  ) {
    return this.request('PUT', url, { headers, body });
  }

  patch(
    url: string,
    body?: string | object,
    headers: Record<string, string> = {}
  ) {
    return this.request('PATCH', url, { headers, body });
  }

  delete(url: string, headers: Record<string, string> = {}) {
    return this.request('DELETE', url, { headers });
  }

  /* 
    Internal request handler 
  */

  private request(
    method: HttpMethod,
    url: string,
    options?: {
      headers?: Record<string, string>;
      body?: string | object | null;
    }
  ) {
    const headers = options?.headers ?? {};
    const body = options?.body;

    this.logRequest(method, url, headers, body);

    let req = this.client[
      method.toLowerCase() as 'get'
    ](url)
      .set(headers)
      .timeout(ENV.timeoutMs);

    if (body != null && method !== 'GET' && method !== 'DELETE') {
      req = req.send(body);
    }

    return req;
  }

  /*
     Logging helpers
   */

private logRequest(
  method: HttpMethod,
  url: string,
  headers: Record<string, string>,
  body?: unknown
) {
  if (process.env.DEBUG_HTTP !== 'true') return;

  const lines: string[] = [];

  lines.push('[HTTP REQUEST]');
  lines.push(`Method : ${method}`);
  lines.push(`URL    : ${ENV.baseUrl}${url}`);
  lines.push(`Headers: ${JSON.stringify(headers, null, 2)}`);

  if (body !== undefined) {
    lines.push(
      `Body   : ${JSON.stringify(this.redact(body), null, 2)}`
    );
  }

  lines.push('-------------------------');

  // eslint-disable-next-line no-console
  console.log('\n' + lines.join('\n') + '\n');
}


  private redact(body: unknown) {
    if (!body || typeof body !== 'object') return body;

    const clone = { ...(body as any) };

    if ('password' in clone) clone.password = '***';
    if ('client_secret' in clone) clone.client_secret = '***';

    return clone;
  }
}
