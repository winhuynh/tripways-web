"use client";

import { useMemo, useState, type MouseEvent } from "react";
import { formatDuration } from "@/shared/domain/route-values";
import { getAirlineDisplay, getAirportDisplay } from "@/features/route-search/domain/route-filter-labels";
import { AirlineLogo } from "@/shared/ui";
import type { RouteFlightSchedule } from "../domain/route-page-model";

const DAYS_OF_WEEK = [
  { day: 1, label: "Mon", letter: "M" },
  { day: 2, label: "Tue", letter: "T" },
  { day: 3, label: "Wed", letter: "W" },
  { day: 4, label: "Thu", letter: "T" },
  { day: 5, label: "Fri", letter: "F" },
  { day: 6, label: "Sat", letter: "S" },
  { day: 7, label: "Sun", letter: "S" },
] as const;

type RouteTimetableSectionProps = {
  originName: string;
  originIata: string;
  destinationName: string;
  destinationIata: string;
  schedules?: readonly RouteFlightSchedule[];
  weeklyDirectFlights?: number | null;
  directOptions?: number;
};

function TimetableAffiliateCta({
  originIata,
  destIata,
  airlineIata,
}: {
  originIata: string;
  destIata: string;
  airlineIata: string;
}) {
  const [loading, setLoading] = useState(false);

  async function handleClick(e: MouseEvent<HTMLAnchorElement>) {
    if (e.metaKey || e.ctrlKey || e.shiftKey) return;
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/flight-affiliate-handoff", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          originIata: originIata.toUpperCase(),
          destIata: destIata.toUpperCase(),
          subId: "route_timetable",
        }),
      });
      const data = await res.json();
      if (data?.data?.url && typeof data.data.url === "string") {
        window.open(data.data.url, "_blank", "noopener,noreferrer");
        setLoading(false);
        return;
      }
    } catch {
      // Fallback below
    }

    const fallbackUrl = `https://www.aviasales.com/search/${originIata.toUpperCase()}0101${destIata.toUpperCase()}1?marker=tripways.route_timetable`;
    window.open(fallbackUrl, "_blank", "noopener,noreferrer");
    setLoading(false);
  }

  return (
    <a
      href={`https://www.aviasales.com/search/${originIata.toUpperCase()}0101${destIata.toUpperCase()}1`}
      onClick={handleClick}
      target="_blank"
      rel="noopener noreferrer"
      className="route-timetable-cta"
      aria-label={`Check fares for ${airlineIata} from ${originIata} to ${destIata}`}
    >
      {loading ? "Checking..." : "Check fares ↗"}
    </a>
  );
}

