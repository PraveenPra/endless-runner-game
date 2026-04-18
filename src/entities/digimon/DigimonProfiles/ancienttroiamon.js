export const ancienttroiamon = {
  body: {
    width: 31,
    height: 39,
    offsetX: 0,
    offsetY: 0,
    gravityY: 900,
  },

  attacks: {
    main: {
      type: "projectile",
      anim: "attack-A",
      power: 1.0,
      impactVFX: "vfx-fireblast",
      projectile: {
        texture: "leafball",
        anim: "vfx-leafball",
        speed: 220,
        offsetX: 26,
        offsetY: 31,
        lifetime: 1900,
      },
      fireFrame: 9,
      cooldown: 800,
    },
    skill1: {
      type: "projectile",
      anim: "attack-B",
      power: 1.0,
      impactVFX: "vfx-fireblast",
      projectile: {
        texture: "fireball",
        anim: "fireball_fly",
        speed: 220,
        offsetX: 26,
        offsetY: 20,
        lifetime: 1900,
      },
      fireFrame: 6,
      cooldown: 800,
    },
  },

  evolution: {
    prev: null,
    next: "imperialdramon",
  },
};
