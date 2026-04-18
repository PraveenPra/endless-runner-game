export const chivmon = {
  body: {
    width: 14,
    height: 15,
    offsetX: 0,
    offsetY: 0,
    gravityY: 900,
  },
  move: {
    speed: 100,
  },

  attacks: {
    main: {
      type: "melee",
      anim: "attack-A",
      power: 1.0,
      fireFrames: [3], // active hit window
      hitbox: {
        width: 11,
        height: 11,
        offsetX: 20,
        offsetY: 35,
        duration: 80, // per-frame lifetime
        statusEffect: "burn",
        hitReaction: "knockbackHeavy",
        // duration: 320,//ms
      },
      cooldown: 500,
    },
    skill1: {
      type: "melee",
      anim: "attack-B",
      power: 1.0,
      desperation: true,
      fireFrames: [3], // active hit window
      hitbox: {
        width: 11,
        height: 10,
        offsetX: 19,
        offsetY: 41,
        duration: 80, // per-frame lifetime
        // duration: 320,
      },
      cooldown: 1500,
    },
    // Attack-C and D are there in spritesheet, not used
  },

  evolution: {
    prev: null,
    next: null,
  },
};
