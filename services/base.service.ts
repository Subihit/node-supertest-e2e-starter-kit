import { ApiResponse } from '../core/response';

export abstract class BaseService<T = unknown> {
  protected apiResponse!: ApiResponse<T>;

  /**
   * Store the latest API response.
   * Must be called by service action methods.
   */
  protected setResponse(response: ApiResponse<T>): this {
    this.apiResponse = response;
    return this;
  }

  /**
   * Wrap assertions so that:
   * - Jest failures are preserved
   * - API diagnostics are logged automatically
   */
  protected assert(fn: () => void): void {
    try {
      fn();
    } catch (error) {
      // Diagnostics only on failure
      if (this.apiResponse) {
        // eslint-disable-next-line no-console
        console.error(
          '\n=== API FAILURE DIAGNOSTICS ===\n',
          JSON.stringify(this.apiResponse.diagnostics, null, 2),
          '\n==============================\n'
        );
      }

      throw error; // rethrow so Jest marks test as failed
    }
  }
}
