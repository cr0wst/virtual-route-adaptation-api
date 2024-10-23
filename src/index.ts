import { ApolloServer } from "@apollo/server"; // preserve-line
import { startStandaloneServer } from "@apollo/server/standalone";
import { readFileSync } from "node:fs";
import { loadRouteRecordsFromAdar } from "./adar";
import { Capability, determineAircraftCapability } from "./flightPlan"; // preserve-line

const typeDefs = readFileSync("./schema.graphql", { encoding: "utf-8" });

const routes = loadRouteRecordsFromAdar();

const resolvers = {
  Query: {
    routes: () => routes,
    route(parent, args) {
      return routes.find((r) => r.id === args.id);
    },
    suggestFlightPlanRoutes: (_, { flightPlan }) => {
      const { departure, arrival, altitude, route } = flightPlan;

      // Logic to adapt the flight plan route.
      // For example, filter and return routes matching the departure, arrival, and altitude criteria.
      const capability = determineAircraftCapability(flightPlan);
      return routes
        .filter((routeObj) => {
          const matchesDeparture = routeObj.departures.includes(departure);
          const matchesArrival = routeObj.arrivals.includes(arrival);
          const matchesAltitude = altitude
            ? parseInt(altitude) >= routeObj.altitudes.min &&
              parseInt(altitude) <= routeObj.altitudes.max
            : true;
          // Check if criteria is present and filter based on capability
          const matchesCriteria =
            routeObj.criteria.length === 0 ||
            routeObj.criteria.some((c) => {
              return (
                c.id &&
                ((c.id === "POINT-TO-POINT" &&
                  (capability === Capability.RNAV1 ||
                    capability === Capability.RNAV)) ||
                  (c.id === "RNAV-ARRIVAL" &&
                    capability === Capability.RNAV1) ||
                  (c.id === "RNAV-DEPARTURE" &&
                    capability === Capability.RNAV1))
              );
            });

          return (
            matchesDeparture &&
            matchesArrival &&
            matchesAltitude &&
            matchesCriteria
          );
        })
        .map((r) => {
          return {
            altitude: flightPlan.altitude,
            route: r.route,
            criteria: r.criteria,
            reason: "ADAR Route",
          };
        });
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

async function main() {
  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
  });

  console.log(`🚀  Server ready at: ${url}`);
}

main().catch(console.error);
