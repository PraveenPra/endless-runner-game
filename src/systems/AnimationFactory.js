export function createAnimations(scene, textureKey) {
  const frameNames = scene.textures.get(textureKey).getFrameNames();

  const groups = {};

  frameNames.forEach((name) => {
    const base = name.split("-").slice(0, -1).join("-");
    // attack-A-6 → attack-A

    if (!groups[base]) groups[base] = [];
    groups[base].push(name);
  });

  Object.keys(groups).forEach((animKey) => {
    scene.anims.create({
      key: `${textureKey}_${animKey}`,
      frames: groups[animKey]
        .sort()
        .map((f) => ({ key: textureKey, frame: f })),
      frameRate: 10,
      repeat:
        animKey.includes("idle") ||
        animKey.includes("run") ||
        animKey.includes("fly")
          ? -1
          : 0,
    });
  });
}
