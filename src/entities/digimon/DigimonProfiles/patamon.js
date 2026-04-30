export const patamon = {
  body: {
    width: 15,
    height: 14,
    offsetX: 0,
    offsetY: 0,
    gravityY: 900,
  },
  movement: {
    mode: "multi-domain",
    domains: ["ground", "air"],
    default: "ground",
  },

  attacks: {
    main: {
      type: "melee",
      anim: "attack-A",
      power: 1.0,
      fireFrames: [5], // active hit window
      hitbox: {
        width: 20,
        height: 11,
        offsetX: 22,
        offsetY: 23,
        duration: 80, // per-frame lifetime
        // duration: 320,
        hitReaction: "flinch",
      },
      cooldown: 100,
    },
    skill1: {
      type: "projectile",
      anim: "attack-B",
      power: 0.5,
      damage: 1,
      hitStop: 50,
      impactVFX: "vfx-explosion",
      projectile: {
        texture: "vfx-windball",
        anim: "vfx-windball",
        scale: 0.3,
        speed: 260,
        offsetX: 19,
        offsetY: 24,
        lifetime: 1200,
        hitReaction: "flinch",
      },
      fireFrame: 6,
      cooldown: 800,
    },

    skill2: {
      type: "projectile",
      anim: "attack-C",
      power: 0.8,
      damage: 1,
      hitStop: 50,
      impactVFX: "vfx-explosion",
      projectile: {
        texture: "vfx-windball",
        anim: "vfx-windball",
        scale: 0.3,
        speed: 260,
        offsetX: 25,
        offsetY: 20,
        lifetime: 1200,
      },
      fireFrame: 4,
      cooldown: 800,
    },
  },
  evolution: {
    prev: null,
    next: "greymon",
  },
};
