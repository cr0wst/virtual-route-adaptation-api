import { XMLParser } from "fast-xml-parser";
import * as path from "path";
import * as fs from "fs";

export function loadRouteRecordsFromAdar() {
  // Load ADAR records from a source
  const adarRecords = loadAdarRecords();

  // Convert ADAR records to Route records
  return adarRecords.map(convertAdarRecordToRouteRecord);
}

function loadAdarRecords() {
  const parser = new XMLParser();
  const xml = parser.parse(
    fs.readFileSync(path.join(__dirname, "../resources/ADAR.xml"), "utf8"),
  );

  return xml["ADAR_Records"]["ADARRecord"] || [];
}

export function convertAdarRecordToRouteRecord(adarRecord: any) {
  return {
    id: adarRecord["ADAR_ID"],
    altitudes: {
      min: adarRecord["LowerAltitude"],
      max: adarRecord["UpperAltitude"],
    },
    criteria: buildCriteria(adarRecord),
    route: buildRoute(adarRecord),
    arrivals: Array.isArray(adarRecord["ADARArrivalList"]["AirportID"])
      ? adarRecord["ADARArrivalList"]["AirportID"]
      : [adarRecord["ADARArrivalList"]["AirportID"]],
    departures: Array.isArray(adarRecord["ADARDepartureList"]["AirportID"])
      ? adarRecord["ADARDepartureList"]["AirportID"]
      : [adarRecord["ADARDepartureList"]["AirportID"]],
  };
}

function buildRoute(adarRecord: any) {
  return adarRecord["ADARAutoRouteAlphas"]["RouteString"]
    .split(".")
    .filter((s: string) => s.length > 0)
    .join(" ");
}

function buildCriteria(adarRecord: any): any[] {
  const adarCriteria = adarRecord["ADARIERRCriteria"];
  if (!adarCriteria) {
    return [];
  }

  if (!Array.isArray(adarCriteria)) {
    return [
      {
        id: adarCriteria["IERRCriteriaID"] || null,
        facility: adarCriteria["IERRFacility"] || null,
        priority: adarCriteria["RoutePriority"] || null,
      },
    ];
  }

  return adarCriteria.map((criteriaRecord: any) => {
    return {
      id: criteriaRecord["IERRCriteriaID"],
      facility: criteriaRecord["IERRFacility"],
      priority: criteriaRecord["RoutePriority"],
    };
  });
}
