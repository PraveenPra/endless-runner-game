import { GameState } from "../GameState.js";
import { getMapConfig } from "../config/maps.js";
import { createBitmapLabel, createButton, createPanel } from "../ui/PixelUI.js";

export class MainMenuScene extends Phaser.Scene {
  constructor() {
    super("MainMenuScene");
  }

  create() {
    const { width, height } = this.cameras.main;
    this.createBackdrop(width, height);
    this.createShell(width, height);
  }

  createBackdrop(width, height) {
    const map = getMapConfig(GameState.selectedMapKey);
    const layers = map.backgrounds?.length
      ? map.backgrounds
      : getMapConfig("desert").backgrounds;

    layers.forEach((layer, index) => {
      if (!this.textures.exists(layer.key)) return;

      const bg = this.add
        .tileSprite(0, 0, width, height, layer.key)
        .setOrigin(0)
        .setDepth(-20 + index)
        .setAlpha(index === 0 ? 1 : 0.88);

      this.tweens.add({
        targets: bg,
        tilePositionX: 48 + index * 18,
        duration: 12000 + index * 2200,
        repeat: -1,
        ease: "Linear",
      });
    });

    this.add.rectangle(width / 2, height / 2, width, height, 0x07101b, 0.28);
  }

  createShell(width, height) {
    createPanel(this, width / 2, height / 2 + 18, 520, 400, {
      depth: 5,
      alpha: 0.96,
    });

    createPanel(this, width / 2, 92, 620, 108, {
      depth: 6,
      alpha: 0.96,
    });

    createBitmapLabel(this, width / 2, 72, "DIGIMON", {
      font: "bigFont",
      size: 50,
      tint: 0xf7ffe8,
    }).setDepth(8);

    createBitmapLabel(this, width / 2, 119, "endless-runner", {
      font: "smallFont",
      size: 52,
      tint: 0x244b2a,
    }).setDepth(8);

    const map = getMapConfig(GameState.selectedMapKey);
    createBitmapLabel(this, width / 2, 181, `map:${map.name}`, {
      font: "smallFont",
      size: 50,
      tint: 0xf7ffe8,
    }).setDepth(8);

    const buttons = [
      ["start-game", () => this.scene.start("MapSelectScene")],
      ["character", () => this.scene.start("CharacterSelect")],
      ["hatchery", () => this.scene.start("HatcheryScene")],
      ["shop", () => this.scene.start("ShopScene")],
    ];

    buttons.forEach(([label, onClick], index) => {
      createButton(this, width / 2, 236 + index * 58, 300, 42, label, onClick, {
        depth: 10,
        fontSize: 50,
      });
    });

    this.createStatusBar(width, height);
  }

  createStatusBar(width, height) {
    createPanel(this, width / 2, height - 34, 700, 48, {
      depth: 6,
      alpha: 0.94,
    });

    const stats = [
      `coins:${GameState.currency.coins}`,
      `gems:${GameState.currency.gems}`,
      `eggs:${GameState.hatchery.eggs.length}/${GameState.hatchery.capacity}`,
      `best:${GameState.highScore}`,
    ];

    stats.forEach((stat, index) => {
      createBitmapLabel(
        this,
        width / 2 - 255 + index * 170,
        height - 34,
        stat,
        {
          font: "smallFont",
          size: 50,
          tint: 0xf7ffe8,
        },
      ).setDepth(8);
    });
  }
}
