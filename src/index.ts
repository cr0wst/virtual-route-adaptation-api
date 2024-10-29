import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { readFileSync } from "node:fs";
import { loadRouteRecordsFromAdar } from "./adar";
import { resolve } from "./suggestion";

const typeDefs = readFileSync("./schema.graphql", { encoding: "utf-8" });

const routes = loadRouteRecordsFromAdar();

const resolvers = {
  Query: {
    routes: () => routes,
    route(parent, args) {
      return routes.find((r) => r.id === args.id);
    },
    suggestion: (_, { flightPlan }) => {
      return resolve({ vatsimFlightPlan: flightPlan, routes });
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
