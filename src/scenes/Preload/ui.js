export function loadUI(scene) {
  scene.load.atlas("ui", "assets/ui/ui.png", "assets/ui/ui.json");

  scene.load.atlas(
    "mobile-buttons",
    "assets/ui/mobile-buttons.png",
    "assets/ui/mobile-buttons.json",
  );

  scene.load.bitmapFont(
    "bigFont",
    "assets/ui/fonts/Big-font1.png",
    "assets/ui/fonts/Big-font1.xml",
  );

  scene.load.bitmapFont(
    "smallFont",
    "assets/ui/fonts/Small-font1.png",
    "assets/ui/fonts/Small-font1.xml",
  );
}
