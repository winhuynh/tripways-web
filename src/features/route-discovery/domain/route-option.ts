export type RouteOption = Readonly<{
  id: string;
  from: string;
  to: string;
  stops: number;
  connection_airports: string[];
  operating_airlines: string[];
  total_flight_minutes: number;
  layover_minutes: number | null;
  total_duration_minutes: number;
  departure_local_time: string;
  arrival_local_time: string;
  arrival_day_offset: number;
  valid_from: string;
  valid_to: string;
  days_of_week: number[];
  confidence_score: number;
  data_version: string;
}>;

export type RouteFacet<T extends string | number> = Readonly<{
  value: T;
  count: number;
}>;

export type RouteSearchResult = Readonly<{
  routes: RouteOption[];
  pagination: { total: number; limit: number; offset: number };
  facets: {
    stops: RouteFacet<number>[];
    airlines: RouteFacet<string>[];
  };
}>;
