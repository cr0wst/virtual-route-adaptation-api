export type FlightPlan = {
  flight_rules: string;
  aircraft: string;
  aircraft_faa: string;
  aircraft_short: string;
  departure: string;
  arrival: string;
  altitude: string;
  remarks: string;
  route: string;
};

// The ADR.xml and ADAR.xml files contain the following structure. The property names go against the TypeScript naming conventions.

export type ADRRecord = {
  ADR_ID: string;
  UpperAltitude: string;
  LowerAltitude: string;
  Order: number;
  AutoRouteLimit: string;
  ADRAutoRouteAlphas: {
    RouteString: string;
    ProtectedAreaOverwrite: string;
    DP_ID: string;
  };
  RouteFixList: {
    RouteFix: {
      FixNAme: string;
      UniqueFixID: {
        FixID: string;
        ICAOCode: string;
      };
    };
  }[];
  ADRTransitionFix: {
    FixName: string;
    FixID: string;
    ICAOCode: string;
    TFixType: string;
    TFixIndex: number;
  };
  ADRAirportList: {
    AirportID: string | string[];
  };
  ADRACClassCriteriaList: {
    AircraftClassCriteriaID: string;
    AircraftClassCriteriaFac: string;
    IsExcluded: boolean;
  };
  ADRCrossingLine: {
    CrossingLineID: string;
    UpperAltitude: number;
    LowerAltitude: number;
    CrossingLineApplicability: {
      ApplicabilityType: string;
      PriorityInd: boolean;
    };
    ADRCrossingLineTransFix: {
      FixName: string;
      FixID: string;
      ICAOCode: string;
    };
    TransitionLineDistance: number;
    ADRLineCoordinates: {
      Latitude: string;
      Longitude: string;
      XSpherical: number;
      YSpherical: number;
      ZSpherical: number;
    }[];
  };
  ADRIERRCriteria: {
    IERRCriteriaID: string;
    IERRFacility: string;
    RoutePriority: number;
  };
  UserComment: string;
};
