export const APPLICATION_ENVIRONMENTS = [
  "local",
  "staging",
  "production",
] as const;

export type ApplicationEnvironmentName =
  (typeof APPLICATION_ENVIRONMENTS)[number];

export type ApplicationEnvironment = Readonly<{
  appEnvironment: ApplicationEnvironmentName;
  siteUrl: string;
}>;

const CANONICAL_SITE_URLS: Record<ApplicationEnvironmentName, string> = {
  local: "http://localhost:3000",
  staging: "https://staging.tripways.app",
  production: "https://tripways.app",
};

export function readApplicationEnvironment(): ApplicationEnvironment {
  const isTest = process.env.NODE_ENV === "test";
  const appEnvironment = process.env.APP_ENV?.trim() || (isTest ? "local" : undefined);
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "") ||
    (isTest ? CANONICAL_SITE_URLS.local : undefined);

  if (
    !APPLICATION_ENVIRONMENTS.includes(
      appEnvironment as ApplicationEnvironmentName,
    )
  ) {
    throw new Error("ERR_APPLICATION_ENVIRONMENT_SETUP");
  }

  const validatedEnvironment = appEnvironment as ApplicationEnvironmentName;
  if (siteUrl !== CANONICAL_SITE_URLS[validatedEnvironment]) {
    throw new Error("ERR_APPLICATION_ENVIRONMENT_SETUP");
  }

  return {
    appEnvironment: validatedEnvironment,
    siteUrl,
  };
}
