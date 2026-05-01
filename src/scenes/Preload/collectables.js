const COLLECTABLES_PATH = "assets/collectables";

export const collectibleSpritesheets = [
  {
    key: "collectible-gold-coin",
    file: "goldcoins.png",
    w: 16,
    h: 16,
  },
  {
    key: "collectible-silver-coin",
    file: "silvercoins.png",
    w: 16,
    h: 16,
  },
  {
    key: "collectible-gem-green",
    file: "gems-green.png",
    w: 16,
    h: 16,
  },
];

// Temporary spritesheets to be replaced by atlas. Some collectibles are images that don't move and thus don't need an animation
export const collectibleSpritesheetsNonMoving = [
  { key: "collectible-eggs", file: "eggs.png", w: 64, h: 64 },
];

export const collectablesStaticImages = [
  { key: "shield-powerup", file: "shield.png" },
  { key: "magnet-powerup", file: "magnet.png" },
  { key: "speedboost-powerup", file: "speed-boost.png" },
  { key: "evolution-powerup", file: "evolution.png" },
];

export function loadCollectibles(scene) {
  // standalone images
  collectablesStaticImages.forEach(({ key, file }) => {
    scene.load.image(key, `${COLLECTABLES_PATH}/static/${file}`);
  });

  // spritesheets
  collectibleSpritesheets.forEach(({ key, file, w, h }) => {
    scene.load.spritesheet(key, `${COLLECTABLES_PATH}/moving/${file}`, {
      frameWidth: w,
      frameHeight: h,
    });
  });

  // Temporary spritesheets to be replaced by atlas. Some collectibles are images that don't move and thus don't need an animation
  collectibleSpritesheetsNonMoving.forEach(({ key, file, w, h }) => {
    scene.load.spritesheet(key, `${COLLECTABLES_PATH}/static/${file}`, {
      frameWidth: w,
      frameHeight: h,
    });
  });
}
