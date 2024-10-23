interface FlightPlan {
  aircraft: string; // e.g., "A320/M-SDE3FGHIRWY/LB1"
  departure: string; // e.g., "KAUS"
  arrival: string; // e.g., "KMSY"
  altitude: string; // e.g., "37000"
  remarks: string; // e.g., "PBN/A1B1C1D1O1S1 DOF/241020 REG/GFENX OPR/NKS PER/C RMK/TCAS/V/"
}

export enum Capability {
  RNAV1 = "RNAV1",
  RNAV = "RNAV",
  OTHER = "OTHER",
}

export function determineAircraftCapability(
  flightPlan: FlightPlan,
): Capability {
  const { aircraft, remarks } = flightPlan;
  const { pbnCapabilities } = remarksDecoder(remarks);

  if (pbnCapabilities.includes(PbnCapability.RNAV_1)) {
    return Capability.RNAV1;
  }

  if (pbnCapabilities.length > 0) {
    return Capability.RNAV;
  }

  return Capability.OTHER;
}

function remarksDecoder(remarks: string): {
  pbnCapabilities: PbnCapability[];
} {
  const pbnMatch = remarks.match(/PBN\/([A-Z0-9]+)/);

  // Check if pbnMatch is null or undefined
  if (!pbnMatch) {
    return { pbnCapabilities: [] };
  }

  // Decode the first matched PBN capabilities
  return { pbnCapabilities: decodePbn(pbnMatch[1]) };
}

function decodePbn(pbn: string): PbnCapability[] {
  // Split into two byte chunks
  const chunks = pbn.match(/.{1,2}/g) || [];

  const pbnCapabilities = [];
  chunks.forEach((chunk) => {
    switch (chunk) {
      case "A1":
        pbnCapabilities.push(PbnCapability.RNAV_10);
        break;
      case "B1":
      case "B2":
      case "B3":
      case "B4":
      case "B5":
      case "B6":
        pbnCapabilities.push(PbnCapability.RNAV_5);
        break;
      case "C1":
      case "C2":
      case "C3":
      case "C4":
        pbnCapabilities.push(PbnCapability.RNAV_2);
        break;
      case "D1":
      case "D2":
      case "D3":
      case "D4":
        pbnCapabilities.push(PbnCapability.RNAV_1);
        break;
      case "L1":
        pbnCapabilities.push(PbnCapability.RNP_4);
        break;
      case "O1":
      case "O2":
      case "O3":
      case "O4":
        pbnCapabilities.push(PbnCapability.BASIC_RNP_1);
        break;
      case "S1":
      case "S2":
        pbnCapabilities.push(PbnCapability.RNP_APCH);
        break;
      case "T1":
      case "T2":
        pbnCapabilities.push(PbnCapability.RNP_AR_APCH);
        break;
    }
  });

  return pbnCapabilities;
}

enum PbnCapability {
  RNAV_10 = "RNAV_10",
  RNAV_5 = "RNAV_5",
  RNAV_2 = "RNAV_2",
  RNAV_1 = "RNAV_1",
  RNP_4 = "RNP_4",
  BASIC_RNP_1 = "BASIC_RNP_1",
  RNP_APCH = "RNP_APCH",
  RNP_AR_APCH = "RNP_AR_APCH",
}
