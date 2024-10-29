export type VatsimFlightPlan = {
  aircraft: string;
  departure: string;
  arrival: string;
  altitude: string;
  route: string;
  remarks: string;
};

export type RouteRecord = {
  id: string;
  altitudes: { min: number; max: number };
  criteria: { id: string; facility: string; priority: number }[];
  route: {
    string?: string;
    fixes?: { id: string }[];
    arrival?: string;
    departure?: string;
  };
};
