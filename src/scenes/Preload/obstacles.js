const OBSTACLES_PATH = "assets/obstacles";

export const obstacleSpritesheets = [
  { key: "obstacle-moving-1", file: "bala.png", w: 16, h: 16 },
  { key: "obstacle-moving-2", file: "bomba.png", w: 16, h: 16 },
  { key: "obstacle-moving-3", file: "bomba2.png", w: 16, h: 16 },
  { key: "obstacle-moving-4", file: "bombaex.png", w: 16, h: 16 },
  { key: "obstacle-moving-5", file: "estrelectra.png", w: 16, h: 16 },
  { key: "obstacle-moving-6", file: "mechagoomba.png", w: 16, h: 16 },
];

export function loadObstacles(scene) {
  // standalone images
  scene.load.image("obstacle-static-1", `${OBSTACLES_PATH}/static/balota.png`);

  // spritesheets
  obstacleSpritesheets.forEach(({ key, file, w, h }) => {
    scene.load.spritesheet(key, `${OBSTACLES_PATH}/moving/${file}`, {
      frameWidth: w,
      frameHeight: h,
    });
  });
}
