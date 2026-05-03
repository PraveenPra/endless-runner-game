import { GameState } from "../GameState.js";
import { getMapConfig } from "../config/maps.js";
import { createBitmapLabel, createButton, createPanel } from "../ui/PixelUI.js";

const MAIN_MENU_FONT = "allFont";
const MAIN_MENU_PANEL = {
  atlas: "panel-blue",
  prefix: "panel-blue",
  slice: 32,
};
const MAIN_MENU_BUTTON = {
  atlas: "simple-buttons",
  layout: "horizontal",
  slice: 32,
  font: MAIN_MENU_FONT,
  fontSize: 25,
  tint: 0x17301b,
};

function buttonStyle(color, options = {}) {
  return {
    ...MAIN_MENU_BUTTON,
    prefix: `button-${color}-v`,
    ...options,
  };
}

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
      ...MAIN_MENU_PANEL,
      depth: 5,
      alpha: 0.96,
    });

    createPanel(this, width / 2, 92, 620, 108, {
      ...MAIN_MENU_PANEL,
      depth: 6,
      alpha: 0.96,
    });

    this.add.image(width / 2 - 124, 72, "icons", "icon-star").setScale(1.55).setDepth(8);
    createBitmapLabel(this, width / 2, 72, "DIGIMON", {
      font: MAIN_MENU_FONT,
      size: 46,
      tint: 0xf7ffe8,
    }).setDepth(8);
    this.add.image(width / 2 + 124, 72, "icons", "icon-star").setScale(1.55).setDepth(8);

    createBitmapLabel(this, width / 2, 119, "ENDLESS RUNNER", {
      font: MAIN_MENU_FONT,
      size: 26,
      tint: 0x9fd8ff,
    }).setDepth(8);

    const map = getMapConfig(GameState.selectedMapKey);
    createBitmapLabel(this, width / 2, 181, `MAP: ${map.name.toUpperCase()}`, {
      font: MAIN_MENU_FONT,
      size: 26,
      tint: 0xf7ffe8,
    }).setDepth(8);

    const buttons = [
      ["START GAME", "lime", "icon-right-arrow", () => this.scene.start("MapSelectScene")],
      ["CHARACTER", "yellow", "icon-login", () => this.scene.start("CharacterSelect")],
      ["HATCHERY", "gray", "icon-key", () => this.scene.start("HatcheryScene")],
      ["SHOP", "red", "icon-diamond", () => this.scene.start("ShopScene")],
      ["CREDITS", "gray", "icon-star", () => this.scene.start("CreditsScene")],
    ];

    buttons.forEach(([label, color, icon, onClick], index) => {
      createButton(this, width / 2, 226 + index * 50, 300, 42, label, onClick, {
        ...buttonStyle(color, {
          icon,
          iconSize: 18,
          textX: 16,
        }),
        depth: 10,
      });
    });

    this.createStatusBar(width, height);
  }

  createStatusBar(width, height) {
    createPanel(this, width / 2, height - 34, 700, 48, {
      ...MAIN_MENU_PANEL,
      depth: 6,
      alpha: 0.94,
    });

    const stats = [
      `COINS: ${GameState.currency.coins}`,
      `GEMS: ${GameState.currency.gems}`,
      `EGGS: ${GameState.hatchery.eggs.length}/${GameState.hatchery.capacity}`,
      `BEST: ${GameState.highScore}`,
    ];

    stats.forEach((stat, index) => {
      createBitmapLabel(
        this,
        width / 2 - 255 + index * 170,
        height - 34,
        stat,
        {
          font: MAIN_MENU_FONT,
          size: 22,
          tint: 0xf7ffe8,
        },
      ).setDepth(8);
    });
  }
}
