export const magnamon = {
  body: {
    width: 14,
    height: 18,
    offsetX: 0,
    offsetY: 0,
    gravityY: 900
  },
  move: {
    speed: 180
  },
  attacks: {
    main: {
      type: "projectile",
      anim: "attack-C",
      power: 1,
      damage: 1,
      antiAir: true,
      desperation: true,
      projectile: {
        texture: "big-fireball",
        speed: 260,
        offsetX: 13,
        offsetY: 7,
        lifetime: 1200
      },
      fireFrame: 3,
      cooldown: 800
    }
  },
  evolution: {
    prev: null,
    next: null
  }
};
