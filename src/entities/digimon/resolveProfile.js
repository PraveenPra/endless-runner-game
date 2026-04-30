import { DIGIMON_DEFAULTS } from "./DigimonDefaults.js";
// import { DIGIMON_PROFILES } from "./DigimonProfiles.js";
import * as DIGIMON_PROFILES from "./DigimonProfiles/index.js";

// export const DIGIMON_PROFILES = profiles;

export function resolveProfile(key) {
  const specific = DIGIMON_PROFILES[key] || {};

  let body = { ...DIGIMON_DEFAULTS.body, ...specific.body };
  const attacks = JSON.parse(JSON.stringify(specific.attacks || {}));

  try {
    const saved = localStorage.getItem(`digimon_${key}_body`);
    if (saved) {
      body = { ...body, ...JSON.parse(saved) };
    }
  } catch (e) {
    // Ignore localStorage errors
  }

  try {
    const saved = localStorage.getItem(`digimon_${key}_projectiles`);
    const savedProjectiles = saved ? JSON.parse(saved) : null;

    if (savedProjectiles) {
      Object.keys(savedProjectiles).forEach((attackKey) => {
        const attack = attacks[attackKey];
        const offsets = savedProjectiles[attackKey];

        if (!attack?.projectile || !offsets) return;

        attack.fireFrame = offsets.fireFrame ?? attack.fireFrame;
        attack.projectile = {
          ...attack.projectile,
          offsetX: offsets.offsetX ?? attack.projectile.offsetX,
          offsetY: offsets.offsetY ?? attack.projectile.offsetY,
        };
      });
    }
  } catch (e) {
    // Ignore localStorage errors
  }

  return {
    key, // important for evolution + animation naming
    body,
    move: { ...DIGIMON_DEFAULTS.move, ...specific.move },
    combat: { ...DIGIMON_DEFAULTS.combat, ...specific.combat },
    attacks,
    movement: { ...DIGIMON_DEFAULTS.movement, ...specific.movement },
    evolution: specific.evolution || {},
  };
}
