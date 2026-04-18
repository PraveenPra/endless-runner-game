export const seraphimon = {
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
    default: "air",
  },

  attacks: {
    main: {
      type: "projectile",
      anim: "attack-A",
      power: 1.0,
      hitStop: 110, // 👈 heavy hit
      impactVFX: "impact-hit",
      projectile: {
        texture: "big-fireball",
        speed: 260,
        offsetX: 28,
        offsetY: 0,
        lifetime: 1200,
      },
      fireFrame: 7,
      cooldown: 800,
    },
    skill1: {
      type: "projectile",
      anim: "attack-B",
      power: 1.0,
      projectile: {
        texture: "big-fireball",
        speed: 260,
        offsetX: 18,
        offsetY: -10,
        lifetime: 1200,
      },
      fireFrame: 7,
      cooldown: 800,
    },

    skill2: {
      type: "melee",
      anim: "attack-C",
      power: 1.0,
      fireFrames: [3, 4, 5], // active hit window
      hitbox: {
        width: 20,
        height: 18,
        offsetX: 16,
        offsetY: -8,
        duration: 80, // per-frame lifetime
        // duration: 320,
      },
      cooldown: 1500,
    },
  },
  evolution: {
    prev: null,
    next: "patamon",
  },
};
