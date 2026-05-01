const BG_PATH = "assets/backgrounds/";

export const backgrounds = [
  { key: "bg1", file: "plx-5.png" },
  { key: "bg2", file: "plx-4.png" },
  { key: "bg3", file: "plx-3.png" },
  { key: "bg4", file: "plx-2.png" },
  { key: "bg5", file: "plx-1.png" },
  { key: "ground", file: "ground.png" },
  { key: "ground1", file: "ground1.png" },
  { key: "ground2", file: "ground2.png" },
  { key: "ground3", file: "ground3.png" },
  { key: "bg-far", file: "sky.png" },
  { key: "bg-mid", file: "bg-mid.png" },
  { key: "sky", file: "sky.png" },
  { key: "sky1", file: "sky1.png" },
  { key: "blue-sky", file: "blue-sky.png" },
  { key: "cloud1", file: "cloud1.png" },
  { key: "cloud2", file: "cloud2.png" },
  { key: "blue-clouds", file: "blue-clouds.png" },
  { key: "sanddune", file: "sanddune.png" },
  { key: "big-sanddune", file: "big-sanddune.png" },
  { key: "cliffs", file: "cliffs.png" },
];

export function loadBackgrounds(scene) {
  backgrounds.forEach(({ key, file }) => {
    scene.load.image(key, `${BG_PATH}${file}`);
  });
}
