import type { ObservedPrice, RoutePageModel } from "../domain/route-page-model";

export function parseRoutePageResponse(value: unknown): RoutePageModel {
  try {
    const root = record(value);
    const route = record(root.route);
    const origin = record(route.origin);
    const destination = record(route.destination);
    const originModel = { name: text(origin.name), slug: text(origin.slug) };
    const destinationModel = { name: text(destination.name), slug: text(destination.slug) };
    const content = optionalRecord(root.content);
    const contentSeo = optionalRecord(content?.seo);
    const legacySeo = optionalRecord(root.seo);
    const h1 = optionalText(contentSeo?.h1) ?? optionalText(legacySeo?.h1) ?? `${originModel.name} to ${destinationModel.name} flights`;
    const intro = optionalText(content?.intro) ?? optionalText(legacySeo?.intro) ?? `Compare recently observed prices from ${originModel.name} to ${destinationModel.name}.`;
    const summary = optionalRecord(root.summary);
    const routeOptions = optionalArray(root.route_options);
    return {
      route: { origin: originModel, destination: destinationModel },
      seo: { h1, subheadline: optionalText(legacySeo?.subheadline) ?? "Compare recent route observations", title: optionalText(legacySeo?.title) ?? h1, description: optionalText(legacySeo?.meta_description) ?? intro, intro },
      summary: { directOptions: optionalNumber(summary?.direct_options) ?? routeOptions.length, indirectOptions: optionalNumber(summary?.indirect_options) ?? 0, fastestDirectMinutes: nullableNumber(summary?.fastest_direct_minutes), fastestIndirectMinutes: nullableNumber(summary?.fastest_indirect_minutes) },
      facts: optionalArray(root.travel_facts).map(parseFact),
      sections: optionalArray(root.editorial_sections).map(parseSection),
      faqs: optionalArray(root.faqs).map(parseFaq),
      affiliateOffers: optionalArray(optionalRecord(root.affiliate)?.offers).map(parseOffer),
      affiliateDisclosure: optionalText(optionalRecord(root.affiliate)?.disclosure) ?? optionalText(root.disclosure) ?? "Cached prices are not live offers; final price and availability are confirmed by the booking partner.",
      observedPrices: optionalArray(root.observations).map(parseObservation),
    };
  } catch { throw new Error("ERR_ROUTE_PAGE_CONTRACT"); }
}

function parseObservation(value: unknown): ObservedPrice { const row=record(value); return { reference:observationReference(row.observation_ref), amount:number(row.observed_amount), currencyCode:text(row.currency_code), departureDate:nullableText(row.departure_date), direct:nullableBoolean(row.direct), observedAt:text(row.observed_at), validUntil:text(row.valid_until) }; }
function parseFact(value: unknown){const row=record(value);return{type:text(row.fact_type),title:text(row.title),body:text(row.body),...(typeof row.primary_source_url==="string"?{sourceUrl:row.primary_source_url}:{})};}
function parseSection(value: unknown){const row=record(value);return{type:text(row.section_type),heading:text(row.heading),body:text(row.body)};}
function parseFaq(value: unknown){const row=record(value);return{question:text(row.question),answer:text(row.answer)};}
function parseOffer(value: unknown){const row=record(value);return{title:text(row.title),href:text(row.href)};}
function record(value:unknown):Record<string,unknown>{if(typeof value!=="object"||value===null||Array.isArray(value))throw 0;return value as Record<string,unknown>}
function optionalRecord(value:unknown):Record<string,unknown>|null{return typeof value==="object"&&value!==null&&!Array.isArray(value)?value as Record<string,unknown>:null}
function optionalArray(value:unknown):unknown[]{return Array.isArray(value)?value:[]}
function text(value:unknown):string{if(typeof value!=="string"||!value)throw 0;return value}
function optionalText(value:unknown):string|null{return typeof value==="string"&&value?value:null}
function nullableText(value:unknown):string|null{return value===null||value===undefined?null:text(value)}
function number(value:unknown):number{if(typeof value!=="number"||!Number.isFinite(value))throw 0;return value}
function optionalNumber(value:unknown):number|null{return typeof value==="number"&&Number.isFinite(value)?value:null}
function nullableNumber(value:unknown):number|null{return value===null||value===undefined?null:number(value)}
function nullableBoolean(value:unknown):boolean|null{return value===null||value===undefined?null:typeof value==="boolean"?value:(()=>{throw 0})()}
function observationReference(value:unknown):string{const reference=text(value);if(!/^obs_[0-9a-f]{32}$/.test(reference))throw 0;return reference}
