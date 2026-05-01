export function loadGameplay(scene) {
  scene.load.image("ground", "assets/ground.png");
  scene.load.image("bg-far", "assets/sky.png");
  scene.load.image("bg-mid", "assets/bg-mid.png");

  scene.load.spritesheet("obstacle-moving-1", "assets/obstacles/moving/bala.png", {
    frameWidth: 16,
    frameHeight: 16,
  });

  scene.load.spritesheet("obstacle-moving-2", "assets/obstacles/moving/bomba.png", {
    frameWidth: 16,
    frameHeight: 16,
  });

  scene.load.spritesheet("obstacle-moving-3", "assets/obstacles/moving/bomba2.png", {
    frameWidth: 16,
    frameHeight: 16,
  });

  scene.load.spritesheet("obstacle-moving-4", "assets/obstacles/moving/bombaex.png", {
    frameWidth: 16,
    frameHeight: 16,
  });

  scene.load.spritesheet(
    "obstacle-moving-5",
    "assets/obstacles/moving/estrelectra.png",
    {
      frameWidth: 16,
      frameHeight: 16,
    },
  );

  scene.load.spritesheet(
    "obstacle-moving-6",
    "assets/obstacles/moving/mechagoomba.png",
    {
      frameWidth: 16,
      frameHeight: 16,
    },
  );

  scene.load.image("obstacle-static-1", "assets/obstacles/static/balota.png");

  scene.load.spritesheet(
    "collectible-gold-coin",
    "assets/collectables/moving/goldcoins.png",
    {
      frameWidth: 16,
      frameHeight: 16,
    },
  );

  scene.load.spritesheet(
    "collectible-silver-coin",
    "assets/collectables/moving/silvercoins.png",
    {
      frameWidth: 16,
      frameHeight: 16,
    },
  );

  scene.load.spritesheet(
    "collectible-gem-green",
    "assets/collectables/moving/gems-green.png",
    {
      frameWidth: 16,
      frameHeight: 16,
    },
  );

  scene.load.spritesheet("collectible-eggs", "assets/collectables/static/eggs.png", {
    frameWidth: 64,
    frameHeight: 64,
  });

  scene.load.image("shield-powerup", "assets/collectables/static/shield.png");
  scene.load.image("magnet-powerup", "assets/collectables/static/magnet.png");
  scene.load.image("speedboost-powerup", "assets/collectables/static/speed-boost.png");
  scene.load.image("evolution-powerup", "assets/vfx/power-up.png");

  scene.load.audio("jump", "assets/sfx/jump.wav");
}
