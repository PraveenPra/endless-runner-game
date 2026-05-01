import { loadDigimons } from "./digimons.js";
import { loadVFX } from "./vfx.js";
import { loadAudio } from "./audio.js";
import { loadBackgrounds } from "./backgrounds.js";
// import { loadGameplay } from "./gameplay.js";
import { loadObstacles } from "./obstacles.js";
import { loadCollectibles } from "./collectables.js";
// import { loadTilemaps } from "./tilemaps.js";
// import { loadItems } from "./items.js";
// import { loadUI } from "./ui.js";

export class Preload extends Phaser.Scene {
  constructor() {
    super("Preload");
  }

  preload() {
    this.loadingScreen();

    loadDigimons(this);
    loadBackgrounds(this);
    loadVFX(this);
    // loadGameplay(this);
    loadObstacles(this);
    loadCollectibles(this);
    // loadItems(this);
    // loadTilemaps(this);
    loadAudio(this);
    // loadUI(this);
  }

  create() {
    // this.scene.start("CharacterSelect");
    // GameState.selectedDigimon = "agumon";
    // this.scene.start("Start");
    this.scene.start("MainMenuScene");
  }

  loadingScreen() {
    const { width, height } = this.cameras.main;

    // ================================
    // LOADING SCREEN UI (FIRST!)
    // ================================
    const bg = this.add.rectangle(
      width / 2,
      height / 2,
      width,
      height,
      0x000000,
    );

    const loadingText = this.add
      .text(width / 2, height / 2 - 50, "Loading...", {
        fontSize: "20px",
        color: "#ffffff",
      })
      .setOrigin(0.5);

    const progressBox = this.add.rectangle(
      width / 2,
      height / 2,
      320,
      30,
      0x222222,
    );

    const progressBar = this.add
      .rectangle(width / 2 - 160, height / 2, 0, 24, 0xffffff)
      .setOrigin(0, 0.5);

    const percentText = this.add
      .text(width / 2, height / 2 + 40, "0%", {
        fontSize: "16px",
        color: "#ffffff",
      })
      .setOrigin(0.5);

    // ================================
    // LOADER EVENTS
    // ================================
    this.load.on("progress", (value) => {
      progressBar.width = 300 * value;
      percentText.setText(`${Math.floor(value * 100)}%`);
    });

    this.load.on("complete", () => {
      bg.destroy();
      loadingText.destroy();
      progressBox.destroy();
      progressBar.destroy();
      percentText.destroy();
    });
  }
}
