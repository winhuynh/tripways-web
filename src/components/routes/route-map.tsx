import type { Airport } from "@/lib/airports";

type RouteMapProps = {
  origin: Airport;
  destinations: Airport[];
};

export function RouteMap({ origin, destinations }: RouteMapProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-[#b9deea] p-4 sm:p-7">
      <svg aria-label={`Route map from ${origin.city}`} className="h-[270px] w-full" role="img" viewBox="0 0 100 70">
        <path d="M8 17 18 11l10 4 4 9-5 7-8-2-6 6-8-4zm29 4 12-9 10 3 2 8 13 4 10 12-3 8-11 1-4 15-12-2-3-14-10-6-8-10zm-22 29 10-4 8 5-3 13-8 3-7-8zm70-1 8-3 5 6-4 8-9-2z" fill="#eaf5f7" opacity=".96" stroke="#8ec6d4" strokeWidth=".55" />
        {destinations.map((destination, index) => (
          <path
            d={`M ${origin.mapX} ${origin.mapY} Q ${(origin.mapX + destination.mapX) / 2} ${Math.min(origin.mapY, destination.mapY) - 12 - index * 1.5} ${destination.mapX} ${destination.mapY}`}
            fill="none"
            key={destination.iata}
            opacity=".7"
            stroke="#147df5"
            strokeDasharray="2 2"
            strokeWidth=".7"
          />
        ))}
        {[origin, ...destinations].map((airport) => (
          <g key={airport.iata}>
            <circle cx={airport.mapX} cy={airport.mapY} fill="#fff" r="2.2" stroke="#147df5" strokeWidth=".9" />
            <text fill="#101828" fontSize="2.4" fontWeight="800" textAnchor="middle" x={airport.mapX} y={airport.mapY - 3.2}>
              {airport.iata}
            </text>
          </g>
        ))}
      </svg>
      <div className="absolute bottom-4 left-4 rounded-full bg-white/90 px-4 py-2 text-xs font-bold text-[#075fc4] shadow-sm">
        Stored route graph · not live tracking
      </div>
    </div>
  );
}
