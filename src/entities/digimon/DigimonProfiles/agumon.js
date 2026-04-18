export const agumon = {
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
      power: 0.2,
      fireFrames: [4, 5], // active hit window
      hitbox: {
        width: 9,
        height: 15,
        offsetX: 19,
        offsetY: 19,
        // statusEffect: "burn",
        duration: 80, // per-frame lifetime
      },
      cooldown: 300,
    },
    skill1: {
      type: "melee",
      anim: "attack-B",
      power: 0.2,
      fireFrames: [5], // active hit window
      hitbox: {
        width: 11,
        height: 15,
        offsetX: 11,
        offsetY: 24,
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
        offsetY: 20,
        lifetime: 1900,
        statusEffect: "burn",
        hitReaction: "launch",
      },
      fireFrame: 5,
      cooldown: 800,
    },
    skill3: {
      type: "melee",
      anim: "attack-D",
      power: 3.0,
      fireFrames: [3, 4, 5, 6], // active hit window
      hitbox: {
        width: 33,
        height: 30,
        offsetX: -1,
        offsetY: 13,
        // duration: 320,
        // duration: 80, // per-frame lifetime
      },
      cooldown: 1500,
    },
    skill4: {
      type: "projectile",
      anim: "attack-E",
      power: 4.0,
      impactVFX: "vfx-gnd-blast",
      projectile: {
        motion: "arc",
        explosive: true,
        explodeOnGround: true,
        explosionRadius: 164,
        texture: "big-fireball",
        // scale: 0.1,
        speed: 220,
        offsetX: 15,
        offsetY: -10,
        lifetime: 900,
      },
      fireFrame: 7,
      cooldown: 800,
    },
  },

  move: {
    speed: 200,
  },

  evolution: {
    prev: null,
    next: "imperialdramon",
  },
};
