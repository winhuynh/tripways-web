import type {
  CityPageAirport,
  CityPageDestination,
  CityPageModel,
} from "../domain/city-page-model";

export function parseCityPageResponse(
  value: unknown,
  meta?: { canonicalPath?: string; freshnessAt?: string },
): CityPageModel {
  try {
    const r = rec(value);
    const city = rec(r.city);
    const country = rec(r.country);
    const page = rec(r.page);
    const facts = rec(r.quick_facts);

    const region =
      typeof country.region === "string" && country.region
        ? country.region
        : typeof r.region === "string" && r.region
          ? r.region
          : "Asia";

    const airports: CityPageAirport[] = arr(r.airports).map((v) => {
      const x = rec(v);
      const isPrimary = bool(x.is_primary);
      const role =
        optstr(x.hub_label) ??
        optstr(x.role) ??
        (isPrimary ? "Primary Hub" : "LCC Hub");

      return {
        iata: str(x.iata),
        name: str(x.name),
        primary: isPrimary,
        destinations: num(x.direct_destinations),
        airlines: num(x.airlines),
        role,
        description: optstr(x.description),
        latitude: optnum(x.latitude),
        longitude: optnum(x.longitude),
      };
    });

    const destinations: CityPageDestination[] = arr(
      r.featured_destinations,
    ).map((v) => {
      const x = rec(v);
      const c = rec(x.city);
      const co = rec(x.country);

      // Parse price / fare estimate if supplied by backend RPC
      const fareObj = optrec(x.fare_estimate) ?? optrec(x.estimated_fare) ?? optrec(x.price);
      const fareMin = optnum(fareObj?.min) ?? optnum(fareObj?.price_min) ?? optnum(x.fare_min);
      const fareMax = optnum(fareObj?.max) ?? optnum(fareObj?.price_max) ?? optnum(x.fare_max);
      const fareCurrency =
        optstr(fareObj?.currency) ??
        optstr(fareObj?.currency_code) ??
        optstr(x.fare_currency) ??
        "£";

      const destRegion =
        optstr(x.region) ??
        optstr(co.region) ??
        optstr(co.sub_region);

      const duration = optnum(x.duration_minutes) ?? optnum(x.total_duration_minutes) ?? 120;
      const minDuration = optnum(x.shortest_duration_minutes) ?? duration;
      const maxDuration = optnum(x.longest_duration_minutes) ?? duration;
      const frequency = nulnum(
        x.frequency_per_week ??
          (Array.isArray(x.days_of_week) ? x.days_of_week.length : null),
      );

      return {
        city: str(c.name),
        citySlug: str(c.slug),
        country: str(co.name),
        originAirports: strs(x.origin_airports),
        airports: strs(x.destination_airports),
        airlines: strs(x.airlines),
        frequency,
        minDuration,
        maxDuration,
        path: str(x.route_path),
        region: destRegion,
        fareMin,
        fareMax,
        fareCurrency,
        latitude: optnum(x.latitude) ?? optnum(c.latitude),
        longitude: optnum(x.longitude) ?? optnum(c.longitude),
        isTopRoute: optbool(x.is_top_route),
        stops: optnum(x.stops),
        layoverAirports: Array.isArray(x.layover_airports) ? strs(x.layover_airports) : undefined,
      };
    });


    return {
      city: {
        name: str(city.name),
        slug: str(city.slug),
        latitude: optnum(city.latitude),
        longitude: optnum(city.longitude),
      },
      country: {
        name: str(country.name),
        slug: str(country.slug),
        region,
      },
      seo: {
        h1: str(page.h1),
        subheadline: str(page.subheadline),
        title: str(page.seo_title),
        description: str(page.meta_description),
        intro: str(page.intro),
        isIndexable: optbool(r.is_indexable) ?? optbool(page.is_indexable) ?? true,
        noindexReason: optstr(r.noindex_reason) ?? optstr(page.noindex_reason),
      },
      airports,
      quickFacts: {
        airports: num(facts.airports),
        destinations: num(facts.direct_destinations),
        countries: num(facts.direct_countries),
        airlines: num(facts.airlines),
      },
      destinations,
      faqs: arr(r.faqs).map((v) => {
        const x = rec(v);
        return {
          question: str(x.question),
          answer: str(x.answer),
        };
      }),
      links: arr(r.internal_link_groups).map((v) => {
        const g = rec(v);
        return {
          title: str(g.cluster),
          links: arr(g.links).map((l) => {
            const x = rec(l);
            return {
              label: str(x.anchor_text),
              href: str(x.path),
              ...(typeof x.secondary_text === "string"
                ? { secondaryText: x.secondary_text }
                : {}),
            };
          }),
        };
      }),
      freshnessAt: meta?.freshnessAt ?? null,
      canonicalPath: meta?.canonicalPath ?? null,
    };
  } catch {
    throw new Error("ERR_CITY_PAGE_CONTRACT");
  }
}

function rec(v: unknown): Record<string, unknown> {
  if (typeof v !== "object" || v === null || Array.isArray(v)) throw 0;
  return v as Record<string, unknown>;
}

function optrec(v: unknown): Record<string, unknown> | undefined {
  if (typeof v !== "object" || v === null || Array.isArray(v)) return undefined;
  return v as Record<string, unknown>;
}

function arr(v: unknown): unknown[] {
  if (!Array.isArray(v)) throw 0;
  return v;
}

function str(v: unknown): string {
  if (typeof v !== "string" || !v) throw 0;
  return v;
}

function optstr(v: unknown): string | undefined {
  return typeof v === "string" && v.length > 0 ? v : undefined;
}

function num(v: unknown): number {
  if (typeof v !== "number" || !Number.isFinite(v)) throw 0;
  return v;
}

function optnum(v: unknown): number | undefined {
  return typeof v === "number" && Number.isFinite(v) ? v : undefined;
}

function nulnum(v: unknown): number | null {
  return v === null || v === undefined ? null : num(v);
}

function bool(v: unknown): boolean {
  if (typeof v !== "boolean") throw 0;
  return v;
}

function optbool(v: unknown): boolean | undefined {
  return typeof v === "boolean" ? v : undefined;
}

function strs(v: unknown): string[] {
  return arr(v).map(str);
}
