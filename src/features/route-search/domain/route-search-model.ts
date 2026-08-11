import type { PriceEstimate } from "@/shared/domain/route-values";

export type RouteSearchScope={type:"global"}|{type:"origin_city"|"origin_airport";key:string}|{type:"airport";key:string;direction:"from"|"to"}|{type:"city_pair";from:string;to:string};
export type RouteOption=Readonly<{id:string;from:string;to:string;originCountry:string;destinationCountry:string;international:boolean;stops:number;connections:string[];airlines:string[];flightMinutes:number;layoverMinutes:number;durationMinutes:number;routePath:string|null;price:PriceEstimate}>;
export type Facet=Readonly<{value:string;count:number}>;
export type RouteSearchModel=Readonly<{options:RouteOption[];total:number;pageSize:number;nextCursor:string|null;facets:{stops:Facet[];airlines:Facet[];connections:Facet[];countries:Facet[];regions:Facet[]}}>;
