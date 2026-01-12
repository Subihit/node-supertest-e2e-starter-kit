import { ENV } from '../config/env';

type StepFn = () => void | Promise<void>;

function hasJestStep(): boolean {
  return (
    typeof (global as any).test !== 'undefined' &&
    typeof (global as any).test.step === 'function'
  );
}

export const report = {
  /**
   * Report a meaningful test step.
   * In E2E runs, this shows up in test reports.
   * In other contexts, it safely becomes a no-op wrapper.
   */
  async step(name: string, fn: StepFn): Promise<void> {
    if (!ENV.enableReporting) {
      return fn();
    }

    if (hasJestStep()) {
      return (global as any).test.step(name, fn);
    }

    // Fallback: execute without reporting
    return fn();
  }
};
