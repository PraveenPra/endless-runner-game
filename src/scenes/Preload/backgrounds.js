export const backgrounds = [
  { key: "bg1", path: "assets/backgrounds/plx-5.png" },
  { key: "bg2", path: "assets/backgrounds/plx-4.png" },
  { key: "bg3", path: "assets/backgrounds/plx-3.png" },
  { key: "bg4", path: "assets/backgrounds/plx-2.png" },
  { key: "bg5", path: "assets/backgrounds/plx-1.png" },
];

export function loadBackgrounds(scene) {
  backgrounds.forEach((bg) => {
    scene.load.image(bg.key, bg.path);
  });
}
