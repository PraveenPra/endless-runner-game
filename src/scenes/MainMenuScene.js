import { GameState } from "/src/GameState.js";

export class MainMenuScene extends Phaser.Scene {
  constructor() {
    super("MainMenuScene");
  }

  create() {
    const { width, height } = this.cameras.main;

    // Title
    this.add
      .text(width / 2, 120, "DIGIMON Endless runner", {
        fontSize: "48px",
        color: "#ffffff",
      })
      .setOrigin(0.5);

    const startGame = this.add
      .text(width / 2, 260, "Start Game", {
        fontSize: "28px",
        color: "#00ffcc",
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    startGame.on("pointerdown", () => {
      this.scene.start("CharacterSelect");
    });

    const characterSelection = this.add
      .text(width / 2, 320, "Character selection", {
        fontSize: "28px",
        color: "#ffcc00",
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    characterSelection.on("pointerdown", () => {
      this.scene.start("CharacterSelect");
    });

    const hatchery = this.add
      .text(width / 2, 380, "Hatchery", {
        fontSize: "28px",
        color: "#ffdcaa",
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    hatchery.on("pointerdown", () => {
      this.scene.start("HatcheryScene");
    });

    const shop = this.add
      .text(width / 2, 440, "Shop", {
        fontSize: "28px",
        color: "#8fd1ff",
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    shop.on("pointerdown", () => {
      this.scene.start("ShopScene");
    });

    // ==========================
    // HOVER EFFECT
    // ==========================

    this.addHover(startGame);
    this.addHover(characterSelection);
    this.addHover(hatchery);
    this.addHover(shop);
  }

  addHover(btn) {
    btn.on("pointerover", () => btn.setScale(1.1));
    btn.on("pointerout", () => btn.setScale(1));
  }
}
