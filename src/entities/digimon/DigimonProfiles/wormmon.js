export const wormmon = {
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
      fireFrames: [2], // active hit window
      hitbox: {
        width: 9,
        height: 38,
        offsetX: 19,
        offsetY: 12,
        // statusEffect: "burn",
        duration: 80, // per-frame lifetime
      },
      cooldown: 300,
    },
    skill1: {
      type: "melee",
      anim: "attack-B",
      power: 0.5,
      fireFrames: [2], // active hit window
      hitbox: {
        width: 11,
        height: 50,
        offsetX: 14,
        offsetY: 5,
        // duration: 320,
        // duration: 80, // per-frame lifetime
      },
      cooldown: 1500,
    },
    skill2: {
      type: "projectile",
      anim: "attack-C",
      power: 0.5,
      impactVFX: "vfx-tiny-fire-impact",
      projectile: {
        texture: "fireball",
        anim: "fireball_fly",
        speed: 220,
        offsetX: 26,
        offsetY: 18,
        lifetime: 1900,
        statusEffect: "burn",
        hitReaction: "launch",
      },
      fireFrame: 1,
      cooldown: 800,
    },
  },

  move: {
    speed: 100,
  },

  evolution: {
    prev: null,
    next: "imperialdramon",
  },
};
