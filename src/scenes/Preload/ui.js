export function loadUI(scene) {
  scene.load.atlas("ui", "assets/ui/ui.png", "assets/ui/ui.json");

  scene.load.atlas(
    "simple-buttons",
    "assets/ui/simple-buttons.png",
    "assets/ui/simple-buttons.json",
  );

  scene.load.atlas(
    "panel-blue",
    "assets/ui/panel-blue.png",
    "assets/ui/panel-blue.json",
  );

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

  scene.load.bitmapFont(
    "allFont",
    "assets/ui/fonts/All-font1.png",
    "assets/ui/fonts/All-font1.xml",
  );
}
