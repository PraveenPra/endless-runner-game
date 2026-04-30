export const imperialdramon = {
  body: {
    width: 18,
    height: 44,
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
      damage: 1,
      hitStop: 50, // 👈 light hit
      impactVFX: "impact-hit",
      projectile: {
        texture: "big-fireball",
        speed: 260,
        offsetX: 36,
        offsetY: 17,
        lifetime: 1200,
      },
      fireFrame: 4,
      cooldown: 800,
    },
    skill1: {
      type: "projectile",
      anim: "attack-B",
      power: 1.0,
      damage: 1,
      projectile: {
        texture: "big-fireball",
        speed: 260,
        offsetX: 28,
        offsetY: 12,
        lifetime: 1200,
      },
      fireFrame: 11,
      cooldown: 800,
    },

    skill2: {
      type: "melee",
      anim: "attack-C",
      power: 1.0,
      fireFrames: [4], // active hit window
      hitbox: {
        width: 23,
        height: 24,
        offsetX: 24,
        offsetY: 35,
        duration: 80, // per-frame lifetime
        // duration: 320,
      },
      cooldown: 1500,
    },
  },
  evolution: {
    prev: null,
    next: "greymon",
  },
};
