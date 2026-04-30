import { GameState } from "../GameState.js";
import { createAnimations } from "../systems/AnimationFactory.js";

export class CharacterSelect extends Phaser.Scene {
  constructor() {
    super("CharacterSelect");
  }

  create() {
    this.characters = [
      "botomon",
      "wormmon",
      "kunemon",
      "agumon",
      "chivmon",
      "gabumon",
      "magnamon",
      "patamon",
      "imperialdramon",
      "ancienttroiamon",
      "ophanimon",
    ];

    this.selectedKey = null;
    this.sprites = [];

    this.characters.forEach((key) => {
      createAnimations(this, key);
      const sprite = this.add
        .sprite(0, 0, key)
        .setInteractive({ useHandCursor: true });

      const idleKey = `${key}_idle`;
      const flyKey = `${key}_fly`;
      const animKey = this.anims.exists(idleKey) ? idleKey : flyKey;

      sprite.anims.play(animKey, true);
      sprite.on("pointerdown", () => this.select(key));
      this.sprites.push(sprite);
    });

    Phaser.Actions.GridAlign(this.sprites, {
      width: 10,
      cellWidth: 64,
      cellHeight: 100,
      x: this.cameras.main.centerX - 270,
      y: 120,
    });

    this.add
      .text(480, 40, "SELECT DIGIMON", {
        fontSize: "28px",
        color: "#ffffff",
      })
      .setOrigin(0.5);

    this.createButtons();
  }

  createButtons() {
    this.add
      .text(260, 530, "EDIT BODY", {
        fontSize: "18px",
        color: "#ffffff",
        backgroundColor: "#333333",
        padding: { x: 15, y: 8 },
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on("pointerdown", () => this.editBody());

    this.add
      .text(480, 530, "EDIT PROJECTILES", {
        fontSize: "18px",
        color: "#ffffff",
        backgroundColor: "#1f4d66",
        padding: { x: 15, y: 8 },
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on("pointerdown", () => this.editProjectiles());

    this.add
      .text(700, 530, "START", {
        fontSize: "18px",
        color: "#000000",
        backgroundColor: "#00ff00",
        padding: { x: 15, y: 8 },
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on("pointerdown", () => this.startGame());

    this.add
      .text(480, 495, "SELECT A DIGIMON", {
        fontSize: "14px",
        color: "#888888",
      })
      .setOrigin(0.5)
      .setVisible(true);
  }

  select(key) {
    this.selectedKey = key;
    GameState.selectedDigimon = key;

    this.sprites.forEach((sprite) => {
      sprite.setAlpha(sprite.texture.key === key ? 1 : 0.3);
    });
  }

  editBody() {
    if (!this.selectedKey) {
      this.showMessage("Select a digimon first!");
      return;
    }
    this.scene.start("EditBodyScene", { digimon: this.selectedKey });
  }

  editProjectiles() {
    if (!this.selectedKey) {
      this.showMessage("Select a digimon first!");
      return;
    }
    this.scene.start("EditProjectileScene", { digimon: this.selectedKey });
  }

  startGame() {
    if (!this.selectedKey) {
      this.showMessage("Select a digimon first!");
      return;
    }
    this.scene.start("Start");
  }

  showMessage(text) {
    if (this.msg) this.msg.destroy();
    this.msg = this.add
      .text(480, 470, text, {
        fontSize: "16px",
        color: "#ff0000",
      })
      .setOrigin(0.5);
    this.time.delayedCall(1500, () => {
      if (this.msg) this.msg.destroy();
    });
  }
}
