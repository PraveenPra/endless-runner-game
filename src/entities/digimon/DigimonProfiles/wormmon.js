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
      type: "projectile",
      anim: "attack-C",
      power: 0.5,
      damage: 1,
      impactVFX: "vfx-tiny-fire-impact",
      projectile: {
        texture: "fireball",
        anim: "fireball_fly",
        speed: 220,
        offsetX: 33,
        offsetY: 0,
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
