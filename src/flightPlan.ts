import { VatsimFlightPlan } from "./global/types";

const FAA_RNAV_EQUIPMENT = ["G", "I", "L", "Z"];

export interface Route {
  string: string;
  fixes: string[];
  departure?: { name: string; transition?: string };
  arrival?: { name: string; transition?: string };
}

export class FlightPlan {
  aircraft: { type: string; equipment: string; isRnavCapable: boolean };
  altitude: string;
  arrival: string;
  departure: string;
  remarks: string;
  route: string;

  constructor(flightPlan: VatsimFlightPlan) {
    this.aircraft = this.decodeAircraft(flightPlan.aircraft);
    this.altitude = flightPlan.altitude;
    this.arrival = flightPlan.arrival;
    this.departure = flightPlan.departure;
    this.route = flightPlan.route.replace(/\s?DCT\s?/, " ").trim();
    this.remarks = flightPlan.remarks;

    console.log(this.route);
  }

  /**
   * Takes the aircraft string, e.g. C172/G, and decodes it into an object with the type and equipment.
   *
   * @param aircraft
   * @private
   */
  private decodeAircraft(aircraft: string) {
    const [type, faaEquipment] = aircraft.split("/");

    return {
      type,
      equipment: faaEquipment,
      isRnavCapable: FAA_RNAV_EQUIPMENT.some((e) => faaEquipment.includes(e)),
    };
  }
}
