export const ophanimon = {
  body: {
    width: 18,
    height: 40,
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
      fireFrames: [4, 6], // active hit window
      hitbox: {
        width: 10,
        height: 26,
        offsetX: 36,
        offsetY: 26,
        duration: 80, // per-frame lifetime
        // duration: 320,
      },
      cooldown: 1500,
    },
    skill1: {
      type: "projectile",
      anim: "attack-B",
      power: 1.0,
      damage: 1,
      antiAir: true, // 👈 aerial control
      projectile: {
        texture: "vfx-rainbowball",
        anim: "vfx-rainbowball",
        speed: 260,
        offsetX: 47,
        offsetY: 35,
        lifetime: 1200,
      },
      fireFrame: 8,
      cooldown: 800,
    },

    skill2: {
      type: "projectile",
      anim: "attack-C",
      power: 1.0,
      damage: 1,
      punish: true,
      desperation: true, // 👈 “phase change” feel
      hitStop: 110, // 👈 heavy hit
      impactVFX: "impact-hit",
      projectile: {
        texture: "vfx-rainbowball",
        anim: "vfx-rainbowball",
        speed: 260,
        offsetX: 33,
        offsetY: 50,
        lifetime: 1200,
      },
      fireFrame: 5,
      cooldown: 800,
    },
  },
  evolution: {
    prev: null,
    next: "patamon",
  },
};
