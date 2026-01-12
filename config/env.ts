import { PROFILES, EnvProfile, EnvProfileName } from './profiles';

function getProfileName(): EnvProfileName {
  const name = process.env.TEST_ENV as EnvProfileName | undefined;

  if (!name) {
    return 'local'; // safe default
  }

  if (!PROFILES[name]) {
    throw new Error(
      `Unknown TEST_ENV "${name}". Valid values: ${Object.keys(PROFILES).join(', ')}`
    );
  }

  return name;
}

const profile: EnvProfile = PROFILES[getProfileName()];

export const ENV = {
  // resolved environment profile
  profile,

  // shortcuts (avoid deep imports)
  baseUrl: profile.baseUrl,
  timeoutMs: profile.timeoutMs,
  retries: profile.retries,

  // execution flags
  debugHttp: process.env.DEBUG_HTTP === 'true',
  traceSteps: process.env.TRACE_STEPS === 'true',
  enableReporting: process.env.ENABLE_REPORTING !== 'false',

  // safety switches
  allowDestructiveTests: profile.allowDestructiveTests
};
