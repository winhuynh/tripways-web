import type { AirportPageModel, JourneyStep } from "../domain/airport-page-model";

export function parseAirportPageResponse(value: unknown): AirportPageModel {
  try {
    const root = record(value);
    const airport = record(root.airport);
    const city = record(airport.city);
    const country = record(airport.country);
    const seo = record(root.seo);
    const orientation = record(root.orientation);
    const quick = record(root.quick_answers);
    const defaultTransport = quick.default_transport === null ? null : record(quick.default_transport);
    return {
      airport: { iata: text(airport.iata), name: text(airport.name), city: { name: text(city.name), slug: text(city.slug) }, country: { name: text(country.name), slug: text(country.slug) } },
      seo: { h1: text(seo.h1), subheadline: text(seo.subheadline), title: text(seo.title), description: text(seo.meta_description) },
      orientation: { intro: text(orientation.intro), summary: text(orientation.summary), cityDistanceKm: nullableNumber(orientation.city_distance_km), terminalCount: numberValue(orientation.terminal_count) },
      quickAnswers: {
        defaultTransport: defaultTransport ? text(defaultTransport.name) : null,
        transportMinutes: defaultTransport ? { min: numberValue(record(defaultTransport.typical_minutes).min), max: numberValue(record(defaultTransport.typical_minutes).max) } : null,
        cityDistanceKm: nullableNumber(quick.city_distance_km), terminalCount: numberValue(quick.terminal_count),
      },
      arrival: parseJourney(root.arrival), departure: parseJourney(root.departure),
      transport: array(root.transport).map((item) => { const entry=record(item); const duration=record(entry.duration); const price=record(entry.estimated_price); return { type:text(entry.type), name:text(entry.name), summary:text(entry.summary), duration:{minMinutes:nullableNumber(duration.min_minutes),maxMinutes:nullableNumber(duration.max_minutes)}, price:{min:nullableNumber(price.min),max:nullableNumber(price.max),currency:nullableText(price.currency)} }; }),
      terminals: array(root.terminals).map((item)=>{const entry=record(item);return{code:text(entry.code),name:text(entry.name)}}),
      facilities: array(root.facilities).map((item)=>{const entry=record(item);return{category:text(entry.category),name:text(entry.name),summary:text(entry.summary)}}),
      lounges: array(root.lounges).map((item)=>{const entry=record(item);return{name:text(entry.name),location:nullableText(entry.location_summary)??"",access:nullableText(entry.access_summary)??""}}),
      notices: array(root.notices).map((item)=>{const entry=record(item);return{title:nullableText(entry.title)??"Airport notice",body:text(entry.body)}}),
      faqs: array(root.faqs).map((item)=>{const entry=record(item);return{question:text(entry.question),answer:text(entry.answer)}}),
      links: array(root.internal_link_groups).map((item)=>{const group=record(item);return{title:text(group.cluster),links:array(group.links).map((link)=>{const entry=record(link);return{label:text(entry.anchor_text),href:text(entry.path),...(nullableText(entry.secondary_text)?{secondaryText:text(entry.secondary_text)}:{})}})}}),
      provenance: { reviewedAt:nullableText(record(root.provenance).last_editorial_review),freshnessAt:nullableText(record(root.provenance).source_freshness_at),dataVersion:nullableText(record(root.provenance).data_version) },
    };
  } catch {
    throw new Error("ERR_AIRPORT_PAGE_CONTRACT");
  }
}

function parseJourney(value: unknown): { summary: string; steps: JourneyStep[] } { const item=record(value); return {summary:text(item.summary),steps:array(item.steps).map((step)=>{const entry=record(step);return{audience:text(entry.audience),title:text(entry.title),body:text(entry.body)}})}; }
function record(value: unknown): Record<string, unknown> { if(typeof value!=="object"||value===null||Array.isArray(value)) throw new Error(); return value as Record<string,unknown>; }
function array(value: unknown): unknown[] { if(!Array.isArray(value)) throw new Error(); return value; }
function text(value: unknown): string { if(typeof value!=="string"||value.trim()==="") throw new Error(); return value; }
function nullableText(value: unknown): string|null { return value===null||value===undefined?null:text(value); }
function numberValue(value: unknown): number { if(typeof value!=="number"||!Number.isFinite(value)) throw new Error(); return value; }
function nullableNumber(value: unknown): number|null { return value===null||value===undefined?null:numberValue(value); }
