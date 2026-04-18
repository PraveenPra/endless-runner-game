export const magnamon = {
  body: {
    width: 14,
    height: 18,
    offsetX: 0,
    offsetY: 0,
    gravityY: 900,
  },
  move: {
    speed: 180,
  },

  attacks: {
    main: {
      type: "melee",
      anim: "attack-A",
      power: 1.0,
      fireFrames: [5, 6], // active hit window
      hitbox: {
        width: 20,
        height: 27,
        offsetX: 6,
        offsetY: 16,
        duration: 80, // per-frame lifetime
        // duration: 320,
      },
      cooldown: 1500,
    },
    skill1: {
      type: "melee",
      anim: "attack-B",
      power: 1.0,
      punish: true, // 👈 catches overcommit
      fireFrames: [4, 5, 6, 7, 8, 9, 10], // active hit window
      hitbox: {
        width: 25,
        height: 24,
        offsetX: 0,
        offsetY: 11,
        duration: 80, // per-frame lifetime
        // duration: 320,
      },
      cooldown: 1500,
    },

    skill2: {
      type: "projectile",
      anim: "attack-C",
      power: 1.0,
      antiAir: true, // 👈 jump denial
      desperation: true, // 👈 late-fight pressure
      projectile: {
        texture: "big-fireball",
        speed: 260,
        offsetX: 13,
        offsetY: 7,
        lifetime: 1200,
      },
      fireFrame: 3,
      cooldown: 800,
    },
  },

  evolution: {
    prev: null,
    next: null,
  },
};
