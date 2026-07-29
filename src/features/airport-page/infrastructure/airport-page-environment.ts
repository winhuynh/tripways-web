import "server-only";

export type AirportPageEnvironment = Readonly<{
  supabaseUrl: string;
  supabaseServiceRoleKey: string;
}>;

export function readAirportPageEnvironment(): AirportPageEnvironment {
  const supabaseUrl = process.env.SUPABASE_URL?.trim().replace(/\/$/, "");
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!supabaseUrl || !supabaseServiceRoleKey) throw new Error("ERR_AIRPORT_PAGE_SETUP");
  return {
    supabaseUrl,
    supabaseServiceRoleKey,
  };
}
