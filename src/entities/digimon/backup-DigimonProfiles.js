export const DIGIMON_PROFILES = {
  botomon: {
    body: {
      width: 14,
      height: 14,
      offsetX: -7,
      offsetY: 1,
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
  },

  agumon: {
    body: {
      width: 11,
      height: 14,
      offsetX: -6,
      offsetY: 18,
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
  },

  wormmon: {
    body: {
      width: 11,
      height: 14,
      offsetX: -6,
      offsetY: 18,
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
  },

  kunemon: {
    body: {
      width: 11,
      height: 14,
      offsetX: -6,
      offsetY: 1,
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
  },
  gabumon: {
    body: {
      width: 11,
      height: 21,
      offsetX: -4,
      offsetY: 10,
      gravityY: 900,
    },
    move: {
      speed: 90,
    },

    attacks: {
      main: {
        type: "melee",
        anim: "attack-B",
        power: 1.0,
        fireFrames: [2], // active hit window
        hitbox: {
          width: 20,
          height: 18,
          offsetX: 21,
          offsetY: 18,
          duration: 80, // per-frame lifetime
          // duration: 320,
        },
        cooldown: 1500,
      },
      skill1: {
        type: "projectile",
        anim: "attack-A",
        power: 1.0,
        antiAir: true, // 👈 jump check
        projectile: {
          texture: "vfx-windball",
          speed: 260,
          offsetX: 17,
          offsetY: 20,
          lifetime: 1200,
        },
        fireFrame: 9,
        cooldown: 800,
      },
      skill2: {
        type: "melee",
        anim: "attack-C",
        power: 1.0,
        punish: true, // 👈 catches greedy players
        fireFrames: [5], // active hit window
        hitbox: {
          width: 20,
          height: 18,
          offsetX: 21,
          offsetY: 20,
          duration: 80, // per-frame lifetime
          // duration: 320,
        },
        cooldown: 1500,
      },
      skill3: {
        type: "melee",
        anim: "attack-D",
        power: 1.0,
        punish: true, // 👈 catches greedy players
        fireFrames: [4], // active hit window
        hitbox: {
          width: 20,
          height: 18,
          offsetX: 21,
          offsetY: 20,
          duration: 80, // per-frame lifetime
          // duration: 320,
        },
        cooldown: 1500,
      },
    },

    evolution: {
      prev: null,
      next: null,
    },
  },

  chivmon: {
    body: {
      width: 14,
      height: 15,
      offsetX: -5,
      offsetY: 32,
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
  },

  patamon: {
    body: {
      width: 15,
      height: 14,
      offsetX: -6,
      offsetY: 17,
      gravityY: 900,
    },
    movement: {
      mode: "multi-domain",
      domains: ["ground", "air"],
      default: "ground",
    },

    attacks: {
      main: {
        type: "melee",
        anim: "attack-A",
        power: 1.0,
        fireFrames: [5], // active hit window
        hitbox: {
          width: 20,
          height: 11,
          offsetX: 22,
          offsetY: 23,
          duration: 80, // per-frame lifetime
          // duration: 320,
          hitReaction: "flinch",
        },
        cooldown: 100,
      },
      skill1: {
        type: "projectile",
        anim: "attack-B",
        power: 0.5,
        hitStop: 50, // 👈 light hit
        impactVFX: "vfx-explosion",
        projectile: {
          texture: "vfx-windball",
          anim: "vfx-windball",
          scale: 0.3,
          speed: 260,
          offsetX: 19,
          offsetY: 24,
          lifetime: 1200,
          hitReaction: "flinch",
        },
        fireFrame: 6,
        cooldown: 800,
      },

      skill2: {
        type: "projectile",
        anim: "attack-C",
        power: 0.8,
        hitStop: 50, // 👈 light hit
        impactVFX: "vfx-explosion",
        projectile: {
          texture: "vfx-windball",
          anim: "vfx-windball",
          scale: 0.3,
          speed: 260,
          offsetX: 25,
          offsetY: 20,
          lifetime: 1200,
        },
        fireFrame: 4,
        cooldown: 800,
      },
    },
    evolution: {
      prev: null,
      next: "greymon",
    },
  },

  seraphimon: {
    body: {
      width: 18,
      height: 40,
    },

    movement: {
      mode: "multi-domain",
      domains: ["ground", "air"],
      default: "air",
    },

    attacks: {
      main: {
        type: "projectile",
        anim: "attack-A",
        power: 1.0,
        hitStop: 110, // 👈 heavy hit
        impactVFX: "impact-hit",
        projectile: {
          texture: "big-fireball",
          speed: 260,
          offsetX: 28,
          offsetY: 0,
          lifetime: 1200,
        },
        fireFrame: 7,
        cooldown: 800,
      },
      skill1: {
        type: "projectile",
        anim: "attack-B",
        power: 1.0,
        projectile: {
          texture: "big-fireball",
          speed: 260,
          offsetX: 18,
          offsetY: -10,
          lifetime: 1200,
        },
        fireFrame: 7,
        cooldown: 800,
      },

      skill2: {
        type: "melee",
        anim: "attack-C",
        power: 1.0,
        fireFrames: [3, 4, 5], // active hit window
        hitbox: {
          width: 20,
          height: 18,
          offsetX: 16,
          offsetY: -8,
          duration: 80, // per-frame lifetime
          // duration: 320,
        },
        cooldown: 1500,
      },
    },
    evolution: {
      prev: null,
      next: "patamon",
    },
  },

  magnamon: {
    body: {
      width: 14,
      height: 18,
      offsetX: -6,
      offsetY: 13,
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
  },
  birdramon: {
    body: {
      width: 28,
      height: 20,
    },

    movement: {
      mode: "air",
    },

    attacks: {
      main: {
        type: "projectile",
        anim: "attack-A",
        power: 1.0,
        projectile: {
          texture: "big-fireball",
          speed: 260,
          offsetX: 28,
          offsetY: 0,
          lifetime: 1200,
        },
        fireFrame: 4,
        cooldown: 800,
      },
      skill1: {
        type: "projectile",
        anim: "attack-B",
        power: 1.0,
        projectile: {
          texture: "big-fireball",
          speed: 260,
          offsetX: 18,
          offsetY: -10,
          lifetime: 1200,
        },
        fireFrame: 2,
        cooldown: 800,
      },
    },
    evolution: {
      prev: null,
      next: "seraphimon",
    },
  },

  imperialdramon: {
    body: {
      width: 18,
      height: 44,
      offsetX: -9,
      offsetY: 4,
      gravityY: 900,
    },

    movement: {
      mode: "multi-domain",
      domains: ["ground", "air"],
      default: "air",
    },

    attacks: {
      main: {
        type: "projectile",
        anim: "attack-A",
        power: 1.0,
        hitStop: 50, // 👈 light hit
        impactVFX: "impact-hit",
        projectile: {
          texture: "big-fireball",
          speed: 260,
          offsetX: 36,
          offsetY: 17,
          lifetime: 1200,
        },
        fireFrame: 4,
        cooldown: 800,
      },
      skill1: {
        type: "projectile",
        anim: "attack-B",
        power: 1.0,
        projectile: {
          texture: "big-fireball",
          speed: 260,
          offsetX: 28,
          offsetY: 12,
          lifetime: 1200,
        },
        fireFrame: 11,
        cooldown: 800,
      },

      skill2: {
        type: "melee",
        anim: "attack-C",
        power: 1.0,
        fireFrames: [4], // active hit window
        hitbox: {
          width: 23,
          height: 24,
          offsetX: 24,
          offsetY: 35,
          duration: 80, // per-frame lifetime
          // duration: 320,
        },
        cooldown: 1500,
      },
    },
    evolution: {
      prev: null,
      next: "greymon",
    },
  },

  ancientTroiamon: {
    body: {
      width: 31,
      height: 39,
      offsetX: -14,
      offsetY: 25,
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
  },

  ophanimon: {
    body: {
      width: 18,
      height: 40,
      offsetX: -9,
      offsetY: 7,
      gravityY: 900,
    },

    movement: {
      mode: "multi-domain",
      domains: ["ground", "air"],
      default: "ground",
    },

    attacks: {
      main: {
        type: "melee",
        anim: "attack-A",
        power: 1.0,
        fireFrames: [4, 6], // active hit window
        hitbox: {
          width: 10,
          height: 26,
          offsetX: 36,
          offsetY: 26,
          duration: 80, // per-frame lifetime
          // duration: 320,
        },
        cooldown: 1500,
      },
      skill1: {
        type: "projectile",
        anim: "attack-B",
        power: 1.0,
        antiAir: true, // 👈 aerial control
        projectile: {
          texture: "vfx-rainbowball",
          anim: "vfx-rainbowball",
          speed: 260,
          offsetX: 47,
          offsetY: 35,
          lifetime: 1200,
        },
        fireFrame: 8,
        cooldown: 800,
      },

      skill2: {
        type: "projectile",
        anim: "attack-C",
        power: 1.0,
        punish: true,
        desperation: true, // 👈 “phase change” feel
        hitStop: 110, // 👈 heavy hit
        impactVFX: "impact-hit",
        projectile: {
          texture: "vfx-rainbowball",
          anim: "vfx-rainbowball",
          speed: 260,
          offsetX: 33,
          offsetY: 50,
          lifetime: 1200,
        },
        fireFrame: 5,
        cooldown: 800,
      },
    },
    evolution: {
      prev: null,
      next: "patamon",
    },
  },
};
