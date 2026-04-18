const VFX_PATH = "assets/vfx/";

export const vfxSpritesheets = [
  { key: "fireball", file: "fireball-vfx.png", w: 17, h: 17 },
  { key: "impact-hit", file: "impact-hit.png", w: 32, h: 32 },
  { key: "sx-impact-hit", file: "small-fireball-impact.png", w: 64, h: 64 },
  { key: "vfx-fireblast", file: "fireblast.png", w: 64, h: 49 },
  { key: "vfx-explosion", file: "explosion.png", w: 53, h: 47 },
  { key: "vfx-windball", file: "windball.png", w: 96, h: 96 },
  { key: "vfx-leafball", file: "leafball.png", w: 96, h: 32 },
  { key: "vfx-rainbowball", file: "rainbowball.png", w: 32, h: 32 },
  { key: "burn-fx", file: "burn-fx.png", w: 16, h: 16 },
  { key: "vfx-gnd-blast", file: "gnd-blast.png", w: 32, h: 32 },
  { key: "vfx-tiny-fire-impact", file: "tiny-fire-impact.png", w: 32, h: 32 },
  {
    key: "vfx-watergun-impact",
    file: "watergun/watergun-impact.png",
    w: 55,
    h: 48,
  },
  {
    key: "vfx-watergun-muzzle",
    file: "watergun/watergun-muzzle.png",
    w: 55,
    h: 48,
  },
  {
    key: "vfx-watergun-body",
    file: "watergun/watergun-body.png",
    w: 55,
    h: 48,
  },
  {
    key: "vfx-watergun-stream",
    file: "watergun/watergun-stream.png",
    w: 39,
    h: 31,
  },
];

export function loadVFX(scene) {
  // standalone images
  scene.load.image("big-fireball", `${VFX_PATH}big-fireball.png`);

  // spritesheets
  vfxSpritesheets.forEach(({ key, file, w, h }) => {
    scene.load.spritesheet(key, `${VFX_PATH}${file}`, {
      frameWidth: w,
      frameHeight: h,
    });
  });
}