export function RouteTimetableSection({
  originName,
  originIata,
  destinationName,
  destinationIata,
  schedules = [],
  weeklyDirectFlights,
  directOptions = 0,
}: RouteTimetableSectionProps) {
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  // Filter schedules by selected day if one is chosen
  const visibleSchedules = useMemo(() => {
    if (!selectedDay) return schedules;
    return schedules.filter((s) => s.daysOfWeek.includes(selectedDay));
  }, [schedules, selectedDay]);

  const hasSchedules = visibleSchedules.length > 0;
  const totalWeekly = weeklyDirectFlights ?? (schedules.length > 0 ? schedules.reduce((acc, s) => acc + s.daysOfWeek.length, 0) : null);

  return (
    <section
      id="timetable"
      className="route-timetable-section pseo-section"
      aria-labelledby="route-timetable-heading"
    >
      <div className="route-timetable-header">
        <div className="route-timetable-header__text">
          <span className="route-timetable-eyebrow">FLIGHT TIMETABLE & SCHEDULE</span>
          <h2 id="route-timetable-heading" className="route-timetable-title">
            Flight schedule: {originName} to {destinationName}
          </h2>
          <p className="route-timetable-subtitle">
            {totalWeekly && totalWeekly > 0
              ? `${totalWeekly} direct flights per week operated by scheduled carriers between ${originName} and ${destinationName}.`
              : `Compare scheduled flight numbers, operating days, and airline timetables between ${originName} and ${destinationName}.`}
          </p>
        </div>

        {/* Day-of-week Filter Pills */}
        {schedules.length > 0 && (
          <div className="route-timetable-filter" role="toolbar" aria-label="Filter schedule by day of week">
            <span className="route-timetable-filter__label">Filter day:</span>
            <div className="route-timetable-filter__chips">
              <button
                type="button"
                className={`route-timetable-chip ${selectedDay === null ? "route-timetable-chip--active" : ""}`}
                onClick={() => setSelectedDay(null)}
                aria-pressed={selectedDay === null}
              >
                All days
              </button>
              {DAYS_OF_WEEK.map(({ day, label }) => {
                const countOnDay = schedules.filter((s) => s.daysOfWeek.includes(day)).length;
                return (
                  <button
                    key={day}
                    type="button"
                    disabled={countOnDay === 0}
                    className={`route-timetable-chip ${selectedDay === day ? "route-timetable-chip--active" : ""}`}
                    onClick={() => setSelectedDay(selectedDay === day ? null : day)}
                    aria-pressed={selectedDay === day}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Main Timetable Content */}
      {hasSchedules ? (
        <div className="route-timetable-grid" role="list">
          {visibleSchedules.map((schedule, idx) => {
            const airlineDisplay = getAirlineDisplay(schedule.airlineIata);
            const isDaily = schedule.daysOfWeek.length >= 7;
            const flightNumberStr = schedule.flightNumbers.length > 0
              ? schedule.flightNumbers.join(", ")
              : "Scheduled Direct";

            return (
              <article
                key={`${schedule.fromAirport}-${schedule.toAirport}-${schedule.airlineIata}-${idx}`}
                className="route-timetable-card"
                role="listitem"
              >
                {/* 1. Airline Header */}
                <div className="route-timetable-card__airline">
                  <div className="route-timetable-card__logo-wrap">
                    <AirlineLogo
                      iata={schedule.airlineIata}
                      name={schedule.airlineName ?? airlineDisplay}
                      size={32}
                    />
                  </div>
                  <div className="route-timetable-card__airline-info">
                    <strong className="route-timetable-card__airline-name">
                      {schedule.airlineName ?? airlineDisplay}
                    </strong>
                    <span className="route-timetable-card__flight-badge" title="Flight number">
                      ✈ {flightNumberStr}
                    </span>
                  </div>
                </div>

                {/* 2. Route & Duration */}
                <div className="route-timetable-card__route">
                  <div className="route-timetable-card__endpoints">
                    <div className="route-timetable-card__airport">
                      <strong>{schedule.fromAirport}</strong>
                      <small>{getAirportDisplay(schedule.fromAirport)}</small>
                    </div>
                    <div className="route-timetable-card__vector" aria-hidden="true">
                      <span className="route-timetable-card__line" />
                      <span className="route-timetable-card__stop-tag">
                        {schedule.stops === 0 ? "Nonstop" : `${schedule.stops} stop`}
                      </span>
                    </div>
                    <div className="route-timetable-card__airport">
                      <strong>{schedule.toAirport}</strong>
                      <small>{getAirportDisplay(schedule.toAirport)}</small>
                    </div>
                  </div>
                  {schedule.durationMinutes > 0 && (
                    <span className="route-timetable-card__duration">
                      ⏱ {formatDuration(schedule.durationMinutes)} typical
                    </span>
                  )}
                </div>

                {/* 3. Days of Week Operating Calendar */}
                <div className="route-timetable-card__schedule">
                  <div className="route-timetable-card__days-header">
                    <span className="route-timetable-card__days-summary">
                      {isDaily
                        ? "🟢 Daily flight operation"
                        : `Operates ${schedule.daysOfWeek.length} days / week`}
                    </span>
                  </div>
                  <div className="route-timetable-card__day-pills" aria-label="Operating days of the week">
                    {DAYS_OF_WEEK.map(({ day, letter, label }) => {
                      const isActive = schedule.daysOfWeek.includes(day);
                      return (
                        <span
                          key={day}
                          className={`route-day-pill ${isActive ? "route-day-pill--active" : "route-day-pill--inactive"}`}
                          title={`${label}: ${isActive ? "Operates" : "No scheduled flight"}`}
                          aria-label={`${label} ${isActive ? "operates" : "does not operate"}`}
                        >
                          {letter}
                        </span>
                      );
                    })}
                  </div>
                </div>

                {/* 4. Action & Fares */}
                <div className="route-timetable-card__action">
                  <TimetableAffiliateCta
                    originIata={schedule.fromAirport || originIata}
                    destIata={schedule.toAirport || destinationIata}
                    airlineIata={schedule.airlineIata}
                  />
                </div>
              </article>
            );
          })}
        </div>
      ) : schedules.length > 0 ? (
        <div className="route-timetable-empty">
          <p>No flights scheduled on the selected day of the week.</p>
          <button
            type="button"
            className="route-timetable-chip route-timetable-chip--active"
            onClick={() => setSelectedDay(null)}
          >
            Show all operating days
          </button>
        </div>
      ) : (
        <div className="route-timetable-fallback">
          <div className="route-timetable-fallback__content">
            <span className="route-timetable-fallback__icon">📅</span>
            <div className="route-timetable-fallback__text">
              <strong>Seasonal & Regular Schedule Information</strong>
              <p>
                {directOptions > 0
                  ? `There are ${directOptions} direct flight options operating between ${originName} and ${destinationName}. Live flight timetables and specific departure dates are confirmed in real-time.`
                  : `Connecting and seasonal flights operate regularly between ${originName} and ${destinationName}. Check real-time departure boards for today's active flights.`}
              </p>
            </div>
          </div>
          <TimetableAffiliateCta
            originIata={originIata}
            destIata={destinationIata}
            airlineIata="DIRECT"
          />
        </div>
      )}

      {/* Timetable Disclaimers & Notes */}
      <footer className="route-timetable-disclaimer">
        <small>
          Flight numbers, timetables, and operating days reflect published seasonal schedules and are subject to carrier adjustments, weather delays, and seasonal rotation.
        </small>
      </footer>
    </section>
  );
}
