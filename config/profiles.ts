export type EnvProfileName = 'local' | 'staging' | 'prod-like';

export interface EnvProfile {
  name: EnvProfileName;
  baseUrl: string;
  timeoutMs: number;
  retries: number;
  allowDestructiveTests: boolean;
}

export const PROFILES: Record<EnvProfileName, EnvProfile> = {
  local: {
    name: 'local',
    baseUrl: 'http://localhost:3000',
    timeoutMs: 15_000,
    retries: 0,
    allowDestructiveTests: true
  },

  staging: {
    name: 'staging',
    baseUrl: 'https://staging.api.myapp.com',
    timeoutMs: 30_000,
    retries: 1,
    allowDestructiveTests: false
  },

  'prod-like': {
    name: 'prod-like',
    baseUrl: 'https://api.myapp.com',
    timeoutMs: 45_000,
    retries: 2,
    allowDestructiveTests: false
  }
};
