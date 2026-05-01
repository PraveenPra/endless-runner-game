const BG_PATH = "assets/backgrounds/";

export const backgrounds = [
  { key: "bg1", file: "plx-5.png" },
  { key: "bg2", file: "plx-4.png" },
  { key: "bg3", file: "plx-3.png" },
  { key: "bg4", file: "plx-2.png" },
  { key: "bg5", file: "plx-1.png" },
  { key: "ground", file: "ground.png" },
  { key: "bg-far", file: "sky.png" },
  { key: "bg-mid", file: "bg-mid.png" },
];

export function loadBackgrounds(scene) {
  backgrounds.forEach(({ key, file }) => {
    scene.load.image(key, `${BG_PATH}${file}`);
  });
}
