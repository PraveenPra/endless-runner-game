export const birdramon = {
  body: {
    width: 28,
    height: 20,
    offsetX: 0,
    offsetY: 0,
    gravityY: 900,
  },

  movement: {
    mode: "air",
  },

  attacks: {
    main: {
      type: "projectile",
      anim: "attack-A",
      power: 1.0,
      projectile: {
        texture: "big-fireball",
        speed: 260,
        offsetX: 28,
        offsetY: 0,
        lifetime: 1200,
      },
      fireFrame: 4,
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
      fireFrame: 2,
      cooldown: 800,
    },
  },
  evolution: {
    prev: null,
    next: "seraphimon",
  },
};
