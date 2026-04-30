export const kunemon = {
  body: {
    width: 11,
    height: 14,
    offsetX: 0,
    offsetY: 0,
    gravityY: 900
  },
  attacks: {
    main: {
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
        hitReaction: "knockbackHeavy"
      },
      fireFrame: 3,
      cooldown: 800
    }
  },
  move: {
    speed: 80
  },
  evolution: {
    prev: null,
    next: "imperialdramon"
  }
};
