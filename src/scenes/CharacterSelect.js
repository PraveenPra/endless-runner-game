import { GameState } from "../GameState.js";
import { createAnimations } from "../systems/AnimationFactory.js";
import { getMapConfig } from "../config/maps.js";

export class CharacterSelect extends Phaser.Scene {
  constructor() {
    super("CharacterSelect");
  }

  create() {
    this.characters = GameState.allPlayableDigimon;

    this.selectedKey = null;
    this.sprites = [];
    this.lockLabels = [];

    this.characters.forEach((key) => {
      createAnimations(this, key);
      const unlocked = GameState.unlockedBaseForms.has(key);
      const sprite = this.add
        .sprite(0, 0, key)
        .setInteractive({ useHandCursor: true });

      const idleKey = `${key}_idle`;
      const flyKey = `${key}_fly`;
      const animKey = this.anims.exists(idleKey) ? idleKey : flyKey;

      sprite.anims.play(animKey, true);
      sprite.digimonKey = key;
      sprite.locked = !unlocked;
      sprite.setAlpha(unlocked ? 0.85 : 0.22);
      sprite.on("pointerdown", () => this.select(key));
      this.sprites.push(sprite);

      const lockLabel = this.add
        .text(0, 0, "LOCKED", {
          fontSize: "10px",
          color: "#ff7777",
        })
        .setOrigin(0.5)
        .setVisible(!unlocked);
      this.lockLabels.push(lockLabel);
    });

    Phaser.Actions.GridAlign(this.sprites, {
      width: 10,
      cellWidth: 64,
      cellHeight: 100,
      x: this.cameras.main.centerX - 270,
      y: 120,
    });

    this.sprites.forEach((sprite, index) => {
      const label = this.lockLabels[index];
      label.setPosition(sprite.x, sprite.y + 34);
    });

    this.add
      .text(480, 40, "SELECT DIGIMON", {
        fontSize: "28px",
        color: "#ffffff",
      })
      .setOrigin(0.5);

    const map = getMapConfig(GameState.selectedMapKey);
    this.add
      .text(480, 74, `MAP: ${map.name.toUpperCase()}`, {
        fontSize: "14px",
        color: "#ffdcaa",
      })
      .setOrigin(0.5);

    this.createButtons();
  }

  createButtons() {
    this.add
      .text(190, 530, "MAP", {
        fontSize: "18px",
        color: "#000000",
        backgroundColor: "#ffdcaa",
        padding: { x: 15, y: 8 },
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on("pointerdown", () => this.scene.start("MapSelectScene"));

    this.add
      .text(335, 530, "EDIT BODY", {
        fontSize: "18px",
        color: "#ffffff",
        backgroundColor: "#333333",
        padding: { x: 15, y: 8 },
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on("pointerdown", () => this.editBody());

    this.add
      .text(535, 530, "EDIT PROJECTILES", {
        fontSize: "18px",
        color: "#ffffff",
        backgroundColor: "#1f4d66",
        padding: { x: 15, y: 8 },
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on("pointerdown", () => this.editProjectiles());

    this.add
      .text(785, 530, "START", {
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
    if (!GameState.unlockedBaseForms.has(key)) {
      this.showMessage("Hatch this Digimon first!");
      return;
    }

    this.selectedKey = key;
    GameState.selectedDigimon = key;

    this.sprites.forEach((sprite) => {
      const unlocked = !sprite.locked;
      const selected = sprite.digimonKey === key;
      sprite.setAlpha(selected ? 1 : unlocked ? 0.55 : 0.18);
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
