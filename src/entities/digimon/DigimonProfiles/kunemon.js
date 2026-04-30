export const kunemon = {
  body: {
    width: 11,
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
      fireFrames: [3], // active hit window
      hitbox: {
        width: 9,
        height: 38,
        offsetX: 15,
        offsetY: -4,
        // statusEffect: "burn",

        duration: 80, // per-frame lifetime
      },
      cooldown: 300,
    },
    skill1: {
      type: "projectile",
      anim: "attack-B",
      power: 0.5,
      damage: 1,
      impactVFX: "vfx-tiny-fire-impact",
      projectile: {
        texture: "fireball",
        anim: "fireball_fly",
        speed: 220,
        offsetX: 12,
        offsetY: 8,
        lifetime: 1900,
        statusEffect: "burn",
        hitReaction: "knockbackHeavy",
      },
      fireFrame: 3,
      cooldown: 800,
    },
  },

  move: {
    speed: 80,
  },

  evolution: {
    prev: null,
    next: "imperialdramon",
  },
};
