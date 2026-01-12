import request, { SuperTest, Test } from 'supertest';
import { ENV } from '../config/env';

export class HttpClient {
  private readonly client: SuperTest<Test>;

  constructor() {
    this.client = request(ENV.baseUrl);
  }

  get(url: string, headers: Record<string, string> = {}) {
    return this.client
      .get(url)
      .set(headers)
      .timeout(ENV.timeoutMs);
  }

  post(
    url: string,
    body?: string | object,
    headers: Record<string, string> = {}
  ) {
    return this.client
      .post(url)
      .set(headers)
      .send(body)
      .timeout(ENV.timeoutMs);
  }

  put(
    url: string,
    body?: string | object,
    headers: Record<string, string> = {}
  ) {
    return this.client
      .put(url)
      .set(headers)
      .send(body)
      .timeout(ENV.timeoutMs);
  }

  patch(
    url: string,
    body?: string | object,
    headers: Record<string, string> = {}
  ) {
    return this.client
      .patch(url)
      .set(headers)
      .send(body)
      .timeout(ENV.timeoutMs);
  }

  delete(url: string, headers: Record<string, string> = {}) {
    return this.client
      .delete(url)
      .set(headers)
      .timeout(ENV.timeoutMs);
  }
}
