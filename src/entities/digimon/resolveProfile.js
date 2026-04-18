import { DIGIMON_DEFAULTS } from "./DigimonDefaults.js";
// import { DIGIMON_PROFILES } from "./DigimonProfiles.js";
import * as DIGIMON_PROFILES from "./DigimonProfiles/index.js";

// export const DIGIMON_PROFILES = profiles;

export function resolveProfile(key) {
  const specific = DIGIMON_PROFILES[key] || {};

  let body = { ...DIGIMON_DEFAULTS.body, ...specific.body };

  try {
    const saved = localStorage.getItem(`digimon_${key}_body`);
    if (saved) {
      body = { ...body, ...JSON.parse(saved) };
    }
  } catch (e) {
    // Ignore localStorage errors
  }

  return {
    key, // important for evolution + animation naming
    body,
    move: { ...DIGIMON_DEFAULTS.move, ...specific.move },
    combat: { ...DIGIMON_DEFAULTS.combat, ...specific.combat },
    attacks: specific.attacks || {},
    movement: { ...DIGIMON_DEFAULTS.movement, ...specific.movement },
    evolution: specific.evolution || {},
  };
}
