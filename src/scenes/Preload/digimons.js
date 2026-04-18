export const digimons = [
  "Kunemon",
  "Botomon",
  "Agumon",
  "Gabumon",
  "Wormmon",
  "Chivmon",
  "Patamon",
  "Seraphimon",
  "Magnamon",
  "Birdramon",
  "Imperialdramon",
  "AncientTroiamon",
  "Ophanimon",
];

export function loadDigimons(scene) {
  digimons.forEach((name) => {
    const key = name.toLowerCase();

    scene.load.atlas(
      key,
      `assets/digimons/${name}/${name}.png`,
      `assets/digimons/${name}/${name}.json`,
    );
  });
}
