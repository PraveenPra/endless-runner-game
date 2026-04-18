import { GameState } from "/src/GameState.js";

export class MainMenuScene extends Phaser.Scene {
  constructor() {
    super("MainMenuScene");
  }

  create() {
    const { width, height } = this.cameras.main;

    // Title
    this.add
      .text(width / 2, 120, "DIGIMON BATTLE", {
        fontSize: "48px",
        color: "#ffffff",
      })
      .setOrigin(0.5);

    // ==========================
    // PLATFORMER MODE BUTTON
    // ==========================

    const platformer = this.add
      .text(width / 2, 260, "Start Game", {
        fontSize: "28px",
        color: "#00ffcc",
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    platformer.on("pointerdown", () => {
      this.scene.start("CharacterSelect");
    });

    // ==========================
    // SURVIVAL MODE BUTTON
    // ==========================

    const survival = this.add
      .text(width / 2, 320, "Character selection", {
        fontSize: "28px",
        color: "#ffcc00",
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    survival.on("pointerdown", () => {
      this.scene.start("CharacterSelect");
    });

    // ==========================
    // HOVER EFFECT
    // ==========================

    this.addHover(platformer);
    this.addHover(survival);
  }

  addHover(btn) {
    btn.on("pointerover", () => btn.setScale(1.1));
    btn.on("pointerout", () => btn.setScale(1));
  }
}
