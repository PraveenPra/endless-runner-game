export const botomon = {
  body: {
    width: 14,
    height: 14,
    offsetX: 0,
    offsetY: 0,
    gravityY: 900
  },
  attacks: {
    main: {
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
        hitReaction: "launch"
      },
      fireFrame: 5,
      cooldown: 800
    }
  },
  move: {
    speed: 100
  },
  evolution: {
    prev: null,
    next: "agumon"
  }
};
