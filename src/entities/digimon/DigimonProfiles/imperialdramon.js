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
      power: 1,
      damage: 1,
      hitStop: 50,
      impactVFX: "impact-hit",
      projectile: {
        texture: "big-fireball",
        speed: 260,
        offsetX: 59,
        offsetY: 14,
        lifetime: 1200,
      },
      fireFrame: 4,
      cooldown: 800,
    },
    skill1: {
      type: "projectile",
      anim: "attack-B",
      power: 1,
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
  },
  evolution: {
    prev: null,
    next: "greymon",
  },
};
