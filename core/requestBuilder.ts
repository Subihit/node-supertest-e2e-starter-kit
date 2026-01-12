import { HttpClient } from './httpClient';

type Headers = Record<string, string>;

export class RequestBuilder {
  private headers: Headers = {};

  constructor(private readonly client: HttpClient) {}

  /**
   * Attach Bearer auth token
   */
  withAuth(token: string): this {
    this.headers['Authorization'] = `Bearer ${token}`;
    return this;
  }

  /**
   * Attach arbitrary headers
   */
  withHeaders(headers: Headers): this {
    this.headers = { ...this.headers, ...headers };
    return this;
  }

  /**
   * Convenience for JSON APIs
   */
  asJson(): this {
    this.headers['Content-Type'] = 'application/json';
    this.headers['Accept'] = 'application/json';
    return this;
  }

  /**
   * HTTP verbs
   */
  get(url: string) {
    return this.client.get(url, this.headers);
  }

  post(url: string, body: string | object) {
    return this.client.post(url, body, this.headers);
  }

  put(url: string, body: string | object) {
    return this.client.put(url, body, this.headers);
  }

  patch(url: string, body: string | object) {
    return this.client.patch(url, body, this.headers);
  }

  delete(url: string) {
    return this.client.delete(url, this.headers);
  }
}
