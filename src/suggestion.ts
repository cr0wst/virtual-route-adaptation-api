import { FlightPlan } from "./flightPlan";
import { VatsimFlightPlan } from "./global/types";

/**
 * Uses the flight plan and routes to determine if there is a suggested route for the flight plan.
 *
 * @param vatsimFlightPlan - The VATSIM flight plan object
 * @param routes - Array of available routes
 * @returns Filtered list of routes matching the flight plan's departure and arrival
 */
export function resolve({
  vatsimFlightPlan,
  routes,
}: {
  vatsimFlightPlan: VatsimFlightPlan;
  routes: RouteRecord[];
}): Suggestion | null {
  const flightPlan = new FlightPlan(vatsimFlightPlan);

  const filteredRoutes = routes
    .filter((route) => route.departures.includes(flightPlan.departure))
    .filter((route) => route.arrivals.includes(flightPlan.arrival));

  // Check each suggestion.route against the flight plan route. If there's a match, return null. Otherwise, return the first suggestion.
  for (const suggestion of filteredRoutes) {
    if (suggestion.route === flightPlan.route) {
      return null;
    }
  }

  if (filteredRoutes.length > 0) {
    return {
      route: filteredRoutes[0].route,
      reason: "ADAR",
    };
  }
}

interface RouteRecord {
  id: string;
  altitudes: { min: number; max: number };
  criteria: { id: string; facility: string; priority: number }[];
  route: string;
  arrivals: string[];
  departures: string[];
}

export interface RouteDetails {
  string: string;
  departure?: { name: string; transition?: string };
  arrival?: { name: string; transition?: string };
}

export interface Suggestion {
  route: string;
  reason: string;
}
