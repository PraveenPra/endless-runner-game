export const botomon = {
  body: {
    width: 14,
    height: 14,
    offsetX: 0,
    offsetY: 0,
    gravityY: 900,
  },

  attacks: {
    main: {
      type: "melee",
      anim: "attack-A",
      power: 0.5,
      fireFrames: [5], // active hit window
      hitbox: {
        width: 32,
        height: 48,
        offsetX: 26,
        offsetY: -10,
        statusEffect: "burn",
        duration: 80, // per-frame lifetime
      },
      cooldown: 10,
    },
    skill1: {
      type: "projectile",
      anim: "attack-A",
      power: 0.5,
      damage: 1,
      impactVFX: "vfx-tiny-fire-impact",
      projectile: {
        texture: "fireball",
        anim: "fireball_fly",
        speed: 220,
        offsetX: 13,
        offsetY: 9,
        lifetime: 1900,
        statusEffect: "burn",
        hitReaction: "launch",
      },
      fireFrame: 5,
      cooldown: 800,
    },
  },

  move: {
    speed: 100,
  },

  evolution: {
    prev: null,
    next: "agumon",
  },
};
