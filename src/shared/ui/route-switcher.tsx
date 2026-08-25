"use client";

import { useState, type FormEvent } from "react";

import { HUB_AIRPORTS } from "@/features/homepage/domain/homepage-routes-data";
import { resolveRouteNavigation } from "@/features/route-navigation/domain/resolve-route-navigation";

/**
 * Lets users move between canonical route and city pages without creating search-result URLs.
 */
export function RouteSwitcher() {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [error, setError] = useState<string | null>(null);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const target = resolveRouteNavigation(origin, destination);
    if (!target) {
      setError("Choose a supported departure city or airport.");
      return;
    }

    setError(null);
    window.location.assign(target.href);
  }

  return (
    <form
      aria-label="Explore another flight route"
      className="route-switcher"
      onSubmit={submit}
    >
      <label className="route-switcher__field">
        <span>FROM</span>
        <input
          aria-describedby={error ? "route-switcher-error" : undefined}
          autoComplete="off"
          list="route-switcher-origins"
          onChange={(event) => setOrigin(event.target.value)}
          placeholder="City or airport"
          value={origin}
        />
      </label>
      <label className="route-switcher__field">
        <span>TO</span>
        <input
          autoComplete="off"
          list="route-switcher-destinations"
          onChange={(event) => setDestination(event.target.value)}
          placeholder="Where to?"
          value={destination}
        />
      </label>
      <button className="route-switcher__submit" type="submit">
        EXPLORE
      </button>
      <datalist id="route-switcher-origins">
        {HUB_AIRPORTS.map((hub) => <option key={hub.iata} value={hub.cityName}>{hub.iata}</option>)}
      </datalist>
      <datalist id="route-switcher-destinations">
        {HUB_AIRPORTS.map((hub) => <option key={hub.iata} value={hub.cityName}>{hub.iata}</option>)}
      </datalist>
      {error ? <p className="route-switcher__error" id="route-switcher-error" role="status">{error}</p> : null}
    </form>
  );
}
